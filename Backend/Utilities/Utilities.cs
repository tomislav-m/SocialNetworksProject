using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SocialNetworks.Models;
using System.Linq;
using Recommender;

namespace Utilities
{
    public class TMDBMovie
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public DateTime Release_Date { get; set; }
        public IEnumerable<string> Genre_Ids { get; set; }
        public int Vote_Count { get; set; }
        public float Vote_Average { get; set; }
        public float Popularity { get; set; }
        public string Poster_Path { get; set; }
    }

    public class OMDMovie
    {
        public string ImdbId { get; set; }
        public float ImdbRating { get; set; }
        public double ImdbVotes { get; set; }
        public string Plot { get; set; }
        public string Runtime { get; set; }
        public string Metascore { get; set; }
        public Rating[] Ratings { get; set; }
    }

    public class Rating
    {
        public string Source { get; set; }
        public string Value { get; set; }
    }

    public class Cast
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Profile_Path { get; set; }
    }

    public class Genre2
    {
        public string Id { get; set; }
        public string Name { get; set; }
    }

    public class Utilities
    {
        private static readonly HttpClient client = new HttpClient();
        private static readonly string apiKey = "687a2e7fcee1a717e582f9665c5bf685";

        public static async Task GetMovies(string url)
        {
            var str = url + "api_key=" + apiKey + "&page=";
            for (int i = 1; i <= 320; ++i)
            {
                var stringTask = client.GetStringAsync(str + i);
                var msg = await stringTask;
                JObject o = JObject.Parse(msg);
                JToken token = o.Last;
                IEnumerable<JToken> tokens = token.Children().Children();

                foreach (var t in tokens)
                {
                    TMDBMovie movie = JsonConvert.DeserializeObject<TMDBMovie>(t.ToString());
                    Movie model = new Movie
                    {
                        TMDbId = movie.Id,
                        Genres = movie.Genre_Ids,
                        ReleaseDate = movie.Release_Date,
                        Title = movie.Title,
                        VoteCount = movie.Vote_Count,
                        VoteAverage = movie.Vote_Average,
                        Popularity = movie.Popularity,
                        PosterUrl = movie.Poster_Path
                    };
                    var stringContent = new StringContent(JsonConvert.SerializeObject(model), Encoding.UTF8, "application/json");
                    var response = await client.PostAsync("http://localhost:5000/api/Movies", stringContent);
                    Console.WriteLine(movie.Title + ": " + response.StatusCode);

                    // msg = await client.GetStringAsync("https://api.themoviedb.org/3/movie/" + movie.Id + "/credits?api_key=687a2e7fcee1a717e582f9665c5bf685");
                    // o = JObject.Parse(msg);
                    // token = o.SelectToken("$.cast");
                    // IEnumerable<JToken> tokens2 = token.Children();
                    // foreach(var tok in tokens2)
                    // {
                    //     Cast cast = JsonConvert.DeserializeObject<Cast>(tok.ToString());
                    //     Console.WriteLine(cast.Name);
                    // }
                }

                System.Threading.Thread.Sleep(300);
            }
        }

        public static async Task GetAndSaveCast()
        {
            var task = client.GetStringAsync("http://localhost:5000/api/Movies");
            var response = await task;
            var movies = JArray.Parse(response);
            int i = 0;
            foreach (var movie in movies.Children())
            {
                var model = JsonConvert.DeserializeObject<Movie>(movie.ToString());
                if (model.ActorsIds != null)
                {
                    continue;
                }
                ++i;
                var credits = "https://api.themoviedb.org/3/movie/" + model.TMDbId + "/credits?api_key=" + apiKey;
                task = client.GetStringAsync(credits);
                var creditsResponse = await task;
                var o = JObject.Parse(creditsResponse);
                var people = o.GetValue("cast").Children();
                var directors = o.SelectTokens("$.crew[?(@.job=='Director')]");
                var castArray = new List<string>();
                var directorArray = new List<string>();
                foreach (var person in people)
                {
                    castArray.Add(await SaveCast(person));
                }
                foreach (var person in directors)
                {
                    directorArray.Add(await SaveCast(person));
                }
                model.ActorsIds = castArray;
                model.DirectorsIds = directorArray;
                var movieJson = JsonConvert.SerializeObject(model);
                var movieContent = new StringContent(movieJson, Encoding.UTF8, "application/json");
                var movieResponse = await client.PutAsync("http://localhost:5000/api/Movies/" + model.TMDbId, movieContent);
                if (i % 10 == 0)
                {
                    Console.WriteLine(i);
                }
            }
        }

        private static async Task<string> SaveCast(JToken person)
        {
            var cast = JsonConvert.DeserializeObject<Cast>(person.ToString());
            var castModel = new Person
            {
                TMDbId = cast.Id,
                Name = cast.Name,
                PictureUrl = cast.Profile_Path
            };
            var json = JsonConvert.SerializeObject(castModel);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var castResponse = await client.PutAsync("http://localhost:5000/api/People/" + castModel.TMDbId, content);
            return cast.Id;
        }

        public static async Task GetAndSaveGenres()
        {
            var genreUrl = "https://api.themoviedb.org/3/genre/movie/list?api_key=" + apiKey;
            var response = await client.GetStringAsync(genreUrl);
            var obj = JObject.Parse(response);
            foreach (var genre in obj.GetValue("genres").Children())
            {
                var model = JsonConvert.DeserializeObject<Genre2>(genre.ToString());
                Genre g = new Genre
                {
                    TMDbId = model.Id,
                    Name = model.Name
                };
                var json = JsonConvert.SerializeObject(g);
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                await client.PostAsync("http://localhost:5000/api/Genres", content);
            }
        }

        public static async Task GetMore()
        {
            var url = "http://www.omdbapi.com/?apikey=40c521a7&plot=full&t=";
            var movies = await client.GetStringAsync("http://localhost:5000/api/Movies?pageSize=6393");
            foreach (var movie in JsonConvert.DeserializeObject<IEnumerable<Movie>>(movies).Where(x => x.IMDbRating == 0))
            {
                try
                {
                    var response = await client.GetStringAsync(url + movie.Title);
                    var obj = JObject.Parse(response);
                    var omdMovie = JsonConvert.DeserializeObject<OMDMovie>(obj.ToString());
                    movie.IMDbId = omdMovie.ImdbId;
                    movie.IMDbRating = omdMovie.ImdbRating;
                    movie.IMDbVotes = omdMovie.ImdbVotes;
                    try
                    {
                        movie.Metascore = omdMovie.Metascore;
                    }
                    catch { }
                    movie.Plot = omdMovie.Plot;
                    movie.Runtime = omdMovie.Runtime;
                    try
                    {
                        var rtRating = omdMovie.Ratings.FirstOrDefault(x => x.Source == "Rotten Tomatoes");
                        if (rtRating != null)
                        {
                            var rating = Int32.Parse(rtRating.Value.Split('%')[0]);
                            movie.RTRating = rating;
                        }
                    }
                    catch { }
                    var json = JsonConvert.SerializeObject(movie);
                    var content = new StringContent(json, Encoding.UTF8, "application/json");
                    var postResponse = await client.PutAsync("http://localhost:5000/api/Movies/" + movie.TMDbId, content);
                    Console.WriteLine(movie.Title + ": " + postResponse.StatusCode);
                }
                catch(Exception exc)
                {
                    Console.WriteLine(movie.Title + ":" + exc.Message);
                }
            }
        }

        public static async Task GetAndSaveSoundtrack()
        {
            var response = await client.GetStringAsync("http://localhost:5000/api/Movies");
            var movies = JsonConvert.DeserializeObject<IEnumerable<Movie>>(response);
            foreach (var movie in movies.Skip(2))
            {
                var year = movie.ReleaseDate.Year;
                var searchUrl = $"https://api.discogs.com/database/search?q={movie.Title}&style=soundtrack&year={year}";
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Discogs", "key=EujhPvhRDMCgptbPCece, secret=AMUIkVJHwXYjanhOymvvOeCyJLKeCCls");
                client.DefaultRequestHeaders.UserAgent.Add(new ProductInfoHeaderValue("snapp", "0.1"));
                var searchResponse = await client.GetStringAsync(searchUrl);
                var o = JObject.Parse(searchResponse);
                var albumUrl = o.SelectToken("results[0].master_url");
                var albumResponse = await client.GetStringAsync(albumUrl.ToString());
                var album = JsonConvert.DeserializeObject<Album>(albumResponse);
                album.CoverUrl = o.SelectToken("results[0].cover_image").ToString();
                album.DiscogsId = o.SelectToken("results[0].id").ToString();
                var songs = JObject.Parse(albumResponse).SelectToken("tracklist").Children();
                var songsArray = new List<Song>();
                foreach (var songObject in songs)
                {
                    var song = JsonConvert.DeserializeObject<Song>(songObject.ToString());
                    JEnumerable<JToken> artists;
                    try
                    {
                        artists = songObject.SelectToken("artist").Children();
                        var artistsAray = new List<string>();
                        foreach (var artist in artists)
                        {
                            artistsAray.Add(artist.SelectToken("name").ToString());
                        }
                        song.ArtistsList = artistsAray;
                    }
                    catch { }
                    songsArray.Add(song);
                }
                album.Songs = songsArray;
                Console.WriteLine(JsonConvert.SerializeObject(album));
                break;
            }
        }

        public static void RecommenderTest()
        {
            var user1 = new Dictionary<string, int>
            {
                { "Titanic", 10 },
                { "Amelie", 10 },
                { "Beauty and the beast", 8 },
                { "Girl with the dragon tattoo", 8 },
                { "A Star is born", 8 },
                { "Split", 7 },
                { "Punch-drunk love", 5 },
                { "A simple favor", 8 },
                { "Pretty woman", 7 },
                { "The place", 7 },
                { "No string attached", 6 },
                { "Clueless", 6 },
                { "Orphan", 7 },
                { "The shape of water", 7 },
                { "Lady bird", 7 },
            };
            var user2 = new Dictionary<string, int>
            {
                { "Titanic", 7 },
                { "Amelie", 10 },
                { "Beauty and the beast", 7 },
                { "Bohemian rhapsody", 8 },
                { "A Star is born", 9 },
                { "Split", 7 },
                { "Punch-drunk love", 6 },
                { "A simple favor", 7 },
                { "Pretty woman", 7 },
                { "The place", 8 },
                { "No string attached", 5 },
                { "Clueless", 6 },
                { "Orphan", 7 },
                { "Get out", 8 },
                { "The shape of water", 7 },
                { "Lady bird", 7 },
                { "Your name", 7 },
                { "Mother", 4 }
            };
            var user3 = new Dictionary<string, int>
            {
                { "Titanic", 10 },
                { "Amelie", 9 },
                { "Beauty and the beast", 8 },
                { "Girl with the dragon tattoo", 6 },
                { "A Star is born", 8 },
                { "Split", 6 },
                { "Punch-drunk love", 7 },
                { "A simple favor", 6 },
                { "Pretty woman", 6 },
                { "The place", 6 },
                { "Orphan", 6 },
                { "Get out", 8 },
                { "The shape of water", 8 },
                { "Lady bird", 9 },
                { "Your name", 9 },
                { "Mother", 7 }
            };
            var user4 = new Dictionary<string, int>
            {
                { "Titanic", 9 },
                { "Amelie", 10 },
                { "Beauty and the beast", 7 },
                { "Girl with the dragon tattoo", 7 },
                { "A Star is born", 8 },
                { "Split", 7 },
                { "Punch-drunk love", 6 },
                { "A simple favor", 8 },
                { "Pretty woman", 7 },
                { "The place", 7 },
                { "No string attached", 6 },
                { "Clueless", 6 },
                { "Orphan", 7 },
                { "The shape of water", 7 },
                { "Lady bird", 7 },
                { "Get out", 7 },
                { "Your name", 9 }
            };
            var user5 = new Dictionary<string, int>
            {
                { "Titanic", 9 },
                { "Amelie", 10 },
                { "Beauty and the beast", 7 },
                { "Girl with the dragon tattoo", 7 },
                { "A Star is born", 8 },
                { "Split", 7 },
                { "Punch-drunk love", 6 },
                { "A simple favor", 8 },
                { "Pretty woman", 7 },
                { "The place", 7 },
                { "No string attached", 6 },
                { "Clueless", 6 },
                { "Orphan", 7 },
                { "The shape of water", 7 },
                { "Lady bird", 7 },
                { "Get out", 7 },
                { "Your name", 10 }
            };
            var user6 = new Dictionary<string, int>
            {
                { "Titanic", 10 },
                { "Amelie", 10 },
                { "Beauty and the beast", 8 },
                { "Girl with the dragon tattoo", 7 },
                { "A Star is born", 8 },
                { "Split", 7 },
                { "Punch-drunk love", 6 },
                { "A simple favor", 8 },
                { "Pretty woman", 7 },
                { "The place", 7 },
                { "No string attached", 6 },
                { "Clueless", 6 },
                { "Orphan", 7 },
                { "The shape of water", 7 },
                { "Lady bird", 7 },
                { "Get out", 9 },
                { "Your name", 8 }
            };
            var dict = new Dictionary<string, Dictionary<string, int>>
            {
                { "0", user1 },
                { "1", user2 },
                { "2", user3 },
                { "3", user4 },
                { "4", user5 },
                { "5", user6 }
            };
            var recommender = new UserBasedRecommender(dict, "0", 0.6);
            var recs = recommender.Recommend();
            Console.WriteLine("Recommendations for user1:");
            foreach (var rec in recs)
            {
                Console.WriteLine(rec.Key + ": " + rec.Value);
            }
        }

        public static async Task CalculateAverageScore()
        {
            var response = await client.GetStringAsync("http://localhost:5000/api/Movies?pageSize=6393&pageNum=1");
            var movies = JsonConvert.DeserializeObject<IEnumerable<Movie>>(response);
            foreach(var movie in movies)
            {
                int count = 0;
                float score = 0;
                if (movie.RTRating > 0)
                {
                    score += (movie.RTRating / 20f);
                    ++count;
                }
                if (movie.IMDbRating > 0)
                {
                    score += movie.IMDbRating / 2;
                    ++count;
                }
                int.TryParse(movie.Metascore, out int result);
                if (result > 0)
                {
                    score += (result / 20f);
                    ++count;
                }
                if (count > 0)
                {
                    score /= count;

                    movie.VoteAverage = score;
                    var movieContent = new StringContent(JsonConvert.SerializeObject(movie), Encoding.UTF8, "application/json");
                    await client.PutAsync($"http://localhost:5000/api/Movies/{movie.TMDbId}", movieContent);
                }

                Console.WriteLine(movie.Title + ": " + movie.VoteAverage);
            }
        }
    }
}
