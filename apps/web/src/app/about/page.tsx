import Link from "next/link";
import { ui } from "@/components/ui/ui";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Загортаємо весь контент в стилізовану картку терміналу */}
      <div className={`${ui.card} ${ui.cardPad} border-t-2 border-t-cyan-500`}>
        
        {/* Заголовок сторінки */}
        <h1 className="text-xl font-bold tracking-tight text-slate-100 font-mono">
          <span className="text-cyan-500">&gt;</span> Про сервіс_
        </h1>
        
        {/* Основний опис */}
        <p className="mt-3 text-sm text-slate-400 leading-relaxed">
          RoomBooking — внутрішній вебзастосунок компанії для швидкого резервування
          переговорних кімнат та планування спільних зустрічей.
        </p>

        {/* Список можливостей з кастомними неоновими маркерами */}
        <div className="mt-6 border-t border-slate-900 pt-4">
          <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-widest font-mono mb-3">
            [Функціональні можливості]
          </h2>
          <ul className="text-xs text-slate-300 space-y-2 font-mono">
            <li className="flex items-start gap-2">
              <span className="text-cyan-500">■</span> Перегляд розкладу зайнятості залів у реальному часі
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-500">■</span> Швидке створення броні на потрібний тайм-слот
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-500">■</span> Фільтрація приміщень за місткістю та наявним обладнанням
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-500">■</span> Управління власними бронюваннями через особистий кабінет
            </li>
          </ul>
        </div>

        {/* Кнопка повернення */}
        <div className="mt-8 pt-4 border-t border-slate-900">
          <Link href="/" className={ui.btnSecondary + " text-xs font-mono"}>
            &lt;&lt; На головну
          </Link>
        </div>

      </div>
    </div>
  );
}