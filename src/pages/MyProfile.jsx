import { useEffect, useState } from "react";

import React from 'react';
import { Container, Row, Col, Card, Button, Image } from 'react-bootstrap';
import SavedRecipes from "../components/SavedRecipes";
import '../styling/MyProfile.css';


const MyProfile = ({ token }) => {
  const [user, setUser] = useState(null);
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

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      console.log("Token for fetching profile:", token);
      try {
        const response = await fetch(`/api/users/profile`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        console.log("Response status for profile fetch:", response.status);
        const userProfileResult = await response.json();
        console.log("Fetched user profile:", userProfileResult);
        setUser(userProfileResult);
        if (userProfileResult.preferences && userProfileResult.preferences[0]) {
          const filteredPreferences = (({ id, userId, ...rest }) => rest)(userProfileResult.preferences[0]);
          setPreferences(filteredPreferences);
        }
      } catch (error) {
        console.log("Error caught when fetching users profile from api", error);
      }
    }
    fetchProfile();
  }, []);

  const handlePreferenceChange = async (pref) => {
    const updatedPreferences = { ...preferences, [pref]: !preferences[pref] };
    setPreferences(updatedPreferences);
    console.log("Updated preferences to be sent:", updatedPreferences);

    const token = localStorage.getItem("token");
    console.log("Token for updating preferences:", token);
    try {
      const response = await fetch(`/api/users/preferences`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updatedPreferences) //only send preferences
      });
      console.log("Response status for preferences update:", response.status);
      const rawResponse = await response.text();
      console.log("Raw response body:", rawResponse);
      
      const updatedPreferencesFromServer = JSON.parse(rawResponse);
      const filteredPreferences = (({ id, userId, ...rest }) => rest)(updatedPreferencesFromServer);
      setPreferences(filteredPreferences);
    } catch (error) {
      console.log("Error caught when fetching and updating preferences", error);
    }
  }

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <Container>
      <Row className="mt-4">
        <Col md={3}>
          <Image src="https://static.vecteezy.com/system/resources/previews/006/331/115/non_2x/chef-hat-restaurant-kitchen-line-style-icon-free-free-vector.jpg"
            id="profile-pic" fluid thumbnail />
          <Card className="mt-3">
            <Card.Body>
              <Card.Title> {user.username}'s Profile</Card.Title>
              <Card.Text>Email: {user.email}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>About Me</Card.Title>
              <Card.Text>{user.about}</Card.Text>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Dietary Selection</Card.Title>
              <div>
                {Object.keys(preferences).map(pref => (
                  <Button
                    key={pref}
                    variant={preferences[pref] ? "primary" : "outline-primary"}
                    onClick={() => handlePreferenceChange(pref)}
                    className="m-1"
                  >
                    {pref.replace(/([A-Z])/g, ' $1').trim()}
                  </Button>
                ))}
              </div>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <Card.Title>My Favorite Recipes</Card.Title>
              {user && <SavedRecipes userId={user.id} />}
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          {user.isAdmin && (
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Admin Tools</Card.Title>
                <Button variant="primary">All Users</Button>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default MyProfile;
