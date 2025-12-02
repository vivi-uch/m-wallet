import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
// import { ToastComponent } from "../components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createUser, detectNetwork } from "../utils/api";

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
  const [network, setNetwork] = useState("");
  const [isError, setIsError] = useState(false);
  const [showPassword, setShowPassword] = useState({
    confirmPassword: false,
    password: false,
    pin: false,
  });

  const handleToggleShowPassword = (fieldName) => {
    setShowPassword((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  const handleChange = (e) => {
    // const err = {};
    const { name, value } = e.target;
    setFormData((prevUserdata) => ({ ...prevUserdata, [name]: value }));
    setErrors((prevUserdata) => ({ ...prevUserdata, [name]: "" }));

    if (name === "phone") {
      if (value.length === 11) {
        const net = detectNetwork(value);
        if (net) {
          setNetwork(net);
          setFormData((prevUserdata) => ({ ...prevUserdata, network: net }));
        } else {
          setNetwork("Invalid number");
          setIsError(true);
        }
      } else {
        setNetwork("");
        setIsError(false);
      }
    }
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
    if (isError) {
      toast.error("Please check all provided information");
      return;
    }
    setIsLoading(true);
    try {
      const { confirmPassword: _, ...user } = formData;
      await createUser(user);
      toast.success("Account created. Please login.", user);
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
              <div key={field.name} className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                <input
                  name={field.name}
                  type={
                    field.type === "password"
                      ? showPassword[field.name]
                        ? "text"
                        : "password"
                      : field.type || "text"
                  }
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                  maxLength={
                    field.name === "phone" ? 11 : field.name === "pin" ? 4 : 50
                  }
                />
                {field.type === "password" && (
                  <button
                    type="button"
                    onClick={() => handleToggleShowPassword(field.name)}
                    className="ml-2 text-sm text-purple-600 absolute right-4 top-8"
                  >
                    {showPassword[field.name] ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                    )}
                  </button>
                )}
                {field.name === "phone" && (
                  <p
                    className={
                      network === "MTN"
                        ? "text-yellow-500 text-sm mt-1"
                        : network === "AIRTEL"
                        ? "text-red-500 text-sm mt-1"
                        : network === "GLO"
                        ? "text-green-600 text-sm mt-1"
                        : "text-green-700 text-sm mt-1"
                    }
                  >
                    {network}
                  </p>
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
