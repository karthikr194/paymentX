import { 
  Lightbulb, 
  ArrowLeftRight, 
  ArrowUp, 
  ArrowDown, 
  BarChart3,
  HelpCircle,
  MessageCircle,
  Info,
  ChevronRight,
  User
} from "lucide-react";
import { Link } from "wouter";
import BottomNav from "@/components/BottomNav";

const menuItems = [
  { 
    id: "profile", 
    icon: User, 
    label: "Profile", 
    color: "bg-purple-100 dark:bg-purple-900/30",
    iconColor: "text-purple-600",
    path: "/settings"
  },
  { 
    id: "pay-bills", 
    icon: Lightbulb, 
    label: "Pay bills", 
    color: "bg-purple-100 dark:bg-purple-900/30",
    iconColor: "text-purple-600",
    path: "#"
  },
  { 
    id: "transfer", 
    icon: ArrowLeftRight, 
    label: "Transfer", 
    color: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600",
    path: "/transfer"
  },
  { 
    id: "topup", 
    icon: ArrowUp, 
    label: "Topup", 
    color: "bg-green-100 dark:bg-green-900/30",
    iconColor: "text-green-600",
    path: "#"
  },
  { 
    id: "withdraw", 
    icon: ArrowDown, 
    label: "Withdraw", 
    color: "bg-red-100 dark:bg-red-900/30",
    iconColor: "text-red-600",
    path: "#"
  },
  { 
    id: "analytics", 
    icon: BarChart3, 
    label: "Analytics", 
    color: "bg-purple-100 dark:bg-purple-900/30",
    iconColor: "text-purple-600",
    path: "#"
  },
];

const supportItems = [
  { 
    id: "help", 
    icon: HelpCircle, 
    label: "Help", 
    color: "bg-yellow-100 dark:bg-yellow-900/30",
    iconColor: "text-yellow-600",
    path: "#"
  },
  { 
    id: "contact", 
    icon: MessageCircle, 
    label: "Contact us", 
    color: "bg-cyan-100 dark:bg-cyan-900/30",
    iconColor: "text-cyan-600",
    path: "#"
  },
  { 
    id: "about", 
    icon: Info, 
    label: "About", 
    color: "bg-purple-100 dark:bg-purple-900/30",
    iconColor: "text-purple-600",
    path: "#"
  },
];

export default function More() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-4 pt-8 pb-6">
        <div className="max-w-mobile mx-auto">
          <h1 className="text-2xl font-bold mb-6">More</h1>
        </div>
      </div>

      <div className="px-4">
        <div className="max-w-mobile mx-auto space-y-8">
          {/* Main Actions */}
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const content = (
                <button
                  data-testid={`button-${item.id}`}
                  onClick={() => console.log(`${item.label} clicked`)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover-elevate active-elevate-2"
                >
                  <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${item.iconColor}`} />
                  </div>
                  <span className="flex-1 text-left text-base font-semibold">{item.label}</span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </button>
              );

              return item.path !== "#" ? (
                <Link key={item.id} href={item.path}>
                  {content}
                </Link>
              ) : (
                <div key={item.id}>{content}</div>
              );
            })}
          </div>

          {/* Support Section */}
          <div className="space-y-2">
            {supportItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  data-testid={`button-${item.id}`}
                  onClick={() => console.log(`${item.label} clicked`)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover-elevate active-elevate-2"
                >
                  <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${item.iconColor}`} />
                  </div>
                  <span className="flex-1 text-left text-base font-semibold">{item.label}</span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
