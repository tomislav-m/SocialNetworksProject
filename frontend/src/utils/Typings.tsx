export interface IGenre {
    id: string;
    tmDbId: string;
    name: string;
}
// info o filmovima iz apija
export interface IMovie {
    id: string; // kod TopWatched liste filmova id je id od tmDb, a u svim drugim slučajevima je id iz baze
    title: string;
    overview: string;
    poster_path: string;
    voteAverage: number;
    rating: number;
    ratingCount: number;
    runtime: string;
    release_date: string;
    genre_ids: string[];
    actorsIds: string[];
    directorsIds: string[];
    soundtrackId: string;
}