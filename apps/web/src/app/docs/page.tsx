import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Регламент та документація</h1>
      <p className="mt-2 text-neutral-600">
        Ласкаво просимо до бази знань сервісу RoomBooking. Тут зібрано базові правила бронювання 
        спільного простору та інструкції для співробітників компанії.
      </p>

      <div className="mt-6 space-y-4 max-w-2xl rounded-2xl border bg-white p-5 shadow-sm">
        <div>
          <h2 className="text-sm font-semibold text-neutral-800 uppercase tracking-wider">1. Ліміти бронювання</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Один співробітник може забронювати переговорну кімнату максимум на 2 години поспіль, щоб уникнути монополізації простору.
          </p>
        </div>
        <hr className="border-neutral-100" />
        <div>
          <h2 className="text-sm font-semibold text-neutral-800 uppercase tracking-wider">2. Скасування резерву</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Якщо ваша зустріч скасувалася або перенеслася, будь ласка, звільніть кімнату через особистий кабінет (розділ &quot;Профіль&quot;).
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/about"
          className="inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm font-medium shadow-sm hover:bg-neutral-50 transition text-neutral-700"
        >
          Про сервіс
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition"
        >
          На головну
        </Link>
      </div>
    </div>
  );
}