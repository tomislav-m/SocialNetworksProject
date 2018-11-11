using System.Collections.Generic;
using System.Threading.Tasks;
using SocialNetworks.Models;

namespace SocialNetworks.Repositories
{
    public interface ISongRepository
    {
        //Task<IEnumerable<Song>> GetAllSongs(int pageNum, int pageSize);
        Task<Song> GetSong(string id);
        Task AddSong(Song song);
        //Task<bool> RemoveSong(string id);
        Task<bool> UpdateSong(string id, Song song);
        Task<IEnumerable<Song>> SearchSongs(string query, int pageNum, int pageSize);
    }
}