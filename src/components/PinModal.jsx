import React, { useState } from "react";
import { toast } from "react-toastify";

const PinModal = ({ onConfirm, onCancel }) => {
  const [pin, setPin] = useState("");

  const handleConfirm = () => {
    if (pin.trim().length !== 4) {
      toast.error("Enter your 4-digit PIN");
      return;
    }
    onConfirm(pin);
    setPin("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Enter Security PIN
        </h2>
        <input
          type="password"
          maxLength="4"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="w-full border rounded px-3 py-2 text-center tracking-widest"
        />
        <div className="flex justify-between mt-4">
          <button className="bg-gray-300 px-4 py-2 rounded" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded"
            onClick={handleConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default PinModal;
