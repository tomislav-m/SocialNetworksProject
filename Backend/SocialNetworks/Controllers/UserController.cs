using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Options;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using SocialNetworks.Repositories;
using SocialNetworks.Models;
using SocialNetworks.Helpers;
using AutoMapper;
using System.Net.Http;
using Newtonsoft.Json;
using System.Threading.Tasks;
using Recommender;
using System.Linq;
using Microsoft.AspNetCore.Cors;

namespace SocialNetworks.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private IUserRepository _userRepository;
        private IMovieRepository _movieRepository;
        private IMapper _mapper;
        private readonly Settings _appSettings;
        private static readonly HttpClient Client = new HttpClient();
        private readonly FacebookAuthSettings _fbAuthSettings;

        public UsersController(
            IUserRepository userRepository,
            IMovieRepository movieRepository,
            IMapper mapper,
            IOptions<Settings> appSettings,
            IOptions<FacebookAuthSettings> fbAuthSettings)
        {
            _userRepository = userRepository;
            _movieRepository = movieRepository;
            _mapper = mapper;
            _appSettings = appSettings.Value;
            _fbAuthSettings = fbAuthSettings.Value;
        }

        [AllowAnonymous]
        [HttpPost("authenticate")]
        public IActionResult Authenticate([FromBody]UserDto userDto)
        {
            var user = _userRepository.Authenticate(userDto.Email, userDto.Password);

            if (user == null)
                return BadRequest(new { message = "Username or password is incorrect" });

            var tokenString = getToken(user);
            return Ok(new
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Token = tokenString
            });
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public IActionResult Register([FromBody]UserDto userDto)
        {
            var user = _mapper.Map<User>(userDto);

            try
            {
                _userRepository.Create(user, userDto.Password);
                return Ok();
            }
            catch (AppException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        
        [HttpGet]
        public IActionResult GetAll()
        {
            var users = _userRepository.GetAll();
            var userDtos = _mapper.Map<IList<UserDto>>(users);
            return Ok(userDtos);
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public IActionResult GetById(string id)
        {
            var user = _userRepository.GetById(id);
            var userDto = _mapper.Map<UserDto>(user);
            return Ok(userDto);
        }

        [HttpPut("{id}")]
        public IActionResult Update(string id, [FromBody]UserDto userDto)
        {
            var user = _mapper.Map<User>(userDto);
            user.Id = id;

            try
            {
                _userRepository.Update(user, userDto.Password);
                return Ok();
            }
            catch (AppException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            _userRepository.Delete(id);
            return Ok();
        }

        [AllowAnonymous]
        [HttpPost("facebook")]
        public async Task<IActionResult> Facebook([FromBody]FacebookUserData userData)
        {
            var appAccessTokenResponse = await Client.GetStringAsync($"https://graph.facebook.com/oauth/access_token?client_id={_fbAuthSettings.AppId}&client_secret={_fbAuthSettings.AppSecret}&grant_type=client_credentials");
            var appAccessToken = JsonConvert.DeserializeObject<FacebookAppAccessToken>(appAccessTokenResponse);
            var userAccessTokenValidationResponse = await Client.GetStringAsync($"https://graph.facebook.com/debug_token?input_token={userData.AccessToken}&access_token={appAccessToken.AccessToken}");
            var userAccessTokenValidation = JsonConvert.DeserializeObject<FacebookUserAccessTokenValidation>(userAccessTokenValidationResponse);
            if (!userAccessTokenValidation.Data.IsValid)
            {
                return BadRequest("Invalid facebook token.");
            }

            return ExternalLogin(userData);
        }

        [AllowAnonymous]
        [HttpPost("google")]
        public async Task<IActionResult> Google([FromBody]GoogleUserData body)
        {
            var response = await Client.GetStringAsync($"https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={body.AccessToken}");
            var userData = JsonConvert.DeserializeObject<GoogleUserData>(response);
            return ExternalLogin(userData);
        }
        
        [HttpPut("add-ratings/{id}")]
        public async Task<IActionResult> AddRatings(string id, [FromBody]Dictionary<string, int> ratings)
        {
            var userRatings = _userRepository.GetById(id).MovieRatings;
            await _userRepository.AddRatings(id, ratings);
            foreach(var movieRating in ratings)
            {
                var movie = await _movieRepository.GetMovie(movieRating.Key);
                var x = movie.Rating * movie.RatingCount;
                var y = 0;
                if (!userRatings.ContainsKey(movieRating.Key))
                {
                    ++movie.RatingCount;
                }
                else
                {
                    y = userRatings[movieRating.Key];
                }
                movie.Rating = (x + movieRating.Value - y) / movie.RatingCount;
                await _movieRepository.UpdateMovie(movie.TMDbId, movie);
            }
            return Ok();
        }
        
        [AllowAnonymous]
        [HttpGet("recommend/{id}")]
        public async Task<IActionResult> Recommend(string id, string genres)
        {
            if (_userRepository.GetById(id) == null)
            {
                return NotFound();
            }
            var users = _userRepository.GetAll();
            foreach(var user in users)
            {
                for(int i = user.MovieRatings.Count - 1; i >= 0 ; --i)
                {
                    var key = user.MovieRatings.ElementAt(i).Key;
                    if (key.Length < 24)
                    {
                        user.MovieRatings.Remove(key);
                    }
                }
            }
            var recommender = new UserBasedRecommender(users.ToDictionary(x => x.Id, y => y.MovieRatings), id, 0.2);
            var recs = recommender.Recommend();
            var genresArray = genres == null ? new string[] { } : genres.Split(',');
            var movies = (await _movieRepository.GetMoreMovies(recs.Select(x => x.Key), genresArray)).ToList();
            try
            {
                movies.Sort((x, y) => recs.Single(z => z.Key == y.Id).Value.CompareTo(recs.Single(z => z.Key == x.Id).Value));
            }
            catch { }
            return Ok(_mapper.Map<IList<MovieJson>>(movies).Take(30));
        }
        
        [HttpGet("get-rating")]
        public async Task<int> GetRating(string userId, string movieId)
        {
            return await _userRepository.GetRating(userId, movieId);
        }

        private IActionResult ExternalLogin(dynamic userData)
        {
            User user = _userRepository.GetByEmail(userData.Email);

            if (user == null)
            {
                user = _userRepository.Create(_mapper.Map<User>(userData), null, true);
            }

            var tokenString = getToken(user);

            return Ok(new
            {
                user.Id,
                user.Email,
                user.FirstName,
                user.LastName,
                Token = tokenString,
                user.FavoriteGenres,
                user.MovieRatings,
                user.PictureUrl
            });
        }

        private string getToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.Id.ToString())
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return tokenString;
        }
    }
}