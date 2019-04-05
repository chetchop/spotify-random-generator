import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Bar from './components/Bar';
import Sidebar from './Sidebar';
import PGrid from './PGrid';
import Main from './main.js'




class App extends Component {

  render() {
    return (
      <div>

        <Bar />
        <PGrid />

        {/* <Test /> */}
        {/* <iframe src="https://open.spotify.com/embed/track/5Lv5c9Cv6u4G4lEbI4ZSdB" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe> */}
      </div>
    );
  }
}


export default App;

