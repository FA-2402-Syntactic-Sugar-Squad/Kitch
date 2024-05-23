import { useEffect, useState } from 'react';
import { Routes, Route } from "react-router-dom";

import NavBar from './components/NavBar.jsx';
import Home from './pages/Home.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import MyProfile from './pages/MyProfile.jsx';

import './App.css';
import Searchbar from './components/Searchbar.jsx';

function App() {
  const [token, setToken] = useState("");

  const [searchResults, setSearchResults] = useState([]);

  const handleRecipesFetched = (fetchedRecipes) => {
    setSearchResults(fetchedRecipes);
  };

  //Added a useEffect for Token, will set the token as we refresh and nav through pages.
  useEffect(()=> {
    const localToken = localStorage.getItem("token");
    if (localToken) {
      setToken(localToken);
    }
  }, []);

  return (
    <>
      {/*We need to remove the hard coded recipe id in the url in AddReview.jsx*/}
      <NavBar token={token} setToken={setToken}/>
      <Searchbar onRecipesFetched={handleRecipesFetched}/>
      <Routes>
        <Route path="/" element={<Home token={token} searchResults={searchResults}/>}/>
        <Route path="/register" element={<Register token={token} setToken={setToken}/>}/>
        <Route path="/login" element={<Login token={token} setToken={setToken}/>}/>    
        <Route path="/myProfile" element={<MyProfile token={token}/>} />
      </Routes>

      
    </>
  )
}

export default App
