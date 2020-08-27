import React, { FunctionComponent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import AuthenticationService from '../services/authentication-services';

type Field = {
    value?: any,
    error?: string,
    isValid?: boolean,
    path?: any
};

type FormData = {
    pseudo: Field,
    password: Field,
    email: Field,
    avatar: Field
}

const Register: FunctionComponent = () => {

    const history = useHistory();

    const [form, setForm] = useState<FormData>({
        pseudo: { value: '' },
        password: { value: '' },
        email: { value: '' },
        avatar: {value : File}
    });

    const [message, setMessage] = useState<string>('Inscription !');

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

    const validateForm = () => {
        let newForm: FormData = form;

        // Validator username
        if (form.pseudo.value.length < 3) {
            const errorMsg: string = 'Votre prénom doit faire au moins 3 caractères de long.';
            const newField: Field = { value: form.pseudo.value, error: errorMsg, isValid: false };
            newForm = { ...newForm, ...{ pseudo: newField } };
        } else {
            const newField: Field = { value: form.pseudo.value, error: '', isValid: true };
            newForm = { ...newForm, ...{ pseudo: newField } };
        }
        //validator email
        if (form.email.value.length < 3) {
            const errorMsg: string = 'Votre email doit faire au moins 3 caractères de long.';
            const newField: Field = { value: form.email.value, error: errorMsg, isValid: false };
            newForm = { ...newForm, ...{ email: newField } };
        } else {
            const newField: Field = { value: form.email.value, error: '', isValid: true };
            newForm = { ...newForm, ...{ email: newField } };
        }

        // Validator password
        if (form.password.value.length < 3) {
            const errorMsg: string = 'Votre mot de passe doit faire au moins 6 caractères de long.';
            const newField: Field = { value: form.password.value, error: errorMsg, isValid: false };
            newForm = { ...newForm, ...{ password: newField } };
        } else {
            const newField: Field = { value: form.password.value, error: '', isValid: true };
            newForm = { ...newForm, ...{ password: newField } };
        }


        setForm(newForm);
        return newForm.pseudo.isValid && newForm.password.isValid && newForm.email.isValid;
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const isFormValid = validateForm();
        if (isFormValid) {
            setMessage('👉 Tentative d enregistrement');
             AuthenticationService.register(form.pseudo.value, form.password.value, form.email.value, form.avatar.value).then(isAuthenticated => {
                if (!isAuthenticated) {
                    setMessage('🔐 Bad Input.');
                    return;
                }
                history.push('/');
                history.go(0);

            }); 
        }
    }

    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            <div className="row">
                <div className="col s12 m8 offset-m2">
                    <div className="card hoverable">
                        <div className="card-stacked">
                            <div className="card-content">
                                {/* Form message */}
                                {message && <div className="form-group">
                                    <div className="card-panel grey lighten-5">
                                        {message}
                                    </div>
                                </div>}
                                {/* Field email */}
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input id="email" type="text" name="email" className="form-control" value={form.email.value} onChange={e => handleInputChange(e)}></input>
                                    {/* error */}
                                    {form.email.error &&
                                        <div className="card-panel red accent-1">
                                            {form.email.error}
                                        </div>}
                                </div>
                                {/* Field username */}
                                <div className="form-group">
                                    <label htmlFor="pseudo">Pseudo</label>
                                    <input id="pseudo" type="text" name="pseudo" className="form-control" value={form.pseudo.value} onChange={e => handleInputChange(e)}></input>
                                    {/* error */}
                                    {form.pseudo.error &&
                                        <div className="card-panel red accent-1">
                                            {form.pseudo.error}
                                        </div>}
                                </div>
                                {/* Field password */}
                                <div className="form-group">
                                    <label htmlFor="password">Mot de passe</label>
                                    <input id="password" type="password" name="password" className="form-control" value={form.password.value} onChange={e => handleInputChange(e)}></input>
                                    {/* error */}
                                    {form.password.error &&
                                        <div className="card-panel red accent-1">
                                            {form.password.error}
                                        </div>}
                                </div>
                                {/* Field avatar */}
                                <div className="form-group">
                                    <div className="file-field input-field">
                                    <div className="btn">
                                        <span>Avatar</span>
                                        <input type="file" value={form.avatar.path} onChange={e => handleUploadChange(e)} />
                                        </div>
                                    
                                    <div className="file-path-wrapper">
                                    <input id="avatar"   type="text" name="avatar"  className="form-control file-path validate" ></input>
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
        </form>
    );
};

export default Register;