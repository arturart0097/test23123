import { useState, type FC } from "react";
import { ShoppingCart, Wallet } from "lucide-react";
import { Button } from "./Button";
import { useNavigate } from "react-router";

interface Transaction {
  type: "purchased" | "spent";
  description: string;
  amount: number;
  date: string;
  time: string;
  status: "completed";
}

interface TransactionsTableProps {
  transactions: Transaction[];
  activeFilter?: "all" | "purchases" | "bonuses" | "usage";
}

export const TransactionsTable: FC<TransactionsTableProps> = ({
  transactions,
  activeFilter = "all",
}) => {
  return (
    <div className="w-full">
      {/* Table Header */}
      <div className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr] gap-4 px-6! py-4! text-[#6B7280] text-sm font-medium uppercase tracking-wider border-b border-t border-white/10">
        <div>Type</div>
        <div>Description</div>
        <div>Amount</div>
        <div>Date & Time</div>
        <div>Status</div>
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-white/5">
        {transactions.map((transaction, index) => (
          <div
            key={index}
            className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr] gap-4 px-6! py-5! items-center hover:bg-white/5 transition-colors"
          >
            {/* Type */}
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${transaction.type === "purchased"
                  ? "bg-purple-500/20"
                  : "bg-indigo-500/20"
                  }`}
              >
                {transaction.type === "purchased" ? (
                  <ShoppingCart className="w-5 h-5 text-purple-400" />
                ) : (
                  <Wallet className="w-5 h-5 text-indigo-400" />
                )}
              </div>
              <span className="text-white capitalize">
                {transaction.type}
              </span>
            </div>

            {/* Description */}
            <div className="text-[#9CA3AF]">{transaction.description}</div>

            {/* Amount */}
            <div
              className={`text-xl font-semibold ${transaction.amount > 0 ? "text-[#057DFF]" : "text-[#6760FF]"
                }`}
            >
              {transaction.amount > 0 ? "+" : ""}
              {transaction.amount}
            </div>

            {/* Date & Time */}
            <div className="text-[#9CA3AF]">
              <div>{transaction.date}</div>
              <div className="text-sm text-[#6B7280]">{transaction.time}</div>
            </div>

            {/* Status */}
            <div>
              <span className="px-4! py-1.5! text-sm font-medium rounded-full border-[0.599px]! border-[rgba(5,125,255,0.3)]! bg-[rgba(5,125,255,0.2)]! text-[#057DFF]!">
                {transaction.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};



export const TransactionHistory: FC = () => {
  const [activeFilter, setActiveFilter] = useState<"all" | "purchases" | "bonuses" | "usage">("all");
  const navigate = useNavigate()

  const mockTransactions = [
    {
      type: "purchased" as const,
      description: "Starter Pack Purchase",
      amount: 500,
      date: "2025-01-28",
      time: "14:32",
      status: "completed" as const,
    },
    {
      type: "spent" as const,
      description: 'Game Generation - "Space Adventure"',
      amount: -120,
      date: "2025-01-27",
      time: "09:15",
      status: "completed" as const,
    },
    {
      type: "spent" as const,
      description: "AI Code Optimization",
      amount: -85,
      date: "2025-01-26",
      time: "16:48",
      status: "completed" as const,
    },
    {
      type: "purchased" as const,
      description: "Starter Pack Purchase",
      amount: 50,
      date: "2025-01-26",
      time: "08:00",
      status: "completed" as const,
    },
    {
      type: "spent" as const,
      description: 'Game Generation - "Puzzle Master"',
      amount: -200,
      date: "2025-01-25",
      time: "11:23",
      status: "completed" as const,
    },
    {
      type: "purchased" as const,
      description: "Silver Pack Purchase",
      amount: 1000,
      date: "2025-01-24",
      time: "19:05",
      status: "completed" as const,
    },
  ];

  const filters = [
    { id: "all", label: "All Transactions" },
    { id: "purchases", label: "Purchases" },
    { id: "bonuses", label: "Bonuses" },
    { id: "usage", label: "Usage" },
  ];

  return (
    <div className="bg-[#FFFFFF0D] text-white py-8!">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8! px-8!">
          <h1 className="text-4xl font-bold">Transaction History</h1>
          <Button onClick={() => navigate("/dashboard/store")}>
            Buy Credits
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-8! px-8!">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id as any)}
              className={`px-6! py-2.5! rounded-lg font-medium transition-all ${activeFilter === filter.id
                ? "bg-[#1F2937] text-white border border-white/20"
                : "bg-transparent text-[#6B7280] hover:text-white"
                }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="rounded-2xl overflow-hidden">
          <TransactionsTable
            transactions={mockTransactions}
            activeFilter={activeFilter}
          />
        </div>
      </div>
    </div>
  );
};
