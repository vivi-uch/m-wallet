import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import Receipt from "../components/Receipt";
import { getUserById, getAllTransactions, getBanks } from "../utils/api";
import {
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownLeft,
  Send,
  Smartphone,
  FileText,
  ChevronLeft,
  ChevronRight,
  Wallet,
  Clock,
  ArrowUpDown,
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [walletBalance, setWalletBalance] = useState(0);
  const [username, setUsername] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [userbank, setUserBank] = useState("");
  const [bankcodes, setBankCodes] = useState();
  const [showBalance, setShowBalance] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

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
        (trans) => trans.senderId === userId || trans.receiverId === userId,
      );
      setTransactions(userTransactions);
    });
  }, []);

  const visibleTransactions = useMemo(() => {
    const start = (currPage - 1) * itemsperPage;
    const end = start + itemsperPage;
    const sorted = [...transactions].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );
    return sorted.slice(start, end);
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 sm:px-6 lg:px-8 py-8 relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pb-2">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
              Welcome back
            </p>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Hello, {username}!
            </h1>
          </div>

          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm self-start sm:self-auto">
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-xs">
              {chosenBank
                ? chosenBank.name.substring(0, 2).toUpperCase()
                : "MW"}
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {chosenBank ? chosenBank.name : "Wallet Account"}
              </p>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 tracking-medium">
                {accountNumber || "---- ---- ----"}
              </p>
            </div>
          </div>
        </div>

        <Card className="bg-linear-to-br from-purple-900 via-purple-950 to-slate-950 text-white border-0 shadow-xl shadow-purple-950/10 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none translate-x-8 -translate-y-8" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex gap-2 items-center text-purple-200/60">
                <Wallet className="w-4 h-4" />
                <p className="text-xs font-bold uppercase tracking-wider">
                  Total Available Balance
                </p>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-1 rounded-md hover:bg-white/10 text-purple-200/80 transition-colors"
                >
                  {showBalance ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="text-3xl sm:text-4xl font-black tracking-tight font-mono">
                {showBalance ? (
                  <span className="tracking-widest">••••••</span>
                ) : (
                  `₦${Number(walletBalance).toLocaleString()}`
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 w-full md:w-auto">
              <button
                onClick={() => navigate("/transfer")}
                className="flex flex-col items-center justify-center gap-1.5 bg-white/10 hover:bg-white/15 active:scale-[0.97] transition-all p-3 rounded-xl border border-white/10 text-xs font-medium backdrop-blur-sm"
              >
                <Send className="w-4 h-4 text-purple-300" />
                <span>Transfer</span>
              </button>
              <button
                onClick={() => navigate("/airtime")}
                className="flex flex-col items-center justify-center gap-1.5 bg-white/10 hover:bg-white/15 active:scale-[0.97] transition-all p-3 rounded-xl border border-white/10 text-xs font-medium backdrop-blur-sm"
              >
                <Smartphone className="w-4 h-4 text-purple-300" />
                <span>Airtime</span>
              </button>
              <button
                onClick={() => navigate("/bills")}
                className="flex flex-col items-center justify-center gap-1.5 bg-white/10 hover:bg-white/15 active:scale-[0.97] transition-all p-3 rounded-xl border border-white/10 text-xs font-medium backdrop-blur-sm"
              >
                <FileText className="w-4 h-4 text-purple-300" />
                <span>Bills</span>
              </button>
            </div>
          </div>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-md rounded-2xl p-5 sm:p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Transaction History
              </h3>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {transactions.length} total
            </span>
          </div>

          {transactions.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              <ArrowUpDown className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                No transaction activities recorded yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {visibleTransactions.map((transaction) => {
                const isDebit =
                  transaction.senderId === sessionStorage.getItem("userId");
                const descName = isDebit
                  ? transaction.receiverName
                  : transaction.senderName;

                return (
                  <div
                    key={transaction.id}
                    onClick={() => setSelectedTransaction(transaction)}
                    className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-900 rounded-xl hover:border-purple-500/30 dark:hover:border-purple-500/20 transition-colors duration-150 cursor-pointer active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                          isDebit
                            ? "bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-950/40 text-rose-600 dark:text-rose-400"
                            : "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        {isDebit ? (
                          <ArrowUpRight className="w-5 h-5" />
                        ) : (
                          <ArrowDownLeft className="w-5 h-5" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate capitalize">
                          {transaction.type} {isDebit ? "to" : "from"}{" "}
                          {descName || "Unknown"}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                          {new Date(transaction.date).toLocaleDateString(
                            undefined,
                            {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 pl-4">
                      <p
                        className={`text-base font-bold font-mono tracking-tight ${
                          isDebit
                            ? "text-rose-600 dark:text-rose-400"
                            : "text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        {isDebit ? "-" : "+"}₦
                        {Number(transaction.amount).toLocaleString()}
                      </p>
                      <span
                        className={`inline-block text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded mt-0.5 ${
                          transaction.status?.toLowerCase() === "success" ||
                          transaction.status?.toLowerCase() === "successful"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : transaction.status?.toLowerCase() === "failed"
                              ? "bg-rose-500/10 text-rose-500"
                              : "bg-amber-500/10 text-amber-500"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex justify-end items-center gap-2 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/60">
            <button
              onClick={handlePrevPage}
              disabled={currPage === 1}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-2 select-none">
              Page {currPage} of{" "}
              {Math.max(1, Math.ceil(transactions.length / itemsperPage))}
            </span>
            <button
              onClick={handleNextPage}
              disabled={transactions.length <= currPage * itemsperPage}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </Card>
      </div>

      {selectedTransaction && (
        <Receipt
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
