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
    public interface IUserRepository
    {
        User Authenticate(string username, string password);
        IEnumerable<User> GetAll();
        User GetById(string id);
        User GetByEmail(string email);
        User Create(User user, string password, bool isExternal = false);
        void Update(User user, string password = null);
        void Delete(string id);
        Task AddRatings(string id, Dictionary<string, int> ratings);
    }

    public class UserRepository : IUserRepository
    {
        private readonly Context _context = null;

        public UserRepository(IOptions<Settings> settings)
        {
            _context = new Context(settings);
        }

        public User Authenticate(string email, string password)
        {
            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
                return null;

            var user = _context.Users.Find<User>(x => x.Email == email).SingleOrDefault();

            if (user == null)
                return null;

            if (!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
                return null;

            return user;
        }

        public IEnumerable<User> GetAll()
        {
            return _context.Users.Find(_ => true).ToList();
        }

        public User GetById(string id)
        {
            return _context.Users.Find(x => x.Id == id).SingleOrDefault();
        }

        public User GetByEmail(string email)
        {
            return _context.Users.Find(x => x.Email == email).SingleOrDefault();
        }

        public User Create(User user, string password, bool isExternal = false)
        {
            if (string.IsNullOrWhiteSpace(password))
            {
                if (isExternal)
                {
                    password = createRandomString(8);
                }
                else
                {
                    throw new AppException("Password is required");
                }
            }

            if (_context.Users.Find(x => x.Email == user.Email).Any())
            {
                throw new AppException("Username \"" + user.Email + "\" is already taken");
            }

            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(password, out passwordHash, out passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;
            user.MovieRatings = new Dictionary<string, int>();
            user.FavoriteGenres = new List<string>();
            user.Id = null;

            _context.Users.InsertOne(user);

            return user;
        }

        public void Update(User userParam, string password = null)
        {
            var user = _context.Users.Find(x => x.Id == userParam.Id).SingleOrDefault();

            if (user == null)
                throw new AppException("User not found");

            if (userParam.Email != user.Email)
            {
                if (_context.Users.Find(x => x.Email == userParam.Email).Any())
                    throw new AppException("Username " + userParam.Email + " is already taken");
            }

            user.FirstName = userParam.FirstName;
            user.LastName = userParam.LastName;
            user.Email = userParam.Email;

            if (!string.IsNullOrWhiteSpace(password))
            {
                byte[] passwordHash, passwordSalt;
                CreatePasswordHash(password, out passwordHash, out passwordSalt);

                user.PasswordHash = passwordHash;
                user.PasswordSalt = passwordSalt;
            }

            _context.Users.ReplaceOne(x => x.Id == userParam.Id, user);
        }

        public void Delete(string id)
        {
            var user = _context.Users.Find(x => x.Id == id).SingleOrDefault();
            if (user != null)
            {
                _context.Users.DeleteOne(x => x.Id == id);
            }
        }

        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            if (password == null) throw new ArgumentNullException("password");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");

            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        private static bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
        {
            if (password == null) throw new ArgumentNullException("password");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");
            if (storedHash.Length != 64) throw new ArgumentException("Invalid length of password hash (64 bytes expected).", "passwordHash");
            if (storedSalt.Length != 128) throw new ArgumentException("Invalid length of password salt (128 bytes expected).", "passwordHash");

            using (var hmac = new System.Security.Cryptography.HMACSHA512(storedSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != storedHash[i]) return false;
                }
            }

            return true;
        }

        private static string createRandomString(int length)
        {
            Random random = new Random();
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        public async Task AddRatings(string id, Dictionary<string, int> ratings)
        {
            try
            {
                var filter = Builders<User>.Filter.Eq(x => x.Id, id);
                var update = Builders<User>
                    .Update.AddToSetEach(x => x.MovieRatings, ratings);

                await _context.Users.FindOneAndUpdateAsync(filter, update);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}