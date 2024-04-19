import React, { Component } from 'react'
import '../App.css';

export default class NewsItem extends Component {

    render() {
        let { title, description, url, newsURL, author, date, source } = this.props;
        return (
            <div className='my-3'>
                <div className="card">
                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {source}
                    </span>
                    <img src={!url ? "https://c.ndtvimg.com/2023-07/a8k2gqs_kulgam-soldier_625x300_30_July_23.jpg" : url} className="card-img-top" alt="..." />
                    <div className="card-body">
                        <h5 className="card-title">{title}</h5>
                        <p className="card-text">{description}</p>
                        <p class="card-text"><small class="text-muted">By {!author ? "Unknown" : author} on {new Date(date).toGMTString()}</small></p>
                        <a href={newsURL} className="btn btn-dark">Read More</a>
                    </div>
                </div>
            </div>
        )
    }
}
