import Link from "next/link";
import { ui } from "@/components/ui/ui";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Головний банер сервісу */}
      <section className={`${ui.card} ${ui.cardPad} border-l-4 border-l-cyan-500`}>
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded border border-slate-800 px-3 py-1 text-xs text-cyan-400 bg-slate-900/50 font-mono">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            [CORE SYSTEM] // Next.js + Tailwind CSS
          </div>

          <h1 className="mt-4 text-3xl font-bold leading-tight md:text-4xl text-slate-100 font-mono">
            Система бронювання переговорних кімнат
          </h1>

          <p className="mt-3 text-slate-400 text-sm leading-relaxed">
            Проєкт демонструє логіку взаємодії між сутностями користувачів (users), кімнат (rooms) та сесій бронювання (bookings). 
            На поточному етапі реалізовано автономну клієнтську частину без підключення до API.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/bookings/new" className={ui.btnPrimary}>
              Створити бронювання
            </Link>

            <Link href="/bookings" className={ui.btnSecondary}>
              Перейти до розкладу _
            </Link>
          </div>
        </div>
      </section>

      {/* Що реалізовано в інтерфейсі */}
      <section className="mt-12">
        <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-widest font-mono mb-5">
          // Доступні розділи системи
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard title="Розклад" desc="Загальний список усіх активних бронювань переговорних локацій." href="/bookings" />
          <FeatureCard title="Нова бронь" desc="Інтерактивна форма для резервування кімнати на обраний час." href="/bookings/new" />
          <FeatureCard title="Переговорні" desc="Перегляд доступних залів, інформації про їх місткість та обладнання." href="/rooms" />
          <FeatureCard title="Користувачі" desc="Список зареєстрованих співробітників компанії та їхніх ролей." href="/users" />
        </div>
      </section>

      {/* Опис логічної схеми бази даних */}
      <section className="mt-12">
        <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-widest font-mono mb-5">
          // Логічна архітектура реляційної схеми
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <StepCard step="01" title="Користувач (User)" desc="Один співробітник може створити багато запитів на бронювання кімнат (One-to-Many)." />
          <StepCard step="02" title="Кімната (Room)" desc="Кожна кімната містить унікальні параметри: назву, місткість та технічне забезпечення." />
          <StepCard step="03" title="Бронювання (Booking)" desc="Поєднує користувача та обрану кімнату через зовнішні ключі, фіксуючи дату й часовий інтервал." />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ title, desc, href }: { title: string; desc: string; href: string }) {
  return (
    <Link href={href} className={`${ui.card} p-5 block transition-all hover:border-cyan-500/40 hover:bg-slate-900/40 group`}>
      <div className="text-base font-semibold text-slate-100 font-mono group-hover:text-cyan-400 transition-colors">{title}</div>
      <p className="mt-2 text-xs text-slate-400 leading-relaxed">{desc}</p>
    </Link>
  );
}

function StepCard({ step, title, desc }: { step: string; title: string; desc: string }) {
  return (
    <div className={`${ui.card} p-5 bg-slate-950/40 border-dashed`}>
      <div className="flex items-center gap-3">
        <div className="text-xs font-bold text-cyan-400 font-mono border border-cyan-500/30 rounded px-1.5 py-0.5 bg-cyan-950/20">
          {step}
        </div>
        <div className="text-sm font-bold text-slate-200 font-mono">{title}</div>
      </div>
      <p className="mt-3 text-xs text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}