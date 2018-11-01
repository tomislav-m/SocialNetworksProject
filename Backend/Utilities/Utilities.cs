﻿using System;
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
    }
}