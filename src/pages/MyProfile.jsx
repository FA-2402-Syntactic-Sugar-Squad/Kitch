import { useEffect, useState } from "react";

const MyProfile = ({ token }) => {
  const [userProfile, setUserProfile] = useState("");
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [preferences, setPreferences] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`api/users/profile`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const userProfileResult = await response.json();
        setUserProfile(userProfileResult);
        setSavedRecipes(userProfileResult.users_recipes);
        const filteredPreferences = (({ id, userId, ...rest }) => rest)(userProfileResult.preferences[0]);
        setPreferences(filteredPreferences);
      } catch (error) {
        console.log("Error caught when fetching users profile from api", error);
      }
    }
    fetchProfile();
  }, []);

  const handlePreferenceChange = (event) => {
    const { name, checked } = event.target;
    setPreferences(prev => ({ ...prev, [name]: checked }));
  }

  const savePreferences = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`/api/users/preferences`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(preferences) //only send preferences
      });
      const updatedPreferences = await response.json();
      const filteredPreferences = (({ id, userId, ...rest }) => rest)(updatedPreferences);
      setPreferences(filteredPreferences);
    } catch (error) {
      console.log("Error caught when fetching and updating preferences", error);
    }
  }

  return (
    <>
      {token ? (
        <>
          <h2>My Profile</h2>
          <div>
            <h4>Welcome {userProfile.username}</h4>
            <p>Email: {userProfile.email}</p>
          </div>
          <div>
            <h3>My Saved Recipes</h3>
          
          </div>
          <div>
            <h3>Dietary Selection</h3>
            <form>
              {Object.keys(preferences).map(pref => (
                <div key={pref}>
                  <label>
                    <input
                      type="checkbox"
                      name={pref}
                      checked={preferences[pref]}
                      onChange={handlePreferenceChange}
                    />
                    {pref.replace(/([A-Z])/g, '$1').trim()}
                  </label>
                </div>
              ))}
              <button type="button" onClick={savePreferences}>Save Preferences</button>
            </form>
          </div>
        </>
      ) :
        <p>Loading...</p>
      }
    </>
  )
}

export default MyProfile;