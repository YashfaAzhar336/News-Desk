// import './App.css';
import LoadingBar from 'react-top-loading-bar';
import React, { Component } from 'react';
import Navbar from './Components/Navbar';
import News from './Components/News';
import EditProfile from './Components/EditProfile';
import ForgetPassword from './Components/ForgetPassword';
import ResetPassword from './Components/ResetPassword';
import Login from './Components/Login';
import Signup from './Components/Signup';
import 'bootstrap/dist/css/bootstrap.min.css';


import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import DeleteAccount from './Components/DeleteAccount';
import VerifyDeleteToken from './Components/VerifyDeleteToken';

export default class App extends Component {
  state = {
    progress: 0
  }

  setProgress = (progress) => {
    this.setState({
      progress: progress
    });
  }

  render() {
    return (
      <Router>
        <div>
        {window.location.pathname !== '/' && window.location.pathname !== '/delete-accounts' && window.location.pathname !== '/delete-accounts'  && window.location.pathname !== '/signup' && window.location.pathname !== '/forget-password' && !window.location.pathname.includes('/reset-password/') && <Navbar />}
        
          <LoadingBar
            height={3}
            color='#f11946'
            progress={this.state.progress}
          />

          <Routes>
            {/* Route for SlideNavbar */}
            <Route
              exact
              path="/"
              element={<Login/>}
            />

            <Route
              path="/signup"
              element={<Signup/>}
            />


            {/* Routes for News */}
            <Route path="/general" element={<News setProgress={this.setProgress} pageSize={5} country="us" category="general" />} />
            <Route path="/business" element={<News setProgress={this.setProgress} pageSize={5} country="us" category="business" />} />
            <Route path="/entertainment" element={<News setProgress={this.setProgress} pageSize={5} country="us" category="entertainment" />} />
            <Route path="/health" element={<News setProgress={this.setProgress} pageSize={5} country="us" category="health" />} />
            <Route path="/science" element={<News setProgress={this.setProgress} pageSize={5} country="us" category="science" />} />
            <Route path="/sports" element={<News setProgress={this.setProgress} pageSize={5} country="us" category="sports" />} />
            <Route path="/technology" element={<News setProgress={this.setProgress} pageSize={5} country="us" category="technology" />} />

            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/delete-accounts" element={<DeleteAccount />} />
            <Route path="/delete-account/:token" element={<VerifyDeleteToken />} />

            {/* Forget password route */}
            <Route path="/forget-password" element={<ForgetPassword />} />
            
            {/* Reset password route */}
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Routes>
        </div>
      </Router>
    );
  }
}
