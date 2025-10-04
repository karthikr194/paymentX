import { ChevronRight } from "lucide-react";

interface TransactionItemProps {
  id: string;
  merchantName: string;
  merchantIcon: React.ReactNode;
  date: string;
  amount: string;
  type: "debit" | "credit";
  onClick?: () => void;
}

export default function TransactionItem({
  id,
  merchantName,
  merchantIcon,
  date,
  amount,
  type,
  onClick,
}: TransactionItemProps) {
  const amountColor = type === "credit" ? "text-chart-2" : "text-destructive";

  return (
    <button
      onClick={onClick}
      data-testid={`transaction-${id}`}
      className="w-full flex items-center gap-3 p-3 rounded-xl hover-elevate active-elevate-2"
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-background flex items-center justify-center">
        {merchantIcon}
      </div>
      
      <div className="flex-1 text-left">
        <p className="text-base font-semibold text-foreground">{merchantName}</p>
        <p className="text-sm text-muted-foreground">{date}</p>
      </div>

      <div className="flex items-center gap-2">
        <p className={`text-base font-semibold ${amountColor}`}>
          {type === "credit" ? "+" : "-"}{amount}
        </p>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </button>
  );
}
