import { getTodayISO, getNotes, saveNotes, getStreak, saveStreak, getBadges, saveBadges } from '../utils.js';

function updateStreak(today, notes) {
  let streak = getStreak();
  let lastDate = localStorage.getItem('lastNoteDate');
  if (lastDate) {
    const diff = (new Date(today) - new Date(lastDate)) / (1000*60*60*24);
    if (diff === 1) streak++;
    else if (diff > 1) streak = 1;
  } else {
    streak = 1;
  }
  saveStreak(streak);
  localStorage.setItem('lastNoteDate', today);
  // Badges
  let badges = getBadges();
  if (streak === 3 && !badges.includes('3dias')) badges.push('3dias');
  if (streak === 7 && !badges.includes('7dias')) badges.push('7dias');
  if (streak === 30 && !badges.includes('30dias')) badges.push('30dias');
  saveBadges(badges);
}

export function renderHome() {
  const app = document.getElementById('app');
  const today = getTodayISO();
  const notes = getNotes();
  const note = notes[today] || '';
  app.innerHTML = `
    <nav class="flex gap-4 mb-6">
      <a href="#" class="text-lg font-bold text-fuchsia-700">Hoje</a>
      <a href="#resumo" class="hover:underline">Resumo</a>
      <a href="#calendario" class="hover:underline">Calendário</a>
      <a href="#badges" class="hover:underline">Badges</a>
    </nav>
    <h1 class="text-3xl font-elegant font-bold mb-2 text-fuchsia-900">Anotações do Dia</h1>
    <p class="mb-4 text-fuchsia-700">${today}</p>
    <textarea id="note" class="w-full h-40 p-3 rounded-lg border-2 border-fuchsia-300 focus:border-fuchsia-600 bg-white/80 font-elegant text-lg mb-4" placeholder="Escreva sua anotação...">${note}</textarea>
    <button id="save" class="bg-fuchsia-700 hover:bg-fuchsia-900 text-white px-6 py-2 rounded-lg font-bold shadow">Salvar</button>
    <div id="streak" class="mt-6 text-fuchsia-800 font-semibold"></div>
  `;
  document.getElementById('save').onclick = () => {
    const value = document.getElementById('note').value.trim();
    if (value) {
      notes[today] = value;
      saveNotes(notes);
      updateStreak(today, notes);
      renderHome();
    }
  };
  // Mostrar streak
  const streak = getStreak();
  document.getElementById('streak').innerHTML = streak ? `🔥 Sequência: <span class="badge">${streak} dias</span>` : '';
}
