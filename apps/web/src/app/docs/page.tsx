import Link from "next/link";
import { ui } from "@/components/ui/ui";

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className={`${ui.card} ${ui.cardPad} border-t-2 border-t-cyan-500`}>
        {/* Заголовок */}
        <h1 className="text-xl font-bold tracking-tight text-slate-100 font-mono">
          <span className="text-cyan-500">&gt;</span> Регламент та документація_
        </h1>
        <p className="mt-2 text-sm text-slate-400 font-mono">
          Ласкаво просимо до бази знань сервісу RoomBooking. Тут зібрано базові правила бронювання 
          спільного простору та інструкції для співробітників компанії.
        </p>

        {/* Секції правил */}
        <div className="mt-6 space-y-4 max-w-2xl border border-slate-900 bg-slate-950/40 p-5 rounded-xl font-mono text-xs">
          <div>
            <h2 className="font-bold text-cyan-400 uppercase tracking-wider">[1. Ліміти бронювання]</h2>
            <p className="mt-1.5 text-slate-300 leading-relaxed">
              Один співробітник може забронювати переговорну кімнату максимум на 2 години поспіль, щоб уникнути монополізації простору.
            </p>
          </div>
          
          <hr className="border-slate-900" />
          
          <div>
            <h2 className="font-bold text-cyan-400 uppercase tracking-wider">[2. Скасування резерву]</h2>
            <p className="mt-1.5 text-slate-300 leading-relaxed">
              Якщо ваша зустріч скасувалася або перенеслася, будь ласка, звільніть кімнату через особистий кабінет (розділ &quot;Профіль&quot;).
            </p>
          </div>
        </div>

        {/* Навігація */}
        <div className="mt-8 pt-4 border-t border-slate-900 flex flex-wrap gap-3 font-mono text-xs">
          <Link href="/about" className={ui.btnSecondary}>
            Про сервіс
          </Link>
          <Link href="/" className={ui.btnPrimary}>
            На головну _
          </Link>
        </div>
      </div>
    </div>
  );
}