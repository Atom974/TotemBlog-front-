import Article from "../models/article";
import { LogedUserInface } from "../services/authentication-services";
import { get } from 'local-storage';

export default class ArticleService {

    static getUser(): Promise<LogedUserInface| null> {
        return new Promise((resolve) => {
            const user: LogedUserInface = get('user');
            if (!user)
                resolve(null);
            resolve(user);
        })
    }

    static postArticle(log: FormData, user: any): Promise<LogedUserInface>{
        return fetch(`http://localhost:3000/article`, {
            method: 'POST',
            body: log,
            headers: {'x-access-token': user.token}
        })
        .then(response => response.json())
        .catch(error => this.handleError(error));
    }
    static upArticle(log: FormData, user: any): Promise<LogedUserInface>{
        return fetch(`http://localhost:3000/article`, {
            method: 'PUT',
            body: log,
            headers: {'x-access-token': user.token}
        })
        .then(response => response.json())
        .catch(error => this.handleError(error));
    }

    static async addArtcle(text:string, tags: Array<string>, title:string, avatar: File, isPublic: Boolean): Promise<any> {
        try { 
            let form = await new FormData();
            await form.append('text', text);
            for (let i = 0; i< tags.length; i++) {
                form.append('tag[]', tags[i]);
            }
            await form.append('isPublic', JSON.stringify(isPublic));
            await form.append('title', title);
            await form.append('avatarPath', avatar);

            const user = await this.getUser();
            const data = await this.postArticle(form, user);
            if (data.Error != null){
                this.handleError(data.Error);
            } else {
                return true;
            }
        } catch (err) {

        }
    }
    static async updateArtcle(id: number,text:string, tags: Array<string>, title:string, avatar: File, isPublic: Boolean): Promise<any> {
        try { 
            let form = await new FormData();
            await form.append('id', JSON.stringify(id));
            await form.append('text', text);
            for (let i = 0; i< tags.length; i++) {
                form.append('Tags[]', tags[i]);
            }
            await form.append('isPublic', JSON.stringify(isPublic));
            await form.append('title', title);
            await form.append('avatarPath', avatar);

            const user = await this.getUser();
            const data = await this.upArticle(form, user);
            if (data.Error != null){
                this.handleError(data.Error);
            } else {
                return true;
            }
        } catch (err) {

        }
    }

    static async getArticles(): Promise<any> {
        try {
            const user = await this.getUser();
            if (user) {
            return fetch('http://localhost:3000/article', {
                headers: {'x-access-token': user.token},
            })
                .then(response => response.json())
                .catch(error => this.handleError(error));
            } else {
                return fetch('http://localhost:3000/articlepublic')
                    .then(response => response.json())
                    .catch(error => this.handleError(error));
            }
        } catch (err) {
            return;
        }
    }
    static searchArticle(term: string): Promise<Article[]> {
        return fetch(`http://localhost:3000/articlesearch/${term}`)
                .then(response => response.json())
                .catch(error => this.handleError(error));
    }

    static async getArticle(id: number): Promise<any> {
        try {
        const user = await this.getUser();
        if (user) {
        return fetch(`http://localhost:3000/article/${id}`,
        {
            headers: {'x-access-token': user.token},
        })
            .then(response => response.json())
            .then(data => this.isEmpty(data) ? null : data)
            .catch(error => this.handleError(error));
        }
        } catch (err) {
            return;
        }
    }
    static async delete(id: number): Promise<any> {
        try {
             const user = await this.getUser();
            if (user) {
                const myheaders = new Headers();
                const send = { id : id };
                myheaders.append('Content-type', 'application/json');
                myheaders.append('x-access-token', user.token)
                const response = await fetch(`http://localhost:3000/article`,
                   { method: 'DELETE',
                   headers: myheaders,
                   body: JSON.stringify(send)});
                   const data = await response.json();
            }
        } catch (err) {
            this.handleError(err);
        }
    }

    static isEmpty(data: Object): boolean {
        
        return Object.keys(data).length === 0;
    }

    static handleError(error: any) {
        console.error(error);
        return false;
    }
}