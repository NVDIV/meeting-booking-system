interface Booking {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  room: {
    name: string;
  };
}

interface MyBookingsTableProps {
  bookings: Booking[];
}

export default function MyBookingsTable({ bookings }: MyBookingsTableProps) {
  // Функція форматування дати (YYYY-MM-DD)
  const formatDate = (isoString: string) => isoString.split("T")[0];

  // Функція форматування часу (HH:MM)
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" });
  };

  if (bookings.length === 0) {
    return (
      <p className="text-xs text-slate-500 font-mono mt-2">
        // У вас немає активних резервацій кімнат.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-900 bg-transparent">
      <table className="min-w-full divide-y divide-slate-800 text-left text-xs font-mono text-slate-300">
        <thead className="bg-slate-900/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <tr>
            <th className="px-4 py-3.5">Кімната</th>
            <th className="px-4 py-3.5">Дата</th>
            <th className="px-4 py-3.5">Час</th>
            <th className="px-4 py-3.5">Ціль зустрічі</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 bg-transparent">
          {bookings.map((booking) => (
            <tr key={booking.id} className="hover:bg-cyan-500/5 transition-colors">
              <td className="px-4 py-3 font-semibold text-slate-100">{booking.room?.name || "Невідома кімната"}</td>
              <td className="px-4 py-3 whitespace-nowrap text-slate-400">{formatDate(booking.startTime)}</td>
              <td className="px-4 py-3 whitespace-nowrap font-bold text-cyan-400">
                {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
              </td>
              <td className="px-4 py-3 text-slate-300">{booking.title}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}