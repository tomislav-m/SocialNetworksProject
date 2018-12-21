using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SocialNetworks.Models;
using SocialNetworks.Repositories;
using NReco.CF.Taste.Model;
using NReco.CF.Taste.Impl.Model;
using NReco.CF.Taste.Impl.Similarity;
using NReco.CF.Taste.Impl.Neighborhood;
using NReco.CF.Taste.Impl.Recommender;
using NReco.CF.Taste.Impl.Common;
using AutoMapper;

namespace SocialNetworks.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoviesController : ControllerBase
    {
        private readonly IMovieRepository _movieRepository;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public MoviesController(IMovieRepository movieRepository, IUserRepository userRepository, IMapper mapper)
        {
            _movieRepository = movieRepository;
            _userRepository = userRepository;
            _mapper = mapper;
        }

        // GET: api/Movies/
        [HttpGet]
        public async Task<IEnumerable<MovieJson>> Get(int pageNum = 1, int pageSize = 20)
        {
            var movies = await _movieRepository.GetAllMovies(pageNum, pageSize);
            return _mapper.Map<IList<MovieJson>>(movies);
        }

        [HttpGet("top-rated")]
        public async Task<IEnumerable<MovieJson>> GetTopRated(int pageNum = 1, int pageSize = 20)
        {
            var movies = await _movieRepository.GetTopRatedMovies(pageNum, pageSize);
            return _mapper.Map<IList<MovieJson>>(movies);
        } 

        // GET: api/Movies/5
        [HttpGet("{id}")]
        public async Task<MovieJson> Get(string id)
        {
            return _mapper.Map<MovieJson>(await _movieRepository.GetMovie(id));
        }

        // POST: api/Movies
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] MovieJson movie)
        {
            await _movieRepository.AddMovie(_mapper.Map<Movie>(movie));
            return new OkObjectResult(movie);
        }

        // PUT: api/Artists/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(string id, [FromBody] MovieJson movie)
        {
            await _movieRepository.UpdateMovie(id, _mapper.Map<Movie>(movie));
            return new OkObjectResult(movie);
        }

        // DELETE: api/Movies/5
        [HttpDelete("{id}")]
        public void Delete(string id)
        {
            _movieRepository.RemoveMovie(id);
        }

        [HttpGet]
        [Route("search/{query}")]
        public async Task<IEnumerable<MovieJson>> Search(string query, int pageNum = 1, int pageSize = 20)
        {
            var movies = await _movieRepository.SearchMovies(query, pageNum, pageSize);
            return _mapper.Map<IList<MovieJson>>(movies);
        }

        [HttpGet]
        [Route("recommend/{id}")]
        public async void Recommend(string id, int resultNum = 3)
        {
            IDataModel model = null;
            var users = _userRepository.GetAll();

            Dictionary<string, long> movieDict = new Dictionary<string, long>();
            model = loadDataModel(users, movieDict);

            var similarity = new EuclideanDistanceSimilarity(model);
			var neighborhood = new ThresholdUserNeighborhood(0, similarity, model);
			var recommender = new GenericItemBasedRecommender(model, similarity);
			var recommendedItems = recommender.Recommend(1, 1);
            
            var movieId = movieDict.FirstOrDefault(x => x.Value == recommendedItems[0].GetItemID()).Key;
            Console.WriteLine((await _movieRepository.GetMovie(movieId)).Title);
        }

        [HttpGet("getRatings/{id}")]
        public async Task<string> GetRatings(string id)
        {
            var ratings = await _movieRepository.GetRatings(id);
            return ratings;
        }

        private IDataModel loadDataModel(IEnumerable<User> users, Dictionary<string, long> movieDict)
        {
            FastByIDMap<IList<IPreference>> data = new FastByIDMap<IList<IPreference>>();
            int userId = 0;
            int inc = 0;
            Random random = new Random();
            foreach(var user in users)
            {
                var userPrefs = new List<IPreference>();
                data.Put(userId, userPrefs);
                foreach(var rating in user.MovieRatings)
                {
                    long movieId;
                    if(movieDict.ContainsKey(rating.Key))
                    {
                        movieId = movieDict[rating.Key];
                    }
                    else
                    {
                        movieDict.Add(rating.Key, inc);
                        movieId = inc++;
                    }
                    userPrefs.Add(new GenericPreference(userId, movieId, rating.Value));
                }
                ++userId;
            }

            var newData = new FastByIDMap<IPreferenceArray>();
			foreach (var entry in data.EntrySet()) {
				var prefList = (List<IPreference>) entry.Value;
				newData.Put( entry.Key, (IPreferenceArray)new GenericUserPreferenceArray(prefList));
			}
            return new GenericDataModel(newData);
        }
    }
}