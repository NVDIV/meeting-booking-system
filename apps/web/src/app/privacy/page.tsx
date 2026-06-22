import Link from "next/link";
import { ui } from "@/components/ui/ui";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className={`${ui.card} ${ui.cardPad} border-t-2 border-t-cyan-500`}>
        {/* Заголовок */}
        <h1 className="text-xl font-bold tracking-tight text-slate-100 font-mono">
          <span className="text-cyan-500">&gt;</span> Політика конфіденційності_
        </h1>
        <p className="mt-2 text-sm text-slate-400 font-mono">
          Правила обробки внутрішніх корпоративних даних у сервісі RoomBooking.
        </p>

        {/* Список правил обробки */}
        <div className="mt-6 border-t border-slate-900 pt-4">
          <ul className="text-xs text-slate-300 space-y-3 font-mono">
            <li className="flex items-start gap-2.5">
              <span className="text-cyan-500 mt-0.5">■</span>
              <span>Мінімізуємо збирання персональних даних — зберігаємо тільки робочий email та ім&apos;я.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-cyan-500 mt-0.5">■</span>
              <span>Дані про бронювання використовуються виключно для координації розкладу зустрічей.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-cyan-500 mt-0.5">■</span>
              <span>Доступ до адміністрування переговорних кімнат обмежується спеціальними ролями.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-cyan-500 mt-0.5">■</span>
              <span>Логи системи записують час резервування для запобігання конфліктам овербукінгу.</span>
            </li>
          </ul>
        </div>

        {/* Кнопка повернення */}
        <div className="mt-8 pt-4 border-t border-slate-900 font-mono text-xs">
          <Link href="/" className={ui.btnSecondary}>
            &lt;&lt; На головну
          </Link>
        </div>
      </div>
    </div>
  );
}