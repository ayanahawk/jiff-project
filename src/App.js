import React, { Component } from "react";
import styles from "./css/main.css";
import loader from "./images/loader.svg";
import Gifs from "./Gifs";
import clearButton from "./images/close-icon.svg";

const randomChoice = arr => {
  const randIndex = Math.floor(Math.random() * arr.length);
  return arr[randIndex];
};


const Header = ({ clearSearch, hasResults }) => (
  <div className="header grid">
  
    {hasResults ? 
        <img src={clearButton} onClick={clearSearch} />
      
    : 
      <h1 className="title"> Jiffy </h1>
    }
  </div>
);

const UserHint = ({ loading, hintText }) => (
  <div className="user-hint">
    {loading ? <img className="block mx-auto" src={loader} /> : hintText}
  </div>
);


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchItem: "",
      hintText: "",
      gifs: [],
      loading: false
    };
  }

  handleChange = event => {
    const { value } = event.target;
    this.setState((prevState, props) => ({
      ...prevState,
      searchItem: value,
      hintText: value.length > 2 ? `Hit enter to search ${value}` : ""
    }));
    if (value.length > 2) {
    }
  };

  handleKeyPress = event => {
    const { value } = event.target;

    if (value.length > 2 && event.key === "Enter") {
      this.searchGiphy(value);
    }
  };

  searchGiphy = async searchItem => {
    this.setState({
      loading: true
    });

    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=L4G38pXISILaygBAJQROp2qe7xDp14Zm&q=${searchItem}&limit=25&offset=0&rating=PG&lang=en`
      );
      const { data } = await response.json();

      if (!data.length) {
        throw `nothing found for ${searchItem}`;
      }

      const randomGif = randomChoice(data);

      console.log(data);
      const gif = data[0];

      this.setState((prevState, props) => ({
        ...prevState,

        gifs: [...prevState.gifs, randomGif],
        loading: false,
        hintText: `Hit enter to see more ${searchItem}`
      }));
    } catch (error) {
      this.setState((prevState, props) => ({
        hintText: error,
        loading: false
      }));
      console.log("error");
    }
  };

  clearSearch = () => {
    this.setState((prevState, props) => ({
      ...prevState,
      searchItem: "",
      hintText: "",
      gifs: []
    }));
this.textInput.focus();
  };

  
  render() {
    const { searchItem, gifs } = this.state;
    const hasResults = gifs.length;
    // const hasResults=gifs.length;
    return (
      <div className="page">
        <Header clearSearch={this.clearSearch} hasResults={hasResults} />

        <div className="search grid">
          {this.state.gifs.map(gif => (
            <Gifs {...gif} />
          ))}

          <input
            className="input grid-item"
            placeholder="Type Something"
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
            value={searchItem}
            ref={input=>{this.textInput=input;}}
          />
        </div>

        <UserHint {...this.state} />
      </div>
    );
  }
}

export default App;
