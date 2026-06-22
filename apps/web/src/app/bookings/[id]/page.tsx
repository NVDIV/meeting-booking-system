import Link from "next/link";
import { use } from "react";
import { ui } from "@/components/ui/ui";
import { BookingCard } from "@/components/bookings/BookingCard";

export const dynamic = "force-dynamic";

async function getBookingDetails(id: string) {
  try {
    const res = await fetch(`http://localhost:5000/api/bookings`, { 
      cache: "no-store" 
    });
    
    if (!res.ok) return null;
    
    const allBookings = await res.json();
    return allBookings.find((b: any) => String(b.id) === String(id)) || null;
  } catch (error) {
    console.error("Помилка API:", error);
    return null;
  }
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function BookingDetailsPage({ params }: PageProps) {
  // Використовуємо офіційний React.use() для миттєвого розпакування без підвисання компілятора
  const { id } = use(params);

  const booking = use(getBookingDetails(id));

  if (!booking) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center font-mono">
        <h1 className="text-xl font-bold text-red-500">&gt; Помилка: Бронювання #{id} не знайдено</h1>
        <Link href="/bookings" className={`${ui.btnSecondary} text-xs mt-6 inline-block`}>
          &lt; Повернутися до розкладу
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xs font-bold text-cyan-500 font-mono tracking-widest">
            [SESSION_ID_#{String(booking.id).padStart(4, "0")}]
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100 font-mono mt-1">
            {booking.title}
          </h1>
        </div>
        <Link href="/bookings" className={`${ui.btnSecondary} text-xs font-mono w-fit`}>
          &lt; Назад до розкладу
        </Link>
      </div>

      <BookingCard booking={booking} />
    </div>
  );
}