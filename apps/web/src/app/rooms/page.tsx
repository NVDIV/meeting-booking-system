import Link from "next/link";

export const dynamic = "force-dynamic";

export default function RoomsPage() {
  // Статичний масив кімнат для Лабораторної №1
  const rooms = [
    { id: 1, name: "Лондон (Р301)", capacity: 12, equipment: "Проєктор, Маркерна дошка, Клімат-контроль", floor: 3 },
    { id: 2, name: "Париж (Р204)", capacity: 6, equipment: "ТВ-екран, Спікерфон", floor: 2 },
    { id: 3, name: "Токіо (Р412)", capacity: 20, equipment: "Система відеозв'язку Cisco, 2 екрани, Фліпчарт", floor: 4 },
    { id: 4, name: "Київ (Р101)", capacity: 8, equipment: "Маркерна дошка, Конференц-зв'язок", floor: 1 },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-neutral-900">Переговорні кімнати</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Каталог доступних локацій офісу, їх місткість та технічне забезпечення для проведення зустрічей.
        </p>
      </div>

      {/* Проста і стильна сітка карток кімнат без запитів до бекенду */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {rooms.map((room) => (
          <div key={room.id} className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">{room.name}</h2>
                <p className="text-xs text-neutral-500">{room.floor}-й поверх</p>
              </div>
              <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                до {room.capacity} осіб
              </span>
            </div>
            
            <div className="mt-4">
              <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Обладнання:</span>
              <p className="mt-1 text-sm text-neutral-600">{room.equipment}</p>
            </div>

            <div className="mt-5 border-t pt-4 flex justify-end">
              <Link
                href="/bookings/new"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
              >
                Забронювати цей зал &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}