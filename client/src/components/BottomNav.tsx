import { Home, History, CreditCard, MoreHorizontal } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/history", icon: History, label: "History" },
    { path: "/cards", icon: CreditCard, label: "Cards" },
    { path: "/more", icon: MoreHorizontal, label: "More" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="max-w-mobile mx-auto flex items-center justify-around h-16 px-4">
        {navItems.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;
          return (
            <Link key={item.path} href={item.path}>
              <button
                data-testid={`nav-${item.label.toLowerCase()}`}
                className="flex flex-col items-center justify-center gap-1 min-w-[60px] hover-elevate active-elevate-2 rounded-md py-2"
              >
                <Icon
                  className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`}
                />
                <span
                  className={`text-xs ${isActive ? "text-primary font-semibold" : "text-muted-foreground"}`}
                >
                  {item.label}
                </span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
