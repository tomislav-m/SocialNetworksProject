# SocialNetworksProject

GET api/genres
GET api/genres/{id}

GET api/movies?pageNum=1&pageSize=20
GET api/movies/{movieId}
GET api/movies/search/{query}?pageNum=1&pageSize=20

GET api/people?pageNum=1&pageSize=50
GET api/people/{id}

POST api/users/facebook
POST api/users/google
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
