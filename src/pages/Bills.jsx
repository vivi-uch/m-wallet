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

const bills = [
  { id: "electricity", name: "Electricity" },
  { id: "water", name: "Water" },
  { id: "tv", name: "TV" },
];

const Bills = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    billType: "",
    accountId: "",
    amount: "",
    bank: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [banks, setBanks] = useState([]);
  const [Allusers, setAllUsers] = useState([]);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    getBanks().then(setBanks);
    fetchAllUsers().then(setAllUsers);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "accountId" && value.length === 10 && formData.bank) {
      findAccountName(formData.bank, value);
    }
    if (name === "bank" && formData.accountId.length === 10) {
      findAccountName(value, formData.accountId);
    }
  };

  const handleSelectedUserChange = (e) => {
    const selectedID = e.target.value;
    const user = Allusers.find((u) => u.id === selectedID);

    setFormData((prev) => ({
      ...prev,
      bank: user?.accounts[0]?.bankCode || " ",
      accountNumber: user?.accounts[0]?.accountNumber || " ",
    }));

    if (user) {
      findAccountName(
        user?.accounts[0]?.bankCode,
        user?.accounts[0]?.accountNumber
      );
    }
  };
  const findAccountName = async (bankCode, acct) => {
    const receiver = await getUserByAccount(bankCode, acct);
    if (receiver) {
      setAccountName(receiver.fullName);
      setIsError(false);
    } else {
      setAccountName("Account Number don't exist, check beneficiary");
      setIsError(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.billType) return toast.error("Select bill type");
    if (!formData.accountId) return toast.error("Account number is required");
    if (
      formData.accountId.length !== 10 ||
      !/^\d{10}$/.test(formData.accountId)
    )
      return toast.error("Account number must be 10 digits");
    if (!formData.amount) return toast.error("Enter amount");
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
      if (amount > Number(currentUser.walletBalance || 0)) {
        toast.error("Insufficient balance");
        return;
      }

      const receiverUser = await getUserByAccount(
        formData.bank,
        formData.accountId
      );
      if (!receiverUser) {
        setAccountName("Receiver account not found");
        setIsLoading(false);
        return;
      }

      const newReceiverBalance =
        Number(receiverUser.walletBalance || 0) + amount;

      await updateUserBalance(
        currentUser.id,
        Number(currentUser.walletBalance || 0) - amount
      );
      await updateUserBalance(receiverUser.id, newReceiverBalance);

      const transaction = {
        id: Date.now().toString(),
        senderId: currentUser.id,
        receiverId: receiverUser.id,
        amount,
        type: `${formData.billType}`,
        description: ` ${receiverUser.fullName}`,
        status: "completed",
        date: new Date().toISOString(),
      };

      await addTransaction(transaction);

      toast.success(
        `${formData.billType} payment successful to ${receiverUser.fullName}`,
        {
          onClose: () => navigate("/dashboard"),
        }
      );
    } catch (err) {
      console.error(err);
      toast.error(`${formData.billType} payment failed`);
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
          <h1 className="text-2xl font-bold">Bill Transactions</h1>
        </div>

        <Card>
          <h1 className="text-xl mb-4">Pay Bills</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">Bill Type</label>
              <select
                value={formData.billType}
                onChange={handleChange}
                name="billType"
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select type</option>
                {bills.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1">Bank</label>
              <select
                name="bank"
                value={formData.bank}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select a bank</option>
                {banks.map((bank) => (
                  <option key={bank.code} value={bank.code}>
                    {bank.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1">Account/Meter Number</label>
              <input
                type="text"
                value={formData.accountId}
                onChange={handleChange}
                name="accountId"
                className="w-full p-2 border rounded"
                placeholder="Enter number"
                maxLength={10}
                required
              />
              <div className=" flex justify-between items-center mt-1">
                <p className="text-sm uppercase mt-1">{accountName}</p>
                <select
                  onChange={handleSelectedUserChange}
                  className="text-white bg-purple-600 p-1 rounded-sm text-xs"
                >
                  <option value="">Select Beneficiary</option>

                  {Allusers?.map((user) => (
                    <option key={user.id} value={user.id} className="uppercase">
                      {user.fullName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block mb-1">Amount (₦)</label>
              <input
                type="number"
                value={formData.amount}
                onChange={handleChange}
                name="amount"
                className="w-full p-2 border rounded"
                placeholder="0.00"
                min="1"
                required
              />
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Processing..." : "Pay Bill"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Bills;
