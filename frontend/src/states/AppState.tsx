import { observable } from 'mobx';

export class AppState {
    // user
    @observable public firstName: string = ''; 
    @observable public lastName: string = '';
    @observable public email: string = '';
    @observable public imageUrl: string = '';
    @observable public accessToken: string = ''; // token koji dobivamo od googlea
    @observable public token: string = ''; // token koji se šalje u headeru, sami generiramo
    @observable public idGenres: string[] = [];

    // info o movie koji povučemo iz baze
    @observable public title = '';
    @observable public plot = '';
    @observable public directorsIds: string[] = [];
    @observable public actorsIds: string[] = [];
    @observable public genresIds: string[] = [];
    @observable public voteAverage: number;
    @observable public voteCount: number;
    @observable public soundtrackId: '';
    @observable public runtime: '';
    @observable public releaseDate: '';
    @observable public posterUrl: '';
    @observable public popularity: number; // kaj je ovo????
}

