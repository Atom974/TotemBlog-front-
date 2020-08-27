import { get } from 'local-storage';
import { LogedUserInface } from "../services/authentication-services";

export default class CommentaireService {



    static getUser(): Promise<LogedUserInface| null> {
        return new Promise((resolve) => {
            const user: LogedUserInface = get('user');
            if (!user)
                resolve(null);
            resolve(user);
        })
    }

    static async delete(id: number): Promise<any> {
        try {

             const user = await this.getUser();
            if (user) {
                const myheaders = new Headers();
                const send = { id : id };
                myheaders.append('Content-type', 'application/json');
                myheaders.append('x-access-token', user.token)
                const response = await fetch(`http://localhost:3000/commentaires`,
                   { method: 'DELETE',
                   headers: myheaders,
                   body: JSON.stringify(send)});
                   const data = await response.json();
                   if (data.Error != null){
                    console.log(data.Error[0])
                } else {
                   console.log(data);
                } 
            }
        } catch (err) {
            console.log(err.Error[0]);
            return;
        }
    }
    static async add(id: number, text: string): Promise<any> {
        try {
             const user = await this.getUser();
            if (user) {
                const myheaders = new Headers();

                const send = {
                    id : id,
                    text: text
                };
                myheaders.append('Content-type', 'application/json');
                myheaders.append('x-access-token', user.token)
                const response = await fetch(`http://localhost:3000/commentaires`,
                   { method: 'POST',
                   headers: myheaders,
                   body: JSON.stringify(send)});
                   const data = await response.json();
                   if (data.Error != null){
                    console.log(data.Error[0])
                } else {
                   console.log(data);
                } 
            }
        } catch (err) {
            console.log(err.Error[0]);
            return;
        }
    }
    static handleError(error: any): void {
        console.log(`Handle`);
        console.error(error);
    }
}