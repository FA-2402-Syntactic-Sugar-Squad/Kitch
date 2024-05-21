import { useEffect, useState } from 'react';
import { Routes, Route } from "react-router-dom";
import NavBar from './components/NavBar.jsx';
import Home from './pages/Home.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import RecipeDetails from './components/RecipeDetails.jsx';
import './App.css'
import Ingredients from './components/Ingredients.jsx';

function App() {
  const [token, setToken] = useState("");

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
      <Routes>
        <Route path="/" element={<Home token={token}/>}/>
        <Route path="/register" element={<Register token={token} setToken={setToken}/>}/>
        <Route path="/login" element={<Login token={token} setToken={setToken}/>}/>
        <Route path="/recipes/:id" element={<RecipeDetails token={token}/>} />
      </Routes>
      <Ingredients/>
    </>
  )
}

export default App
