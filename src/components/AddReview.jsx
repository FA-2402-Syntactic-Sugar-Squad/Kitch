import React, { useState } from "react";

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

const AddReview = ({ recipeId, onReviewAdded }) => {
  const [reviewData, setReviewData] = useState({
    reviewMsg: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReviewData({
      ...reviewData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `/api/recipes/${recipeId}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reviewMsg: reviewData.reviewMsg
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      console.log("Review added successfully");

      if (onReviewAdded) {
        onReviewAdded();
      }

      setReviewData({
        reviewMsg: "",
      });
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  return (
    <div>
      <InputGroup className="mb-3" onSubmit={handleSubmit}>
        <Form.Control
          placeholder="Add your review"
          aria-label="Add your review"
          aria-describedby="basic-addon2"
          value={reviewData.reviewMsg}
          onChange={handleInputChange}
          required
        />
        <Button variant="outline-secondary" id="button-addon2" type="submit">
          Submit
        </Button>
      </InputGroup>
    </div>
  );
};

export default AddReview;
