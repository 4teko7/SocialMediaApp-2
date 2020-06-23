import React from 'react';
import './App.css';


//React Library
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

//MaterialUi
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'


//components
import Navbar from "./components/Navbar"

//pages
import Home from './pages/home'
import Login from './pages/login'
import Signup from './pages/signup'

const theme = createMuiTheme({
  palette:{
    primary:{
      light:"#33c9dc",
      main: "#00bcd4",
      dark: "#008394",
      contrastText: "#fff"
    },
    secondary:{
      light: "#ff6333",
      main: "#ff3d00",
      dark: "#b22a00",
      contrastText: "#fff"
    }
  }
})

function App() {
  return (
    <MuiThemeProvider theme={theme}>
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
    </MuiThemeProvider>
  );
}


export default App;
