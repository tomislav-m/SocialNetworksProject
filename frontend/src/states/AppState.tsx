import { observable } from 'mobx';

class AppState {
    @observable public firstName: string = ''; // ili private??
    @observable public lastName: string = '';
    @observable public imageUrl: string = '';
    @observable public accessToken: string = ''; // ovo pamtiti jer se salje u svakom requestu prema bazi?
}

export default AppState;