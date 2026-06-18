export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-neutral-900 text-center">Вхід у RoomBooking</h1>
        <p className="mt-1 text-sm text-neutral-500 text-center">Використовуйте свій корпоративний аккаунт</p>
        
        <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-xs font-semibold text-neutral-600 uppercase">Електронна пошта</label>
            <input type="email" placeholder="alex@company.com" className="mt-1 block w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-600 uppercase">Пароль</label>
            <input type="password" placeholder="••••••••" className="mt-1 block w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-blue-500 focus:outline-none" />
          </div>
          <button type="submit" className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition">
            Увійти
          </button>
        </form>
      </div>
    </div>
  );
}