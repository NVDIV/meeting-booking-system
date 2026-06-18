export const dynamic = "force-dynamic";

export default function UsersPage() {
  // Статичний список користувачів для демонстрації в Лабораторній №1
  const users = [
    { id: 1, name: "Олександр Степанов", email: "alex.stepanov@company.com", role: "Співробітник", department: "Департамент розробки" },
    { id: 2, name: "Дмитро Коваленко", email: "d.kovalenko@company.com", role: "Адміністратор", department: "IT-інфраструктура" },
    { id: 3, name: "Марія Рева", email: "m.reva@company.com", role: "Співробітник", department: "HR-відділ" },
    { id: 4, name: "Анначук Сергій", email: "s.anna@company.com", role: "Співробітник", department: "Маркетинг" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Заголовок */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-neutral-900">Користувачі та права доступу</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Керування обліковими записами співробітників, перегляд ролей та закріплених департаментів.
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Таблиця користувачів */}
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm h-fit">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200 text-left text-sm text-neutral-600">
              <thead className="bg-neutral-50 text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Співробітник</th>
                  <th className="px-4 py-3">Департамент</th>
                  <th className="px-4 py-3">Роль</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 bg-white">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-neutral-900">{user.name}</div>
                      <div className="text-xs text-neutral-400">{user.email}</div>
                    </td>
                    <td className="px-4 py-3 text-neutral-700">{user.department}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                        user.role === "Адміністратор" 
                          ? "bg-purple-50 text-purple-700 ring-purple-700/10" 
                          : "bg-blue-50 text-blue-700 ring-blue-700/10"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Статична форма швидкого створення (заглушка) */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm h-fit">
          <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">Новий співробітник</h2>
          <p className="mt-1 text-xs text-neutral-500">Візуальна форма додавання користувача до системи.</p>
          
          <form className="mt-4 space-y-3" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-xs font-medium text-neutral-600">Повне ім&apos;я</label>
              <input type="text" placeholder="Іван Іванов" className="mt-1 block w-full rounded-xl border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-900 focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600">Робочий Email</label>
              <input type="email" placeholder="ivan@company.com" className="mt-1 block w-full rounded-xl border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-900 focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600">Департамент</label>
              <input type="text" placeholder="QA-відділ" className="mt-1 block w-full rounded-xl border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-900 focus:border-blue-500 focus:outline-none" />
            </div>
            <button type="submit" className="w-full rounded-xl bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition shadow-sm mt-2">
              Створити акаунт
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}