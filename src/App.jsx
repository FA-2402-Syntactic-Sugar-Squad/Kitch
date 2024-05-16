import { useEffect, useState } from 'react';
import { Routes, Route } from "react-router-dom";
import NavBar from './components/NavBar.jsx';
import AddReview from './components/AddReview.jsx';
import Login from './pages/Login.jsx';
import './App.css'

function App() {
  const [token, setToken] = useState("");

  useEffect(()=> {
    const localToken = localStorage.getItem("token")
    if (localToken) {
      setToken(localToken);
    }
  }, []);

  return (
    <>
      <NavBar token={token} setToken={setToken}/>
      <Routes>
        <Route path="/" element={<h2>HOME</h2>}/>
        <Route path="/login" element={<Login token={token} setToken={setToken}/>}/>
      </Routes>
      <AddReview/>
    </>
  )
}

export default App
