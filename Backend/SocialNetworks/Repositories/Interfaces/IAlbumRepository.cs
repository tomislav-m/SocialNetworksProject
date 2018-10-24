using SocialNetworks.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SocialNetworks.Repositories
{
    public interface IAlbumRepository
    {
        Task<IEnumerable<Album>> GetAllAlbums();
        Task<Album> GetAlbum(string id);
        Task AddAlbum(Album artist);
        Task<bool> RemoveAlbum(string id);
        Task<bool> UpdateAlbum(string id, Album album);
    }
}
