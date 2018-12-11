export interface IGenre {
    id: string;
    tmDbId: string;
    name: string;
}

export interface IMovie {
    id: string;
    title: string;
    overview: string;
    poster_path: string;
    vote_average: number;
}