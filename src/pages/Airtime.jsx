import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import {
  getUserById,
  updateUserBalance,
  addTransaction,
  getUserByPhone,
} from "../utils/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PinModal from "../components/PinModal";

const networks = [
  { id: "mtn", name: "MTN", color: "bg-yellow-100" },
  { id: "airtel", name: "Airtel", color: "bg-red-100" },
  { id: "glo", name: "Glo", color: "bg-green-100" },
  { id: "9mobile", name: "9mobile", color: "bg-green-200" },
];

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

  useEffect(() => {}, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.phone) return toast.error("Enter phone number");
    if (!formData.network) return toast.error("Select network");
    if (!formData.amount) return toast.error("Enter amount");
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

      const receiverphone = await getUserByPhone(formData.phone);
      if (receiverphone) {
        setPhoneName(receiverphone.fullName);
      } else {
        setPhoneName("Phone number doesn't exist");
      }

      await updateUserBalance(
        currentUser.id,
        Number(currentUser.walletBalance || 0) - amount
      );

      const transaction = {
        id: Date.now().toString(),
        userId: currentUser.id,
        amount,
        type: "airtime",
        description: `Airtime payment to ${formData.phone}`,
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
          <h1 className="text-2xl font-bold">Buy Airtime</h1>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                name="phone"
                className="w-full p-2 border rounded"
                placeholder="Enter phone number"
                required
              />
              <p className="text-sm uppercase mt-1">{phoneName}</p>
            </div>

            <div>
              <label className="block mb-1">Network</label>
              <select
                value={formData.network}
                onChange={handleChange}
                name="network"
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select network</option>
                {networks.map((network) => (
                  <option
                    key={network.id}
                    value={network.id}
                    className={`p-1 ${network.color}`}
                  >
                    {network.name}
                  </option>
                ))}
              </select>
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
              {isLoading ? "Processing..." : "Buy Airtime"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Airtime;
