import { useState } from "react";
import { ArrowLeft, Wifi, QrCode } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import WalletCard from "@/components/WalletCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Card } from "@shared/schema";

export default function CardPayment() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);

  const { data: cards = [], isLoading } = useQuery<Card[]>({
    queryKey: ["/api/cards"],
  });

  const paymentMutation = useMutation({
    mutationFn: async (data: { cardId: string; merchantName: string; amount: string }) => {
      return apiRequest("POST", "/api/nfc-payment", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      toast({
        title: "Payment successful",
        description: "Your payment has been processed",
      });
      setTimeout(() => {
        setLocation("/");
      }, 1500);
    },
    onError: () => {
      toast({
        title: "Payment failed",
        description: "Please try again",
        variant: "destructive",
      });
      setIsScanning(false);
    },
  });

  const handleNFCPayment = () => {
    if (cards.length === 0 || isScanning || paymentMutation.isPending) return;
    
    setIsScanning(true);
    
    setTimeout(() => {
      const selectedCard = cards[cards.length - 1];
      const randomAmount = (Math.random() * 50 + 10).toFixed(2);
      const merchants = ["Coffee Shop", "Gas Station", "Grocery Store", "Restaurant"];
      const merchant = merchants[Math.floor(Math.random() * merchants.length)];
      
      paymentMutation.mutate({
        cardId: selectedCard.id,
        merchantName: merchant,
        amount: randomAmount,
      });
    }, 2000);
  };

  const handleQRPayment = () => {
    if (cards.length === 0 || isScanning || paymentMutation.isPending) return;
    
    setIsScanning(true);
    console.log("QR Pay clicked");
    
    setTimeout(() => {
      const selectedCard = cards[cards.length - 1];
      const randomAmount = (Math.random() * 100 + 20).toFixed(2);
      
      paymentMutation.mutate({
        cardId: selectedCard.id,
        merchantName: "QR Payment",
        amount: randomAmount,
      });
    }, 1500);
  };

  const selectedCard = cards.length > 0 ? cards[cards.length - 1] : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="px-4 pt-8 pb-6">
          <div className="max-w-mobile mx-auto">
            <div className="h-8 w-16 bg-muted animate-pulse rounded-md" />
          </div>
        </div>
        <div className="px-4 mb-12">
          <div className="max-w-mobile mx-auto">
            <div className="h-64 bg-muted animate-pulse rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!selectedCard) {
    return (
      <div className="min-h-screen bg-background">
        <div className="px-4 pt-8 pb-6">
          <div className="max-w-mobile mx-auto">
            <Link href="/cards">
              <button data-testid="button-back" className="flex items-center gap-2 text-primary font-medium hover-elevate active-elevate-2 px-2 py-1 -ml-2 rounded-md">
                <ArrowLeft className="h-5 w-5" />
                Back
              </button>
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">No cards available</p>
            <Link href="/cards">
              <Button>Add a card</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-4 pt-8 pb-6">
        <div className="max-w-mobile mx-auto">
          <Link href="/cards">
            <button data-testid="button-back" className="flex items-center gap-2 text-primary font-medium hover-elevate active-elevate-2 px-2 py-1 -ml-2 rounded-md">
              <ArrowLeft className="h-5 w-5" />
              Back
            </button>
          </Link>
        </div>
      </div>

      {/* Card Display */}
      <div className="px-4 mb-12">
        <div className="max-w-mobile mx-auto">
          <WalletCard
            holderName={selectedCard.holderName}
            cardNumber={selectedCard.cardNumber}
            balance={`$${parseFloat(selectedCard.balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            gradient={selectedCard.gradient}
          />
        </div>
      </div>

      {/* NFC Animation */}
      <div className="px-4 mb-12">
        <div className="max-w-mobile mx-auto flex flex-col items-center justify-center py-12">
          <button
            onClick={handleNFCPayment}
            disabled={isScanning || paymentMutation.isPending}
            className="relative mb-8 hover-elevate active-elevate-2 rounded-full"
            data-testid="button-nfc-scan"
          >
            {/* Pulsing rings */}
            {(isScanning || paymentMutation.isPending) && (
              <>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full border-2 border-primary/30 animate-pulse-ring" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center" style={{ animationDelay: '0.5s' }}>
                  <div className="w-32 h-32 rounded-full border-2 border-primary/30 animate-pulse-ring" />
                </div>
              </>
            )}
            
            {/* NFC Icon */}
            <div className="relative w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
              <Wifi className="h-12 w-12 text-primary rotate-90" />
            </div>
          </button>
          
          <p className="text-lg text-muted-foreground text-center">
            {isScanning 
              ? "Scanning..." 
              : paymentMutation.isPending 
              ? "Processing payment..." 
              : "Tap icon or move near a device to pay"}
          </p>
        </div>
      </div>

      {/* QR Pay Button */}
      <div className="px-4 fixed bottom-8 left-0 right-0">
        <div className="max-w-mobile mx-auto">
          <Button
            data-testid="button-qr-pay"
            className="w-full bg-primary text-primary-foreground py-6 text-lg font-semibold"
            onClick={handleQRPayment}
            disabled={isScanning || paymentMutation.isPending}
          >
            <QrCode className="h-6 w-6 mr-3" />
            {isScanning || paymentMutation.isPending ? "Processing..." : "QR Pay"}
          </Button>
        </div>
      </div>
    </div>
  );
}
