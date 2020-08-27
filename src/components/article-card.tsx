import React, { FunctionComponent, useState } from 'react';
import { useHistory} from 'react-router-dom';
import Article from '../models/article';
import './article-card.css';


type Props = {
    article: Article,
    borderColor?: string
}

const ArticleCard: FunctionComponent<Props> = ({ article, borderColor = '#009688' }) => {
    const [color, setColor] = useState<string>();
    const history = useHistory();

    const showBorder = () => {
        setColor(borderColor);
    }
    const hideBorder = () => {
        setColor('#f5f5f5');
    }

    const goToArticle = (id: number) => {
        setColor('#FF0000');
        setTimeout(() => {
            history.push(`/articles/${id}`);
        }, 500);

    }

    return (
        <div className="col s12 m12" onClick={() => goToArticle(article.id)} onMouseEnter={showBorder} onMouseLeave={hideBorder}>
            <div className="card horizontal" style={{ borderColor: color }}>
                <div className="card-image">
                    <img src={'http://localhost:3000/' + article.imagePath} style={{width: '250px', margin: '0 auto'}} alt={article.title} />
                </div>
                <div className="card-content">
                    <span className="card-title">{article.title}</span>
                    <span className="card-title"><small>{article.createdAt} {article.isPublic ? (<span className="new badge  green darken-2" data-badge-caption="article">public</span>) : (<span className="new badge red darken-2" data-badge-caption="article">private</span>)}</small></span>
                    <p><small>{article.User.pseudo}</small></p>
                    <p >{article.text}</p>
                    {article.Tags &&
                        article.Tags.map(tag => (
                            <span key={tag.name} className="chip">{tag.name}</span>
                        ))}

                </div>
            </div>
        </div>
    );
}
export default ArticleCard;