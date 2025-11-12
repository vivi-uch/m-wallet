import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    if (userId) navigate("/dashboard");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-purple-600 text-white">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-7xl font-bold">M-Wallet</div>
        <p className="text-3xl font-bold">
          Simple, secure wallet for transfer, airtime and bills.
        </p>
        <div className="flex justify-between space-x-4">
          <div className="flex-1 p-4 text-white rounded-md flex flex-col items-center justify-center space-y-2 border-2 border-white min-h-[100px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
              />
            </svg>
            <h2 className="text-white">Transfers</h2>
          </div>
          <div className="flex-1 p-4 text-white rounded-md flex flex-col items-center justify-center space-y-2 border-2 border-white min-h-[100px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
              />
            </svg>
            <h2 className="text-white">Airtime</h2>
          </div>
          <div className="flex-1 p-4 text-white rounded-md flex flex-col items-center justify-center space-y-2 border-2 border-white min-h-[100px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
              />
            </svg>
            <h2 className="text-white">Bills</h2>
          </div>
        </div>
        <div className="space-y-3">
          <Button className="w-full" onClick={() => navigate("/signup")}>
            Get Started
          </Button>
          <Button
            className="w-full bg-white/20 border-purple-600 text-purple-600"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Splash;
