import Link from "next/link";
import { ui } from "@/components/ui/ui";

// 1. Описуємо структуру об'єкта кімнати з бази даних
interface Room {
  id: number;
  name: string;
  capacity: number;
  equipment: string | null;
  location: string;
}

// 2. Типізуємо пропси компонента
interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  return (
    <div className={`${ui.card} ${ui.cardPad} flex flex-col justify-between font-mono text-xs border-l-2 border-l-cyan-500`}>
      <div>
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-slate-100">{room.name}</h2>
            <p className="text-[10px] text-slate-500 mt-0.5">{room.location}</p>
          </div>
          <span className="inline-flex items-center rounded bg-cyan-500/10 px-2 py-1 text-[10px] font-bold text-cyan-400 border border-cyan-500/20 whitespace-nowrap">
            CAPACITY: {room.capacity}
          </span>
        </div>
        
        <div className="mt-4">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">// Обладнання:</span>
          <p className="mt-1 text-slate-300 text-[11px] leading-relaxed">
            {room.equipment || "Відсутнє"}
          </p>
        </div>
      </div>

      <div className="mt-5 border-t border-slate-900 pt-3 flex justify-end">
        <Link
          href={`/bookings/new?roomId=${room.id}`}
          className="text-[11px] font-bold text-cyan-500 hover:text-cyan-400 transition-colors"
        >
          [ Забронювати зал ] &rarr;
        </Link>
      </div>
    </div>
  );
}