export default function ProfilePage() {
  // Статичні дані користувача та його бронювань для Лаби №1
  const user = {
    name: "Олександр Степанов",
    email: "alex.stepanov@company.com",
    role: "Співробітник",
    department: "Департамент розробки"
  };

  const myBookings = [
    { id: 101, room: "Лондон (Р301)", date: "2026-06-19", time: "11:00 - 12:30", purpose: "Daily Scrum" },
    { id: 102, room: "Париж (Р204)", date: "2026-06-22", time: "15:00 - 16:00", purpose: "Синхронізація по дизайну" }
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-neutral-900">Особистий кабінет</h1>
        <p className="mt-1 text-sm text-neutral-500">Інформація про ваш профіль та активні резервації</p>
        
        {/* Картка користувача */}
        <div className="mt-6 grid gap-4 rounded-xl bg-neutral-50 p-4 sm:grid-cols-2">
          <div>
            <span className="text-xs font-semibold text-neutral-400 uppercase">Ім&apos;я користувача</span>
            <p className="text-sm font-medium text-neutral-900 mt-0.5">{user.name}</p>
          </div>
          <div>
            <span className="text-xs font-semibold text-neutral-400 uppercase">Email</span>
            <p className="text-sm font-medium text-neutral-900 mt-0.5">{user.email}</p>
          </div>
          <div>
            <span className="text-xs font-semibold text-neutral-400 uppercase">Роль у системі</span>
            <p className="text-sm font-medium text-neutral-900 mt-0.5">{user.role}</p>
          </div>
          <div>
            <span className="text-xs font-semibold text-neutral-400 uppercase">Підрозділ</span>
            <p className="text-sm font-medium text-neutral-900 mt-0.5">{user.department}</p>
          </div>
        </div>

        {/* Таблиця моїх бронювань */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-neutral-900">Ваші бронювання кімнат</h2>
          
          <div className="mt-4 overflow-hidden rounded-xl border border-neutral-200 bg-white">
            <table className="min-w-full divide-y divide-neutral-200 text-left text-sm text-neutral-600">
              <thead className="bg-neutral-50 text-xs font-semibold text-neutral-700 uppercase">
                <tr>
                  <th className="px-4 py-3">Кімната</th>
                  <th className="px-4 py-3">Дата</th>
                  <th className="px-4 py-3">Час</th>
                  <th className="px-4 py-3">Ціль зустрічі</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {myBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-neutral-900">{booking.room}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{booking.date}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{booking.time}</td>
                    <td className="px-4 py-3">{booking.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}