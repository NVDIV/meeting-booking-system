export const ui = {
  // Картки тепер темні, з тонкими неоновими рамками та гострішими кутами
  card: "rounded-xl border border-slate-800 bg-slate-950/70 backdrop-blur-md shadow-2xl shadow-cyan-950/20",
  cardPad: "p-6",
  
  // Кнопки повністю перероблені: замість пласких кольорових — яскраві неонові плашки
  btnPrimary:
    "inline-flex items-center justify-center rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 active:scale-[0.98] transition-all disabled:cursor-not-allowed disabled:opacity-50 font-mono tracking-wide",
  
  btnSecondary:
    "inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm font-medium text-slate-200 shadow-sm hover:bg-slate-800 hover:text-white hover:border-slate-500 active:scale-[0.98] transition-all disabled:cursor-not-allowed disabled:opacity-50",
  
  btnDanger:
    "inline-flex items-center justify-center rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-600/20 hover:bg-rose-500 active:scale-[0.98] transition-all disabled:cursor-not-allowed disabled:opacity-50",
  
  // Поля введення тепер інтегровані в темну тему з бірюзовим фокусом
  input:
    "h-10 rounded-lg border border-slate-800 bg-slate-900/60 px-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all font-mono",
  
  select:
    "h-10 rounded-lg border border-slate-800 bg-slate-900/60 px-3 text-sm text-slate-100 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all font-mono",
  
  textarea:
    "min-h-28 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 transition-all"
};