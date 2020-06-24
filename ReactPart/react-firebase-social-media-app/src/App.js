import React from 'react';
import './App.css';


//React Library
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import jwtDecode from 'jwt-decode'
import AuthRoute from "./util/AuthRoute"

//MaterialUi
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'


//components
import Navbar from "./components/Navbar"
import themes from './util/theme'
//pages
import Home from './pages/home'
import Login from './pages/login'
import Signup from './pages/signup'

const theme = createMuiTheme(themes)

const token = localStorage.FBIdToken ? localStorage.FBIdToken : false;
let authenticated;

if(!token.includes("undefined")){
  const decodedToken = jwtDecode(token);
  console.log(decodedToken);
  if(decodedToken.exp * 1000 < Date.now()){
    window.location.href="/login";
    authenticated = false;
  }else{
    authenticated = true;
  }
}

function App() {
  return (
    <MuiThemeProvider theme={theme}>
        <div className="App">
          <Router>
              <Navbar />
              <div className="container">
                  <Switch>
                    <Route exact path='/' component={Home} />
                    <Route exact path='/login' component={Login}  authenticated={authenticated}/>
                    <Route exact path='/signup' component={Signup}  authenticated={authenticated}/>
                  </Switch>
              </div>
          </Router>
        </div>
    </MuiThemeProvider>
  );
}


export default App;
