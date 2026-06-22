import Link from "next/link";
import { ui } from "@/components/ui/ui";
import { NewBookingForm } from "@/components/bookings/NewBookingForm";

export const dynamic = "force-dynamic";

// Отримуємо динамічний список кімнат з нашої бази
async function getRooms() {
  try {
    const res = await fetch("http://localhost:5000/api/rooms", { cache: "no-store" });
    if (!res.ok) throw new Error("Помилка завантаження кімнат");
    return await res.json();
  } catch (error) {
    console.error("Не вдалося отримати кімнати з API:", error);
    return [];
  }
}

export default async function NewBookingPage() {
  const rooms = await getRooms();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Заголовок */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100 font-mono">
            <span className="text-cyan-500">+</span> Нове бронювання
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Резервування переговорної локації в базі даних терміналу.
          </p>
        </div>
      </div>

      {/* Контейнер форми */}
      <div className={`${ui.card} ${ui.cardPad} mt-6 border-t-2 border-t-cyan-500`}>
        {/* Рендеримо клієнтську форму, передаючи реальні кімнати */}
        <NewBookingForm rooms={rooms} />
      </div>
    </div>
  );
}