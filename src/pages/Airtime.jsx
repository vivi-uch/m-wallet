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

  useEffect(() => {
    fetchAllUsers().then((users) => {
      const usersWithPhone = users.filter((u) => u.phone);
      setAllUsers(usersWithPhone);
      setFilteredUsers(usersWithPhone);
    });
  }, []);

  // Filter users by selected network
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
    if (!formData.amount) return toast.error("Enter amount");
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
      if (amount > Number(currentUser.walletBalance || 0)) {
        toast.error("Insufficient balance");
        return;
      }

      // console.log("receiverphone", receiverphone);

      await updateUserBalance(
        currentUser.id,
        Number(currentUser.walletBalance || 0) - amount
      );

      const transaction = {
        id: Date.now().toString(),
        userId: currentUser.id,
        amount,
        type: "airtime",
        description: ` ${formData.phone}`,
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
    const receiverphone = await getUserByPhone(phoneNumber);
    if (receiverphone) {
      setPhoneName(receiverphone.fullName);
      setIsError(false);
    } else {
      setPhoneName("Phone number doesn't exist");
      setIsError(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8">
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
            className="text-sm text-gray-600 dark:text-gray-400 mb-2"
          >
            Back
          </button>
          <h1 className="text-2xl font-bold dark:text-white">Buy Airtime</h1>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 dark:text-gray-300">Network</label>
              <select
                value={formData.network}
                onChange={handleChange}
                name="network"
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                required
              >
                <option value="">Select network</option>
                <option value="MTN">MTN</option>
                <option value="GLO">GLO</option>
                <option value="AIRTEL">AIRTEL</option>
                <option value="9MOBILE">9MOBILE</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 dark:text-gray-300">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                name="phone"
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                placeholder="Enter phone number"
                maxLength={11}
                required
              />
              <div className="flex justify-between items-center mt-1">
                <p
                  className={`text-sm uppercase mt-1 ${
                    isError
                      ? "text-red-500"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {phoneName}
                </p>
                <select
                  onChange={handleSelectedUserChange}
                  className="text-white bg-purple-600 p-1 rounded-sm text-xs"
                >
                  <option value="">Select Beneficiary</option>
                  {filteredUsers?.map((user) => (
                    <option key={user.id} value={user.id} className="uppercase">
                      {user.fullName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block mb-1 dark:text-gray-300">
                Amount (₦)
              </label>
              <input
                value={formData.amount}
                onChange={handleChange}
                name="amount"
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                placeholder="0.00"
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
