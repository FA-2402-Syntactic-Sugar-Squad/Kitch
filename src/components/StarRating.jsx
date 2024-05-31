import React, { useState } from "react";

import "../App.css";

const StarRating = ({ rating, onRate }) => {
  const [ hoveredStar, setHoveredStar ] = useState(0);
  
  const handleRate = (rate) => {
    if (onRate) {
      onRate(rate);
    }
  };

  return (
    <div className="star-rating">
      {[...Array(5)].map((star, index) => {
        const starValue = index + 1;
        return (
          <button
            key={starValue}
            type="button"
            className={starValue <= (hoveredStar || rating) ? "on" : "off"}
            onClick={() => handleRate(starValue)}
            onMouseEnter={() => setHoveredStar(starValue)}
            onMouseLeave={() => setHoveredStar(0)}
          >
            <span className="star">&#9733;</span>
          </button>
        );
      })}
    </div>
  )
}

export default StarRating;