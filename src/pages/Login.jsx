import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import { getUserByEmail } from "../utils/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff, Wallet, Mail, Lock } from "lucide-react";

const Inputfields = [
  {
    name: "email",
    type: "email",
    placeholder: "john@example.com",
    label: "Email Address",
    icon: <Mail className="w-4 h-4 text-slate-400" />,
  },
  {
    name: "password",
    type: "password",
    placeholder: "Enter password",
    label: "Password",
    icon: <Lock className="w-4 h-4 text-slate-400" />,
  },
];

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const handleToggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

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
      } else if (user && user.password !== formData.password) {
        toast.error("Invalid email or password");
      } else {
        toast.error("Account not found");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error logging in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      <ToastContainer position="top-center" autoClose={4000} />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-tr from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 mb-4 transform hover:scale-105 transition-transform duration-200">
            <Wallet className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Welcome Back</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Securely access your digital assets and transfers.
          </p>
        </div>

        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-xl rounded-2xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {Inputfields.map((field) => (
              <div key={field.name} className="space-y-1.5">
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
                        ? showPassword
                          ? "text"
                          : "password"
                        : field.type
                    }
                    placeholder={field.placeholder}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-950/40 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 text-sm ${
                      errors[field.name] ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-slate-200 dark:border-slate-800"
                    }`}
                    required
                  />
                  
                  {field.type === "password" && (
                    <button
                      type="button"
                      onClick={handleToggleShowPassword}
                      className="absolute right-3 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  )}
                </div>
                
                {errors[field.name] && (
                  <p className="text-xs font-medium text-red-500 dark:text-red-400 mt-1">
                    {errors[field.name]}
                  </p>
                )}
              </div>
            ))}

            <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400 select-none">
                <input 
                  type="checkbox" 
                  className="rounded border-slate-300 dark:border-slate-700 text-purple-600 focus:ring-purple-500/20 w-4 h-4 transition duration-150"
                />
                <span>Remember me</span>
              </label>
              <Link to="#" className="font-semibold text-purple-600 dark:text-purple-400 hover:underline">
                Forgot Password?
              </Link>
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
                  "Sign In"
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center border-t border-slate-100 dark:border-slate-800/80 pt-5">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Don't have an account?{" "}
              <Link to="/signup" className="font-semibold text-purple-600 dark:text-purple-400 hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
