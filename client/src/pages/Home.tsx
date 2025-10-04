import { ArrowUp, ArrowDown, ArrowLeftRight, Settings, ShoppingBag, TrendingUp, Video, ShoppingCart, Home as HomeIcon } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import QuickAction from "@/components/QuickAction";
import TransactionItem from "@/components/TransactionItem";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import BottomNav from "@/components/BottomNav";
import type { User, Transaction } from "@shared/schema";

const merchantIcons: Record<string, React.ReactNode> = {
  "Walmart": <ShoppingBag className="h-6 w-6 text-blue-500" />,
  "Top up": <TrendingUp className="h-6 w-6 text-purple-500" />,
  "Netflix": <Video className="h-6 w-6 text-red-500" />,
  "Amazon": <ShoppingCart className="h-6 w-6 text-orange-500" />,
  "Nike": <ShoppingBag className="h-6 w-6 text-foreground" />,
  "The Home Depot": <HomeIcon className="h-6 w-6 text-orange-600" />,
};

const mockContacts = [
  { id: "1", name: "Ali", color: "bg-orange-500" },
  { id: "2", name: "Steve", color: "bg-pink-500" },
  { id: "3", name: "Ahmed", color: "bg-orange-600" },
  { id: "4", name: "Mike", color: "bg-yellow-500" },
];

export default function Home() {
  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  const { data: transactions = [], isLoading: transactionsLoading } = useQuery<Transaction[]>({
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

  const latestTransactions = transactions.slice(0, 3);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header with gradient */}
      <div className="bg-gradient-to-br from-purple-900 via-purple-700 to-purple-600 px-4 pt-8 pb-24">
        <div className="max-w-mobile mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12" data-testid="avatar-user">
                <AvatarFallback className="bg-purple-500 text-white font-semibold">
                  {user?.name.split(" ").map(n => n[0]).join("").toUpperCase() || "AG"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-white/80 text-sm">Hello,</p>
                <p className="text-white font-semibold text-base">
                  {user?.name.split(" ")[0] || "User"}!
                </p>
              </div>
            </div>
            <Link href="/settings">
              <button
                data-testid="button-settings"
                className="p-2 rounded-full hover-elevate active-elevate-2"
              >
                <Settings className="h-6 w-6 text-white" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Balance Card */}
      <div className="px-4 -mt-16 mb-6">
        <div className="max-w-mobile mx-auto">
          <div className="bg-card rounded-3xl p-6 shadow-xl border border-card-border">
            <p className="text-sm text-muted-foreground mb-2">Main balance</p>
            {userLoading ? (
              <div className="h-12 w-48 bg-muted animate-pulse rounded-md mb-6" />
            ) : (
              <p className="text-4xl font-bold font-mono mb-6" data-testid="text-balance">
                ${parseFloat(user?.balance || "0").toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            )}
            
            <div className="grid grid-cols-3 gap-4">
              <Link href="/transfer" className="flex flex-col items-center gap-2">
                <button
                  data-testid="button-topup"
                  className="w-full p-3 rounded-2xl hover-elevate active-elevate-2"
                >
                  <ArrowUp className="h-5 w-5 text-primary mx-auto mb-1" />
                  <span className="text-xs font-medium">Top up</span>
                </button>
              </Link>
              
              <button
                data-testid="button-withdraw"
                onClick={() => console.log("Withdraw clicked")}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl hover-elevate active-elevate-2"
              >
                <ArrowDown className="h-5 w-5 text-primary mx-auto mb-1" />
                <span className="text-xs font-medium">Withdraw</span>
              </button>
              
              <Link href="/transfer" className="flex flex-col items-center gap-2">
                <button
                  data-testid="button-transfer"
                  className="w-full p-3 rounded-2xl hover-elevate active-elevate-2"
                >
                  <ArrowLeftRight className="h-5 w-5 text-primary mx-auto mb-1" />
                  <span className="text-xs font-medium">Transfer</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transfers */}
      <div className="px-4 mb-6">
        <div className="max-w-mobile mx-auto">
          <h2 className="text-lg font-semibold mb-4">Recent Transfers</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            <Link href="/transfer">
              <button
                data-testid="button-add-contact"
                className="flex flex-col items-center gap-2 min-w-[70px]"
              >
                <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center hover-elevate active-elevate-2">
                  <span className="text-2xl text-foreground">+</span>
                </div>
                <span className="text-xs text-muted-foreground">Add</span>
              </button>
            </Link>
            {mockContacts.map((contact) => (
              <button
                key={contact.id}
                data-testid={`contact-${contact.name.toLowerCase()}`}
                onClick={() => console.log(`Transfer to ${contact.name}`)}
                className="flex flex-col items-center gap-2 min-w-[70px]"
              >
                <div
                  className={`w-14 h-14 rounded-full ${contact.color} flex items-center justify-center text-white font-semibold hover-elevate active-elevate-2`}
                >
                  {contact.name.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-xs text-muted-foreground">{contact.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Latest Transactions */}
      <div className="px-4">
        <div className="max-w-mobile mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Latest Transactions</h2>
            <Link href="/history">
              <button
                data-testid="link-view-all"
                className="text-sm text-primary font-medium hover-elevate active-elevate-2 px-2 py-1 rounded-md"
              >
                View all
              </button>
            </Link>
          </div>
          {transactionsLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {latestTransactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  id={transaction.id}
                  merchantName={transaction.merchantName}
                  merchantIcon={merchantIcons[transaction.merchantName] || <ShoppingBag className="h-6 w-6 text-primary" />}
                  date={formatDate(transaction.createdAt)}
                  amount={`$${parseFloat(transaction.amount).toFixed(2)}`}
                  type={transaction.type as "debit" | "credit"}
                  onClick={() => console.log(`Transaction ${transaction.id} clicked`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
