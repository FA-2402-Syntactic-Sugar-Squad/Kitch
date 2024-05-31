import axios from "axios";
import { useEffect, useState } from "react";

const AdminDashboard = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [ratingsAndReviews, setRatingsAndReviews] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipe] = useState([]);

  useEffect(()=> {
    //fetching users
    axios.get('/api/admin/users', {
      headers: {
        "Authorization": `Bearer ${token}`
      },
    }).then(response => {
      setUsers(response.data);
    }).catch(error => console.error('Error fetching users:', error));

    //fetching all ratings and reviews
    axios.get('/api/admin/', {
      headers: {
        "Authorization": `Bearer ${token}`
      },
    }).then(response => {
      setRatingsAndReviews(response.data);
    }).catch(error => console.error('Error fetching ratings and reviews:', error));

    //fetching all ingredients
    axios.get('/api/admin/ingredients', {
      headers: {
        "Authorization": `Bearer ${token}`
      },
    }).then(response => {
      setIngredients(response.data);
    }).catch(error => console.error('Error fetching ingredients', error));
  }, []);

  return(
    <>
    </>
  );
}

export default AdminDashboard;