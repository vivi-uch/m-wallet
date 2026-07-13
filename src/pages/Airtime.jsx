import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import {
  getUserById,
  updateUserBalance,
  addTransaction,
  getUserByPhone,
  detectNetwork,
  fetchAllUsers,
} from "../utils/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PinModal from "../components/PinModal";
import { ArrowLeft, Wallet, Smartphone, Users, Radio, Banknote, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";

const Airtime = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone: "",
    network: "",
    amount: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [phoneName, setPhoneName] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isError, setIsError] = useState(false);
  const [balance, setBalance] = useState(0); 
  const [chosenAccount, setChosenAccount] = useState("");

  useEffect(() => {
    fetchAllUsers().then((users) => {
      const usersWithPhone = users.filter((u) => u.phone);
      setAllUsers(usersWithPhone);
      setFilteredUsers(usersWithPhone);
    });
    const userId = sessionStorage.getItem("userId");
    if (!userId) return;
    getUserById(userId).then((user) => {
      if (user) {
        setBalance(Number(user.walletBalance || 0));
        setChosenAccount(user.accounts?.[0]?.accountNumber || "");
      }
    });
  }, []);

  useEffect(() => {
    if (formData.network) {
      const filtered = allUsers.filter((user) => {
        const userNetwork = detectNetwork(user.phone);
        return userNetwork === formData.network;
      });
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(allUsers);
    }
  }, [formData.network, allUsers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "phone") {
      if (value.length === 11) {
        const detectedNetwork = detectNetwork(value);
        if (detectedNetwork) {
          setFormData((prev) => ({ ...prev, network: detectedNetwork }));
          findPhoneName(value);
        } else {
          setPhoneName("Invalid phone number");
          setIsError(true);
        }
      } else {
        setPhoneName("");
        setIsError(false);
      }
    }

    if (name === "network") {
      setPhoneName("");
      setIsError(false);
    }
  };

  const handleSelectedUserChange = (e) => {
    const selectedID = e.target.value;
    if (!selectedID) return;

    const user = allUsers.find((u) => u.id === selectedID);

    if (user && user.phone) {
      const detectedNetwork = detectNetwork(user.phone);
      setFormData((prev) => ({
        ...prev,
        phone: user.phone,
        network: detectedNetwork || "",
      }));

      if (detectedNetwork) {
        setPhoneName(user.fullName);
        setIsError(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.phone) return toast.error("Enter phone number");
    if (formData.phone.length !== 11 || !/^\d{11}$/.test(formData.phone))
      return toast.error("Phone number must be 11 digits");
    if (!formData.network) return toast.error("Select network");

    const amt = parseFloat(formData.amount);

    if (!formData.amount) return toast.error("Enter amount");
    else if (isNaN(amt) || amt <= 0) return toast.error("Enter a valid amount");
    else if (amt > balance - 200) return toast.error("Must maintain minimum balance of ₦200");
   
    if (isError) {
      toast.error("Check all fields for errors");
      return;
    }
    setShowPin(true);
  };

  const handlePinConfirm = async (enteredPin) => {
    setShowPin(false);
    setIsLoading(true);
    try {
      const userId = sessionStorage.getItem("userId");
      if (!userId) {
        toast.error("Please login");
        navigate("/login");
        return;
      }
      const currentUser = await getUserById(userId);
      if (!currentUser) {
        toast.error("User not found");
        return;
      }
      if ((currentUser.pin || "") !== enteredPin) {
        toast.error("Incorrect PIN");
        return;
      }

      const amount = parseFloat(formData.amount);
      if (Number(currentUser.walletBalance || 0) - amount < 200) {
        toast.error("You must keep a minimum balance of ₦200");
        return;
      }

      await updateUserBalance(
        currentUser.id,
        Number(currentUser.walletBalance || 0) - amount
      );

      const transaction = {
        id: Date.now().toString(),
        senderId: currentUser.id,
        senderName: currentUser.fullName,
        receiverName: formData.phone,
        amount,
        type: "airtime",
        status: "completed",
        date: new Date().toISOString(),
      };

      await addTransaction(transaction);

      toast.success("Airtime purchased successfully", {
        onClose: () => navigate("/dashboard"),
      });
    } catch (err) {
      console.error(err);
      toast.error("Purchase failed");
    } finally {
      setIsLoading(false);
    }
  };

  const findPhoneName = async (phoneNumber) => {
    setPhoneName("Verifying phone number...");
    setIsError(false);
    const receiverphone = await getUserByPhone(phoneNumber);
    if (receiverphone) {
      setPhoneName(receiverphone.fullName);
      setIsError(false);
    } else {
      setPhoneName("Phone number doesn't exist");
      setIsError(true);
    }
  };

  const getNetworkBadgeStyles = (net) => {
    switch (net?.toUpperCase()) {
      case "MTN": return "bg-amber-500/10 text-amber-600 border border-amber-500/20";
      case "AIRTEL": return "bg-rose-500/10 text-rose-600 border border-rose-500/20";
      case "GLO": return "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20";
      case "9MOBILE": return "bg-teal-500/10 text-teal-600 border border-teal-500/20";
      default: return "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-8 relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

      <ToastContainer position="top-center" autoClose={4000} />
      
      {showPin && (
        <PinModal
          onConfirm={handlePinConfirm}
          onCancel={() => setShowPin(false)}
          receiverName={formData.phone}
          netName={formData.network}
          amount={`₦ ${formData.amount}`}
          narration={`Airtime Purchase`}
          senderName={`YOU | ${chosenAccount}`}
          balance={balance}
        />
      )}

      <div className="max-w-xl mx-auto relative z-10 space-y-6">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors uppercase tracking-wider"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back</span>
            </button>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Buy Airtime
            </h1>
          </div>
          <div className="flex items-center gap-3 bg-linear-to-br from-purple-900 to-indigo-950 text-white px-4 py-3 rounded-2xl shadow-md border border-white/10 self-start sm:self-auto min-w-[180px]">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-purple-300">
              <Wallet className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-purple-200/60 uppercase tracking-wider">Wallet Balance</p>
              <p className="text-base font-bold font-mono tracking-tight">
                ₦{Number(balance).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-xl rounded-2xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wide uppercase">
                Select from Saved Contacts
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 pointer-events-none">
                  <Users className="w-4 h-4 text-slate-400" />
                </div>
                <select
                  onChange={handleSelectedUserChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/40 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 text-sm appearance-none cursor-pointer"
                >
                  <option value="">Select a contact (Optional)</option>
                  {filteredUsers.map((u) => (
                                        <option key={u.id} value={u.id}>
                      {u.fullName} ({u.phone})
                    </option>
                  ))}
                </select>
                <div className="absolute right-3.5 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-400 w-0 h-0" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wide uppercase">
                Network Operator
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 pointer-events-none">
                  <Radio className="w-4 h-4 text-slate-400" />
                </div>
                <select
                  value={formData.network}
                  onChange={handleChange}
                  name="network"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/40 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 text-sm appearance-none cursor-pointer"
                  required
                >
                  <option value="">Select network</option>
                  <option value="MTN">MTN</option>
                  <option value="GLO">GLO</option>
                  <option value="AIRTEL">AIRTEL</option>
                  <option value="9MOBILE">9MOBILE</option>
                </select>
                <div className="absolute right-3.5 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-400 w-0 h-0" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wide uppercase">
                Phone Number
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 pointer-events-none">
                  <Smartphone className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  name="phone"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/40 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 text-sm"
                  placeholder="e.g. 08012345678"
                  maxLength={11}
                  required
                />
              </div>

              {phoneName && (
                <div className="pt-1">
                  <div className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-medium tracking-wide transition-all ${
                    isError 
                      ? "bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400" 
                      : phoneName === "Verifying phone number..."
                      ? "bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400"
                      : "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400"
                  }`}>
                    {isError ? (
                      <AlertCircle className="w-4 h-4 shrink-0" />
                    ) : phoneName === "Verifying phone number..." ? (
                      <span className="w-3.5 h-3.5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                    )}
                    <span className="truncate uppercase">{phoneName}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wide uppercase">
                Recharge Amount (₦)
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 pointer-events-none">
                  <Banknote className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  name="amount"
                  type="number"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/40 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 text-sm font-mono"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Note: A minimum wallet balance of ₦200 must be retained after purchase.
              </p>
            </div>

            {formData.network && !isError && (
              <div className="pt-1 flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Detected Carrier:</span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-200 ${getNetworkBadgeStyles(formData.network)}`}>
                  <Sparkles className="w-3 h-3" /> {formData.network}
                </span>
              </div>
            )}

            <div className="pt-2">
              <Button
                type="submit"
                disabled={isLoading || isError || phoneName === "Verifying phone number..."}
                className="w-full bg-linear-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-purple-600/20 hover:from-purple-700 hover:to-indigo-700 hover:shadow-purple-700/30 disabled:opacity-40 disabled:pointer-events-none transition-all duration-200 text-sm flex items-center justify-center gap-2"
              >
                Proceed to Recharge
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Airtime;

