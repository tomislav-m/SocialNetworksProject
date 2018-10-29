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
    public class AlbumsController : ControllerBase
    {
        private readonly IAlbumRepository _albumRepository;

        public AlbumsController(IAlbumRepository albumRepository)
        {
            _albumRepository = albumRepository;
        }

        // GET: api/Albums
        [HttpGet]
        public async Task<IEnumerable<Album>> Get()
        {
            return await _albumRepository.GetAllAlbums();
        }

        // GET: api/Albums/5
        [HttpGet("{id}")]
        public async Task<Album> Get(string id)
        {
            return await _albumRepository.GetAlbum(id);
        }

        // POST: api/Albums
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Album album)
        {
            await _albumRepository.AddAlbum(album);
            return new OkObjectResult(album);
        }

        // PUT: api/Albums/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(string id, [FromBody] Album album)
        {
            await _albumRepository.UpdateAlbum(id, album);
            return new OkObjectResult(album);
        }

        // DELETE: api/Albums/5
        [HttpDelete("{id}")]
        public void Delete(string id)
        {
            _albumRepository.RemoveAlbum(id);
        }
    }
}