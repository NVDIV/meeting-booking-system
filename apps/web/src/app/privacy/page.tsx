import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Політика конфіденційності</h1>
      <p className="mt-2 text-neutral-600">
        Правила обробки внутрішніх корпоративних даних у сервісі RoomBooking.
      </p>

      <ul className="mt-4 list-disc pl-5 text-neutral-700 space-y-1">
        <li>Мінімізуємо збирання персональних даних — зберігаємо тільки робочий email та ім&apos;я.</li>
        <li>Дані про бронювання використовуються виключно для координації розкладу зустрічей.</li>
        <li>Доступ до адміністрування переговорних кімнат обмежується спеціальними ролями.</li>
        <li>Логи системи записують час резервування для запобігання конфліктам овербукінгу.</li>
      </ul>

      <div className="mt-6">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm font-medium shadow-sm hover:bg-neutral-50 transition text-neutral-700"
        >
          На головну
        </Link>
      </div>
    </div>
  );
}