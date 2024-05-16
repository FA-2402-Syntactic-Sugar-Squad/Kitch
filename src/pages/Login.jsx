import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const result = await fetch(`/auth/login`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email, 
          password })
      });
      const json = await result.json();

      if (result.status === 401) {
        setError("Invalid email or password."); 
      } else if (result.status === 500) {
        setError("Email does not exist"); 
      } else {
        if (json.token) {
          localStorage.setItem("token", json.token);
          setToken(json.token);
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Error occurred:", error);
      setError("An error occurred. Please try again later."); 
    }
  };

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={submitHandler}>
        <label>
          Email:
          <input
            type="text"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </label>
        <input type="submit" value="Log In" />
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>} 
      <label>
        Don't have an account?
        <button className="registerButton">
        <Link to="/register">Sign up</Link>
        </button>
      </label>
    </>
  );
};

export default Login;
