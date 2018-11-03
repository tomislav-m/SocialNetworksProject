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
    public class PeopleController : ControllerBase
    {
        private readonly IPersonRepository _personRepository;

        public PeopleController(IPersonRepository personRepository)
        {
            _personRepository = personRepository;
        }

        // GET: api/People/
        [HttpGet]
        public async Task<IEnumerable<Person>> Get(int pageNum = 1, int pageSize = 50)
        {
            return await _personRepository.GetAllPeople(pageNum, pageSize);
        }

        // GET: api/People/5
        [HttpGet("{id}")]
        public async Task<Person> Get(string id)
        {
            return await _personRepository.GetPerson(id);
        }

        // POST: api/People
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Person person)
        {
            await _personRepository.AddPerson(person);
            return new OkObjectResult(person);
        }

        // PUT: api/People/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(string id, [FromBody] Person person)
        {
            await _personRepository.UpdatePerson(id, person);
            return new OkObjectResult(person);
        }

        // DELETE: api/People/5
        [HttpDelete("{id}")]
        public void Delete(string id)
        {
            _personRepository.RemovePerson(id);
        }

        [HttpGet]
        [Route("search/{query}")]
        public async Task<IEnumerable<Person>> Search(string query, int pageNum, int pageSize)
        {
            return await _personRepository.SearchPeople(query, pageNum, pageSize);
        }
    }
}