import './App.css';
import React, { } from 'react'
import Lobby from './pages/Lobby/Lobby'
import NoMatch from './pages/NoMatch/NoMatch'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Connect from './pages/Connect/Connect';


function App() {


  return (
    <div className="App">
      <h1>Guess the song!</h1>
      <Router>
        <div>
          <Switch>
            <Route exact path="/">
              <Connect />
            </Route>
            <Route path="/play">
              <Lobby />
            </Route>
            <Route path="*">
              <NoMatch />
            </Route>
          </Switch>
        </div>
      </Router>
    </div >
  );
}

export default App;
