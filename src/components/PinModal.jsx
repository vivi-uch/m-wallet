import React, { useState } from "react";
import { toast } from "react-toastify";
import Card from "./Card";


const PinModal = ({ netName, onConfirm, onCancel, balance, senderName, receiverName, amount, bankName, narration }) => {
  const [pin, setPin] = useState("");

  const handleConfirm = () => {
    if (pin.trim().length !== 4)  {
      toast.error("PIN must be 4 digits");
      return;
    }
    onConfirm(pin);
    setPin("");
  };


  const confirmList = [
    {
      description:"From:",
      value: senderName,
     },
     {
      description:"To:",
      value: receiverName,
     },
     {
      description:`${netName ? "Network" : "Bank"}:`,
      value: `${netName ? netName : bankName}`,
     },
     {
      description:"Amount:",
      value: amount,
     },
     {
      description:"Narration:",
      value: narration,
     }
  ];

  return (
    // <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
    //   <div className="bg-white rounded-lg p-6 w-80 shadow-md">
    //     <h2 className="text-lg font-semibold mb-4 text-center">
    //       Enter Security PIN
    //     </h2>
    //     <input
    //       type="password"
    //       maxLength="4"
    //       inputMode="numeric"
    //       value={pin}
    //       onChange={(e) => {
    //         const value = e.target.value.replace(/[^0-9]/g, "");
    //         setPin(value);
    //       }}
    //       className="w-full border rounded px-3 py-2 text-center tracking-widest"
    //     />
    //     <div className="flex justify-between mt-4">
    //       <button className="bg-gray-300 px-4 py-2 rounded" onClick={onCancel}>
    //         Cancel
    //       </button>
    //       <button
    //         className="bg-purple-600 text-white px-4 py-2 rounded"
    //         onClick={handleConfirm}
    //       >
    //         Confirm
    //       </button>
    //     </div>
    //   </div>
    // </div>
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8">
      <div className="max-w-2xl mx-auto">
         <div className="mb-6">
          <button
            onClick={onCancel}
            className="text-sm text-gray-600 dark:text-gray-400 mb-2"
          >
            Back
          </button>
          <h1 className="text-2xl font-bold dark:text-white">Confirm Transaction</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Balance: ₦{Number(balance).toLocaleString()}
          </p>
        </div>

        <Card>
          <div className="space-y-4">
              {confirmList.map((item) => (
                    <div className="flex items-center justify-between" key={item}>
                      <label className="text-md font-serif font-medium dark:text-gray-300">{item.description}</label>
                      <span className="text-sm font-serif text-gray-500 dark:text-white">{item.value}</span>
                    </div>
              ))}
          </div>
          <div className="mt-6 gap-4 p-4 flex flex-col items-center justify-center bg-purple-100 dark:bg-purple-900 rounded-lg">
            Enter Transaction PIN
            <input   
              type="password"
              maxLength="4"
              inputMode="numeric"
              value={pin}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                setPin(value);
              }}
              className="bg-white active:border-purple-600 focus:border-purple-600 py-1 rounded px-2 w-1/2 text-center tracking-widest"
             /> 
          </div>  

          <div className="mt-6 flex flex-col md:flex-row justify-between gap-4">
            <button className="bg-purple-600 text-white px-4 py-2 rounded-md uppercase" onClick={handleConfirm}>
              Confirm
            </button>
            <button className="bg-gray-300 text-black px-4 py-2 rounded-md uppercase" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PinModal;
