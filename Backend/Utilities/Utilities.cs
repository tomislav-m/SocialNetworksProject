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
        public IEnumerable<Genre2> Genres { get; set; }
        public int Vote_Count { get; set; }
        public float Vote_Average { get; set; }
        public float Popularity { get; set; }
        public string Poster_Path { get; set; }
        public string Imdb_id { get; set; }
        public string Overview { get; set; }
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
        public DateTime Released { get; set; }
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
            for (int i = 21; i <= 200; ++i)
            {
                var stringTask = client.GetStringAsync(str + i);
                var msg = await stringTask;
                JObject o = JObject.Parse(msg);
                JToken token = o.Last;
                IEnumerable<JToken> tokens = token.Children().Children();

                foreach (var t in tokens)
                {
                    TMDBMovie movie = JsonConvert.DeserializeObject<TMDBMovie>(t.ToString());
                    var dbMovie = await client.GetStringAsync("http://localhost:5000/api/Movies/" + movie.Id);
                    if (dbMovie != string.Empty) continue;
                    MovieJson model = new MovieJson
                    {
                        TMDbId = movie.Id,
                        //Genres = movie.Genre_Ids,
                        ReleaseDate = movie.Release_Date,
                        Title = movie.Title,
                        VoteAverage = 0,
                        Popularity = movie.Popularity,
                        PosterUrl = movie.Poster_Path,
                        Rating = 0,
                        RatingCount = 0
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
            var task = client.GetStringAsync("http://localhost:5000/api/Movies?pageSize=8000&pageNum=1");
            var response = await task;
            var movies = JArray.Parse(response);
            foreach (var movie in movies.Children())
            {
                var model = JsonConvert.DeserializeObject<MovieJson>(movie.ToString());
                if ((model.ActorsIds != null && model.ActorsIds.Count() > 0) || (model.DirectorsIds != null && model.DirectorsIds.Count() > 0))
                {
                    continue;
                }
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
                Console.WriteLine(model.Title + ":" + movieResponse.StatusCode);
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
            var url = "http://www.omdbapi.com/?apikey=40c521a7&plot=full&i=";
            var movies = await client.GetStringAsync("http://localhost:5000/api/Movies?pageSize=6393");
            foreach (var movie in JsonConvert.DeserializeObject<IEnumerable<MovieJson>>(movies).Where(x => x.VoteAverage == 0 && x.Title == "Memento").OrderByDescending(x => x.Popularity))
            {
                try
                {
                    var response = await client.GetStringAsync(url + "tt0209144");
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
            var response = await client.GetStringAsync("http://localhost:5000/api/Movies/top-rated?pageSize=1000&pageNum=2");
            var movies = JsonConvert.DeserializeObject<IEnumerable<MovieJson>>(response);
            foreach (var movie in movies)
            {
                System.Threading.Thread.Sleep(1000);
                var year = movie.ReleaseDate.Year;
                var searchUrl = $"https://api.discogs.com/database/search?q={movie.Title}&style=soundtrack&year={year}";
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Discogs", "key=EujhPvhRDMCgptbPCece, secret=AMUIkVJHwXYjanhOymvvOeCyJLKeCCls");
                client.DefaultRequestHeaders.UserAgent.Add(new ProductInfoHeaderValue("snapp", "0.1"));
                var searchResponse = await client.GetStringAsync(searchUrl);
                var o = JObject.Parse(searchResponse);
                var albumUrl = o.SelectToken("results[0].master_url");
                var albumResponse = "";
                try
                {
                    albumResponse = await client.GetStringAsync(albumUrl.ToString());
                }
                catch
                {
                    continue;
                }
                var album = JsonConvert.DeserializeObject<Album>(albumResponse);
                JEnumerable<JToken> albumArtists;
                try
                {
                    albumArtists = JObject.Parse(albumResponse).SelectToken("artists").Children();
                    var artistsAray = new List<string>();
                    foreach (var artist in albumArtists)
                    {
                        artistsAray.Add(artist.SelectToken("name").ToString());
                    }
                    album.ArtistsList = artistsAray;
                }
                catch { }
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
                        artists = songObject.SelectToken("artists").Children();
                        var artistsAray = new List<string>();
                        foreach (var artist in artists)
                        {
                            artistsAray.Add(artist.SelectToken("name").ToString());
                        }
                        song.ArtistsList = artistsAray;
                    }
                    catch { }
                    try
                    {
                        artists = songObject.SelectToken("extraartists").Children();
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
                album.Id = null;
                album.MovieId = movie.Id;
                var stringContent = new StringContent(JsonConvert.SerializeObject(album), Encoding.UTF8, "application/json");
                var responseAlbum = await client.PostAsync("http://localhost:5000/api/Albums", stringContent);
                Console.WriteLine(album.Title + ": " + responseAlbum.StatusCode);
            }
        }

        public static async Task RecommenderTest()
        {
            var response = await client.GetStringAsync("http://localhost:5000/api/Users");
            var users = JsonConvert.DeserializeObject<IEnumerable<User>>(response);
            var user = users.SingleOrDefault(x => x.Email == "tomislav.maslac95@gmail.com");
            var dict = new Dictionary<string, Dictionary<string, int>>();
            foreach (var u in users)
            {
                if (u.MovieRatings.Count > 0)
                {
                    dict.Add(u.Email, u.MovieRatings);
                }
            }
            var recommender = new UserBasedRecommender(dict, user.Email, 0.35);
            var recs = recommender.Recommend();
            Console.WriteLine($"Recommendations for {user.Email}:");
            foreach (var rec in recs.Take(50))
            {
                var movieResponse = await client.GetStringAsync("http://localhost:5000/api/Movies/" + rec.Key);
                var movie = JsonConvert.DeserializeObject<Movie>(movieResponse);
                Console.WriteLine(movie.Title + ": " + rec.Value);
            }
        }

        public static async Task CalculateAverageScore()
        {
            var response = await client.GetStringAsync("http://localhost:5000/api/Movies?pageSize=8000&pageNum=1");
            var movies = JsonConvert.DeserializeObject<IEnumerable<MovieJson>>(response).Where(x => x.VoteAverage == 0).OrderByDescending(x => x.Popularity);
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

        public static async Task CreateUsers()
        {
            for (int i = 51; i < 100; ++i)
            {
                string name = "user" + i;
                var user = new UserDto
                {
                    FirstName = name,
                    Email = name + "@mail.com",
                    LastName = name,
                    Password = name
                };
                var content = new StringContent(JsonConvert.SerializeObject(user), Encoding.UTF8, "application/json");
                var response = await client.PostAsync($"http://localhost:5000/api/Users/register", content);
                Console.WriteLine(name + ": " + response.StatusCode);
            }
        }

        public static async Task AddRatings()
        {
            var random = new Random();

            var response = await client.GetStringAsync("http://localhost:5000/api/Users");
            var users = JsonConvert.DeserializeObject<IEnumerable<User>>(response).Where(x => x.Email.Contains("user") && x.MovieRatings.Count == 0);
            var movieResponse = await client.GetStringAsync("http://localhost:5000/api/Movies/top-rated?pageSize=250");
            var movies = JsonConvert.DeserializeObject<IEnumerable<Movie>>(movieResponse);
            foreach (var user in users)
            {
                var ratings = new Dictionary<string, int>();
                for(int i = 0; i < 50; ++i)
                {
                    var movie = movies.ElementAt(random.Next(0, movies.Count() - 1));
                    if (ratings.ContainsKey(movie.Id) || user.MovieRatings.Select(x => x.Key).Contains(movie.Id)) continue;
                    var rating = random.Next(1, 5);
                    if (random.Next(0, 4) > 0)
                    {
                        rating = (int)Math.Ceiling(movie.VoteAverage);
                    }
                    ratings.Add(movie.Id, rating);
                }
                var json = JsonConvert.SerializeObject(ratings);
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                var movieResponse2 = await client.PutAsync($"http://localhost:5000/api/Users/add-ratings/{user.Id}", content);
                Console.WriteLine(user.Email + ": " + movieResponse2.StatusCode);
            }
        }

        public static async Task Update()
        {
            var movieResponse = await client.GetStringAsync("http://localhost:5000/api/Movies?pageSize=8000");
            var movies = JsonConvert.DeserializeObject<IEnumerable<MovieJson>>(movieResponse).Where(x => x.IMDbId == null || x.PosterUrl == "").OrderByDescending(x => x.Popularity).ToList();
            for(int i = 0; i < movies.Count; ++i)
            {
                try
                {
                    var movie = movies.ElementAt(i);
                    var response = await client.GetStringAsync($"https://api.themoviedb.org/3/movie/{movie.TMDbId}?api_key={apiKey}");
                    var tmdbMovie = JsonConvert.DeserializeObject<TMDBMovie>(response);
                    movie.IMDbId = tmdbMovie.Imdb_id;
                    movie.Plot = tmdbMovie.Overview;
                    movie.PosterUrl = tmdbMovie.Poster_Path;
                    movie.ReleaseDate = tmdbMovie.Release_Date;
                    movie.Genres = tmdbMovie.Genres.Select(x => x.Id).ToList();
                    var movieJson = JsonConvert.SerializeObject(movie);
                    var movieContent = new StringContent(movieJson, Encoding.UTF8, "application/json");
                    var movieResponse2 = await client.PutAsync("http://localhost:5000/api/Movies/" + movie.TMDbId, movieContent);
                    Console.WriteLine(movie.Title + ": " + movieResponse2.StatusCode);
                    System.Threading.Thread.Sleep(300);
                }
                catch
                {
                    continue;
                }
            }
        }
    }
}
