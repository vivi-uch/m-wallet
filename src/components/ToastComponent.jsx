import { Children } from "react";

const ToastContainer = () => {
  return (
    <div className="fixed top-4 right-8 bg-red-500 text-white px-4 py-2 rounded">
      {Children}
    </div>
  );
};

export default ToastContainer;
