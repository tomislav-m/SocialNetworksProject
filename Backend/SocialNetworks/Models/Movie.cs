using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace SocialNetworks.Models
{
    public class Movie
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string Title { get; set; }
        public string YearReleased { get; set; }
        public IEnumerable<string> Genres { get; set; }
        public IEnumerable<string> DirectorsIds { get; set; }
        public IEnumerable<string> ActorsIds { get; set; }
        public IEnumerable<string> SoundtrackIds { get; set; }
    }
}
