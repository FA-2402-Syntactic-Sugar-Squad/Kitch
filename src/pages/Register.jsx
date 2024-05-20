// const Register = () => {
//   return (
//     <>
//       <h3>Register</h3>
//       {/* When new users register, we should:
//       DISPLAY preferences (so create a route for preferences) and allow option to skip. */}
//     </>
//   )
// }

// export default Register;

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
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

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log('submitted');

    try {
      const result = await fetch("auth/register", {
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
      console.log(json)
      //not going to login page after submit
      navigate("/Login");
    } catch (error) {
      console.log(error);
    }
  };

  const handlePreferenceChange = (e) => {
    setPreferences({
      ...preferences,
      [e.target.name]: e.target.checked,
    });
  };

  return (
    <>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <br />
        <input type="text" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} />
        <br />

        <label htmlFor="username">Username</label>
        <br />
        <input type="text" value={regUsername} onChange={(e) => setRegUsername(e.target.value)} />
        <br />

        <label htmlFor="password">Password</label>
        <br />
        <input type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} />
        <br />

        <h3>Preferences</h3>
        {Object.keys(preferences).map((preference) => (
          <div key={preference}>
            <label htmlFor={preference}>{preference}</label>
            <input
              type="checkbox"
              name={preference}
              checked={preferences[preference]}
              onChange={handlePreferenceChange}
            />
          </div>
        ))}
        <br />
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default Register;



