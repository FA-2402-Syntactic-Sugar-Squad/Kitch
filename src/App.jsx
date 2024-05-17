import { useEffect, useState } from 'react';
import { Routes, Route } from "react-router-dom";
import NavBar from './components/NavBar.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import './App.css'

function App() {
  const [token, setToken] = useState("");

  //Added a useEffect for Token, will set the token as we refresh and nav through pages.
  useEffect(()=> {
    const localToken = localStorage.getItem("token")
    if (localToken) {
      setToken(localToken);
    }
  }, []);

  return (
    <>
      {/*We need to remove the hard coded recipe id in the url in AddReview.jsx*/}
      <NavBar token={token} setToken={setToken}/>
      <Routes>
        <Route path="/" element={<h2>HOME</h2>}/>        
        <Route path="/login" element={<Login token={token} setToken={setToken}/>}/>
        <Route path="/register" element={<Register/>}/>
      </Routes>
    </>
  )
}

export default App
