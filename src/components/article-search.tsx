import React, { FunctionComponent, useState } from 'react';
import { Link } from 'react-router-dom';
import Article from '../models/article';
import ArticleService from '../services/article-services';
 
const ArticleSearch: FunctionComponent = () => {
  
  const [term, setTerm] = useState<string>('');
  const [article, setArticle] = useState<Article[]>([]);
 
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const term = e.target.value;
    setTerm(term);
 
    if(term.length <= 1) {
      setArticle([]);
      return;
    }
 
    ArticleService.searchArticle(term).then(articles => setArticle(articles));
  }
  
  return (
    <div className="row"> 
    <div className="col s12 m6 offset-m3"> 
      <div className="card"> 
      <div className="card-content"> 
        <div className="input-field"> 
        <input type="text" placeholder="Rechercher un Article" value={term} onChange={e => handleInputChange(e)} /> 
        </div> 
        <div className='collection'>
        {article.map((article) => (
          <Link key={article.id} to={`/articles/${article.id}`} className="collection-item">
            {article.title}
          </Link>
        ))}
        </div> 
      </div> 
      </div> 
    </div> 
    </div>
  );
}
  
export default ArticleSearch;