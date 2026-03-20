export function saveSession(data: any) {
  localStorage.setItem("chat-session", JSON.stringify(data));
}

export function getSession() {
  const data = localStorage.getItem("chat-session");
  return data ? JSON.parse(data) : null;
}

export function clearSession() {
  localStorage.removeItem("chat-session");
}