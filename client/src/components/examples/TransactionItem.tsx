import TransactionItem from '../TransactionItem';
import { ShoppingBag } from 'lucide-react';

export default function TransactionItemExample() {
  return (
    <div className="p-4 max-w-md">
      <TransactionItem
        id="1"
        merchantName="Walmart"
        merchantIcon={<ShoppingBag className="h-6 w-6 text-primary" />}
        date="Today 12:32"
        amount="$35.23"
        type="debit"
      />
    </div>
  );
}
