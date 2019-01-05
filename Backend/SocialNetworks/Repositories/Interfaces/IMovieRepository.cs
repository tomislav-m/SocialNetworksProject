using SocialNetworks.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SocialNetworks.Repositories
{
    public interface IMovieRepository
    {
        Task<IEnumerable<Movie>> GetAllMovies(int pageNum, int pageSize);
        Task<IEnumerable<Movie>> GetMoreMovies(IEnumerable<string> ids, string[] genres);
        Task<IEnumerable<Movie>> GetTopRatedMovies(int pageNum, int pageSize);
        Task<string> GetRatings(string id);
        Task<Movie> GetMovie(string id);
        Task AddMovie(Movie movie);
        Task<bool> RemoveMovie(string id);
        Task<bool> UpdateMovie(string id, Movie movie);
        Task<IEnumerable<Movie>> SearchMovies(string query, int pageNum, int pageSize);
    }
}
