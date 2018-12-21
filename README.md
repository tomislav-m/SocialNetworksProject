# SocialNetworksProject

GET api/genres
GET api/genres/{id}

GET api/movies?pageNum=1&pageSize=20 <br/>
GET api/movies/{movieId} <br/>
GET api/movies/search/{query}?pageNum=1&pageSize=20 <br/>
GET api/movies/getRatings/{movieId}

GET api/people?pageNum=1&pageSize=50 <br/>
GET api/people/{id}

POST api/users/facebook <br/>
POST api/users/google <br/>
POST api/users/add-ratings/userId

GET api/users/recommender/{userId}

# START BACKEND
cd ~/SocialNetworksProject/Backend/SocialNetworks
dotnet run

# START FRONTEND
cd ~/SocialNetworksProject/frontend
npm install
npm start

# The movie dba
dmFer2018
