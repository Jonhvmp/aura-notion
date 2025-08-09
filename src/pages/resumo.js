import { getNotes, createNavigation, setupNavigation } from '../utils.js';

export function renderResumo() {
  const app = document.getElementById('app');
  const notes = getNotes();
  const dates = Object.keys(notes).sort().reverse();

  app.innerHTML = `
    <div class="main-content">
      ${createNavigation('resumo')}

      <div class="container">
        <header class="text-center mb-10">
          <h1 class="title">Resumo</h1>
          <p class="subtitle">Todas as suas entradas organizadas por data</p>
        </header>
        
        <section class="space-y-6">
          ${dates.length === 0 ?
            `<div class="card text-center">
              <i class="ph ph-notebook text-6xl text-slate-400 mb-4"></i>
              <p class="text-lg text-slate-300 mb-2">Nenhuma anotação registrada ainda.</p>
              <p class="text-sm text-slate-400">Comece fazendo sua primeira anotação hoje!</p>
            </div>`
            :
            dates.map(date => `
              <article class="card hover:shadow-xl transition-all duration-300">
                <div class="flex items-center justify-between mb-4">
                  <time datetime="${date}" class="flex items-center gap-2 text-sm font-semibold tracking-wide text-slate-300">
                    <i class="ph ph-calendar-dots"></i>
                    ${new Date(date).toLocaleDateString('pt-BR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                  <span class="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full bg-brand-600/20 text-brand-300">
                    <i class="ph ph-text-aa-fill"></i>
                    ${notes[date].length} caracteres
                  </span>
                </div>
                <p class="text-slate-100 leading-relaxed whitespace-pre-wrap">${notes[date]}</p>
              </article>
            `).join('')
          }
        </section>
      </div>
    </div>
  `;

  setupNavigation();
}
