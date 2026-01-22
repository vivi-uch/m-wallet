import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    if (userId) navigate("/dashboard");
  }, [navigate]);

  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-800">
    
      <div className="hidden lg:flex w-1/2 text-gray-800/90 px-8 py-10 justify-center bg-purple-100 dark:bg-purple-950">
        <div className="max-w-md space-y-9 flex flex-1 flex-col items-center justify-center">
          <h1 className="text-7xl font-bold text-black dark:text-white">M-Wallet</h1>

          <p className="text-4xl text-gray-500/90 dark:text-white/90 font-light text-center w-full">
            Manage your transfers, airtime, and bills with ease.
            Simple. Secure. Reliable.
          </p>

          <div className="pt-10">
            <p className="text-lg text-gray-500/70 dark:text-white/70">
              Trusted by users for fast daily payments
            </p>
          </div>
        </div>
      </div>

 
      <div className="w-full lg:w-1/2 px-8 py-10 flex flex-col">

        {/* Content */}
        <div className="flex flex-1 items-center">
          <div className="w-full max-w-md mx-auto space-y-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Everything you need in one wallet
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {["Transfers", "Airtime", "Bill Payments"].map((item) => (
                <div
                  key={item}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition"
                >
                  <p className="font-medium text-gray-800 dark:text-white/70">{item}</p>
                  <p className="text-sm text-gray-500">
                    Fast, simple and secure
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate("/signup")}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Splash;
