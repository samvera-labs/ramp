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

  const label = 'This item is currently unavailable.';
  const modal = player.createModal(label, { temporary: false, uncloseable: true });
  vjsErrorModalRef.current = modal;
  modal.addClass('vjs-custom-error-modal');
  modal.setAttribute('data-testid', 'error-access-modal');

  modal.el().setAttribute('role', 'alertdialog');
  modal.el().setAttribute('aria-label', label);
  modal.contentEl().setAttribute('aria-live', 'assertive');
  modal.contentEl().setAttribute('aria-atomic', 'true');

  const messageEl = document.createElement('p');
  messageEl.className = 'vjs-custom-error-modal-message';
  messageEl.textContent = message;
  modal.contentEl().appendChild(messageEl);
  player.removeClass('vjs-disabled');

  if (isMultiCanvased) {
    // Show the control bar with only prev/next buttons focusable
    setControlBar(player, true);
    player.controlBar.el().querySelectorAll('button, [tabindex]').forEach((focusable) => {
      if (!focusable.closest('.vjs-previous-button')
        && !focusable.closest('.vjs-next-button')) {
        focusable.setAttribute('tabindex', '-1');
      }
    });
  } else {
    player.controlBar.hide();
  }

  modal.el().focus();
}
