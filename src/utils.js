export function getTodayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function getNotes() {
  return JSON.parse(localStorage.getItem('notes') || '{}');
}

export function saveNotes(notes) {
  localStorage.setItem('notes', JSON.stringify(notes));
}

export function getStreak() {
  return JSON.parse(localStorage.getItem('streak') || '0');
}

export function saveStreak(streak) {
  localStorage.setItem('streak', JSON.stringify(streak));
}

export function getBadges() {
  return JSON.parse(localStorage.getItem('badges') || '[]');
}

export function saveBadges(badges) {
  localStorage.setItem('badges', JSON.stringify(badges));
}
