import React from "react";

const Card = ({ children, className = "", onClick, ...props }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-4 ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
