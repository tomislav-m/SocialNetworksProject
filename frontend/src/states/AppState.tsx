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
}
