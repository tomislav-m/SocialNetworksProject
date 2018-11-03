using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SocialNetworks.Models;
using SocialNetworks.Repositories;

namespace SocialNetworks.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoviesController : ControllerBase
    {
        private readonly IMovieRepository _movieRepository;

        public MoviesController(IMovieRepository movieRepository)
        {
            _movieRepository = movieRepository;
        }

        // GET: api/Movies/
        [HttpGet]
        public async Task<IEnumerable<Movie>> Get(int pageNum = 1, int pageSize = 50)
        {
            return await _movieRepository.GetAllMovies(pageNum, pageSize);
        }

        // GET: api/Movies/5
        [HttpGet("{id}")]
        public async Task<Movie> Get(string id)
        {
            return await _movieRepository.GetMovie(id);
        }

        // POST: api/Movies
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Movie movie)
        {
            await _movieRepository.AddMovie(movie);
            return new OkObjectResult(movie);
        }

        // PUT: api/Artists/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(string id, [FromBody] Movie movie)
        {
            await _movieRepository.UpdateMovie(id, movie);
            return new OkObjectResult(movie);
        }

        // DELETE: api/Movies/5
        [HttpDelete("{id}")]
        public void Delete(string id)
        {
            _movieRepository.RemoveMovie(id);
        }

        [HttpGet]
        [Route("search/{query}")]
        public async Task<IEnumerable<Movie>> Search(string query, int pageNum = 1, int pageSize = 50)
        {
            return await _movieRepository.SearchMovies(query, pageNum, pageSize);
        }
    }
}