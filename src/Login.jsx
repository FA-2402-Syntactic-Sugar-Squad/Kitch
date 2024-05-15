import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const result = await fetch(`http://localhost:3000/auth/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (result.status === 401) {
        setError("Invalid email or password."); 
      } else if (result.status === 500) {
        setError("Email does not exist"); 
      } else {
        const json = await result.json();
        console.log(json);
        if (json.token) {
          localStorage.setItem("token", json.token);
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
              setUsername(e.target.value);
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
    </>
  );
};

export default Login;
