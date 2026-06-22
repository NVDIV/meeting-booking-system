"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ui } from "@/components/ui/ui";

interface Room {
  id: number;
  name: string;
  capacity: number;
}

interface NewBookingFormProps {
  rooms: Room[];
}

export function NewBookingForm({ rooms }: NewBookingFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Зчитуємо roomId з URL-параметрів
  const queryRoomId = searchParams.get("roomId");

  // Стейти для полів форми
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  
  const [roomId, setRoomId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  
  // Новий стейт для ID авторизованого користувача
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Синхронізуємо roomId та завантажуємо сесію поточного юзера
  useEffect(() => {
    if (queryRoomId) {
      setRoomId(queryRoomId);
    } else if (rooms[0]?.id) {
      setRoomId(String(rooms[0].id));
    }

    async function fetchUserSession() {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setError("Помилка авторизації. Будь ласка, увійдіть у систему.");
          return;
        }

        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setCurrentUserId(data.id); // Зберігаємо реальний ID користувача з бази
        } else {
          setError("Сесія застаріла. Перезайдіть в обліковий запис.");
        }
      } catch (err) {
        console.error("Помилка завантаження сесії у формі:", err);
      }
    }

    fetchUserSession();
  }, [queryRoomId, rooms]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!currentUserId) {
      setError("Неможливо створити бронювання: користувач не ідентифікований.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const startIso = new Date(`${date}T${startTime}:00`).toISOString();
      const endIso = new Date(`${date}T${endTime}:00`).toISOString();
      const token = localStorage.getItem("accessToken");

      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` // Передаємо токен бекенду
        },
        body: JSON.stringify({
          title,
          description,
          roomId: Number(roomId),
          userId: currentUserId, // Передаємо реальний ID замість одиниці!
          startTime: startIso,
          endTime: endIso,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Не вдалося створити бронювання");
      }

      router.push("/bookings");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Сталася непередбачувана помилка");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-4 font-mono text-xs" onSubmit={handleSubmit}>
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded text-[11px]">
          [ERROR]: {error}
        </div>
      )}

      <div>
        <label className="block font-bold text-slate-400 uppercase tracking-wider">Тема зустрічі</label>
        <input 
          type="text" 
          placeholder="SYS_MEETING_TITLE" 
          className={`${ui.input} mt-1.5 block w-full`} 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required 
        />
      </div>

      <div>
        <label className="block font-bold text-slate-400 uppercase tracking-wider">Опис / Порядок денний</label>
        <textarea 
          rows={3} 
          placeholder="Необхідне обладнання чи нотатки для команди..." 
          className={`${ui.input} mt-1.5 block w-full resize-none`} 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block font-bold text-slate-400 uppercase tracking-wider">Локація (Кімната)</label>
          <select 
            className={`${ui.input} mt-1.5 block w-full h-[38px] cursor-pointer bg-slate-950`}
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            required
          >
            {rooms.map((room) => (
              <option key={room.id} value={room.id} className="bg-slate-950 text-slate-300">
                {room.name} ({room.capacity} місць)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-400 uppercase tracking-wider">Дата</label>
          <input 
            type="date" 
            className={`${ui.input} mt-1.5 block w-full h-[38px] [color-scheme:dark]`} 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required 
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block font-bold text-slate-400 uppercase tracking-wider">Початок</label>
          <input 
            type="time" 
            className={`${ui.input} mt-1.5 block w-full h-[38px] [color-scheme:dark]`} 
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required 
          />
        </div>

        <div>
          <label className="block font-bold text-slate-400 uppercase tracking-wider">Завершення</label>
          <input 
            type="time" 
            className={`${ui.input} mt-1.5 block w-full h-[38px] [color-scheme:dark]`} 
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required 
          />
        </div>
      </div>

      {/* Кнопки дій */}
      <div className="pt-4 flex flex-col-reverse sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-full sm:w-1/3 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors rounded py-2.5 font-bold"
        >
          [ СКАСУВАТИ ]
        </button>
        
        <button 
          type="submit" 
          className={`${ui.btnPrimary} flex-1 py-2.5 disabled:opacity-50`}
          disabled={loading || !currentUserId}
        >
          {loading ? "Синхронізація з базою..." : "Ініціалізувати резервування _"}
        </button>
      </div>
    </form>
  );
}