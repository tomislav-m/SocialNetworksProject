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
    public class ArtistsController : ControllerBase
    {
        private readonly IArtistRepository _artistRepository;

        public ArtistsController(IArtistRepository artistRepository)
        {
            _artistRepository = artistRepository;
        }

        // GET: api/Artists
        [HttpGet]
        public async Task<IEnumerable<Artist>> Get()
        {
            return await _artistRepository.GetAllArtists();
        }

        // GET: api/Artists/5
        [HttpGet("{id}", Name = "Get")]
        public async Task<Artist> Get(string id)
        {
            return await _artistRepository.GetArtist(id);
        }

        // POST: api/Artists
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Artist artist)
        {
            await _artistRepository.AddArtist(artist);
            return new OkObjectResult(artist);
        }

        // PUT: api/Artists/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(string id, [FromBody] Artist artist)
        {
            await _artistRepository.UpdateArtist(id, artist);
            return new OkObjectResult(artist);
        }

        // DELETE: api/Artists/5
        [HttpDelete("{id}")]
        public void Delete(string id)
        {
            _artistRepository.RemoveArtist(id);
        }
    }
}
