import { useState } from "react";
import { Plus, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import WalletCard from "@/components/WalletCard";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import type { Card } from "@shared/schema";

export default function Cards() {
  const { data: cards = [], isLoading } = useQuery<Card[]>({
    queryKey: ["/api/cards"],
  });

  const [selectedCardIndex, setSelectedCardIndex] = useState(cards.length > 0 ? cards.length - 1 : 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="px-4 pt-8 pb-6">
          <div className="max-w-mobile mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="h-8 w-32 bg-muted animate-pulse rounded-md" />
              <div className="h-8 w-24 bg-muted animate-pulse rounded-md" />
            </div>
          </div>
        </div>
        <div className="px-4">
          <div className="max-w-mobile mx-auto">
            <div className="h-64 bg-muted animate-pulse rounded-3xl" />
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="px-4 pt-8 pb-6">
        <div className="max-w-mobile mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">My Cards</h1>
            <Button
              data-testid="button-add-card"
              variant="ghost"
              size="sm"
              className="text-primary font-medium"
              onClick={() => console.log("Add card clicked")}
            >
              Add card +
            </Button>
          </div>
        </div>
      </div>

      {/* Stacked Cards */}
      <div className="px-4 mb-8">
        <div className="max-w-mobile mx-auto">
          {cards.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No cards added yet</p>
              <Button onClick={() => console.log("Add first card")}>
                <Plus className="h-4 w-4 mr-2" />
                Add your first card
              </Button>
            </div>
          ) : (
            <div className="relative" style={{ height: "280px" }}>
              {cards.map((card, index) => {
                const offset = (cards.length - 1 - index) * 12;
                const isSelected = index === selectedCardIndex;
                const scale = isSelected ? 1 : 0.95;
                
                return (
                  <button
                    key={card.id}
                    data-testid={`card-${card.id}`}
                    onClick={() => setSelectedCardIndex(index)}
                    className="absolute w-full transition-all duration-300 ease-out"
                    style={{
                      top: `${offset}px`,
                      zIndex: index,
                      transform: `scale(${scale})`,
                      opacity: isSelected ? 1 : 0.7,
                    }}
                  >
                    <WalletCard
                      holderName={card.holderName}
                      cardNumber={card.cardNumber}
                      balance={`$${parseFloat(card.balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                      gradient={card.gradient}
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Card Actions */}
      {cards.length > 0 && (
        <div className="px-4">
          <div className="max-w-mobile mx-auto">
            <div className="bg-card rounded-2xl p-4 border border-card-border">
              <h3 className="text-sm font-semibold mb-4">Card Actions</h3>
              <div className="space-y-2">
                <Link href="/card-payment">
                  <Button
                    data-testid="button-pay-now"
                    className="w-full justify-start"
                    variant="ghost"
                  >
                    Pay with this card
                  </Button>
                </Link>
                <Button
                  data-testid="button-freeze-card"
                  className="w-full justify-start"
                  variant="ghost"
                  onClick={() => console.log("Freeze card clicked")}
                >
                  Freeze card
                </Button>
                <Button
                  data-testid="button-card-settings"
                  className="w-full justify-start"
                  variant="ghost"
                  onClick={() => console.log("Card settings clicked")}
                >
                  Card settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
