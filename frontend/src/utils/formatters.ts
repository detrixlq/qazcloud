export function formatChatTime(date: Date, todayLabel: string): string {
  const d = new Date(date);
  const now = new Date();
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return isToday ? `${todayLabel}, ${time}` : d.toLocaleDateString() + ', ' + time;
}

export function previewFromMessages(messages: { content: string }[], maxLen = 40): string {
  const first = messages.find((m) => m.content.trim());
  if (!first) return 'New chat';
  const text = first.content.trim();
  return text.length <= maxLen ? text : text.slice(0, maxLen) + '…';
}
