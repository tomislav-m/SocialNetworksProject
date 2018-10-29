using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace SocialNetworks.Models
{
    public class Genre
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string Type { get; set; }
        public IEnumerable<string> MoviesIds { get; set; }
    }
}
