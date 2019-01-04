using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SocialNetworks.Models
{
    public class MovieJson
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string TMDbId { get; set; }
        public string Title { get; set; }
        [JsonProperty("release_date")]
        public DateTime ReleaseDate { get; set; }
        [JsonProperty("genre_ids")]
        public IEnumerable<string> Genres { get; set; }
        public IEnumerable<string> DirectorsIds { get; set; }
        public IEnumerable<string> ActorsIds { get; set; }
        public string SoundtrackId { get; set; }
        public float VoteAverage { get; set; }
        public float Popularity { get; set; }
        [JsonProperty("poster_path")]
        public string PosterUrl { get; set; }
        [JsonProperty("imdb_id")]
        public string IMDbId { get; set; }
        public float IMDbRating { get; set; }
        public double IMDbVotes { get; set; }
        [JsonProperty("overview")]
        public string Plot { get; set; }
        public string Runtime { get; set; }
        public string Metascore { get; set; }
        public int RTRating { get; set; }
        public float Rating { get; set; }
        public int RatingCount { get; set; }
    }
}
