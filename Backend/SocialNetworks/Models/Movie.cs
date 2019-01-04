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
        public float VoteAverage { get; set; }
        public float Popularity { get; set; }
        public string PosterUrl { get; set; }
        public string IMDbId { get; set; }
        public float IMDbRating { get; set; }
        public double IMDbVotes { get; set; }
        public string Plot { get; set; }
        public string Runtime { get; set; }
        public string Metascore { get; set; }
        public int RTRating { get; set; }
        public float Rating { get; set; }
        public int RatingCount { get; set; }
    }
}
