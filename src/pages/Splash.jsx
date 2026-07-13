import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Smartphone, Zap, ShieldCheck } from "lucide-react";

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    if (userId) navigate("/dashboard");
  }, [navigate]);

  const features = [
    {
      title: "Instant Transfers",
      desc: "Send money locally and globally in seconds.",
      icon: (
        <ArrowRight className="w-5 h-5 text-purple-600 dark:text-purple-400" />
      ),
    },
    {
      title: "Airtime & Data",
      desc: "Top up your phone instantly anytime.",
      icon: (
        <Smartphone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
      ),
    },
    {
      title: "Bill Payments",
      desc: "Pay utilities securely with zero hassle.",
      icon: <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
    },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">

      <div className="hidden lg:flex w-1/2 justify-center items-center relative overflow-hidden bg-linear-to-br from-purple-700 via-purple-800 to-indigo-950 p-12">

        <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="max-w-md space-y-8 relative z-10 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-purple-200 text-xs font-medium tracking-wide uppercase backdrop-blur-sm">
            <ShieldCheck className="w-4 h-4" /> Secure Financial Ecosystem
          </div>

          <h1 className="text-6xl font-black text-white tracking-tight leading-none">
            M-Wallet
          </h1>

          <p className="text-xl text-purple-100/80 font-light leading-relaxed">
            Manage your transfers, airtime, and bills with ease. Simple. Secure.
            Reliable.
          </p>

          <div className="pt-8 border-t border-white/10">
            <p className="text-sm text-purple-200/60 tracking-wide font-medium">
              TRUSTED BY OVER 1 MILLION ACTIVE USERS
            </p>
          </div>
        </div>
      </div>


      <div className="w-full lg:w-1/2 p-6 sm:p-12 flex flex-col justify-center bg-white dark:bg-slate-900">
        <div className="w-full max-w-md mx-auto space-y-8">

          <div className="lg:hidden space-y-2 text-center mb-4">
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              M-Wallet
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Simple. Secure. Reliable.
            </p>
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Everything you need in one wallet
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Experience frictionless digital banking today.
            </p>
          </div>

          <div className="space-y-4">
            {features.map((item) => (
              <div
                key={item.title}
                className="group flex gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-md hover:shadow-purple-500/5 transition-all duration-200 cursor-default"
              >
                <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/50 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <div className="space-y-0.5">
                  <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate("/signup")}
            className="group flex items-center justify-center gap-2 w-full bg-purple-600 text-white font-medium py-3.5 px-4 rounded-xl shadow-lg shadow-purple-600/20 hover:bg-purple-700 hover:shadow-purple-700/30 transition-all duration-200 active:scale-[0.99]"
          >
            Get Started
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Splash;
