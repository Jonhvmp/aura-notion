import { getNotes, createNavigation, setupNavigation, showNotesModal } from '../utils.js';

function getMonthDays(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

window.viewNote = function(date) {
  const notes = getNotes();
  const dayNotes = notes[date];

  if (dayNotes) {
    showNotesModal(date, dayNotes);
  } else {
    showNotesModal(date, null);
  }
};

export function renderCalendario() {
  const app = document.getElementById('app');
  const notes = getNotes();

  // Usar horário do Brasil (UTC-3) de forma mais precisa
  const now = new Date();
  // Obter data atual em UTC-3 (horário de Brasília)
  const brazilTime = new Date(now.getTime() - (3 * 60 * 60 * 1000));

  const year = brazilTime.getUTCFullYear();
  const month = brazilTime.getUTCMonth();
  const daysInMonth = getMonthDays(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const daysWithNotes = Object.keys(notes);

  const monthName = brazilTime.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric', timeZone: 'America/Sao_Paulo' });

  app.innerHTML = `
    <div class="main-content">
      ${createNavigation('calendario')}

      <div class="container">
        <header class="text-center mb-10">
          <h1 class="title">Calendário</h1>
          <p class="subtitle">${monthName.charAt(0).toUpperCase()+monthName.slice(1)}</p>
        </header>

        <section class="card">
          <div class="calendar-grid">
            <div class="calendar-header">Dom</div>
            <div class="calendar-header">Seg</div>
            <div class="calendar-header">Ter</div>
            <div class="calendar-header">Qua</div>
            <div class="calendar-header">Qui</div>
            <div class="calendar-header">Sex</div>
            <div class="calendar-header">Sáb</div>

            ${Array.from({length: firstDay}, () => '<div class="calendar-day"></div>').join('')}
            ${Array.from({length: daysInMonth}, (_, i) => {
              const day = (i + 1).toString().padStart(2, '0');
              const monthStr = (month + 1).toString().padStart(2, '0');
              const iso = `${year}-${monthStr}-${day}`;

              const dayNotes = notes[iso];
              const hasNote = dayNotes && (
                (typeof dayNotes === 'string' && dayNotes.trim()) ||
                (Array.isArray(dayNotes) && dayNotes.length > 0)
              );

              const todayBrazil = brazilTime.toISOString().slice(0,10);
              const isToday = iso === todayBrazil;

              let preview = '';
              if (hasNote) {
                if (typeof dayNotes === 'string') {
                  preview = dayNotes.substring(0, 50) + (dayNotes.length > 50 ? '...' : '');
                } else if (Array.isArray(dayNotes)) {
                  const firstNote = dayNotes[0] || '';
                  const totalNotes = dayNotes.length;
                  preview = `${firstNote.substring(0, 40)}${firstNote.length > 40 ? '...' : ''}${totalNotes > 1 ? ` (+${totalNotes - 1})` : ''}`;
                }
              }

              return `<div class="calendar-day ${hasNote ? 'has-note' : ''} ${isToday ? 'today' : ''}" onclick="viewNote('${iso}')">
                <div class="day-number">${i+1}</div>
                ${hasNote ? `<div class="day-preview">${preview}</div>` : ''}
              </div>`;
            }).join('')}
          </div>

          <div class="mt-6 flex items-center gap-4 text-sm text-slate-400">
            <div class="flex items-center gap-2">
              <i class="ph ph-circle-fill text-brand-500"></i>
              <span>Dias com anotações</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="ph ph-calendar-check text-brand-400"></i>
              <span>Hoje</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  `;

  setupNavigation();
}
