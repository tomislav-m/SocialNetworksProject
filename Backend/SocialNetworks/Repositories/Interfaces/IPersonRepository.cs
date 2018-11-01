using SocialNetworks.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SocialNetworks.Repositories
{
    public interface IPersonRepository
    {
        Task<IEnumerable<Person>> GetAllPeople();
        Task<Person> GetPerson(string id);
        Task AddPerson(Person person);
        Task<bool> RemovePerson(string id);
        Task<bool> UpdatePerson(string id, Person person);
    }
}
