import React, { FunctionComponent, useState, useEffect } from 'react';
import { useHistory, RouteComponentProps, } from 'react-router-dom';
import Article from "../models/article";
import _ from 'lodash';
import ArticleService from '../services/article-services';



type Field = {
    value?: any,
    error?: string,
    isValid?: boolean,
    path?: any
};

type FormData = {
    id: Field
    text: Field,
    tags: Field,
    title: Field,
    avatar: Field,
    isPublic: Field
}

type Params = { id: string };

const ArticleEdit: FunctionComponent<RouteComponentProps<Params>> = ({ match }) => {


    const [article, setArticle] = useState<Article | null>(null);
    const [type, setType] = useState<boolean>(true);

    const [form, setForm] = useState<FormData>({
        id: {value: ''},
        text: { value: '' },
        tags: { value: '' },
        title: { value: '' },
        avatar: { value: File },
        isPublic: { value: type }
    });

    useEffect(() => {
        ArticleService.getArticle(+match.params.id).then(article => {
            let name = _.map(article.Tags, 'name');
            let tagsString = _.join(name, ',')
            let test: FormData = {
                id: {value: article.id, isValid: true},
                text: { value: article.text, isValid: true },
                tags: { value: tagsString, isValid: true },
                title: { value: article.title, isValid: true },
                avatar: { value: article.imagePath, isValid: true },
                isPublic: { value: article.isPublic, isValid: true }
            }
            setForm(test);
            setType(article.isPublic);
            setArticle(article);
        })
    }, [match.params.id]);
    const history = useHistory();



    const [message, setMessage] = useState<string>('UPDATE ARTICLE');




    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const fieldName: string = e.target.name;
        const fieldValue: string = e.target.value;
        const newField: Field = { [fieldName]: { value: fieldValue } };

        setForm({ ...form, ...newField });
    }
    const handleUploadChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const fieldName: string = 'avatar';
        if (e.target.files) {
            const fieldValue: any = e.target.files[0];

            const newField: Field = { [fieldName]: { value: fieldValue } };
            setForm({ ...form, ...newField });
        }
    }
    const checkPublic = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const checked = e.target.checked;
        let newField: Field;
        if (checked) {
            newField = { value: true };
            setType(true);
        } else {
            setType(false);
            newField = { value: false };
        }
        setForm({ ...form, ...{ isPublic: newField } });
    }

    const validateForm = () => {
        let newForm: FormData = form;

        // Validator text
        if (form.text.value.length < 3) {
            const errorMsg: string = 'Votre text doit faire au moins 3 caractères de long.';
            const newField: Field = { value: form.text.value, error: errorMsg, isValid: false };
            newForm = { ...newForm, ...{ text: newField } };
        } else {
            const newField: Field = { value: form.text.value, error: '', isValid: true };
            newForm = { ...newForm, ...{ text: newField } };
        }
        //validator title
        if (form.title.value.length < 3) {
            const errorMsg: string = 'Votre title doit faire au moins 3 caractères de long.';
            const newField: Field = { value: form.title.value, error: errorMsg, isValid: false };
            newForm = { ...newForm, ...{ title: newField } };
        } else {
            const newField: Field = { value: form.title.value, error: '', isValid: true };
            newForm = { ...newForm, ...{ title: newField } };
        }



        const newField: Field = { value: form.tags.value, error: '', isValid: true };
        newForm = { ...newForm, ...{ tags: newField, } };


        setForm(newForm);
        return newForm.text.isValid && newForm.tags.isValid && newForm.title.isValid;
    }


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const isFormValid = validateForm();
        if (isFormValid && article) {
            const arr = _.split(form.tags.value, ',');
            let trimArr = _.map(arr, _.trim);
            ArticleService.updateArtcle(form.id.value, form.text.value, trimArr, form.title.value, form.avatar.value, form.isPublic.value)
                .then(data => {
                    if (data) {
                        setMessage('Article ajouté');
                        history.push('/');
                        history.goBack();
                    } else {
                        setMessage('something go wrong');
                    }
                }) 
        }
    }

    return (
        <div>
            {article ? (
                <form onSubmit={(e) => handleSubmit(e)}>
                    <div className="row">
                        <div className="col s12 m8 offset-m2">
                            <div className="card hoverable">
                                <div className="card-image">
                                    <img src={'http://localhost:3000/' + article.imagePath} alt={article.title} style={{ width: '250px', margin: '0 auto' }} />
                                </div>
                                <div className="card-stacked">
                                    <div className="card-content">
                                        {/* Form message */}
                                        {message && <div className="form-group">
                                            <div className="card-panel grey lighten-5">
                                                {message}
                                            </div>
                                        </div>}
                                        {/* Field title */}
                                        <div className="form-group">
                                            <label htmlFor="title">Title</label>
                                            <input id="title" type="text" name="title" className="form-control" value={form.title.value} onChange={e => handleInputChange(e)}></input>
                                            {/* error */}
                                            {form.title.error &&
                                                <div className="card-panel red accent-1">
                                                    {form.title.error}
                                                </div>}
                                        </div>
                                        {/* Field text */}
                                        <div className="form-group">
                                            <label htmlFor="text">text</label>
                                            <input id="text" type="text" name="text" className="form-control" value={form.text.value} onChange={e => handleInputChange(e)}></input>
                                            {/* error */}
                                            {form.text.error &&
                                                <div className="card-panel red accent-1">
                                                    {form.text.error}
                                                </div>}
                                        </div>
                                        {/* Field Tags*/}
                                        <div className="form-group">
                                            <label htmlFor="tags">Tags <strong>(separate by ' , ')</strong></label>
                                            <input id="tags" placeholder="Exemple,2,3tags" type="text" name="tags" className="form-control" value={form.tags.value} onChange={e => handleInputChange(e)}></input>
                                            {/* error */}
                                            {form.tags.error &&
                                                <div className="card-panel red accent-1">
                                                    {form.tags.error}
                                                </div>}
                                        </div>
                                        {/* Field isPublic*/}
                                        <div className="form-group">
                                            <label>
                                                <input checked={type} onChange={e => checkPublic(e)} type="checkbox" />
                                                <span>Is Public</span>
                                            </label>
                                        </div>
                                        {/* Field avatar */}
                                        <div className="form-group">
                                            <div className="file-field input-field">
                                                <div className="btn">
                                                    <span>picture</span>
                                                    <input type="file" value={form.avatar.path} onChange={e => handleUploadChange(e)} />
                                                </div>

                                                <div className="file-path-wrapper">
                                                    <input id="avatar" type="text" name="avatar" className="form-control file-path validate" ></input>
                                                </div>
                                            </div>
                                            {/* error */}
                                            {form.avatar.error &&
                                                <div className="card-panel red accent-1">
                                                    {form.avatar.error}
                                                </div>}
                                        </div>
                                    </div>
                                    <div className="card-action center">
                                        {/* Submit button */}
                                        <button type="submit" className="btn">Valider</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form >
            ) : (
                    <div></div>
                )}
        </div>)
};

export default ArticleEdit;