import { ChevronRight } from "lucide-react";

interface ContactItemProps {
  id: string;
  name: string;
  phone: string;
  avatarColor: string;
  onClick?: () => void;
}

export default function ContactItem({ id, name, phone, avatarColor, onClick }: ContactItemProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <button
      onClick={onClick}
      data-testid={`contact-${id}`}
      className="w-full flex items-center gap-3 p-3 rounded-xl hover-elevate active-elevate-2"
    >
      <div
        className={`flex-shrink-0 w-12 h-12 rounded-full ${avatarColor} flex items-center justify-center`}
      >
        <span className="text-white font-semibold">{initials}</span>
      </div>

      <div className="flex-1 text-left">
        <p className="text-base font-semibold text-foreground">{name}</p>
        <p className="text-sm text-muted-foreground">{phone}</p>
      </div>

      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </button>
  );
}
