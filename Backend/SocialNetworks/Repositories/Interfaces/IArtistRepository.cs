using SocialNetworks.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SocialNetworks.Repositories
{
    public interface IArtistRepository
    {
        Task<IEnumerable<Artist>> GetAllArtists();
        Task<Artist> GetArtist(string id);
        Task AddArtist(Artist artist);
        Task<bool> RemoveArtist(string id);
        Task<bool> UpdateArtist(string id, Artist artist);
    }
}
