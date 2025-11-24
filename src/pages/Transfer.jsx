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
} from "../utils/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PinModal from "../components/PinModal";

const Transfer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bank: "",
    accountNumber: "",
    amount: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [accountName, setAccountName] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [banks, setBanks] = useState([]);

  useEffect(() => {
    getBanks().then(setBanks);
    const userId = sessionStorage.getItem("userId");
    if (!userId) return;
    getUserById(userId).then((user) => {
      if (user) setBalance(Number(user.walletBalance || 0));
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));

    if (name === "accountNumber" && value.length === 10 && formData.bank) {
      findAccountName(formData.bank, value);
    }
    if (name === "bank" && formData.accountNumber.length === 10) {
      findAccountName(value, formData.accountNumber);
    }
  };

  const findAccountName = async (bankCode, acct) => {
    const receiver = await getUserByAccount(bankCode, acct);
    if (receiver) setAccountName(receiver.fullName);
    else setAccountName("Account not found");
  };

  const validate = () => {
    const err = {};
    const acct = formData.accountNumber.trim();
    if (!acct) err.accountNumber = "Account number is required";
    else if (acct.length !== 10 || !/^\d{10}$/.test(acct))
      err.accountNumber = "Account number must be 10 digits";
    if (!formData.bank) err.bank = "Choose a bank";

    const amt = parseFloat(formData.amount || 0);
    if (!formData.amount) err.amount = "Amount is required";
    else if (isNaN(amt) || amt <= 0) err.amount = "Enter a valid amount";
    else if (amt > balance) err.amount = "Insufficient balance";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
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
      const receiverUser = await getUserByAccount(
        formData.bank,
        formData.accountNumber
      );

      if (!receiverUser) {
        toast.error("Receiver account not found");
        return;
      }

      await updateUserBalance(
        currentUser.id,
        currentUser.walletBalance - amount
      );
      await updateUserBalance(
        receiverUser.id,
        receiverUser.walletBalance + amount
      );

      const transaction = {
        id: Date.now().toString(),
        senderId: currentUser.id,
        receiverId: receiverUser.id,
        amount,
        type: "transfer",
        description: `Transfer payment to ${receiverUser.fullName}`,
        status: "completed",
        date: new Date().toISOString(),
      };

      await addTransaction(transaction);

      toast.success(`Transfer successful to ${receiverUser.fullName}`, {
        onClose: () => navigate("/dashboard"),
      });
    } catch (err) {
      console.error(err);
      toast.error("Error processing transfer");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <ToastContainer position="top-center" autoClose={4000} />
      {showPin && (
        <PinModal
          onConfirm={handlePinConfirm}
          onCancel={() => setShowPin(false)}
        />
      )}
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-600 mb-2"
          >
            Back
          </button>
          <h1 className="text-2xl font-bold">Transfer Money</h1>
          <p className="text-sm text-gray-600">
            Balance: ₦{Number(balance).toLocaleString()}
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Bank</label>
              <select
                name="bank"
                value={formData.bank}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              >
                <option value="">Select a bank</option>
                {banks.map((bank) => (
                  <option key={bank.code} value={bank.code}>
                    {bank.name}
                  </option>
                ))}
              </select>
              {errors.bank && (
                <p className="text-sm text-red-600 mt-1">{errors.bank}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Account number
              </label>
              <input
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                placeholder="1234567890"
                inputMode="numeric"
                maxLength={10}
                required
              />
              {errors.accountNumber && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.accountNumber}
                </p>
              )}
              <p className="text-sm uppercase mt-1">{accountName}</p>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Amount (₦)
              </label>
              <input
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                placeholder="0.00"
                inputMode="decimal"
                required
              />
              {errors.amount && (
                <p className="text-sm text-red-600 mt-1">{errors.amount}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Note (optional)
              </label>
              <input
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                placeholder="For rent, gift, etc."
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Processing..." : "Send"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Transfer;
