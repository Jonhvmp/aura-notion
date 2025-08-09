export function getTodayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function validateNote(note) {
  if (!note || typeof note !== 'string') {
    return { valid: false, message: 'Anotação deve ser um texto válido' };
  }

  const trimmed = note.trim();
  if (trimmed.length === 0) {
    return { valid: false, message: 'Anotação não pode estar vazia' };
  }

  if (trimmed.length > 5000) {
    return { valid: false, message: 'Anotação muito longa (máximo 5000 caracteres)' };
  }

  return { valid: true, note: trimmed };
}

export function getNotes() {
  try {
    const notes = localStorage.getItem('notes');
    if (!notes) return {};

    const parsed = JSON.parse(notes);
    if (typeof parsed !== 'object' || parsed === null) {
      console.warn('Dados de notas corrompidos, resetando...');
      localStorage.removeItem('notes');
      return {};
    }

    return parsed;
  } catch (error) {
    console.error('Erro ao carregar notas:', error);
    localStorage.removeItem('notes');
    return {};
  }
}

export function saveNotes(notes) {
  try {
    if (typeof notes !== 'object' || notes === null) {
      throw new Error('Dados inválidos para salvar');
    }
    localStorage.setItem('notes', JSON.stringify(notes));
    return true;
  } catch (error) {
    console.error('Erro ao salvar notas:', error);
    return false;
  }
}

export function getStreak() {
  try {
    const streak = localStorage.getItem('streak');
    if (!streak) return 0;

    const parsed = parseInt(streak, 10);
    return isNaN(parsed) ? 0 : Math.max(0, parsed);
  } catch (error) {
    console.error('Erro ao carregar streak:', error);
    return 0;
  }
}

export function saveStreak(streak) {
  try {
    const validStreak = parseInt(streak, 10);
    if (isNaN(validStreak) || validStreak < 0) {
      throw new Error('Streak inválido');
    }
    localStorage.setItem('streak', JSON.stringify(validStreak));
    return true;
  } catch (error) {
    console.error('Erro ao salvar streak:', error);
    return false;
  }
}

export function getBadges() {
  try {
    const badges = localStorage.getItem('badges');
    if (!badges) return [];

    const parsed = JSON.parse(badges);
    if (!Array.isArray(parsed)) {
      console.warn('Dados de badges corrompidos, resetando...');
      localStorage.removeItem('badges');
      return [];
    }

    return parsed;
  } catch (error) {
    console.error('Erro ao carregar badges:', error);
    localStorage.removeItem('badges');
    return [];
  }
}

export function saveBadges(badges) {
  try {
    if (!Array.isArray(badges)) {
      throw new Error('Badges devem ser um array');
    }
    localStorage.setItem('badges', JSON.stringify(badges));
    return true;
  } catch (error) {
    console.error('Erro ao salvar badges:', error);
    return false;
  }
}

export function showFeedback(message, type = 'success') {
  // Remove feedback anterior se existir
  const existing = document.querySelector('.success-feedback, .error-feedback');
  if (existing) {
    existing.remove();
  }

  const feedback = document.createElement('div');
  feedback.className = type === 'success' ? 'success-feedback' : 'error-feedback';
  feedback.textContent = message;

  document.body.appendChild(feedback);

  // Trigger animation
  setTimeout(() => feedback.classList.add('show'), 10);

  // Auto remove after 3 seconds
  setTimeout(() => {
    feedback.classList.remove('show');
    setTimeout(() => feedback.remove(), 300);
  }, 3000);
}

// Debug localStorage
export function debugLocalStorage() {
  console.log('🔍 DEBUG LOCALSTORAGE:');
  console.log('📚 Notes:', localStorage.getItem('notes'));
  console.log('🔥 Streak:', localStorage.getItem('streak'));
  console.log('🏆 Badges:', localStorage.getItem('badges'));
  console.log('📅 Last Date:', localStorage.getItem('lastNoteDate'));

  // Teste de escrita
  try {
    localStorage.setItem('teste', 'funcionando');
    const teste = localStorage.getItem('teste');
    console.log('✅ LocalStorage funciona:', teste);
    localStorage.removeItem('teste');
  } catch (error) {
    console.error('❌ Erro no localStorage:', error);
  }
}
