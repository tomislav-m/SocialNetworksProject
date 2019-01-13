# SocialNetworksProject

SocialNetworksProject is a movie recommendation application created by:

* Kurek Andrea
* Maslač Tomislav
* Šabić Marina
* Vitas Valentina

## START DATABASE LOCALLY
* Prerequisites: installed and started MongoDB
If you run this application for the first time follow this steps:
1) unzip sndb.zip
2) Run this command: `mongorestore -d sndb <path>` , where path is path to unziped sndb.zip folder 

## START BACKEND
You need to be positioned in  `~/SocialNetworksProject/Backend/SocialNetworks`

Then run following command: 
```
dotnet run
```

## START FRONTEND
You need to be positioned in `~/SocialNetworksProject/frontend`

Then run following commands:
```
npm install
npm start
```

### START USING APPLICATION
Go to: [https://localhost:3000](https://localhost:3000)