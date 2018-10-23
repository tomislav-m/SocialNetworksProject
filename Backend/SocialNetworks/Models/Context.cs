using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SocialNetworks.Models
{
    public class Context
    {
        private readonly IMongoDatabase _context = null;

        public Context(IOptions<Settings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            if (client != null)
                _context = client.GetDatabase(settings.Value.Database);
        }

        public IMongoCollection<Artist> Artists
        {
            get
            {
                return _context.GetCollection<Artist>("Artist");
            }
        }
    }
}
