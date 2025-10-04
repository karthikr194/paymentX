import QuickAction from '../QuickAction';
import { ArrowUp } from 'lucide-react';

export default function QuickActionExample() {
  return (
    <div className="p-4">
      <QuickAction
        icon={ArrowUp}
        label="Top up"
        onClick={() => console.log('Top up clicked')}
      />
    </div>
  );
}
