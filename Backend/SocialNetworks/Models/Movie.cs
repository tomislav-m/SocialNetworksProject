using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;

namespace SocialNetworks.Models
{
    public class Movie
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string TMDbId { get; set; }
        public string Title { get; set; }
        public DateTime ReleaseDate { get; set; }
        public IEnumerable<string> Genres { get; set; }
        public IEnumerable<string> DirectorsIds { get; set; }
        public IEnumerable<string> ActorsIds { get; set; }
        public string SoundtrackId { get; set; }
        public int VoteCount { get; set; }
        public float VoteAverage { get; set; }
        public float Popularity { get; set; }
        public string PosterUrl { get; set; }
    }
}
