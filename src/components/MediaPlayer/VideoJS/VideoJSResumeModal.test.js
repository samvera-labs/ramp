import { showResumeModal } from './VideoJSResumeModal';

/**
 * Build a minimal Video.js player mock with what 'showResumeModal' feature needs
 */
const buildPlayerMock = () => {
  const modalEl = document.createElement('div');
  modalEl.setAttribute('data-testid', 'resume-playback-modal');
  const contentEl = document.createElement('div');
  modalEl.appendChild(contentEl);

  const modal = {
    el: () => modalEl,
    contentEl: () => contentEl,
    close: jest.fn(),
    addClass: jest.fn(),
    setAttribute: jest.fn(),
  };

  const player = {
    createModal: jest.fn(() => modal),
    currentTime: jest.fn(),
    play: jest.fn(),
  };

  return { player, modal, contentEl };
};

describe('VideoJSResumeModal component', () => {
  const MANIFEST_URL = 'https://example.com/manifest/1';
  const SAVED_TIME = 120;

  let clearPosition;
  let player, contentEl, modal;

  beforeEach(() => {
    clearPosition = jest.fn();
    const playerMock = buildPlayerMock();
    player = playerMock.player;
    contentEl = playerMock.contentEl;
    modal = playerMock.modal;
  });

  describe('renders dismiss button label', () => {
    test('as "No, start from beginning" when \'isCrossCanvas=false\' (default)', () => {
      const resumeModalRef = { current: null };
      showResumeModal(player, resumeModalRef, SAVED_TIME, MANIFEST_URL, clearPosition);

      const dismissBtn = contentEl.querySelector('.vjs-resume-dismiss-button');
      expect(dismissBtn).not.toBeNull();
      expect(dismissBtn.textContent).toBe('No, start from beginning');
    });

    test('as "No, start from beginning of this section" when \'isCrossCanvas=true\'', () => {
      const resumeModalRef = { current: null };
      showResumeModal(player, resumeModalRef, SAVED_TIME, MANIFEST_URL, clearPosition, true);

      const dismissBtn = contentEl.querySelector('.vjs-resume-dismiss-button');
      expect(dismissBtn).not.toBeNull();
      expect(dismissBtn.textContent).toBe('No, start from beginning of this section');
    });
  });

  describe('modal body', () => {
    test('includes the formatted saved time in the text', () => {
      const resumeModalRef = { current: null };
      showResumeModal(player, resumeModalRef, SAVED_TIME, MANIFEST_URL, clearPosition);

      expect(player.createModal).toHaveBeenCalledWith(
        'Resume playback from 02:00?',
        expect.objectContaining({ temporary: false, uncloseable: true })
      );
    });

    test('renders dismiss buttons', () => {
      const resumeModalRef = { current: null };
      showResumeModal(player, resumeModalRef, SAVED_TIME, MANIFEST_URL, clearPosition);

      expect(contentEl.querySelector('.vjs-resume-button').textContent).toBe('Yes');
      expect(contentEl.querySelector('.vjs-resume-dismiss-button')).not.toBeNull();
    });
  });

  describe('clicking Yes', () => {
    test('seeks to saved time, clears position, closes modal, and plays', () => {
      const resumeModalRef = { current: null };
      showResumeModal(player, resumeModalRef, SAVED_TIME, MANIFEST_URL, clearPosition);

      contentEl.querySelector('.vjs-resume-button').click();

      expect(player.currentTime).toHaveBeenCalledWith(SAVED_TIME);
      expect(clearPosition).toHaveBeenCalledWith(MANIFEST_URL);
      expect(modal.close).toHaveBeenCalled();
      expect(player.play).toHaveBeenCalled();
    });
  });

  describe('clicking dismiss does not seek, clears position, closes modal, and plays when', () => {
    test('button has "No, start from beginning" text', () => {
      const resumeModalRef = { current: null };
      showResumeModal(player, resumeModalRef, SAVED_TIME, MANIFEST_URL, clearPosition);

      contentEl.querySelector('.vjs-resume-dismiss-button').click();

      expect(player.currentTime).not.toHaveBeenCalled();
      expect(clearPosition).toHaveBeenCalledWith(MANIFEST_URL);
      expect(modal.close).toHaveBeenCalled();
      expect(player.play).toHaveBeenCalled();
    });

    test('button has "No, start from beginning of this section" text', () => {
      const resumeModalRef = { current: null };
      showResumeModal(player, resumeModalRef, SAVED_TIME, MANIFEST_URL, clearPosition, true);

      contentEl.querySelector('.vjs-resume-dismiss-button').click();

      expect(player.currentTime).not.toHaveBeenCalled();
      expect(clearPosition).toHaveBeenCalledWith(MANIFEST_URL);
      expect(modal.close).toHaveBeenCalled();
      expect(player.play).toHaveBeenCalled();
    });
  });
});
