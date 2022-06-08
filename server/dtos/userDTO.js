export default class userDTO {
    login;
    id;

    constructor(User) {
        this.login = User.login;
        this.id = User.id;
    }
}
