import React from 'react';
import './App.css';
import { selectError } from './features/management/managementSlice';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from './Home';
import SignUpContainer from './features/usermanagement/SignUpContainer';
import ConfirmRegistration from './features/usermanagement/ConfirmRegistration';
import LoginControl from './features/usermanagement/LoginControl';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

function App() {
  const globalError = useSelector(selectError);

  return (
    <div className="App">
      <header className="App-header">
        <p className="App-caption">ImgTgr - Classify your ML training data here!</p>    
        <Router>
          <div>
            <div>
              <nav>
                <Link to="/login">Login</Link><br/><Link to="/signup">Sign Up</Link><br/><Link to="/">Home</Link><br/>                
              </nav>
            </div>
            <Switch>          
              <Route path="/signup">
                <SignUpContainer />
              </Route>
              <Route path="/verify-code/:search" component={ConfirmRegistration}>
              </Route>
              <Route path="/login" component={LoginControl}>
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </div>
        </Router>        
      </header>
        <footer>
          <span>{globalError}</span>
        </footer>
    </div>
  );
}

export default App;
