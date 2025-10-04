import { useState } from "react";
import { ArrowLeft, Plus, Search, Shield } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import ContactItem from "@/components/ContactItem";
import NumericKeypad from "@/components/NumericKeypad";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Contact } from "@shared/schema";

export default function Transfer() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState<"select" | "amount" | "confirm">("select");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [amount, setAmount] = useState("$00.00");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: contacts = [], isLoading } = useQuery<Contact[]>({
    queryKey: ["/api/contacts"],
  });

  const transferMutation = useMutation({
    mutationFn: async (data: { contactId: string; amount: string }) => {
      return apiRequest("POST", "/api/transfers", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      toast({
        title: "Transfer successful",
        description: `$${amount.replace(/[$,]/g, "")} sent to ${selectedContact?.name}`,
      });
      setLocation("/");
    },
    onError: () => {
      toast({
        title: "Transfer failed",
        description: "Please try again",
        variant: "destructive",
      });
    },
  });

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
    setStep("amount");
    console.log("Contact selected:", contact.name);
  };

  const handleNumberClick = (num: string) => {
    if (amount === "$00.00") {
      setAmount(`$${num}.00`);
    } else {
      const cleanAmount = amount.replace(/[$,]/g, "");
      const parts = cleanAmount.split(".");
      const cents = parts[1] || "00";
      
      if (cents === "00") {
        setAmount(`$${parts[0]}${num}.00`);
      } else if (cents.length === 1) {
        setAmount(`$${parts[0]}.${cents}${num}`);
      } else {
        const newWhole = parts[0] + cents[0];
        setAmount(`$${newWhole}.${cents[1]}${num}`);
      }
    }
  };

  const handleDelete = () => {
    const cleanAmount = amount.replace(/[$,]/g, "");
    if (cleanAmount === "00.00" || cleanAmount === "0.00") return;
    
    const parts = cleanAmount.split(".");
    const whole = parts[0];
    const cents = parts[1] || "00";
    
    if (cents[1] !== "0") {
      setAmount(`$${whole}.${cents[0]}0`);
    } else if (cents[0] !== "0") {
      setAmount(`$${whole}.00`);
    } else if (whole.length > 1) {
      setAmount(`$${whole.slice(0, -1)}.00`);
    } else {
      setAmount(`$0.00`);
    }
  };

  const handleAmountDone = () => {
    const numAmount = parseFloat(amount.replace(/[$,]/g, ""));
    if (numAmount > 0) {
      setStep("confirm");
      console.log("Amount entered:", amount);
    }
  };

  const handleSecurePayment = () => {
    if (!selectedContact) return;
    const numAmount = parseFloat(amount.replace(/[$,]/g, ""));
    transferMutation.mutate({
      contactId: selectedContact.id,
      amount: numAmount.toFixed(2),
    });
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  );

  if (step === "confirm" && selectedContact) {
    return (
      <div className="min-h-screen bg-background">
        <div className="px-4 pt-8 pb-6">
          <div className="max-w-mobile mx-auto">
            <button
              data-testid="button-back"
              onClick={() => setStep("amount")}
              className="flex items-center gap-2 text-primary font-medium hover-elevate active-elevate-2 px-2 py-1 -ml-2 rounded-md mb-6"
            >
              <ArrowLeft className="h-5 w-5" />
              Back
            </button>
            <h1 className="text-2xl font-bold text-center mb-12">Transfer to</h1>
          </div>
        </div>

        <div className="px-4">
          <div className="max-w-mobile mx-auto space-y-8">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className={`${selectedContact.avatarColor} text-white text-2xl font-semibold`}>
                  {selectedContact.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <p className="text-xl font-semibold">{selectedContact.name}</p>
                <p className="text-sm text-muted-foreground">{selectedContact.phone}</p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Enter Amount</p>
              <p className="text-5xl font-bold font-mono" data-testid="text-amount">{amount}</p>
              <div className="w-32 h-1 bg-primary mx-auto mt-4" />
            </div>
          </div>
        </div>

        <div className="px-4 fixed bottom-8 left-0 right-0">
          <div className="max-w-mobile mx-auto">
            <Button
              data-testid="button-secure-payment"
              className="w-full bg-chart-3 text-black hover:bg-chart-3/90 py-6 text-lg font-semibold"
              onClick={handleSecurePayment}
              disabled={transferMutation.isPending}
            >
              <Shield className="h-6 w-6 mr-3" />
              {transferMutation.isPending ? "Processing..." : "Secure payment"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "amount" && selectedContact) {
    return (
      <div className="min-h-screen bg-background">
        <div className="px-4 pt-8 pb-6">
          <div className="max-w-mobile mx-auto">
            <button
              data-testid="button-back"
              onClick={() => {
                setStep("select");
                setAmount("$00.00");
              }}
              className="flex items-center gap-2 text-primary font-medium hover-elevate active-elevate-2 px-2 py-1 -ml-2 rounded-md mb-6"
            >
              <ArrowLeft className="h-5 w-5" />
              Back
            </button>
            <h1 className="text-2xl font-bold text-center mb-12">Transfer to</h1>
          </div>
        </div>

        <div className="px-4 mb-8">
          <div className="max-w-mobile mx-auto">
            <div className="flex flex-col items-center gap-4 mb-12">
              <Avatar className="h-20 w-20">
                <AvatarFallback className={`${selectedContact.avatarColor} text-white text-2xl font-semibold`}>
                  {selectedContact.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <p className="text-xl font-semibold">{selectedContact.name}</p>
                <p className="text-sm text-muted-foreground">{selectedContact.phone}</p>
              </div>
            </div>

            <div className="text-center mb-12">
              <p className="text-sm text-muted-foreground mb-4">Enter Amount</p>
              <p className="text-5xl font-bold font-mono text-foreground mb-2" data-testid="text-amount">
                {amount}
              </p>
              <div className="w-48 h-1 bg-primary mx-auto" />
            </div>

            <NumericKeypad onNumberClick={handleNumberClick} onDelete={handleDelete} />

            <div className="mt-8">
              <Button
                data-testid="button-done"
                className="w-full bg-primary py-6 text-lg font-semibold"
                onClick={handleAmountDone}
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-4 pt-8 pb-6">
        <div className="max-w-mobile mx-auto">
          <Link href="/">
            <button data-testid="button-back" className="flex items-center gap-2 text-primary font-medium hover-elevate active-elevate-2 px-2 py-1 -ml-2 rounded-md mb-6">
              <ArrowLeft className="h-5 w-5" />
              Back
            </button>
          </Link>
          <h1 className="text-2xl font-bold mb-6">Transfer to</h1>
        </div>
      </div>

      <div className="px-4">
        <div className="max-w-mobile mx-auto space-y-6">
          <button
            data-testid="button-new-contact"
            onClick={() => console.log("New contact clicked")}
            className="w-full flex items-center gap-3 p-4 rounded-xl hover-elevate active-elevate-2"
          >
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <span className="text-base font-semibold">New contact</span>
          </button>

          <div className="text-center text-sm text-muted-foreground py-2">or</div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search contact"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search-contact"
              className="pl-10"
            />
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded-xl" />
              ))}
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No contacts found</p>
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-sm font-medium text-muted-foreground mb-3">All contacts</h2>
                <div className="space-y-2">
                  {filteredContacts.map((contact) => (
                    <ContactItem
                      key={contact.id}
                      id={contact.id}
                      name={contact.name}
                      phone={contact.phone}
                      avatarColor={contact.avatarColor}
                      onClick={() => handleContactSelect(contact)}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
