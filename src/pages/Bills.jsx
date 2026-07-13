import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import {
  getUserById,
  updateUserBalance,
  getUserByAccount,
  addTransaction,
  getBanks,
  fetchAllUsers,
} from "../utils/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PinModal from "../components/PinModal";
import {
  ArrowLeft,
  Wallet,
  Layers,
  Building2,
  Hash,
  Banknote,
  Users,
  AlertCircle,
  CheckCircle2,
  Tv,
  Droplet,
  Zap,
} from "lucide-react";

const bills = [
  {
    id: "electricity",
    name: "Electricity",
    icon: <Zap className="w-4 h-4 text-amber-500" />,
  },
  {
    id: "water",
    name: "Water",
    icon: <Droplet className="w-4 h-4 text-blue-500" />,
  },
  {
    id: "tv",
    name: "TV & Cable",
    icon: <Tv className="w-4 h-4 text-purple-500" />,
  },
];

const Bills = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    billType: "",
    accountNumber: "",
    amount: "",
    bank: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [banks, setBanks] = useState([]);
  const [Allusers, setAllUsers] = useState([]);
  const [isError, setIsError] = useState(false);
  const [balance, setBalance] = useState(0);
  const [chosenAccount, setChosenAccount] = useState("");

  useEffect(() => {
    getBanks().then(setBanks);
    const userId = sessionStorage.getItem("userId");
    if (!userId) return;

    getUserById(userId).then((user) => {
      if (user) {
        setBalance(Number(user.walletBalance || 0));
        setChosenAccount(user.accounts?.[0]?.accountNumber || "");
      }
    });
    fetchAllUsers().then(setAllUsers);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "accountNumber" && value.length === 10 && formData.bank) {
      findAccountName(formData.bank, value);
    }
    if (name === "bank" && formData.accountNumber.length === 10) {
      findAccountName(value, formData.accountNumber);
    }
  };

  const handleSelectedUserChange = (e) => {
    const selectedID = e.target.value;
    if (!selectedID) return;
    const user = Allusers.find((u) => u.id === selectedID);

    setFormData((prev) => ({
      ...prev,
      bank: user?.accounts?.[0]?.bankCode || "",
      accountNumber: user?.accounts?.[0]?.accountNumber || "",
    }));

    if (user?.accounts?.[0]) {
      findAccountName(
        user.accounts[0].bankCode,
        user.accounts[0].accountNumber,
      );
    }
  };

  const findAccountName = async (bankCode, acct) => {
    setAccountName("Verifying account info...");
    setIsError(false);
    const receiver = await getUserByAccount(bankCode, acct);
    if (receiver) {
      setAccountName(receiver.fullName);
      setIsError(false);
    } else {
      setAccountName("Account Number doesn't exist, check beneficiary");
      setIsError(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.billType) return toast.error("Select bill type");
    if (!formData.accountNumber)
      return toast.error("Account number is required");
    if (
      formData.accountNumber.length !== 10 ||
      !/^\d{10}$/.test(formData.accountNumber)
    )
      return toast.error("Account number must be 10 digits");

    const amt = parseFloat(formData.amount);
    if (!formData.amount) return toast.error("Enter amount");
    else if (isNaN(amt) || amt <= 0) return toast.error("Enter a valid amount");
    else if (amt > balance - 200)
      return toast.error("Must maintain minimum balance of ₦200");
    if (isError) {
      toast.error("Check all fields for Error");
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

      const receiverUser = await getUserByAccount(
        formData.bank,
        formData.accountNumber,
      );
      if (!receiverUser) {
        toast.error("Receiver account not found");
        return;
      }

      if (currentUser.id === receiverUser.id) {
        toast.info("Impossible!, You can't transfer to your own account", {
          onClose: () => navigate("/dashboard"),
        });
        return;
      }

      const newReceiverBalance =
        Number(receiverUser.walletBalance || 0) + amount;

      await updateUserBalance(
        currentUser.id,
        Number(currentUser.walletBalance || 0) - amount,
      );
      await updateUserBalance(receiverUser.id, newReceiverBalance);

      const transaction = {
        id: Date.now().toString(),
        senderId: currentUser.id,
        receiverId: receiverUser.id,
        senderName: currentUser.fullName,
        receiverName: receiverUser.fullName,
        amount,
        type: `${formData.billType}`,
        status: "completed",
        date: new Date().toISOString(),
      };

      await addTransaction(transaction);

      toast.success(
        `${formData.billType.toUpperCase()} payment successful to ${receiverUser.fullName}`,
        {
          onClose: () => navigate("/dashboard"),
        },
      );
    } catch (err) {
      console.error(err);
      toast.error(`${formData.billType} payment failed`);
    } finally {
      setIsLoading(false);
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
          bankName={
            banks.find((bankName) => bankName.code === formData.bank)?.name
          }
          receiverName={`${accountName} | ${formData.accountNumber}`}
          narration={`${formData.billType.toUpperCase()} Bill Payment`}
          balance={balance}
          senderName={`YOU | ${chosenAccount}`}
          amount={`₦ ${formData.amount}`}
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
              Pay Utilities
            </h1>
          </div>

          <div className="flex items-center gap-3 bg-linear-to-br from-purple-900 to-indigo-950 text-white px-4 py-3 rounded-2xl shadow-md border border-white/10 self-start sm:self-auto min-w-[180px]">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-purple-300">
              <Wallet className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-purple-200/60 uppercase tracking-wider">
                Wallet Balance
              </p>
              <p className="text-base font-bold font-mono tracking-tight">
                ₦{Number(balance).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {bills.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, billType: b.id }))
              }
              className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 text-center transition-all ${
                formData.billType === b.id
                  ? "bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-600/10 scale-[1.02]"
                  : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-purple-500/50"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${formData.billType === b.id ? "bg-white/20" : "bg-slate-50 dark:bg-slate-950"}`}
              >
                {b.icon}
              </div>
              <span className="text-xs font-bold tracking-tight">{b.name}</span>
            </button>
          ))}
        </div>

        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-xl rounded-2xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
  
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wide uppercase">
                Select Saved Biller Account
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 pointer-events-none">
                  <Users className="w-4 h-4 text-slate-400" />
                </div>
                <select
                  onChange={handleSelectedUserChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/40 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 text-sm appearance-none cursor-pointer"
                >
                  <option value="">Choose a regular biller (Optional)</option>
                  {Allusers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.fullName} ({u.accounts?.[0]?.bankCode || "Wallet"})
                    </option>
                  ))}
                </select>
                <div className="absolute right-3.5 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-400 w-0 h-0" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wide uppercase">
                  Biller Provider Bank
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 pointer-events-none">
                    <Building2 className="w-4 h-4 text-slate-400" />
                  </div>
                  <select
                    name="bank"
                    value={formData.bank}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/40 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 text-sm appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Select billing bank</option>
                    {banks.map((bank) => (
                      <option key={bank.code} value={bank.code}>
                        {bank.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3.5 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-400 w-0 h-0" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wide uppercase">
                  Utility Account Number
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 pointer-events-none">
                    <Hash className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    name="accountNumber"
                    type="text"
                    maxLength={10}
                    placeholder="10-digit customer ID"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/40 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {accountName && (
              <div
                className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-medium tracking-wide transition-all ${
                  isError
                    ? "bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400"
                    : accountName === "Verifying account info..."
                      ? "bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400"
                      : "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400"
                }`}
              >
                {isError ? (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                ) : accountName === "Verifying account info..." ? (
                  <span className="w-3.5 h-3.5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                )}
                <span className="truncate uppercase">{accountName}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wide uppercase">
                Payment Amount (₦)
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
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/40 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 text-sm font-mono"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Note: A safety minimum balance of ₦200 must remain active
                post-billing.
              </p>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={
                  isLoading ||
                  isError ||
                  !formData.billType ||
                  accountName === "Verifying account info..."
                }
                className="w-full bg-linear-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-purple-600/20 hover:from-purple-700 hover:to-indigo-700 hover:shadow-purple-700/30 disabled:opacity-40 disabled:pointer-events-none transition-all duration-200 text-sm flex items-center justify-center gap-2"
              >
                Proceed to Settlement
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Bills;
