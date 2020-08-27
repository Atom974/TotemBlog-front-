import { UserInterface } from "./user";

export default interface Article {
    id: number;
    title: string;
    text: string;
    pseudo: string;
    imagePath: string;
    Tags: Array<tags>;
    isPublic: boolean;
    createdAt: Date;
    User: UserInterface;
    Commentaires: Array<com>;
};

export interface tags { 
    id: number;
    name: string;
    articleId: number;
}
export interface com {
    pseudo?: string;
    id: number;
    text: string;
    userParams?: number;
    articleParams?: number;
    avatarPath? : string;
}