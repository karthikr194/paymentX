import { useState } from "react";
import { Search, SlidersHorizontal, ShoppingBag, TrendingUp, Video, ShoppingCart, Home as HomeIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import TransactionItem from "@/components/TransactionItem";
import BottomNav from "@/components/BottomNav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Transaction } from "@shared/schema";

const merchantIcons: Record<string, React.ReactNode> = {
  "Walmart": <ShoppingBag className="h-6 w-6 text-blue-500" />,
  "Top up": <TrendingUp className="h-6 w-6 text-purple-500" />,
  "Netflix": <Video className="h-6 w-6 text-red-500" />,
  "Amazon": <ShoppingCart className="h-6 w-6 text-orange-500" />,
  "Nike": <ShoppingBag className="h-6 w-6 text-foreground" />,
  "The Home Depot": <HomeIcon className="h-6 w-6 text-orange-600" />,
};

export default function History() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return `Today ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
    } else if (days === 1) {
      return `Yesterday ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
    } else {
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
    }
  };

  const formatDateLong = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) + 
           ' - ' + 
           d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const getSection = (date: Date | string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days <= 7) return "This Week";
    return "Earlier";
  };

  const filteredTransactions = transactions.filter(tx =>
    tx.merchantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedTransactions = filteredTransactions.reduce((acc, transaction) => {
    const section = getSection(transaction.createdAt);
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(transaction);
    return acc;
  }, {} as Record<string, Transaction[]>);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="px-4 pt-8 pb-6">
        <div className="max-w-mobile mx-auto">
          <h1 className="text-2xl font-bold mb-6">History</h1>
          
          {/* Search and Filter */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search transactions"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search"
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              size="default"
              data-testid="button-filter"
              onClick={() => console.log("Filter clicked")}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="px-4">
        <div className="max-w-mobile mx-auto space-y-6">
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded-xl" />
              ))}
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No transactions found</p>
            </div>
          ) : (
            Object.entries(groupedTransactions).map(([section, txs]) => (
              <div key={section}>
                <h2 className="text-base font-medium text-muted-foreground mb-3">{section}</h2>
                <div className="space-y-2">
                  {txs.map((transaction) => (
                    <TransactionItem
                      key={transaction.id}
                      id={transaction.id}
                      merchantName={transaction.merchantName}
                      merchantIcon={merchantIcons[transaction.merchantName] || <ShoppingBag className="h-6 w-6 text-primary" />}
                      date={formatDate(transaction.createdAt)}
                      amount={`$${parseFloat(transaction.amount).toFixed(2)}`}
                      type={transaction.type as "debit" | "credit"}
                      onClick={() => setSelectedTransaction(transaction)}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Transaction Details Modal */}
      <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
        <DialogContent className="max-w-mobile">
          <DialogHeader>
            <DialogTitle className="sr-only">Transaction Details</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-6">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center">
                  {merchantIcons[selectedTransaction.merchantName] || <ShoppingBag className="h-8 w-8 text-primary" />}
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold">{selectedTransaction.merchantName}</h3>
                  <p className="text-sm text-muted-foreground">{selectedTransaction.description || "Transaction"}</p>
                </div>
              </div>

              <div className="text-center">
                <p className={`text-3xl font-bold ${selectedTransaction.type === "credit" ? "text-chart-2" : "text-destructive"}`}>
                  {selectedTransaction.type === "credit" ? "+" : "-"}${parseFloat(selectedTransaction.amount).toFixed(2)}
                </p>
              </div>

              <div className="bg-muted rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">{getSection(selectedTransaction.createdAt)}</span>
                  <span className="text-sm font-medium">{formatDateLong(selectedTransaction.createdAt)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Transaction no.</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono">{selectedTransaction.transactionNo}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      data-testid="button-copy-transaction"
                      onClick={() => {
                        navigator.clipboard.writeText(selectedTransaction.transactionNo);
                        console.log("Transaction number copied");
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                className="w-full text-destructive"
                data-testid="button-report-problem"
                onClick={() => console.log("Report problem")}
              >
                Report a problem
              </Button>

              <Button
                data-testid="button-done"
                className="w-full"
                onClick={() => setSelectedTransaction(null)}
              >
                Done
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}
