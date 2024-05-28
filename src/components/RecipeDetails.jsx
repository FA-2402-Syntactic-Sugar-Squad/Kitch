import AddReview from "./AddReview.jsx";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

const RecipeDetails = ({ token, recipe }) => {
  if (!recipe) {
    return <p>Select a recipe to see details.</p>;
  }

  return (
    <>
      {token ? (
        <>
          <Card style={{ width: "18rem" }}>
            <Card.Img variant="top" src={recipe.imageurl} />
            <Card.Body>
              <Card.Title>{recipe.title}</Card.Title>
              <Card.Text>
                Instructions: {recipe.instructions}, Servings: {recipe.servings}
                , Diet: {recipe.diet}, Rating and Reviews:
                {recipe.ratingsAndReviews &&
                recipe.ratingsAndReviews.length > 0 ? (
                  recipe.ratingsAndReviews.map((review) => (
                    <div key={review.id}>
                      <strong>Rating:</strong> {review.rating} <br />
                      <strong>Review:</strong> {review.reviewMsg}
                    </div>
                  ))
                ) : (
                  <p>No reviews yet.</p>
                )}
                <AddReview recipeId={recipe.id}/>
              </Card.Text>
              <Button variant="primary">Save Recipe</Button>
            </Card.Body>
          </Card>
        </>
      ) : (
        <p>Must be logged in to see details.</p>
      )}
      {/*Tier two: Add an alert that brings up the login form*/}
    </>
  );
};

export default RecipeDetails;
