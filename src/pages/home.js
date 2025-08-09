import { getTodayISO, getNotes, saveNotes, getStreak, saveStreak, getBadges, saveBadges, validateNote, showFeedback, debugLocalStorage, createNavigation, setupNavigation } from '../utils.js';

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
  const note = notes[today] || '';
  const charCount = note.length;
  const maxChars = 5000;

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
              <label for="note" class="form-label">Sua anotação</label>
              <span class="text-xs font-medium ${charCount > maxChars * 0.9 ? 'text-red-400' : 'text-slate-400'}">${charCount}/${maxChars}</span>
            </div>
            <textarea
              id="note"
              class="form-textarea"
              placeholder="Capture pensamentos, reflexões, aprendizados ou pequenos highlights do dia..."
              maxlength="${maxChars}"
            >${note}</textarea>
          </div>
          
          <div class="flex items-center gap-4">
            <button id="save" class="btn">
              <i class="ph ph-floppy-disk"></i>
              Salvar Anotação
            </button>
            ${note ? `<button id="clear" class="btn-secondary">
              <i class="ph ph-trash"></i>
              Limpar
            </button>` : ''}
          </div>
          
          <div id="streak" class="mt-6"></div>
        </section>
      </div>
    </div>
  `;

  const saveBtn = document.getElementById('save');
  const noteTextarea = document.getElementById('note');
  const clearBtn = document.getElementById('clear');

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

  noteTextarea.addEventListener('input', () => updateCharCount(noteTextarea));  saveBtn.onclick = () => {
    const value = noteTextarea.value;
    const validation = validateNote(value);

    // console.log('Debug salvamento:', {
    //   valor: value,
    //   validacao: validation,
    //   hoje: today
    // });

    if (!validation.valid) {
      showFeedback(validation.message, 'error');
      return;
    }

    saveBtn.disabled = true;
    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = '<i class="ph ph-circle-notch animate-spin"></i> Salvando...';

    try {
      const notesAtual = getNotes();
      // console.log('Notas atuais:', notesAtual);

      notesAtual[today] = validation.note;
      // console.log('Adicionando nota para hoje:', today, validation.note);

      const sucessoSalvamento = saveNotes(notesAtual);
      // console.log('Resultado salvamento:', sucessoSalvamento);

      if (sucessoSalvamento) {
        updateStreak(today, notesAtual);
        showFeedback('Anotação salva com sucesso! 📝', 'success');

        // Verificar se realmente salvou
        const verificacao = getNotes();
        // console.log('Verificação pós-salvamento:', verificacao);

        // Limpar textarea após salvamento bem sucedido
        noteTextarea.value = '';
        updateCharCount(noteTextarea);

        // Atualizar contador de caracteres
        const counter = document.querySelector('.text-xs.font-medium');
        if (counter) {
          counter.textContent = `0/${maxChars}`;
          counter.className = 'text-xs font-medium text-slate-400';
        }

        // Remover botão limpar se existir
        const clearBtn = document.getElementById('clear');
        if (clearBtn) {
          clearBtn.remove();
        }

        // Atualizar streak display
        const streak = getStreak();
        const streakElement = document.getElementById('streak');
        if (streak > 0) {
          streakElement.innerHTML = `<div class="streak-banner">🔥 <span>${streak} dia${streak > 1 ? 's' : ''} seguidos</span></div>`;
        }
      } else {
        showFeedback('Erro ao salvar anotação', 'error');
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
      showFeedback('Erro inesperado ao salvar', 'error');
    } finally {
      saveBtn.disabled = false;
      saveBtn.innerHTML = '<i class="ph ph-floppy-disk"></i> Salvar Anotação';
    }
  };

  if (clearBtn) {
    clearBtn.onclick = () => {
      if (confirm('Tem certeza que deseja limpar a anotação de hoje?')) {
        delete notes[today];
        if (saveNotes(notes)) {
          showFeedback('Anotação removida', 'success');
          renderHome();
        } else {
          showFeedback('Erro ao remover anotação', 'error');
        }
      }
    };
  }

  // Mostrar streak
  const streak = getStreak();
  const streakElement = document.getElementById('streak');
  if (streak > 0) {
    streakElement.innerHTML = `<div class="streak-banner">🔥 <span>${streak} dia${streak > 1 ? 's' : ''} seguidos</span></div>`;
  }

  setupNavigation();
}
