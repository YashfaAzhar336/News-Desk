import React, { Component } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";
import '../App.css';

export default class News extends Component {
  static defaultProps = {
    country: 'us',
    pageSize: 8,
    category: 'science'
  }

  static propTypes = {
    country: PropTypes.string,
    category: PropTypes.string,
    pageSize: PropTypes.number
  }

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: false,
      totalResults: 0,
    };
    document.title = `${this.capitalizeFirstLetter(this.props.category)} - NewsApp`;
  }

  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  async fetchData() {
    this.props.setProgress(10);
    let urlforapi = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=239351c5ae7449999e92d1603174614a&page=1&pageSize=${this.props.pageSize}`;

    try {
      let response = await fetch(urlforapi);
      this.props.setProgress(30);
      let parsedata = await response.json();
      this.props.setProgress(70);

      this.setState({
        articles: parsedata.articles,
        totalResults: parsedata.totalResults,
        loading: false
      });
      this.props.setProgress(100);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async componentDidMount() {
    console.log("Category:", this.props.category);
    await this.fetchData();
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.category !== this.props.category) {
      console.log("Category changed:", this.props.category);
      await this.fetchData();
    }
  }

  fetchMoreData = async () => {
    let nextPage = Math.ceil(this.state.articles.length / this.props.pageSize) + 1;
    let urlforapi = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=239351c5ae7449999e92d1603174614a&page=${nextPage}&pageSize=${this.props.pageSize}`;
  
    try {
      let response = await fetch(urlforapi);
      let parsedata = await response.json();
      console.log(parsedata)
      this.setState(prevState => ({
        articles: [...prevState.articles, ...parsedata.articles],
        totalResults: parsedata.totalResults
      }));
  
    } catch (error) {
      console.error("Error fetching more data:", error);
    }
  };
  

  render() {
    return (
      <>
        <h1 className='text-center my-3'>Top Headlines From {this.capitalizeFirstLetter(this.props.category)}</h1>
        {this.state.loading && <Spinner />}
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={<Spinner />}
        >
          <div className='container'>
            <div className="row my-3">
              {this.state.articles.map((news) => {
                return (
                  <div className="col-md-4" key={news.url}>
                    <NewsItem
                      title={news.title}
                      description={news.description}
                      url={news.urlToImage}
                      newsURL={news.url}
                      author={news.author}
                      date={news.publishedAt}
                      // source={news.source.name}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </InfiniteScroll>
      </>
    );
  }
}
