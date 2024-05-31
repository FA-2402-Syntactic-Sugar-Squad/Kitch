import { useEffect, useState } from 'react';
import { Routes, Route } from "react-router-dom";

import NavBar from './components/NavBar.jsx';
import Home from './pages/Home.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import MyProfile from './pages/MyProfile.jsx';

import './App.css';

function App() {
  const [token, setToken] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  //Added a useEffect for Token, will set the token as we refresh and nav through pages.
  useEffect(() => {
    try {
      const localToken = localStorage.getItem("token");
      if (localToken) {
        setToken(localToken);

        const user = JSON.parse(atob(localToken.split('.')[1]));
        setIsAdmin(user.isadmin);
      }
    } catch (error) {
      console.log("Error caught when fetching api", error);
    }
  }, []);

  return (
    <>
      {/*We need to remove the hard coded recipe id in the url in AddReview.jsx*/}
      <NavBar token={token} setToken={setToken} setSearchResults={setSearchResults} />

      <Routes>
        <Route path="/" element={<Home token={token} searchResults={searchResults} isAdmin={isAdmin}/>} />
        <Route path="/register" element={<Register token={token} setToken={setToken} />} />
        <Route path="/login" element={<Login token={token} setToken={setToken} />} />
        <Route path="/myProfile" element={<MyProfile token={token} />} />
      </Routes>


    </>
  )
}

export default App
