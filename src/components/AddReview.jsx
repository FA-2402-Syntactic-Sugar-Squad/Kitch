import React, { useState } from "react";

const AddReview = ({ recipeId, onReviewAdded }) => {
  const [reviewData, setReviewData] = useState({
    rating: 0,
    reviewMsg: "",
    recipeId: recipeId,
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
        `/api/users/recipes/631741/ratings-reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reviewData),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      console.log("Review added:", response.data);
      // onReviewAdded() will be called on recipe page for rendering purpose
      // onReviewAdded();

      setReviewData({
        rating: 0,
        reviewMsg: "",
        recipeId: "631741",
      });
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  return (
    <div>
      <h5>Add your review</h5>
      <form onSubmit={handleSubmit}>
        <label>
          Rating:
          <input
            type="number"
            name="rating"
            value={reviewData.rating}
            onChange={handleInputChange}
            min="1"
            max="5"
            required
          />
        </label>
        <label>
          Review:
          <textarea
            name="reviewMsg"
            value={reviewData.reviewMsg}
            onChange={handleInputChange}
            required
          ></textarea>
        </label>
        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
};

export default AddReview;
