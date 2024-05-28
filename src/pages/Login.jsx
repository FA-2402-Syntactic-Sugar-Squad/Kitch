import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import "../styling/Home_Register.css";

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
          password
        })
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
      <div className="Auth-form-container">
        <form onSubmit={submitHandler} className="Auth-form">
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Sign In</h3>
            <div className="text-center"> Don't have an account?{" "}<Link to="/register" className="link-primary">Sign up</Link></div>
            <div className="form-group mt-3">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter email"
                className="form-control mt-1"
                value={email} onChange={(e) => { setEmail(e.target.value); }}
              />
            </div>
            <div className="form-group mt-3">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter password"
                className="form-control mt-1"
                value={password} onChange={(e) => { setPassword(e.target.value); }}
              />
            </div>
            <div className="d-grid gap-2 mt-3">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
            <p className="text-center mt-2">
              Forgot <a href="#">password?</a>
            </p>
          </div>
        </form>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </>
  );
};

export default Login;
