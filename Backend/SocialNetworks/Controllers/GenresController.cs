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
    public class GenresController : ControllerBase
    {
        private readonly IGenreRepository _genreRepository;

        public GenresController(IGenreRepository genreRepository)
        {
            _genreRepository = genreRepository;
        }

        // GET: api/Genres
        [HttpGet]
        public async Task<IEnumerable<Genre>> Get()
        {
            return await _genreRepository.GetAllGenres();
        }

        // GET: api/Genres/5
        [HttpGet("{id}")]
        public async Task<Genre> Get(string id)
        {
            return await _genreRepository.GetGenre(id);
        }

        // POST: api/Genres
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Genre genre)
        {
            await _genreRepository.AddGenre(genre);
            return new OkObjectResult(genre);
        }
    }
}