import { LucideIcon } from "lucide-react";

interface QuickActionProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  testId?: string;
}

export default function QuickAction({ icon: Icon, label, onClick, testId }: QuickActionProps) {
  return (
    <button
      onClick={onClick}
      data-testid={testId}
      className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-card hover-elevate active-elevate-2 border border-card-border"
    >
      <Icon className="h-6 w-6 text-primary" />
      <span className="text-sm font-medium text-foreground">{label}</span>
    </button>
  );
}
