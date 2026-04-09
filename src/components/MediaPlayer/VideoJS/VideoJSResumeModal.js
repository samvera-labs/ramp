import { timeToHHmmss } from '@Services/utility-helpers';

/**
 * Build and display the resume playback modal for a saved playback time for the Manifest.
 * @param {Object} player Video.js player instance
 * @param {Object} resumeModalRef React ref to hold the modal instance for cleanup
 * @param {Number} savedTime saved playback time in seconds
 * @param {String} manifestURL Manifest URL used as the cache key
 * @param {Function} clearPosition function to clear the saved position for the Manifest
 * @param {Boolean} isCrossCanvas whether saved time is on a different Canvas than the starting one
 */
export function showResumeModal(player, resumeModalRef, savedTime, manifestURL, clearPosition, isCrossCanvas = false) {
  const resumeLabel = `Resume playback from ${timeToHHmmss(savedTime)}?`;
  const modal = player.createModal(
    `Resume playback from ${timeToHHmmss(savedTime)}?`,
    { temporary: false, uncloseable: true });
  resumeModalRef.current = modal;
  modal.addClass('vjs-resume-modal');
  modal.setAttribute('data-testid', 'resume-playback-modal');
  // Make the modal accessible by setting appropriate ARIA attributes
  modal.el().setAttribute('role', 'alertdialog');
  modal.el().setAttribute('aria-label', resumeLabel);
  modal.contentEl().setAttribute('aria-live', 'assertive');
  modal.contentEl().setAttribute('aria-atomic', 'true');

  // Create buttons for resuming or dismissing the modal
  const dismiss = (seekTo) => {
    // Set the player's current time to the saved time if user chooses to resume
    if (seekTo) player.currentTime(seekTo);
    /* Clear the cache entry for the Canvas on user confirmation,
    to avoid resuming from an outdated position in the future */
    clearPosition(manifestURL);
    modal.close();
    player.play();
  };

  const btnRow = document.createElement('div');
  btnRow.className = 'vjs-resume-button-row';

  const resumeBtn = document.createElement('button');
  resumeBtn.textContent = 'Yes';
  resumeBtn.className = 'vjs-resume-button';
  resumeBtn.addEventListener('click', () => dismiss(savedTime));
  btnRow.appendChild(resumeBtn);

  const dismissLabel = isCrossCanvas ? 'No, start from beginning of this section' : 'No, start from beginning';
  const dismissBtn = document.createElement('button');
  dismissBtn.textContent = dismissLabel;
  dismissBtn.className = 'vjs-resume-dismiss-button';
  dismissBtn.addEventListener('click', () => dismiss());
  btnRow.appendChild(dismissBtn);

  modal.contentEl().appendChild(btnRow);
}

