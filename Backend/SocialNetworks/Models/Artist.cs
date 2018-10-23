using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace SocialNetworks.Models
{
    public class Artist
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string Name { get; set; }
        public string YearFormed { get; set; }
        public string Country { get; set; }
    }
}
