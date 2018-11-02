using SocialNetworks.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SocialNetworks.Repositories
{
    public interface IMovieRepository
    {
        Task<IEnumerable<Movie>> GetAllMovies(int pageNum, int pageSize);
        Task<Movie> GetMovie(string id);
        Task AddMovie(Movie movie);
        Task<bool> RemoveMovie(string id);
        Task<bool> UpdateMovie(string id, Movie movie);
        Task<IEnumerable<Movie>> SearchMovies(string query);
    }
}
