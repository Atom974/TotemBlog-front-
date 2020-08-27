import React, { FunctionComponent, useState, useEffect } from 'react';
import Article from '../models/article'

import { Link  } from 'react-router-dom';
import ArticleCard from '../components/article-card';
import ArticleService from '../services/article-services';
import ArticleSearch from '../components/article-search';

const BlogList: FunctionComponent = () => {
    const [articles, setArticle] = useState<Article[]>([]);

    useEffect(() => {
        ArticleService.getArticles().then(articles => setArticle(articles));
    }, []);

    return (
        <div>
            <div className="container">
                <div className="row">
                <ArticleSearch />
                <h1> Article<Link to="/articles/add" className="btn-floating btn-large waves-effect waves-light red"><i className="material-icons">add</i></Link> </h1>
                
                {articles ? (
                    articles.map(article => (
                    <ArticleCard key={article.id} article={article}/>
                ))): (
                    <h4>No Article</h4>
                )}
                </div>
            </div>
        </div>
    );
}
export default BlogList;