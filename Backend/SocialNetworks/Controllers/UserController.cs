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

namespace SocialNetworks.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private IUserRepository _userRepository;
        private IMapper _mapper;
        private readonly Settings _appSettings;
        private static readonly HttpClient Client = new HttpClient();
        private readonly FacebookAuthSettings _fbAuthSettings;

        public UsersController(
            IUserRepository userRepository,
            IMapper mapper,
            IOptions<Settings> appSettings,
            IOptions<FacebookAuthSettings> fbAuthSettings)
        {
            _userRepository = userRepository;
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

            return externalLogin(userData);
        }

        [AllowAnonymous]
        [HttpPost("google")]
        public async Task<IActionResult> Google([FromBody]GoogleUserData body)
        {
            var response = await Client.GetStringAsync($"https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={body.AccessToken}");
            var userData = JsonConvert.DeserializeObject<GoogleUserData>(response);
            return externalLogin(userData);
        }

        [HttpPut("add-ratings/{id}")]
        public async Task<IActionResult> AddRatings(string id, [FromBody]Dictionary<string, int> ratings)
        {
            await _userRepository.AddRatings(id, ratings);
            return Ok();
        }

        private IActionResult externalLogin(dynamic userData)
        {
            var user = _userRepository.GetByEmail(userData.Email);

            if (user == null)
            {
                user = _userRepository.Create(_mapper.Map<User>(userData), null, true);
            }

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