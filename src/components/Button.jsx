import React from "react";

const Button = ({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-md bg-purple-600 border border-white text-white font-medium disabled:hidden ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
