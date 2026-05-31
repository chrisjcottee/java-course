/* ---------- Boot ---------- */
bindGlobalEvents();
render();

if (!storageWorks()) {
  showModal({
    title: 'Storage is disabled',
    body: 'This browser isn\'t letting the app save anything to local storage. The most common cause is Private/Incognito mode. Open this URL in a regular browser tab and add it to your home screen from there.',
    confirmText: 'OK',
    hideCancel: true,
    onConfirm: closeModal
  });
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').catch(() => {});
  });
}

