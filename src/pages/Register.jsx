import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../styling/Home_Register.css";

import Form from 'react-bootstrap/Form';

const Register = ({setToken}) => {
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [preferences, setPreferences] = useState({
    glutenFree: false,
    ketogenic: false,
    lactoVegetarian: false,
    ovoVegetarian: false,
    vegan: false,
    pescetarian: false,
    paleo: false,
    primal: false,
    lowFODMAP: false,
    whole30: false,
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await fetch("/auth/register", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: regUsername,
          password: regPassword,
          email: regEmail,
          isadmin: false,
          preferences: preferences,
        }),
      });
      const json = await result.json();
      console.log(json);

      if(json.token){
        localStorage.setItem("token", json.token);
        setToken(json.token);
        navigate("/");
      };

    } catch (error) {
      console.log(error);
    }
  };

  const handlePreferenceChange = (e) => {
    const { name, checked } = e.target;
    setPreferences((prevPreferences) => ({
      ...prevPreferences,
      [name]: checked,
    }));
  };

  return (
    <>
      <div className="Auth-form-container">
        <form className="Auth-form" onSubmit={handleSubmit}>
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Sign Up</h3>
            <div className="text-center">
              Already registered?{" "}
              <Link className="link-primary" to="/login">
                Sign In
              </Link>
            </div>
            <div className="form-group mt-3">
              <label>Username</label>
              <input
                type="text"
                className="form-control mt-1"
                placeholder="e.g Jane Doe"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
              />
            </div>
            <div className="form-group mt-3">
              <label>Email address</label>
              <input
                type="email"
                className="form-control mt-1"
                placeholder="Email Address"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
              />
            </div>
            <div className="form-group mt-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control mt-1"
                placeholder="Password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
              />
            </div>
            <br></br>
            <h2 className="Auth-form-title">Preferences (Optional)</h2>
            <Form.Group>
            {Object.keys(preferences).map((preference) => (
              <div key={preference} className="mb-3">
                <Form.Check
                  type="checkbox"
                  name={preference}
                  label={preference.charAt(0).toUpperCase() + preference.slice(1)}
                  checked={preferences[preference]}
                  onChange={handlePreferenceChange}
                />
              </div>
            ))}
          </Form.Group>
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
    </>
  );
};

export default Register;



