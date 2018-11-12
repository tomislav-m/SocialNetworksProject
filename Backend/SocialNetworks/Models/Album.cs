using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SocialNetworks.Models
{
    public class Album
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string DiscogsId { get; set; }
        public string Title { get; set; }
        public IEnumerable<string> ArtistsIds { get; set; }
        public string CoverUrl { get; set; }
        public IEnumerable<Song> Songs { get; set; }
    }
}
