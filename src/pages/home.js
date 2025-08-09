import { getTodayISO, getNotes, saveNotes, getStreak, saveStreak, getBadges, saveBadges, validateNote, showFeedback, debugLocalStorage, createNavigation, setupNavigation, showConfirm } from '../utils.js';

function updateStreak(today, notes) {
  let streak = getStreak();
  let lastDate = localStorage.getItem('lastNoteDate');

  if (lastDate) {
    const diff = Math.floor((new Date(today) - new Date(lastDate)) / (1000*60*60*24));
    if (diff === 1) {
      streak++;
    } else if (diff > 1) {
      streak = 1;
    }
    // Se diff === 0, mantém o streak atual (mesmo dia)
  } else {
    streak = 1;
  }

  if (!saveStreak(streak)) {
    showFeedback('Erro ao salvar sequência', 'error');
    return;
  }

  localStorage.setItem('lastNoteDate', today);

  // Badges
  let badges = getBadges();
  let newBadges = [];

  if (streak >= 3 && !badges.includes('3dias')) {
    badges.push('3dias');
    newBadges.push('3 Dias Seguidos');
  }
  if (streak >= 7 && !badges.includes('7dias')) {
    badges.push('7dias');
    newBadges.push('7 Dias Seguidos');
  }
  if (streak >= 30 && !badges.includes('30dias')) {
    badges.push('30dias');
    newBadges.push('30 Dias Seguidos');
  }

  if (newBadges.length > 0) {
    if (saveBadges(badges)) {
      showFeedback(`🏆 Novo badge conquistado: ${newBadges.join(', ')}!`, 'success');
    }
  }
}

export function renderHome() {
  // Debug inicial
  debugLocalStorage();

  const app = document.getElementById('app');
  const today = getTodayISO();
  const notes = getNotes();
  const todayNotes = notes[today] || [];
  const charCount = 0; // Sempre começar com textarea vazio
  const maxChars = 5000;

  // Converter nota única em array se necessário (compatibilidade)
  let notesArray = [];
  if (typeof todayNotes === 'string') {
    notesArray = todayNotes.trim() ? [todayNotes] : [];
  } else if (Array.isArray(todayNotes)) {
    notesArray = todayNotes;
  }

  // Limitar exibição a 5 notas mais recentes
  const maxDisplayNotes = 5;
  const displayNotes = notesArray.slice(-maxDisplayNotes).reverse(); // Mais recentes primeiro
  const hiddenNotesCount = Math.max(0, notesArray.length - maxDisplayNotes);

  app.innerHTML = `
    <div class="main-content">
      ${createNavigation('hoje')}

      <div class="container">
        <header class="text-center mb-10">
          <h1 class="title">Anotações do Dia</h1>
          <p class="subtitle">${today}</p>
        </header>

        <section class="card">
          <div class="form-group">
            <div class="flex justify-between items-center mb-4">
              <label for="note" class="form-label">
                <i class="ph ph-plus-circle"></i>
                ${notesArray.length > 0 ? 'Adicionar nova anotação' : 'Sua primeira anotação'}
              </label>
              <span class="text-xs font-medium text-slate-400">${charCount}/${maxChars}</span>
            </div>
            <textarea
              id="note"
              class="form-textarea"
              placeholder="Capture pensamentos, reflexões, aprendizados ou pequenos highlights do dia..."
              maxlength="${maxChars}"
            ></textarea>
          </div>

          <div class="flex items-center gap-4">
            <button id="save" class="btn">
              <i class="ph ph-floppy-disk"></i>
              ${notesArray.length > 0 ? 'Adicionar Anotação' : 'Salvar Anotação'}
            </button>
          </div>

          <div id="streak" class="mt-6"></div>
        </section>

        ${displayNotes.length > 0 ? `
        <section class="card">
          <div class="flex justify-between items-center mb-4">
            <h3 class="form-label">
              <i class="ph ph-note-pencil"></i>
              Suas anotações de hoje (${notesArray.length})
            </h3>
            ${hiddenNotesCount > 0 ? `
              <button id="show-all" class="text-sm text-brand-accent hover:text-brand-accent-hover transition-colors">
                Ver todas (${hiddenNotesCount} ocultas)
              </button>
            ` : ''}
          </div>
          <div class="notes-list" id="notes-container">
            ${displayNotes.map((note, displayIndex) => {
              const actualIndex = notesArray.length - 1 - displayIndex; // Index real no array original
              return `
                <div class="note-item" data-index="${actualIndex}">
                  <div class="note-content">${note}</div>
                  <button class="note-delete" data-index="${actualIndex}" title="Excluir esta nota">
                    <i class="ph ph-trash"></i>
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        </section>
        ` : ''}
      </div>
    </div>
  `;  const saveBtn = document.getElementById('save');
  const noteTextarea = document.getElementById('note');
  const deleteButtons = document.querySelectorAll('.note-delete');
  const showAllBtn = document.getElementById('show-all');

  // Função para mostrar todas as notas
  if (showAllBtn) {
    showAllBtn.addEventListener('click', () => {
      const notesContainer = document.getElementById('notes-container');
      notesContainer.innerHTML = notesArray.slice().reverse().map((note, displayIndex) => {
        const actualIndex = notesArray.length - 1 - displayIndex;
        return `
          <div class="note-item" data-index="${actualIndex}">
            <div class="note-content">${note}</div>
            <button class="note-delete" data-index="${actualIndex}" title="Excluir esta nota">
              <i class="ph ph-trash"></i>
            </button>
          </div>
        `;
      }).join('');

      // Re-adicionar event listeners para os novos botões
      setupDeleteButtons();
      showAllBtn.style.display = 'none';
    });
  }

  function setupDeleteButtons() {
    document.querySelectorAll('.note-delete').forEach(button => {
      button.addEventListener('click', async () => {
        const index = parseInt(button.dataset.index);

        const confirmed = await customConfirm(
          'Tem certeza que deseja excluir esta anotação? Esta ação não pode ser desfeita.',
          'Excluir Anotação',
          {
            confirmText: 'Excluir',
            cancelText: 'Cancelar',
            icon: 'ph-trash'
          }
        );

        if (confirmed) {
          deleteNoteAtIndex(today, index);
        }
      });
    });
  }

  // Contador de caracteres em tempo real
  function updateCharCount(textarea) {
    const current = textarea.value.length;
    const counter = document.querySelector('.text-xs.font-medium');
    if (counter) {
      counter.textContent = `${current}/${maxChars}`;
      counter.className = `text-xs font-medium ${current > maxChars * 0.9 ? 'text-red-400' : 'text-slate-400'}`;
    }

    // Disable save button if over limit
    saveBtn.disabled = current > maxChars;
    saveBtn.style.opacity = current > maxChars ? '0.6' : '1';
  }

  noteTextarea.addEventListener('input', () => updateCharCount(noteTextarea));

  setupDeleteButtons();

  function deleteNoteAtIndex(date, index) {
    const notes = getNotes();
    let dateNotes = notes[date] || [];

    // Converter string em array se necessário
    if (typeof dateNotes === 'string') {
      dateNotes = dateNotes.trim() ? [dateNotes] : [];
    }

    if (Array.isArray(dateNotes) && index >= 0 && index < dateNotes.length) {
      dateNotes.splice(index, 1);

      // Se não há mais notas, remover completamente a entrada do dia
      if (dateNotes.length === 0) {
        delete notes[date];
      } else {
        notes[date] = dateNotes;
      }

      if (saveNotes(notes)) {
        showFeedback('Anotação excluída com sucesso', 'success');
        renderHome(); // Re-renderizar a página
      } else {
        showFeedback('Erro ao excluir anotação', 'error');
      }
    }
  }  saveBtn.onclick = () => {
    const value = noteTextarea.value;
    const validation = validateNote(value);

    if (!validation.valid) {
      showFeedback(validation.message, 'error');
      return;
    }

    saveBtn.disabled = true;
    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = '<i class="ph ph-circle-notch animate-spin"></i> Salvando...';

    try {
      const notesAtual = getNotes();
      let todayNotes = notesAtual[today] || [];

      // Converter string em array se necessário (compatibilidade)
      if (typeof todayNotes === 'string') {
        todayNotes = todayNotes.trim() ? [todayNotes] : [];
      }

      // Adicionar nova nota ao array
      todayNotes.push(validation.note);
      notesAtual[today] = todayNotes;

      const sucessoSalvamento = saveNotes(notesAtual);

      if (sucessoSalvamento) {
        updateStreak(today, notesAtual);
        showFeedback('Anotação adicionada com sucesso! 📝', 'success');

        // Limpar textarea após salvamento bem sucedido
        noteTextarea.value = '';
        updateCharCount(noteTextarea);

        // Re-renderizar a página para mostrar a nova nota
        renderHome();
      } else {
        showFeedback('Erro ao salvar anotação', 'error');
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
      showFeedback('Erro inesperado ao salvar', 'error');
    } finally {
      saveBtn.disabled = false;
      saveBtn.innerHTML = originalText;
    }
  };

  // Mostrar streak
  const streak = getStreak();
  const streakElement = document.getElementById('streak');
  if (streak > 0) {
    streakElement.innerHTML = `<div class="streak-banner">🔥 <span>${streak} dia${streak > 1 ? 's' : ''} seguidos</span></div>`;
  }

  setupNavigation();
}
