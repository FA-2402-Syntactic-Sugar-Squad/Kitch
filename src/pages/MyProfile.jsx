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
        setPreferences(userProfileResult.preferences[0]);
      } catch (error) {
        console.log("Error caught when fetching users profile from api", error);
      }
    }
    fetchProfile();
  }, []);


  return (
    <>
      {token ? (
        <>
          <h2>My Profile</h2>
          <div>
            <h3>Welcome {userProfile.username}</h3>
            <p>Email: {userProfile.email}</p>
          </div>
          <div>
            <h3>My Saved Recipes</h3>
            <h5>{savedRecipes}</h5>
          </div>
          <div>
            <h3>Dietary Selection</h3>
            <p>Gluten Free {preferences.glutenFree}</p>
            <p>Ketogenic {preferences.ketogenic}</p>
            <p>Lacto-Vegetarian {preferences.lactoVegetarian}</p>
            <p>Low FODMAP {preferences.lowFODMAP}</p>
            <p>Ovo-Vegetarian {preferences.ovoVegetarian}</p>
            <p>Paleo {preferences.paleo}</p>
            <p>Pescatarian {preferences.pescetarian}</p>
            <p>Primal {preferences.primal}</p>
            <p>Vegan {preferences.vegan}</p>
            <p>Whole 30 {preferences.whole30}</p>     
          </div>
        </>
      ) :
        <p>Loading...</p>}
    </>
  )
}

export default MyProfile;