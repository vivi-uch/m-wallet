import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import { getUserById, getAllTransactions, getBanks } from "../utils/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [walletBalance, setWalletBalance] = useState(0);
  const [username, setUsername] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [userbank, setUserBank] = useState("");
  const [bankcodes, setBankCodes] = useState();

  const [currPage, setCurrPage] = useState(1);
  const itemsperPage = 3;

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");

    if (!userId) return;

    getUserById(userId).then((user) => {
      if (user) {
        setWalletBalance(user.walletBalance || 0);
        setUsername(user.fullName.split(" ")[0]);
        setAccountNumber(user.accounts?.[0]?.accountNumber || "");
        setBankCodes(user.accounts?.[0]?.bankCode || "");
      }
    });

    getBanks().then(setUserBank);

    getAllTransactions().then((allTransactions) => {
      const userTransactions = allTransactions.filter(
        (trans) => trans.senderId === userId || trans.receiverId === userId
      );
      setTransactions(userTransactions);
    });
  }, []);

  const visibleTransactions = useMemo(() => {
    const start = (currPage - 1) * itemsperPage;
    const end = start + itemsperPage;
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    return transactions.slice(start, end);
  }, [transactions, currPage]);

  const handlePrevPage = () => {
    setCurrPage(currPage - 1);
  };
  const handleNextPage = () => {
    setCurrPage(currPage + 1);
  };

  const chosenBank = Array.isArray(userbank)
    ? userbank.find((bank) => bank.code === bankcodes)
    : "";

  // const handleGenerateReceipt = (transaction) => () => {
  //   const isDebit = transaction.senderId === sessionStorage.getItem("userId");
  // };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-md text-gray-600">Account overview</p>
        </div>

        {/* <h2 className="text-xl font-semibold mb-4">Hello, {username}!</h2> */}
        <h2 className="text-xl font-semibold mb-4 flex justify-between items-center">
          <span>Hello, {username}!</span>
          <span className="text-sm text-gray-600 uppercase">
            account details: {chosenBank ? chosenBank.name : "none"}{" "}
            {accountNumber}
          </span>
        </h2>

        <Card className="mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex gap-3 relative">
                <p className="text-sm text-gray-500">Balance</p>
              </div>

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
              {visibleTransactions.map((transaction) => {
                const isDebit =
                  transaction.senderId === sessionStorage.getItem("userId");
                return (
                  <li
                    key={transaction.id}
                    className="flex items-center justify-between border rounded p-3"
                    // onClick={handleGenerateReceipt(transaction)}
                  >
                    <div>
                      <div className="text-sm text-gray-700 font-medium capitalize">
                        {transaction.type} payment made
                        {isDebit ? " to" : " from"} {transaction.description}
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
                          : `+₦${Number(transaction.amount).toLocaleString()}`}
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

          <div className="flex justify-end gap-4 items-center mt-4">
            <Button
              onClick={handlePrevPage}
              disabled={currPage === 1 ? true : false}
            >
              {/* &lt; */}
              Prev
            </Button>
            <Button
              onClick={handleNextPage}
              disabled={transactions.length <= currPage * itemsperPage}
            >
              {/* &gt; */}
              Next
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
