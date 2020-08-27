import { UserInterface } from "../models/user";


export default class UserService {
    static generateUserAdmin(): Promise<UserInterface> {
        return fetch('http://localhost:3000/generate')
            .then(response => response.json())
            .catch(error => this.handleError(error));
    }

    static handleError(error: any): void {
        console.error(error);
    }
};
