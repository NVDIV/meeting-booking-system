export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  // Витягуємо токен на стороні клієнта
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`http://localhost:5000${endpoint}`, { ...options, headers });
  
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "Сталася помилка при виконанні запиту.");
  }
  
  return res.json();
}