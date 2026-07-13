import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createUser, detectNetwork } from "../utils/api";
import {
  Eye,
  EyeOff,
  Wallet,
  Smartphone,
  ShieldCheck,
  Mail,
  User,
  Lock,
  Sparkles,
} from "lucide-react";

const Inputfields = [
  {
    name: "fullName",
    label: "Full Name",
    placeholder: "John Doe",
    icon: <User className="w-4 h-4 text-slate-400" />,
  },
  {
    name: "email",
    label: "Email Address",
    placeholder: "john@example.com",
    icon: <Mail className="w-4 h-4 text-slate-400" />,
  },
  {
    name: "phone",
    label: "Phone Number",
    placeholder: "08012345678",
    icon: <Smartphone className="w-4 h-4 text-slate-400" />,
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Min. 6 characters",
    type: "password",
    icon: <Lock className="w-4 h-4 text-slate-400" />,
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    placeholder: "Repeat your password",
    type: "password",
    icon: <Lock className="w-4 h-4 text-slate-400" />,
  },
  {
    name: "pin",
    label: "Security PIN",
    placeholder: "4-digit PIN",
    type: "password",
    icon: <ShieldCheck className="w-4 h-4 text-slate-400" />,
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
    if (!formData.phone.trim() || formData.phone.length !== 11)
      err.phone = "Phone must be exactly 11 digits";
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
      toast.success("Account created successfully!");
      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error creating account");
    } finally {
      setIsLoading(false);
    }
  };

  const getNetworkBadgeStyles = (net) => {
    switch (net?.toUpperCase()) {
      case "MTN":
        return "bg-amber-500/10 text-amber-600 border border-amber-500/20";
      case "AIRTEL":
        return "bg-rose-500/10 text-rose-600 border border-rose-500/20";
      case "GLO":
        return "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20";
      case "9MOBILE":
        return "bg-teal-500/10 text-teal-600 border border-teal-500/20";
      case "INVALID NUMBER":
        return "bg-red-500/10 text-red-600 border border-red-500/20";
      default:
        return "hidden";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      <ToastContainer position="top-center" autoClose={4000} />

      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-tr from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 mb-4 transform hover:scale-105 transition-transform duration-200">
            <Wallet className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Create Your Account
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Join M-Wallet for simple, secure, and reliable transfers.
          </p>
        </div>

        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-xl rounded-2xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Inputfields.map((field) => (
                <div
                  key={field.name}
                  className={`space-y-1.5 ${field.name === "fullName" || field.name === "email" ? "sm:col-span-2" : ""}`}
                >
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wide uppercase">
                    {field.label}
                  </label>

                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 pointer-events-none">
                      {field.icon}
                    </div>

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
                      className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-950/40 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 text-sm ${
                        errors[field.name]
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : "border-slate-200 dark:border-slate-800"
                      }`}
                      required
                      maxLength={
                        field.name === "phone"
                          ? 11
                          : field.name === "pin"
                            ? 4
                            : 50
                      }
                    />

                    {field.type === "password" && (
                      <button
                        type="button"
                        onClick={() => handleToggleShowPassword(field.name)}
                        className="absolute right-3 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                      >
                        {showPassword[field.name] ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>

                  {field.name === "phone" && network && (
                    <div className="pt-0.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide uppercase ${getNetworkBadgeStyles(network)}`}
                      >
                        <Sparkles className="w-3 h-3" /> {network}
                      </span>
                    </div>
                  )}

                  {errors[field.name] && (
                    <p className="text-xs font-medium text-red-500 dark:text-red-400 mt-1 animate-pulse">
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-linear-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-purple-600/20 hover:from-purple-700 hover:to-indigo-700 hover:shadow-purple-700/30 disabled:opacity-50 disabled:pointer-events-none transition-all duration-200 text-sm flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Create Account"
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center border-t border-slate-100 dark:border-slate-800/80 pt-5">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-purple-600 dark:text-purple-400 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
