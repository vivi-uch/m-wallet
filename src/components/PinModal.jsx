import React, { useState } from "react";
import { toast } from "react-toastify";
import Card from "./Card";
import { ArrowLeft, ShieldCheck, Wallet, ArrowUpRight, CheckCircle2 } from "lucide-react";

const PinModal = ({ netName, onConfirm, onCancel, balance, senderName, receiverName, amount, bankName, narration }) => {
  const [pin, setPin] = useState("");

  const handleConfirm = () => {
    if (pin.trim().length !== 4) {
      toast.error("PIN must be 4 digits");
      return;
    }
    onConfirm(pin);
    setPin("");
  };

  const confirmList = [
    { description: "Sender Account", value: senderName },
    { description: "Recipient", value: receiverName },
    { description: netName ? "Telecom Network" : "Destination Bank", value: netName ? netName : bankName },
    { description: "Description / Memo", value: narration || "None" }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      
      <div className="w-full max-w-lg relative transform transition-all duration-200 animate-in zoom-in-95">
        
        <div className="absolute top-[-10%] left-[-10%] w-72 h-72 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-2xl rounded-2xl p-6 sm:p-8 overflow-hidden relative z-10">

          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-4 mb-6">
            <button
              onClick={onCancel}
              className="group flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors uppercase tracking-wider"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back</span>
            </button>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-full uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Secure Check</span>
            </div>
          </div>


          <div className="text-center space-y-2 mb-6">
            <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-950/40 flex items-center justify-center mx-auto text-purple-600 dark:text-purple-400">
              <ArrowUpRight className="w-6 h-6 animate-pulse" />
            </div>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Total Outflow Amount
            </p>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
              {amount}
            </h2>
            <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <Wallet className="w-3.5 h-3.5 text-slate-400" />
              <span>Post-balance: ₦{Number(balance).toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-900 rounded-2xl p-4 space-y-3.5">
            {confirmList.map((item) => (
              <div className="flex items-start justify-between gap-4 text-xs" key={item.description}>
                <span className="font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap pt-0.5">
                  {item.description}
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-right break-all max-w-[70%]">
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 p-5 flex flex-col items-center justify-center bg-linear-to-tr from-purple-500/10 to-indigo-500/10 dark:from-purple-950/30 dark:to-indigo-950/30 border border-purple-500/10 dark:border-purple-500/5 rounded-2xl space-y-3">
            <label className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-widest flex items-center gap-1.5">
              <span>Enter 4-Digit Security PIN</span>
            </label>
            <input
              type="password"
              maxLength="4"
              inputMode="numeric"
              pattern="\d*"
              value={pin}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                setPin(value);
              }}
              className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 py-3 rounded-xl w-40 text-center tracking-[1.2em] font-bold text-lg shadow-inner transition-all"
              placeholder="••••"
            />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3.5">
            <button
              onClick={onCancel}
              className="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-3.5 px-4 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 text-sm tracking-wide uppercase"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={pin.length !== 4}
              className="w-full bg-linear-to-r from-purple-600 to-indigo-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-purple-600/20 hover:from-purple-700 hover:to-indigo-700 hover:shadow-purple-700/30 disabled:opacity-40 disabled:pointer-events-none transition-all duration-200 text-sm tracking-wide uppercase flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm</span>
            </button>
          </div>

        </Card>
      </div>
    </div>
  );
};

export default PinModal;
