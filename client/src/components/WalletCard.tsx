import { Wifi } from "lucide-react";

interface WalletCardProps {
  holderName: string;
  cardNumber: string;
  balance: string;
  gradient?: string;
  className?: string;
}

export default function WalletCard({
  holderName,
  cardNumber,
  balance,
  gradient = "from-purple-700 via-purple-600 to-purple-500",
  className = "",
}: WalletCardProps) {
  return (
    <div
      className={`relative w-full aspect-[1.6/1] rounded-3xl bg-gradient-to-br ${gradient} p-6 text-white shadow-2xl ${className}`}
      data-testid="wallet-card"
    >
      {/* Decorative circles */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl">
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full border-2 border-white/20" />
        <div className="absolute -top-10 -right-10 w-60 h-60 rounded-full border-2 border-white/20" />
      </div>

      {/* Card content */}
      <div className="relative h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium opacity-90">{holderName}</p>
          </div>
          <p className="text-sm font-mono font-medium">****{cardNumber.slice(-4)}</p>
        </div>

        <div>
          <p className="text-xs opacity-75 mb-1">Balance</p>
          <p className="text-3xl font-bold font-mono">{balance}</p>
        </div>

        {/* NFC Icon */}
        <div className="absolute bottom-6 right-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-3">
            <Wifi className="h-6 w-6 rotate-90" />
          </div>
        </div>
      </div>
    </div>
  );
}
