import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Cards from "@/pages/Cards";
import History from "@/pages/History";
import CardPayment from "@/pages/CardPayment";
import Transfer from "@/pages/Transfer";
import More from "@/pages/More";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/cards" component={Cards} />
      <Route path="/history" component={History} />
      <Route path="/card-payment" component={CardPayment} />
      <Route path="/transfer" component={Transfer} />
      <Route path="/more" component={More} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
