import React from 'react';
import './App.css';

import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

//components
import Navbar from "./components/Navbar"

//pages
import Home from './pages/home'
import Login from './pages/login'
import Signup from './pages/signup'



function App() {
  return (
    <div className="App">
      <Router>
          <Navbar />
          <div className="container">
              <Switch>
                <Route exact path='/' component={Home} />
                <Route exact path='/login' component={Login} />
                <Route exact path='/signup' component={Signup} />
              </Switch>
          </div>
      </Router>
    </div>
  );
}


export default App;
