import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Про сервіс</h1>
      <p className="mt-2 text-neutral-600">
        RoomBooking — внутрішній вебзастосунок компанії для швидкого резервування
        переговорних кімнат та планування спільних зустрічей.
      </p>

      <ul className="mt-4 list-disc pl-5 text-neutral-700 space-y-1">
        <li>Перегляд розкладу зайнятості залів у реальному часі</li>
        <li>Швидке створення броні на потрібний тайм-слот</li>
        <li>Фільтрація приміщень за місткістю та наявним обладнанням</li>
        <li>Управління власними бронюваннями через особистий кабінет</li>
      </ul>

      <div className="mt-6">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm font-medium shadow-sm hover:bg-neutral-50 transition"
        >
          На головну
        </Link>
      </div>
    </div>
  );
}