import React from "react";
import Card from "./Card";
import {
  X,
  CheckCircle2,
  Copy,
  Share2,
  ArrowUpRight,
  ArrowDownLeft,
  Smartphone,
  Zap,
  Droplet,
  Tv,
  FileText,
  Building2,
  Hash,
  User,
  Calendar,
  CreditCard,
  ClipboardCheck,
} from "lucide-react";
import { toast } from "react-toastify";

const typeConfig = {
  transfer: {
    icon: ArrowUpRight,
    label: "Transfer",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-950/40",
  },
  airtime: {
    icon: Smartphone,
    label: "Airtime",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/40",
  },
  electricity: {
    icon: Zap,
    label: "Electricity",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/40",
  },
  water: {
    icon: Droplet,
    label: "Water",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/40",
  },
  tv: {
    icon: Tv,
    label: "TV & Cable",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-950/40",
  },
};

const Receipt = ({
  transaction,
  balanceAfter,
  onClose,
  onDone,
}) => {
  if (!transaction) return null;

  const config = typeConfig[transaction.type] || typeConfig.transfer;
  const TypeIcon = config.icon;

  const formattedDate = new Date(transaction.date).toLocaleDateString("en-NG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = new Date(transaction.date).toLocaleTimeString("en-NG", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const formatAmount = (amt) =>
    `₦${Number(amt).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const receiptText = `
M-WALLET RECEIPT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Transaction ID: ${transaction.id}
Type: ${config.label}
Date: ${formattedDate}
Time: ${formattedTime}
Status: ${transaction.status?.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
From: ${transaction.senderName || "N/A"}
${transaction.receiverName ? `To: ${transaction.receiverName}` : ""}
${transaction.bank ? `Bank: ${transaction.bank}` : ""}
${transaction.accountNum ? `Account: ${transaction.accountNum}` : ""}
${transaction.network ? `Network: ${transaction.network}` : ""}
${transaction.narration ? `Note: ${transaction.narration}` : ""}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Amount: ${formatAmount(transaction.amount)}
${balanceAfter != null ? `Balance After: ${formatAmount(balanceAfter)}` : ""}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `.trim();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(receiptText);
      toast.success("Receipt copied to clipboard");
    } catch {
      toast.error("Failed to copy receipt");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${config.label} Receipt - M-Wallet`,
          text: receiptText,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          handleCopy();
        }
      }
    } else {
      handleCopy();
    }
  };

  const detailRows = [
    {
      icon: ClipboardCheck,
      label: "Transaction ID",
      value: transaction.id,
      mono: true,
    },
    {
      icon: Calendar,
      label: "Date & Time",
      value: `${formattedDate} • ${formattedTime}`,
    },
    {
      icon: User,
      label: "From",
      value: transaction.senderName || "N/A",
    },
    ...(transaction.receiverName
      ? [
          {
            icon: transaction.type === "airtime" ? Smartphone : User,
            label: transaction.type === "airtime" ? "Phone Number" : "To",
            value: transaction.receiverName,
          },
        ]
      : []),
    ...(transaction.bank
      ? [
          {
            icon: Building2,
            label: "Bank",
            value: transaction.bank,
          },
        ]
      : []),
    ...(transaction.accountNum
      ? [
          {
            icon: Hash,
            label: "Account Number",
            value: transaction.accountNum,
            mono: true,
          },
        ]
      : []),
    ...(transaction.network
      ? [
          {
            icon: Smartphone,
            label: "Network",
            value: transaction.network,
          },
        ]
      : []),
    ...(transaction.narration
      ? [
          {
            icon: FileText,
            label: "Description",
            value: transaction.narration,
          },
        ]
      : []),
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg relative transform transition-all duration-200 animate-in zoom-in-95">
        <div className="absolute top-[-10%] left-[-10%] w-72 h-72 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-2xl rounded-2xl p-6 sm:p-8 overflow-hidden relative z-10">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-4 mb-6">
            <button
              onClick={onClose || onDone}
              className="group flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors uppercase tracking-wider"
            >
              <X className="w-3.5 h-3.5" />
              <span>Close</span>
            </button>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-full uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Successful</span>
            </div>
          </div>

          <div className="text-center space-y-2 mb-6">
            <div className={`w-14 h-14 rounded-full ${config.bg} flex items-center justify-center mx-auto ${config.color}`}>
              <TypeIcon className="w-7 h-7" />
            </div>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              {config.label} Successful
            </p>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
              {formatAmount(transaction.amount)}
            </h2>
            {balanceAfter != null && (
              <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 pt-1">
                <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                <span>Balance after: {formatAmount(balanceAfter)}</span>
              </div>
            )}
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-900 rounded-2xl p-4 space-y-3.5">
            {detailRows.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  className="flex items-start justify-between gap-4 text-xs"
                  key={item.label}
                >
                  <span className="font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap pt-0.5 flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    {item.label}
                  </span>
                  <span
                    className={`font-bold text-slate-800 dark:text-slate-200 text-right break-all max-w-[70%] ${
                      item.mono ? "font-mono text-[11px]" : ""
                    }`}
                  >
                    {item.value}
                  </span>
                </div>
              );
            })}

            <div className="flex items-start justify-between gap-4 text-xs">
              <span className="font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap pt-0.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                Status
              </span>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 text-[11px] uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full">
                {transaction.status}
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3.5">
            <button
              onClick={handleShare}
              className="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-3.5 px-4 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 text-sm tracking-wide uppercase flex items-center justify-center gap-1.5"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button
              onClick={handleCopy}
              className="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-3.5 px-4 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 text-sm tracking-wide uppercase flex items-center justify-center gap-1.5"
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
          </div>

          {onDone && (
            <button
              onClick={onDone}
              className="mt-3.5 w-full bg-linear-to-r from-purple-600 to-indigo-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-purple-600/20 hover:from-purple-700 hover:to-indigo-700 hover:shadow-purple-700/30 transition-all duration-200 text-sm tracking-wide uppercase"
            >
              Done
            </button>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Receipt;
