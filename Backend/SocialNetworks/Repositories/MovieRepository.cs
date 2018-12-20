using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using SocialNetworks.Helpers;
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

        public async Task<IEnumerable<Movie>> GetAllMovies(int pageNum, int pageSize)
        {
            try
            {
                return await _context.Movies
                    .Find(_ => true)
                    .Skip((pageNum - 1) * pageSize).Limit(pageSize)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<IEnumerable<Movie>> GetTopRatedMovies(int pageNum, int pageSize)
        {
            try
            {
                return await _context.Movies
                    .Find(_ => true)
                    .SortByDescending(x => x.VoteAverage)
                    .Skip((pageNum - 1) * pageSize).Limit(pageSize)
                    .ToListAsync();
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
            catch
            {
                try
                {
                    return await _context.Movies
                        .Find(m => m.TMDbId == id)
                        .FirstOrDefaultAsync();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
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
                    .ReplaceOneAsync(m => m.TMDbId.Equals(id), movie);
                return actionResult.IsAcknowledged && actionResult.ModifiedCount > 0;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<IEnumerable<Movie>> SearchMovies(string query, int pageNum, int pageSize)
        {
            try
            {
                var queryList = query.Split(' ').Select(x => x.ToLower()).ToList();
                var list = await _context.Movies
                        .Find(x => x.Title.ToLower().Contains(queryList[0])).ToListAsync();
                queryList.RemoveAt(0);
                foreach (var q in queryList)
                {
                    list = list.Where(x => x.Title.ToLower().Contains(q)).ToList();
                }
                return list.OrderByDescending(x => x.Popularity)
                    .Skip((pageNum - 1) * pageSize).Take(pageSize);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<string> GetRatings(string id)
        {
            try
            {
                var fields = Builders<Movie>.Projection
                    .Include(x => x.VoteAverage)
                    .Include(x => x.Rating)
                    .Exclude(x => x.Id);
                var cursor = await _context.Movies.Find(x => x.Id == id)
                    .Project(fields).SingleOrDefaultAsync();
                return cursor.ToJson();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
