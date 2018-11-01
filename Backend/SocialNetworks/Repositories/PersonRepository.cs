using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using SocialNetworks.Models;

namespace SocialNetworks.Repositories
{
    public class PersonRepository : IPersonRepository
    {
        private readonly Context _context = null;

        public PersonRepository(IOptions<Settings> settings)
        {
            _context = new Context(settings);
        }

        public async Task<IEnumerable<Person>> GetAllPeople()
        {
            try
            {
                return await _context.People.Find(_ => true).ToListAsync();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<Person> GetPerson(string id)
        {
            try
            {
                return await _context.People
                    .Find(p => p.Id == id)
                    .FirstOrDefaultAsync();
            }
            catch
            {
                try
                {
                    return await _context.People
                        .Find(p => p.TMDbId == id)
                        .FirstOrDefaultAsync();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        public async Task AddPerson(Person person)
        {
            try
            {
                await _context.People.InsertOneAsync(person);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<bool> RemovePerson(string id)
        {
            try
            {
                var actionResult = await _context.People.
                DeleteOneAsync(Builders<Person>.Filter.Eq(p => p.Id, id));

                return actionResult.IsAcknowledged && actionResult.DeletedCount > 0;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<bool> UpdatePerson(string id, Person person)
        {
            try
            {
                var actionResult = await _context.People
                    .ReplaceOneAsync(p => p.TMDbId.Equals(id), person, new UpdateOptions { IsUpsert = true });
                return actionResult.IsAcknowledged && actionResult.ModifiedCount > 0;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
