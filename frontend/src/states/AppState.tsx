import { observable } from 'mobx';

class AppState {
    @observable public firstName: string = ''; 
    @observable public lastName: string = '';
    @observable public email: string = '';
    @observable public imageUrl: string = '';
    @observable public accessToken: string = ''; // ovo pamtiti jer se salje u svakom requestu prema bazi?
}

export default AppState;