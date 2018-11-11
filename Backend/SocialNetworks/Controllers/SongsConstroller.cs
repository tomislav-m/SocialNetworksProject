using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SocialNetworks.Models;
using SocialNetworks.Repositories;

namespace SocialNetworks.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SongsController : ControllerBase
    {
        private readonly ISongRepository _songRepository;

        public SongsController(ISongRepository songRepository)
        {
            _songRepository = songRepository;
        }

        [HttpGet("{id}")]
        public async Task<Song> Get(string id)
        {
            return await _songRepository.GetSong(id);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Song song)
        {
            await _songRepository.AddSong(song);
            return new OkObjectResult(song);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(string id, [FromBody] Song song)
        {
            await _songRepository.UpdateSong(id, song);
            return new OkObjectResult(song);
        }

        [HttpGet]
        [Route("search/{query}")]
        public async Task<IEnumerable<Song>> Search(string query, int pageNum = 1, int pageSize = 50)
        {
            return await _songRepository.SearchSongs(query, pageNum, pageSize);
        }
    }
}