import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import BlogList from "./pages/blog-list";
import PageNotFound from './pages/page-not-found';
import ArticleDetail from "./pages/article-detail";
import Login from "./pages/login";
import { get, remove } from "local-storage";
import AuthenticationService from './services/authentication-services';
import PrivateRoute from './PrivateRoute';
import Register from './pages/register';
import ArticleAdd from './pages/article-add';
import ArticleEdit from './pages/article-edit';


type User = {
  token: string;
  pseudo: string;
  email: string;
  avatarPath: string;
}


const App: React.FC = () => {



  const [User, setUser] = useState<User>();
  const logout = () => {
    remove('user');
    AuthenticationService.isAuthenticated = false;
    setUser(undefined);
  }
  useEffect(() => {
    const user: User = get('user') || '';
    if (user) 
      AuthenticationService.isAuthenticated = true;
    console.log(AuthenticationService.isAuthenticated);
    setUser(user);
  }, []);



  return (
    <Router>
      <div>
        {}
        <nav>
          <div className="nav-wrapper  indigo accent-1">
            <Link to="/" className="brand-logo center">Blog</Link>
            <ul className="right">

              {User ? (
                <div className="right">
                  <li>
                    <div className="chip">
                    <img className="imgAvatar" alt="avatar" src={'http://localhost:3000/' + User.avatarPath} />
                    {User.pseudo}
                    </div>
                </li>
                </div>
                  ) : (
                  <li>
                    <Link to="/login">Login</Link>
                  </li>
                  )}
  
              <li>
                    {User &&
                      <Link onClick={() => logout()} to="/" className="Right btn waves-effect waves-light #ff8a80 red accent-1">LogOut</Link>
                    }
                  </li>
            </ul>
          </div>
        </nav>
            {}
            <Switch>
              <Route exact path="/" component={BlogList} />
              <Route exact path="/blog" component={BlogList} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <PrivateRoute exact path="/articles/add" component={ArticleAdd} />
              <PrivateRoute exact path="/articles/:id" component={ArticleDetail} />
              <PrivateRoute exact path="/articles/edit/:id" component={ArticleEdit} />
              <Route exact path="/pageNotF" component={PageNotFound} />
              <Route component={PageNotFound} />
            </Switch>
          </div>
    </Router>
        )
      }
      
      export default App;
