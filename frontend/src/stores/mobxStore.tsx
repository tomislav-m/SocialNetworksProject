import { observable } from 'mobx';

export interface IMobxStore {
    firstName: string;
    lastName: string;
    email: string;
    imageUrl: string;
    accessToken: string;
    token: string;
    idGenres: string[];
    movieRatings: any[];
}
export class MobxStore implements IMobxStore{
    // user
    @observable public firstName = ''; 
    @observable public lastName = '';
    @observable public email = '';
    @observable public imageUrl = '';
    @observable public accessToken = ''; // token koji dobivamo od googlea
    @observable public token = ''; // token koji se šalje u headeru, sami generiramo
    @observable public idGenres = [];
    @observable public movieRatings = [];
}

