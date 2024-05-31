import { useEffect, useState } from "react";
import React from 'react';
import { Container, Row, Col, Card, Button, Image } from 'react-bootstrap';
import '../styling/MyProfile.css';

// const MyProfile = ({ token })
const MyProfile = ({ token }) => {
  const [user, setUser] = useState("");
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
        setUser(userProfileResult);
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
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <Container>
      <Row className="mt-4">
        <Col md={3}>
          <Image src="https://static.vecteezy.com/system/resources/previews/006/331/115/non_2x/chef-hat-restaurant-kitchen-line-style-icon-free-free-vector.jpg" 
          roundedCircle fluid thumbnail />
          <Card className="mt-3">
            <Card.Body>
              <Card.Title> {user.username}'s Profile</Card.Title>
              {/* <Card.Text>Name: {user.name}</Card.Text> */}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>About Me</Card.Title>
              {/* <Card.Text>{user.about}</Card.Text> */}
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>User's Reviews</Card.Title>
              {/* Map through user's top reviews */}
              {/* {user.REVIEW.map((review, index) => (
                <Card.Text key={index}>{review}</Card.Text>
              ))} */}
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <Card.Title>Comments from User</Card.Title>
              {/* Map through comments from user */}
              {/* {user.COMMENTS.map((comment, index) => (
                <Card.Text key={index}>{comment}</Card.Text>
              ))} */}
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          {/* {isAdmin && (
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Admin Tools</Card.Title>
                <Button variant="primary">All Users</Button>
              </Card.Body>
            </Card>
          )} */}
        </Col>
      </Row>
    </Container>
  );
};

export default MyProfile;