import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import { getUserById, getAllTransactions } from "../utils/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [walletBalance, setWalletBalance] = useState(0);
  const [username, setUsername] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) return;

    getUserById(userId).then((user) => {
      if (user) {
        setWalletBalance(user.walletBalance || 0);
        setUsername(user.fullName.split(" ")[0]);
        setAccountNumber(user.accounts?.[0]?.accountNumber || "");
      }
    });

    getAllTransactions().then((allTransactions) => {
      const userTransactions = allTransactions.filter(
        (trans) => trans.senderId === userId || trans.receiverId === userId
      );
      setTransactions(userTransactions);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-gray-600">Account overview</p>
        </div>

        {/* <h2 className="text-xl font-semibold mb-4">Hello, {username}!</h2> */}
        <h2 className="text-xl font-semibold mb-4 flex justify-between items-center">
          <span>Hello, {username}!</span>
          <span className="text-sm text-gray-600">
            ACCOUNT NUMBER: {accountNumber}
          </span>
        </h2>

        <Card className="mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">Balance</p>
              <div className="text-3xl font-bold">
                ₦{Number(walletBalance).toLocaleString()}
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => navigate("/transfer")}>Transfer</Button>
              <Button onClick={() => navigate("/airtime")}>Airtime</Button>
              <Button onClick={() => navigate("/bills")}>Bills</Button>
            </div>
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Transaction history</h3>
            <div className="text-sm text-gray-600">
              {transactions.length} items
            </div>
          </div>

          {transactions.length === 0 ? (
            <p className="text-gray-600">No transactions yet.</p>
          ) : (
            <ul className="space-y-3">
              {transactions
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((transaction) => {
                  const isDebit =
                    transaction.senderId === sessionStorage.getItem("userId");
                  return (
                    <li
                      key={transaction.id}
                      className="flex items-center justify-between border rounded p-3"
                    >
                      <div>
                        <div className="text-sm text-gray-700 font-medium">
                          {transaction.description}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(transaction.date).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`font-semibold ${
                            isDebit ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          {isDebit
                            ? `-₦${Number(transaction.amount).toLocaleString()}`
                            : `+₦${Number(
                                transaction.amount
                              ).toLocaleString()}`}
                        </div>
                        <div className="text-xs text-gray-500">
                          {transaction.status}
                        </div>
                      </div>
                    </li>
                  );
                })}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
