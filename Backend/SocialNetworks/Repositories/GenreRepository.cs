using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using SocialNetworks.Models;

namespace SocialNetworks.Repositories
{
    public class GenreRepository : IGenreRepository
    {
        private readonly Context _context = null;

        public GenreRepository(IOptions<Settings> settings)
        {
            _context = new Context(settings);
        }
        public async Task AddGenre(Genre genre)
        {
            try
            {
                await _context.Genres.InsertOneAsync(genre);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<IEnumerable<Genre>> GetAllGenres()
        {
            try
            {
                return await _context.Genres.Find(_ => true).ToListAsync();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<Genre> GetGenre(string id)
        {
            try
            {
                return await _context.Genres
                                .Find(genre => genre.TMDbId == id)
                                .FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}