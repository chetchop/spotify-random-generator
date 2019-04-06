import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Bar from './components/Bar';

import PGrid from './PGrid';
import MainBoard from './MainBoard'




class App extends Component {

  

  render() {
    return (
      <div>

      <MainBoard />
        {/* <iframe src="https://open.spotify.com/embed/track/5Lv5c9Cv6u4G4lEbI4ZSdB" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe> */}
      </div>
    );
  }
}


export default App;

