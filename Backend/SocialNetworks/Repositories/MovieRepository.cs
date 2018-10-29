using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using SocialNetworks.Models;

namespace SocialNetworks.Repositories
{
    public class MovieRepository : IMovieRepository
    {
        private readonly Context _context = null;

        public MovieRepository(IOptions<Settings> settings)
        {
            _context = new Context(settings);
        }

        public async Task<IEnumerable<Movie>> GetAllMovies()
        {
            try
            {
                return await _context.Movies.Find(_ => true).ToListAsync();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<Movie> GetMovie(string id)
        {
            try
            {
                return await _context.Movies
                                .Find(m => m.Id == id)
                                .FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task AddMovie(Movie movie)
        {
            try
            {
                await _context.Movies.InsertOneAsync(movie);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<bool> RemoveMovie(string id)
        {
            try
            {
                var actionResult = await _context.Movies.
                DeleteOneAsync(Builders<Movie>.Filter.Eq(m => m.Id, id));

                return actionResult.IsAcknowledged && actionResult.DeletedCount > 0;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<bool> UpdateMovie(string id, Movie movie)
        {
            try
            {
                var actionResult = await _context.Movies
                    .ReplaceOneAsync(m => m.Id.Equals(id), movie);
                return actionResult.IsAcknowledged && actionResult.ModifiedCount > 0;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
