using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SocialNetworks.Models;

namespace Utilities
{
    public class TMDBMovie
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public DateTime Release_Date { get; set; }
        public IEnumerable<string> Genre_Ids { get; set; }
    }
    public class Utilities
    {
        private static readonly HttpClient client = new HttpClient();
        private static readonly string apiKey = "687a2e7fcee1a717e582f9665c5bf685";

        public static async Task Get(string url)
        {
            var str = url + "api_key=" + apiKey + "&page=";
            for (int i = 1; i <= 10; ++i)
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
                        Title = movie.Title
                    };
                    var stringContent = new StringContent(JsonConvert.SerializeObject(model), Encoding.UTF8, "application/json");
                    var response = await client.PostAsync("http://localhost:49659/api/Movies", stringContent);
                    Console.WriteLine(movie.Title + ": " + response.StatusCode);
                }
            }
        }
    }
}
