import React, { FunctionComponent, useState, useEffect } from 'react';
import { RouteComponentProps, Link, useHistory } from 'react-router-dom';
import Article from "../models/article";
import ArticleService from "../services/article-services";
import Loader from "../components/loader";
import CommentaireService from "../services/commentaire-services";

type Field = {
    value?: any,
    error?: string,
    isValid?: boolean,
    path?: any
};

type FormData = {
    id: Field,
    text: Field,
}
type Params = { id: string };

const ArticleDetail: FunctionComponent<RouteComponentProps<Params>> = ({ match }) => {

    const [article, setArticle] = useState<Article | null>(null);
    const history = useHistory();

    const [form, setForm] = useState<FormData>({
        id: { value: +match.params.id },
        text: { value: '' }
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const fieldName: string = e.target.name;
        const fieldValue: string = e.target.value;
        const newField: Field = { [fieldName]: { value: fieldValue } };

        setForm({ ...form, ...newField });
    }

    const validateForm = () => {
        let newForm: FormData = form;
        if (form.text.value.length < 3) {
            const errorMsg: string = 'Votre Message doit faire au moins 3 caractères de long.';
            const newField: Field = { value: form.text.value, error: errorMsg, isValid: false };
            newForm = { ...newForm, ...{ text: newField } };
        } else if (form.text.value.length > 255) {

            const errorMsg: string = 'Votre prénom doit faire moins de 255 caractères de long.';
            const newField: Field = { value: form.text.value, error: errorMsg, isValid: false };
            newForm = { ...newForm, ...{ text: newField } };
        } else {
            const newField: Field = { value: form.text.value, error: '', isValid: true };
            newForm = { ...newForm, ...{ text: newField } };
        }
        setForm(newForm);
        return newForm.text.isValid;
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const isFormValid = validateForm();
        if (isFormValid) {
            CommentaireService.add(+match.params.id, form.text.value);
            history.go(0);
        }
    }
    const deleteArticle = (id: number) => {
        ArticleService.delete(id); 
        history.push('/blog');
        history.go(0);
    }

    useEffect(() => {
        ArticleService.getArticle(+match.params.id).then(article => setArticle(article)).catch((err) =>{
            history.push('/pageNotF');
        });
    }, [match.params.id]);

    const deleteCom = (id: number) => {
        CommentaireService.delete(id);
        history.go(0);
    }


    return (
        <div>
            {article ? (
                <div className="row">
                    <div className="col s12 m8 offset-m2">
                        <h2 className="header center">{article.title}</h2>
                        <div className="card hoverable">
                            <div className="card-image">
                                <img src={'http://localhost:3000/' + article.imagePath} alt={article.title} style={{ width: '250px', margin: '0 auto' }} />
                                <Link to={`/articles/edit/${article.id}`} className="btn btn-floating halfway-fab waves-effect waves-light">
                                    <i className="material-icons">edit</i>
                                </Link>
                            </div>
                            <div className="card-stacked">
                                <div className="card-content">
                                    <table className="bordered striped">
                                        <tbody>
                                            <tr>
                                                <td>Author</td>
                                                <td><div className="chip">
                                                    <img className="imgAvatar" alt="avatar" src={'http://localhost:3000/' + article.User.avatarPath} />
                                                    {article.User.pseudo}
                                                </div></td>
                                            </tr>
                                            <tr>
                                                <td>Date</td>
                                                <td><strong>{article.createdAt}</strong></td>
                                            </tr>
                                            <tr>
                                                <td>Text</td>
                                                <td><strong>{article.text}</strong></td>
                                            </tr>
                                            <tr>
                                                <td>Tags</td>
                                                <td>
                                                    {article.Tags.map(tag => (
                                                        <span key={tag.name} className="chip">{tag.name}</span>
                                                    ))}</td>
                                            </tr>
                                            <tr>
                                                <td>Visible ?</td>
                                                <td>{article.isPublic ? (<span className="new badge  green darken-2" data-badge-caption="article">public</span>) : (<span className="new badge red darken-2" data-badge-caption="article">private</span>)}</td>
                                            </tr>
                                            {article.Commentaires.map(com => (
                                                <tr>
                                                    <td><div className="chip">
                                                        <img key={com.avatarPath} className="imgAvatar" alt="avatar" src={'http://localhost:3000/' + com.avatarPath} />
                                                        {com.pseudo}
                                                    </div></td>
                                                    <td>{com.text}</td>
                                                    <td><a className="waves-effect waves-light btn" onClick={() => deleteCom(com.id)}><i className="material-icons ">delete</i></a></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="row">
                                        <form onSubmit={(e) => handleSubmit(e)} className="col s12">
                                            <div className="row">
                                                <div className="input-field col s12">
                                                    <input type="text" id="text" name="text" value={form.text.value} onChange={e => handleInputChange(e)}  className="materialize-textarea form-control"></input>
                                                    <label className="textarea1">Commentaire</label>
                                                </div>
                                                <button type="submit" className="btn">Valider</button>
                                            </div>
                                            {form.text.error &&
                                        <div className="card-panel red accent-1">
                                            {form.text.error}
                                        </div>}
                                        </form>
                                    </div>
                                </div>
                                <div className="card-action">
                                    <Link to="/">Retour</Link>
                                </div>
                                <div className="card-action">
                                <a className="waves-effect waves-light red btn" onClick={() => deleteArticle(+match.params.id)}><i className="material-icons right">delete</i>Supprimer l'article</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                    <h4 className="center"><Loader /></h4>
                )}
        </div>
    );
}
export default ArticleDetail;