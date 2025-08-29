import React from 'react';

/** SVG icons for the edit buttons in Annotations component */
export const EditIcon = () => {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
      style={{ fill: 'white', height: '1rem', width: '1rem', scale: 0.8 }}
    >
      <path fillRule="evenodd" clipRule="evenodd"
        d="M21.1213 2.70705C19.9497 1.53548 18.0503 1.53547 16.8787 2.70705L15.1989 
        4.38685L7.29289 12.2928C7.16473 12.421 7.07382 12.5816 7.02986 12.7574L6.02986 
        16.7574C5.94466 17.0982 6.04451 17.4587 6.29289 17.707C6.54127 17.9554 6.90176 
        18.0553 7.24254 17.9701L11.2425 16.9701C11.4184 16.9261 11.5789 16.8352 11.7071 
        16.707L19.5556 8.85857L21.2929 7.12126C22.4645 5.94969 22.4645 4.05019 21.2929 
        2.87862L21.1213 2.70705ZM18.2929 4.12126C18.6834 3.73074 19.3166 3.73074 19.7071 
        4.12126L19.8787 4.29283C20.2692 4.68336 20.2692 5.31653 19.8787 5.70705L18.8622 
        6.72357L17.3068 5.10738L18.2929 4.12126ZM15.8923 6.52185L17.4477 8.13804L10.4888 
        15.097L8.37437 15.6256L8.90296 13.5112L15.8923 6.52185ZM4 7.99994C4 7.44766 4.44772 
        6.99994 5 6.99994H10C10.5523 6.99994 11 6.55223 11 5.99994C11 5.44766 10.5523 
        4.99994 10 4.99994H5C3.34315 4.99994 2 6.34309 2 7.99994V18.9999C2 20.6568 3.34315 
        21.9999 5 21.9999H16C17.6569 21.9999 19 20.6568 19 18.9999V13.9999C19 13.4477 
        18.5523 12.9999 18 12.9999C17.4477 12.9999 17 13.4477 17 13.9999V18.9999C17 
        19.5522 16.5523 19.9999 16 19.9999H5C4.44772 19.9999 4 19.5522 4 18.9999V7.99994Z"
        fill="#fffff" />
    </svg>
  );
};

export const DeleteIcon = () => {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"
      style={{ height: '1rem', width: '1rem', scale: 0.8 }}
    >
      <g strokeWidth="0" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 12V17" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
        <path d="M14 12V17" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
        <path d="M4 7H20" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
        <path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
        <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
      </g>
    </svg>
  );
};

export const SaveIcon = () => {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ height: '1rem', width: '1rem', scale: 0.8 }}
    >
      <g strokeWidth="0" strokeLinecap="round" strokeLinejoin="round">
        <path id="Vector" d="M6 12L10.2426 16.2426L18.727 7.75732" stroke="#ffffff"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
      </g>
    </svg>
  );
};

export const CancelIcon = () => {
  return (
    <svg fill="#ffffff" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"
      style={{ height: '1rem', width: '1rem', scale: 0.8 }}
    >
      <g strokeWidth="0" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 
        0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 
        0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 
        0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 
        1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 
        0.396 0.396 1.038 0 1.435l-6.096 6.096z">
        </path>
      </g>
    </svg>
  );
};

/** SVG icon for previous/next buttons in player control bar */
export const SectionButtonIcon = ({ flip = false }) => {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ fill: 'white', height: '1.25rem', width: '1.25rem', transform: flip ? 'rotate(180deg)' : 'rotate(0)' }}>
      <g strokeWidth="0" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20L15.3333 12L4 4V20Z" fill="#ffffff"></path>
        <path d="M20 4H17.3333V20H20V4Z" fill="#ffffff"></path>
      </g>
    </svg>
  );
};

/** SVG icons for track scrubber button in player control bar */
export const TrackScrubberZoomInIcon = ({ scale }) => {
  return (
    <svg viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'
      style={{ fill: 'white', height: '1.25rem', width: '1.25rem', scale: scale }}>
      <g strokeWidth='0' strokeLinecap='round' strokeLinejoin='round'>
        <path fill='#ffffff' fillRule='evenodd' d='M4 9a5 5 0 1110 0A5 5 0 014 9zm5-7a7 7 0 104.2 12.6.999.999 
				0 00.093.107l3 3a1 1 0 001.414-1.414l-3-3a.999.999 0 00-.107-.093A7 7 0 009 2zM8 6.5a1 1 0 112 0V8h1.5a1 
				1 0 110 2H10v1.5a1 1 0 11-2 0V10H6.5a1 1 0 010-2H8V6.5z'>
        </path>
      </g>
    </svg>
  );
};

export const TrackScrubberZoomOutIcon = ({ scale }) => {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ fill: 'white', height: '1.25rem', width: '1.25rem', scale: scale }}>
      <g strokeWidth="0" strokeLinecap="round" strokeLinejoin="round">
        <path fillRule="evenodd" clipRule="evenodd" d="M4 11C4 7.13401 7.13401 4 11 4C14.866 4 18 7.13401 18 11C18 14.866 
				14.866 18 11 18C7.13401 18 4 14.866 4 11ZM11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C13.125 20 15.078 
				19.2635 16.6177 18.0319L20.2929 21.7071C20.6834 22.0976 21.3166 22.0976 21.7071 21.7071C22.0976 21.3166 22.0976 
				20.6834 21.7071 20.2929L18.0319 16.6177C19.2635 15.078 20 13.125 20 11C20 6.02944 15.9706 2 11 2Z" fill="#ffffff">
        </path>
        <path fillRule="evenodd" clipRule="evenodd" d="M7 11C7 10.4477 7.44772 10 8 10H14C14.5523 10 15 10.4477 15 11C15 
				11.5523 14.5523 12 14 12H8C7.44772 12 7 11.5523 7 11Z" fill="#ffffff">
        </path>
      </g>
    </svg>
  );
};

/** SVG icon for inaccessible items in StructuredNavigation component */
export const LockedSVGIcon = () => {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
      style={{ height: '0.75rem', width: '0.75rem' }} className="structure-item-locked"
    >
      <g strokeWidth="0" strokeLinecap="round" strokeLinejoin="round">
        <path fillRule="evenodd" clipRule="evenodd" d="M5.25 10.0546V8C5.25 4.27208 8.27208 
          1.25 12 1.25C15.7279 1.25 18.75 4.27208 18.75 8V10.0546C19.8648 10.1379 20.5907 
          10.348 21.1213 10.8787C22 11.7574 22 13.1716 22 16C22 18.8284 22 20.2426 21.1213 
          21.1213C20.2426 22 18.8284 22 16 22H8C5.17157 22 3.75736 22 2.87868 21.1213C2 
          20.2426 2 18.8284 2 16C2 13.1716 2 11.7574 2.87868 10.8787C3.40931 10.348 4.13525 
          10.1379 5.25 10.0546ZM6.75 8C6.75 5.10051 9.10051 2.75 12 2.75C14.8995 2.75 17.25 
          5.10051 17.25 8V10.0036C16.867 10 16.4515 10 16 10H8C7.54849 10 7.13301 10 6.75 
          10.0036V8Z" fill="#000000" />
      </g>
    </svg>
  );
};

/** SVG icon for previous/next search result in TranscriptSearch */
export const SearchArrow = ({ flip = false }) => {
  return (
    <svg viewBox="0 0 1024 1024" fill="#ffffff" xmlns="http://www.w3.org/2000/svg"
      style={{ height: '1rem', width: '1rem', scale: 0.8, transform: flip ? 'rotate(180deg)' : 'rotate(0)' }}>
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <path d="M256 120.768L306.432 64 768 512l-461.568 448L256 903.232 659.072 512z" fill="#ffffff"></path>
      </g>
    </svg>
  );
};

/** SVG icon for download button TranscriptDownloader */
export const FileDownloadIcon = () => {
  return (
    <svg viewBox="0 0 24 24" fill="#fffff" xmlns="http://www.w3.org/2000/svg"
      style={{ fill: 'none', height: '1.25rem', width: '1.25rem' }}>
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <rect width="24" height="24" fill="none"></rect>
        <path d="M5 12V18C5 18.5523 5.44772 19 6 19H18C18.5523 19 19 18.5523 19 18V12" stroke="#ffffff"
          strokeLinecap="round" strokeLinejoin="round"></path>
        <path d="M12 3L12 15M12 15L16 11M12 15L8 11" stroke="#ffffff" strokeLinecap="round"
          strokeLinejoin="round">
        </path>
      </g>
    </svg>
  );
};
