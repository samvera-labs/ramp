/**
 * Build and display an error modal to provide feedback to the user when an error
 * pops up when loading the sources
 * e.g. loading playlist items behind a CDL wall in playlists
 * @param {Object} player VideoJS player instance
 * @param {Object} vjsErrorModalRef React ref to hold the modal instance for cleanup
 * @param {Boolean} isMultiCanvased whether there are multiple canvases to navigate
 * @param {Function} setControlBar function to show/hide the player control bar
 * @param {String} message optional message to display; defaults access related message
 */
export function showErrorModal(player, vjsErrorModalRef, isMultiCanvased, setControlBar,
  message = 'This item may require special access. Please contact support for assistance.') {
  if (vjsErrorModalRef.current) return;

  let label = 'This item is currently unavailable.';
  /* Combine the message into the label for audio-only mode, as there is less space to display
  to display it in a new paragraph in the audio player container. */
  if (player.audioOnlyMode_) {
    label = message;
  }

  const modal = player.createModal(label, { temporary: false, uncloseable: true });
  vjsErrorModalRef.current = modal;
  modal.addClass('vjs-custom-error-modal');
  modal.setAttribute('data-testid', 'error-access-modal');
  modal.el().setAttribute('tabindex', '0');
  modal.el().setAttribute('role', 'alertdialog');
  modal.el().setAttribute('aria-label', label);
  modal.contentEl().setAttribute('aria-live', 'assertive');
  modal.contentEl().setAttribute('aria-atomic', 'true');

  // Only use a separate message element in the modal for Video mode, as there is more space to display it.
  if (!player.audioOnlyMode_) {
    const messageEl = document.createElement('p');
    messageEl.className = 'vjs-custom-error-modal-message';
    messageEl.textContent = message;
    modal.contentEl().appendChild(messageEl);
  }

  // Enable player and unvail player control-bar in blocked state
  player.removeClass('vjs-disabled');
  setControlBar(player, true);

  /* Show the previous/next button in the control bar for multi-Canvas players so that,
  the user can navigate between canvases in error-mode. */
  if (isMultiCanvased) {
    player.controlBar.el().querySelectorAll('button, [tabindex]').forEach((focusable) => {
      if (!focusable.closest('.vjs-previous-button')
        && !focusable.closest('.vjs-next-button')) {
        focusable.setAttribute('tabindex', '-1');
      }
    });
  }

  modal.el().focus();
}
