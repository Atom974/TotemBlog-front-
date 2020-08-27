import { set } from 'local-storage';


export default class AuthenticationService {
    static isAuthenticated: boolean = false;
    static postLog(log: logInterface): Promise<LogedUserInface> {
        return fetch(`http://localhost:3000/login`, {
            method: 'POST',
            body: JSON.stringify(log),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => response.json())
            .catch(error => this.handleError(error));
    }
    static postReg(log: FormData): Promise<LogedUserInface> {
        return fetch(`http://localhost:3000/user`, {
            method: 'POST',
            body: log,
        })
            .then(response => response.json())
            .catch(error => this.handleError(error));
    }
    static async login(pseudo: string, password: string): Promise<boolean> {
        try {
            const log: logInterface = { pseudo: pseudo, password: password };
            const data = await this.postLog(log)
            if (data.Error != null) {
                return this.isAuthenticated
            } else {
                set('user', data);
                return this.isAuthenticated = true;
            }
        } catch (err) {
            return false;
        }
    }
    static async register(pseudo: string, password: string, email: string, avatarPath: File): Promise<boolean> {
        try {
            let form = await new FormData();
            await form.append('pseudo', pseudo);
            await form.append('password', password);
            await form.append('email', email);
            await form.append('avatarPath', avatarPath);

            const data = await this.postReg(form)
            if (data.Error != null) {
                return this.isAuthenticated
            } else {
                set('user', data);
                return this.isAuthenticated = true;
            }
        } catch (err) {
            return false;
        }
    }
    static handleError(error: any): void {
        console.error(error);
    }

}
export interface logInterface {
    pseudo: string;
    password: string;
}
export interface LogedUserInface {
    pseudo: string;
    email: string;
    avatarPath: string;
    token: string;
    Error?: Array<string>;
}