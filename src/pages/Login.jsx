import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import { getUserByEmail } from "../utils/api";
// import ToastComponent from "../components/ToastComponent";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Inputfields = [
  {
    name: "email",
    type: "email",
    placeholder: "john@example.com",
    label: "Email",
  },
  {
    name: "password",
    type: "password",
    placeholder: "Password",
    label: "Password",
  },
];

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevUserdata) => ({ ...prevUserdata, [name]: value }));
    setErrors((prevUserdata) => ({ ...prevUserdata, [name]: "" }));
  };

  const validate = () => {
    const err = {};
    if (!formData.email.trim()) err.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      err.email = "Email is invalid";
    if (!formData.password) err.password = "Password is required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);

    try {
      const user = await getUserByEmail(formData.email);
      if (user && user.password === formData.password) {
        sessionStorage.setItem("userId", user.id.toString());
        setUser(user);
        navigate("/dashboard");
      } else {
        toast.error("Invalid email or password");
      }
    } catch (err) {
      toast.error("Error logging in");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <ToastContainer position="top-center" autoClose={4000} />
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="bg-purple-600 text-white rounded-md w-12 h-12 mx-auto flex items-center justify-center font-bold">
            MW
          </div>
          <h1 className="text-2xl font-bold mt-4">Welcome Back</h1>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            {Inputfields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                <input
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                />
                {errors[field.name] && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors[field.name]}
                  </p>
                )}
              </div>
            ))}

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link to="#" className="text-purple-600">
                Forgot?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging..." : "Login"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-purple-600">
              Sign Up
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
