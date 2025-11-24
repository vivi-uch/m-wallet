import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
// import { ToastComponent } from "../components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createUser } from "../utils/api";

const Inputfields = [
  { name: "fullName", label: "Full name", placeholder: "John Doe" },
  { name: "email", label: "Email", placeholder: "john@example.com" },
  { name: "phone", label: "Phone", placeholder: "08012345678" },
  {
    name: "password",
    label: "Password",
    placeholder: "Password",
    type: "password",
  },
  {
    name: "confirmPassword",
    label: "Confirm",
    placeholder: "Confirm password",
    type: "password",
  },
  {
    name: "pin",
    label: "Security PIN",
    placeholder: "4-digit PIN",
    type: "password",
  },
];

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    pin: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleToggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevUserdata) => ({ ...prevUserdata, [name]: value }));
    setErrors((prevUserdata) => ({ ...prevUserdata, [name]: "" }));
  };

  const validate = () => {
    const err = {};
    if (!formData.fullName.trim()) err.fullName = "Name is required";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      err.email = "Valid email required";
    if (!formData.phone.trim() || !formData.phone.length === 11)
      err.phone = "Phone is required and should be 11 digits";
    if (!formData.password || formData.password.length < 6)
      err.password = "Password min 6 chars";
    if (formData.password !== formData.confirmPassword)
      err.confirmPassword = "Passwords do not match";
    if (!formData.pin || formData.pin.length !== 4)
      err.pin = "PIN must be 4 digits";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const { confirmPassword: _, ...user } = formData;
      await createUser(user);
      toast.success("Account created. Please login.");
      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      toast.error("Error creating account");
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
          <h1 className="text-2xl font-bold mt-4">Create Account</h1>
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
                  // type={field.type || "text"}
                  type={
                    field.type === "password"
                      ? showPassword
                        ? "text"
                        : "password"
                      : field.type || "text"
                  }
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
                {field.type === "password" && (
                  <button
                    type="button"
                    onClick={handleToggleShowPassword}
                    className="ml-2 text-sm text-purple-600"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                )}
                {errors[field.name] && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors[field.name]}
                  </p>
                )}
              </div>
            ))}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating..." : "Sign Up"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-600">
              Login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
