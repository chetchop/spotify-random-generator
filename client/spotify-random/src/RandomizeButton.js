import React from 'react';
import Button from '@material-ui/core/Button';


export default class RandomizeButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {playlistSongs : [],
        };
    }


  getSongs() {
    fetch("http://localhost:8888/getSongs/" + this.props.playlistID)
      .then(res => res.text())
      .then(res => this.setState({playlistSongs : JSON.parse(res)}))
      .catch(err => err);
  }


  componentDidUpdate() {
    this.getSongs();
  }


  onClickHandler() {
    fetch("http://localhost:8888/createplaylist/" + this.props.playlistName + "RANDO" + "/TESTDESCRIPTION/" + this.generateRandomSongListURI())
    .then(res => res.text())
    .then(res => this.getPlaylist(JSON.parse(res).id)) //Do you need to do anythoing with the response?
    .catch(err => err);
  }

  getPlaylist(playlistID) {
    fetch("http://localhost:8888/getplaylist/" + playlistID)
    .then(res => res.text())
    .then(res => this.props.loadPlaylist(JSON.parse(res)[0])) //Do you need to do anythoing with the response?
    .catch(err => err);
  }



  generateRandomSongListURI() {
    let songsURI = [];
    let songs = this.state.playlistSongs;
    let indexToSwap = songs.length;

    while (indexToSwap > 0) {
      let randomIndex = Math.floor(Math.random() * songs.length);
      indexToSwap--;
      let temp = songs[indexToSwap];
      songs[indexToSwap] = songs[randomIndex];
      songs[randomIndex] = temp;
    };

    songs.forEach(function(song) {
      songsURI.push(song.uri);
      songsURI.push("%2C")
    })
    return songsURI.join("");
  }


  render() {
    return (
        <Button onClick={this.onClickHandler.bind(this)}>{"Randomize " + this.props.playlistName}</Button>
    )
  }
}
  
  
