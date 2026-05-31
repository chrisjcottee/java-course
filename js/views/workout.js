Views.workout = function() {
  const a = state.active;
  const totalEx = a.exercises.length;
  const currentExIdx = a.exercises.findIndex(e => !exerciseIsResolved(e));
  const allDone = currentExIdx === -1;
  const doneCount = a.exercises.filter(exerciseIsResolved).length;

  return `
    <div class="workout-top">
      <div class="row">
        <div>
          <div class="subtle">Week ${a.weekIndex + 1} · ${esc(a.dayName)}</div>
        </div>
      </div>
      <div class="dots">
        ${a.exercises.map((e, i) => {
          const done = exerciseIsComplete(e);
          const skipped = !!e.skipped;
          const cur = i === currentExIdx;
          return `<div class="dot ${done ? 'done' : ''} ${skipped ? 'skipped' : ''} ${cur ? 'current' : ''}" data-jump="${i}"></div>`;
        }).join('')}
      </div>
    </div>

    ${a.exercises.map((e, i) => exerciseCardHtml(e, i, currentExIdx)).join('')}

    <div class="workout-bottom">
      <div class="workout-bottom-inner">
        <div class="row between" style="align-items:center; gap:12px;">
          <span class="subtle" style="white-space:nowrap;">${doneCount} of ${totalEx} complete</span>
          <button class="btn ${allDone ? 'success' : ''}" id="finish-workout" style="flex:1; max-width:200px;">${allDone ? 'Finish Workout ✓' : 'Finish'}</button>
        </div>
      </div>
    </div>
  `;
};

function exerciseCardHtml(ex, i, currentExIdx) {
  const complete = exerciseIsComplete(ex);
  const skipped = !!ex.skipped;
  const done = complete || skipped;
  const pending = !done && i !== currentExIdx;
  const isCurrent = i === currentExIdx;

  let cardClass = 'ex-card';
  if (complete) cardClass += ' done';
  if (skipped) cardClass += ' skipped';
  if (pending) cardClass += ' pending';

  if (done) {
    const summary = skipped
      ? (ex.sets.length ? `${sessionExerciseSetSummary(ex)} · skipped rest` : 'Skipped')
      : ex.sets.map(s => `${fmtNum(s.weight)}×${s.reps}`).join(' · ');
    return `
      <div class="${cardClass}" data-ex-idx="${i}">
        <div class="ex-header">
          <div class="name">${esc(ex.name)}</div>
          <div class="progress mono">${skipped ? 'Skipped' : `${ex.sets.length}/${ex.targetSets}`}</div>
          <div class="check">${skipped ? '–' : '✓'}</div>
        </div>
        <div class="ex-summary">${summary}</div>
      </div>
    `;
  }

  return `
    <div class="${cardClass}" data-ex-idx="${i}">
      <div class="ex-header">
        <div class="name">${esc(ex.name)}</div>
        <div class="progress mono">${ex.sets.length}/${ex.targetSets}</div>
        ${isCurrent ? `<button class="btn ghost small skip-ex-btn" data-act="skip-ex" data-ex-idx="${i}">${ex.sets.length ? 'Skip Rest' : 'Skip'}</button>` : ''}
      </div>
      <div class="ex-target">Target: ${ex.targetSets} × ${ex.targetReps}</div>
      <div class="sets">
        ${Array.from({length: ex.targetSets}, (_, si) => setRowHtml(ex, i, si, isCurrent)).join('')}
      </div>
    </div>
  `;
}

function setRowHtml(ex, exIdx, si, isCurrentEx) {
  const logged = ex.sets[si];
  const isEditing = !!logged && editingSet && editingSet.exIdx === exIdx && editingSet.setIdx === si;
  const isActive = isCurrentEx && !logged && si === ex.sets.length;
  const isPending = !logged && !isActive;

  if (isEditing) {
    return `
      <div class="set-row editing" data-set-idx="${si}">
        <span class="lbl">${si + 1}</span>
        <input type="tel" inputmode="decimal" class="set-w" value="${logged.weight}" autocomplete="off" maxlength="6">
        ${repsStepperHtml(logged.reps)}
        <div class="edit-actions">
          <button class="log-btn" data-act="save-edit" title="Save">✓</button>
          <button class="cancel-btn" data-act="cancel-edit" title="Cancel">×</button>
        </div>
      </div>
    `;
  }

  if (logged) {
    return `
      <div class="set-row logged" data-edit-set="${exIdx},${si}">
        <span class="lbl">${si + 1} ✓</span>
        <span class="val">${fmtNum(logged.weight)} kg</span>
        <span class="val">× ${logged.reps}</span>
        <span class="edit-set-btn" aria-hidden="true">✎</span>
      </div>
    `;
  }

  if (isPending) {
    return `
      <div class="set-row pending">
        <span class="lbl">${si + 1}</span>
        <span class="val">– kg</span>
        <span class="val">× –</span>
        <span></span>
      </div>
    `;
  }

  // Active row — prefilled where possible
  const wPrefill = weightPrefillFor(ex, si);
  const rPrefill = repsPrefillFor(ex, si);
  const wHasValue = wPrefill !== '' && !isNaN(parseFloat(wPrefill));
  const last = findLastSet(ex.name, si);
  return `
    <div class="set-row active" data-set-idx="${si}">
      <span class="lbl">${si + 1}</span>
      <input type="tel" inputmode="decimal" class="set-w" value="${wHasValue ? wPrefill : ''}" placeholder="kg" autocomplete="off" maxlength="6">
      ${repsStepperHtml(rPrefill)}
      <button class="log-btn"${wHasValue ? '' : ' disabled'}>✓</button>
      ${last ? `
        <div class="last-ref">
          <span class="last-chip static">Last: ${fmtNum(last.weight)} kg × ${last.reps}</span>
        </div>
      ` : ''}
    </div>
  `;
}

function repsStepperHtml(value) {
  return `
    <div class="reps-stepper">
      <button class="step-btn" data-step="-1" type="button">−</button>
      <span class="step-val">${value}</span>
      <button class="step-btn" data-step="1" type="button">+</button>
      <input type="hidden" class="set-r" value="${value}">
    </div>
  `;
}

