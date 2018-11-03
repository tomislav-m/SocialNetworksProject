using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using SocialNetworks.Helpers;
using SocialNetworks.Models;

namespace SocialNetworks.Repositories
{
    public class AlbumRepository : IAlbumRepository
    {
        private readonly Context _context = null;

        public AlbumRepository(IOptions<Settings> settings)
        {
            _context = new Context(settings);
        }

        public async Task<IEnumerable<Album>> GetAllAlbums()
        {
            try
            {
                return await _context.Albums.Find(_ => true).ToListAsync();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<Album> GetAlbum(string id)
        {
            try
            {
                return await _context.Albums
                                .Find(album => album.Id == id)
                                .FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task AddAlbum(Album album)
        {
            try
            {
                await _context.Albums.InsertOneAsync(album);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<bool> RemoveAlbum(string id)
        {
            try
            {
                var actionResult = await _context.Albums.
                DeleteOneAsync(Builders<Album>.Filter.Eq(a => a.Id, id));

                return actionResult.IsAcknowledged && actionResult.DeletedCount > 0;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<bool> UpdateAlbum(string id, Album album)
        {
            try
            {
                var actionResult = await _context.Albums
                    .ReplaceOneAsync(a => a.Id.Equals(id), album);
                return actionResult.IsAcknowledged && actionResult.ModifiedCount > 0;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
