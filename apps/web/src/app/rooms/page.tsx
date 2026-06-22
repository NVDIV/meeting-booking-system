import RoomCard from "@/components/rooms/RoomCard";

export const dynamic = "force-dynamic";

// 1. Описуємо інтерфейс кімнати (такий самий, як у RoomCard)
interface Room {
  id: number;
  name: string;
  capacity: number;
  equipment: string | null;
  location: string;
}

// 2. Вказуємо, що функція повертає проміс із масивом кімнат Promise<Room[]>
async function getRooms(): Promise<Room[]> {
  try {
    const res = await fetch("http://localhost:5000/api/rooms", { 
      cache: "no-store" 
    });
    
    if (!res.ok) {
      throw new Error("Не вдалося завантажити дані з сервера");
    }
    
    return await res.json();
  } catch (error) {
    console.error("Помилка при запиті кімнат:", error);
    return []; 
  }
}

export default async function RoomsPage() {
  const rooms = await getRooms();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Заголовок сторінки */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-100 font-mono">
          <span className="text-cyan-500">&gt;</span> Переговорні кімнати_
        </h1>
        <p className="mt-1 text-xs text-slate-400 font-mono">
          Каталог доступних локацій офісу, їх місткість та технічне забезпечення для проведення зустрічей.
        </p>
      </div>

      {/* Перевірка на порожню базу даних */}
      {rooms.length === 0 ? (
        <p className="mt-8 text-center text-xs text-slate-500 font-mono">
          // Наразі немає доступних кімнат або бекенд-сервер офлайн.
        </p>
      ) : (
        /* Сітка карток кімнат */
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {rooms.map((room) => (
            // Тепер TypeScript знає, що room — це об'єкт типу Room
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
}