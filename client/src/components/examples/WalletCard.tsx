import WalletCard from '../WalletCard';

export default function WalletCardExample() {
  return (
    <div className="p-4 max-w-md">
      <WalletCard
        holderName="Abdullah Ghatasheh"
        cardNumber="3245"
        balance="$2,354"
        gradient="from-purple-900 via-purple-700 to-purple-600"
      />
    </div>
  );
}
