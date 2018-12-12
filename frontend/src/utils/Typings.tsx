export interface IGenre {
    id: string;
    tmDbId: string;
    name: string;
}
// info o filmovima iz apija
export interface IMovie {
    id: string;
    title: string;
    overview: string;
    poster_path: string;
    vote_average: number;
    vote_count: number;
}