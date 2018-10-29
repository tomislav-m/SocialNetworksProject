using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace SocialNetworks.Models
{
    public enum Role { Actor, Director, Artist }

    public class Person
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string Name { get; set; }
        public string Country { get; set; }
        public IEnumerable<Role> Roles { get; set; }
    }
}
