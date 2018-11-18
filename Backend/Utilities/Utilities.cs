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
    }
}
