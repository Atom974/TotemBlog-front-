import React, { FunctionComponent, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import AuthenticationService from '../services/authentication-services';

type Field = {
  value?: any,
  error?: string,
  isValid?: boolean
};

type Form = {
  pseudo: Field,
  password: Field
}

const Login: FunctionComponent = () => {

  const history = useHistory();

  const [form, setForm] = useState<Form>({
    pseudo: { value: '' },
    password: { value: '' },
  });

  const [message, setMessage] = useState<string>('Veuillez vous identifier !');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    const newField: Field = { [fieldName]: { value: fieldValue } };

    setForm({ ...form, ...newField});
  }

  const validateForm = () => {
    let newForm: Form = form;

    // Validator username
    if(form.pseudo.value.length < 3) {
      const errorMsg: string = 'Votre prénom doit faire au moins 3 caractères de long.';
      const newField: Field = { value: form.pseudo.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{pseudo: newField } };
    } else {
      const newField: Field = { value: form.pseudo.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ pseudo: newField } };
    }

    // Validator password
    if(form.password.value.length < 3) {
      const errorMsg: string = 'Votre mot de passe doit faire au moins 6 caractères de long.';
      const newField: Field = {value: form.password.value, error: errorMsg, isValid: false};
      newForm = { ...newForm, ...{ password: newField } };
    } else {
      const newField: Field = { value: form.password.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ password: newField } };
    }

    setForm(newForm);

    return newForm.pseudo.isValid && newForm.password.isValid;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isFormValid = validateForm();
    if(isFormValid) {
      setMessage('👉 Tentative de connexion en cours ...');
      AuthenticationService.login(form.pseudo.value, form.password.value).then(isAuthenticated => {
        if(!isAuthenticated) {
          setMessage('🔐 Identifiant ou mot de passe incorrect.');
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
                {/* Field username */}
                <div className="form-group">
                  <label htmlFor="pseudo">Identifiant</label>
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
              </div>
              <div className="card-action center">
                {/* Submit button */}
                <button type="submit" className="btn">Valider</button>
                <Link to="/register" className="btn  indigo accent-1">Register</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
 
export default Login;