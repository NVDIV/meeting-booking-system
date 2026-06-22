import Link from "next/link";
import { ui } from "@/components/ui/ui";
import { BookingsTable } from "@/components/bookings/BookingsTable";

export const dynamic = "force-dynamic";

async function getBookings() {
  try {
    const res = await fetch("http://localhost:5000/api/bookings", { cache: "no-store" });
    if (!res.ok) throw new Error("Помилка завантаження");
    return await res.json();
  } catch (error) {
    console.error("Помилка підключення до API:", error);
    return [];
  }
}

export default async function BookingsPage() {
  const bookings = await getBookings();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100 font-mono">
            <span className="text-cyan-500">&gt;</span> Розклад бронювань
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Повний список зарезервованих кімнат та статус тайм-слотів.
          </p>
        </div>
        <div>
          <Link href="/bookings/new" className={`${ui.btnPrimary} text-xs font-mono block text-center`}>
            + Нове бронювання
          </Link>
        </div>
      </div>

      <BookingsTable initialBookings={bookings} />
    </div>
  );
}