using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using SocialNetworks.Models;

namespace SocialNetworks.Repositories
{
    public class ArtistRepository : IArtistRepository
    {
        private readonly Context _context = null;

        public ArtistRepository(IOptions<Settings> settings)
        {
            _context = new Context(settings);
        }

        public async Task<IEnumerable<Artist>> GetAllArtists()
        {
            try
            {
                return await _context.Artists.Find(_ => true).ToListAsync();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<Artist> GetArtist(string id)
        {
            try
            {
                return await _context.Artists
                                .Find(artist => artist.Id == id)
                                .FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task AddArtist(Artist artist)
        {
            try
            {
                await _context.Artists.InsertOneAsync(artist);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<bool> RemoveArtist(string id)
        {
            try
            {
                var actionResult = await _context.Artists.
                DeleteOneAsync(Builders<Artist>.Filter.Eq(a => a.Id, id));

                return actionResult.IsAcknowledged && actionResult.DeletedCount > 0;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<bool> UpdateArtist(string id, Artist artist)
        {
            try
            {
                var actionResult = await _context.Artists
                    .ReplaceOneAsync(a => a.Id.Equals(id), artist);
                return actionResult.IsAcknowledged && actionResult.ModifiedCount > 0;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
