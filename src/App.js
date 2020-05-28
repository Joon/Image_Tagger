import React from 'react';
import './App.css';
import { selectLoading } from './features/management/managementSlice';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from './Home';
import SignUpContainer from './features/usermanagement/SignUpContainer';
import ConfirmRegistration from './features/usermanagement/ConfirmRegistration';
import LoginControl from './features/usermanagement/LoginControl';
import { Spin, Modal } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

function App() {
  const globalLoading = useSelector(selectLoading);
  
  return (
    <div className="App">
      <header className="App-header">
        <p className="App-caption">ImgTgr - Classify your ML training data here!</p>    
        <Router>
          <div>
            <div>
              <nav>
                <Link to="/login">Login</Link>&nbsp;&nbsp;&nbsp;<Link to="/signup">Sign Up</Link>&nbsp;&nbsp;&nbsp;<Link to="/">Home</Link>
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
      <Modal
          title="Loading"
          visible={globalLoading}
          footer={null}>
           <Spin indicator={<LoadingOutlined />}/>
      </Modal>
    </div>
  );
}

export default App;
