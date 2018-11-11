using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using SocialNetworks.Helpers;
using SocialNetworks.Models;

namespace SocialNetworks.Repositories
{
    public class SongRepository : ISongRepository
    {
        private readonly Context _context = null;

        public SongRepository(IOptions<Settings> settings)
        {
            _context = new Context(settings);
        }
        public async Task AddSong(Song song)
        {
            try
            {
                await _context.Songs.InsertOneAsync(song);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<Song> GetSong(string id)
        {
            try
            {
                return await _context.Songs
                    .Find(s => s.Id == id)
                    .FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<IEnumerable<Song>> SearchSongs(string query, int pageNum, int pageSize)
        {
            try
            {
                var queryList = query.Split(' ').Select(x => x.ToLower()).ToList();
                var list = await _context.Songs
                        .Find(x => x.Title.ToLower().Contains(queryList[0])).ToListAsync();
                queryList.RemoveAt(0);
                foreach (var q in queryList)
                {
                    list = list.Where(x => x.Title.ToLower().Contains(q)).ToList();
                }
                return list.Skip((pageNum - 1) * pageSize).Take(pageSize);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<bool> UpdateSong(string id, Song song)
        {
            try
            {
                var actionResult = await _context.Songs
                    .ReplaceOneAsync(m => m.Id.Equals(id), song);
                return actionResult.IsAcknowledged && actionResult.ModifiedCount > 0;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}