import { Delete } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NumericKeypadProps {
  onNumberClick: (num: string) => void;
  onDelete: () => void;
}

export default function NumericKeypad({ onNumberClick, onDelete }: NumericKeypadProps) {
  const numbers = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    [".", "0", "delete"],
  ];

  return (
    <div className="w-full max-w-sm mx-auto">
      {numbers.map((row, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-3 gap-4 mb-4">
          {row.map((item) => (
            <Button
              key={item}
              variant="ghost"
              size="lg"
              data-testid={`keypad-${item}`}
              onClick={() => (item === "delete" ? onDelete() : onNumberClick(item))}
              className="h-14 text-2xl font-medium hover-elevate active-elevate-2"
            >
              {item === "delete" ? <Delete className="h-6 w-6" /> : item}
            </Button>
          ))}
        </div>
      ))}
    </div>
  );
}
