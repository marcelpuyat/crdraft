import React, { Component } from 'react';
import logo from './logo.svg';
import Draft from './Draft.js';
import Fluxxor from 'fluxxor';
import flux from './Flux.js';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Draft flux={flux}/>
      </div>
    );
  }
}

export default App;
