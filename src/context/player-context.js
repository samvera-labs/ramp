import React from 'react';

const PlayerStateContext = React.createContext();
const PlayerDispatchContext = React.createContext();

/**
 * Definition of all state variables in this Context
 */
const defaultState = {
  player: null,
  clickedUrl: '',
  isCaptionOn: false,
  isClicked: false,
  isPlaying: false,
  startTime: null,
  endTime: null,
  isEnded: false,
  currentTime: null,
  playerRange: { start: null, end: null },
};

function PlayerReducer(state = defaultState, action) {
  switch (action.type) {
    case 'updatePlayer': {
      return { ...state, player: action.player };
    }
    case 'navClick': {
      return {
        ...state,
        clickedUrl: action.clickedUrl,
        isClicked: true,
      };
    }
    case 'resetClick': {
      return { ...state, isClicked: false };
    }
    case 'setTimeFragment': {
      return {
        ...state,
        startTime: action.startTime,
        endTime: action.endTime,
      };
    }
    case 'setPlayingStatus': {
      return { ...state, isPlaying: action.isPlaying };
    }
    case 'setCaptionStatus': {
      return { ...state, captionOn: action.captionOn };
    }
    case 'setIsEnded': {
      return { ...state, isEnded: action.isEnded };
    }
    case 'setCurrentTime': {
      return { ...state, currentTime: action.currentTime };
    }
    case 'setPlayerRange': {
      return {
        ...state,
        playerRange: {
          ...state.playerRange,
          start: action.start,
          end: action.end,
        },
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function PlayerProvider({ initialState = defaultState, children }) {
  const [state, dispatch] = React.useReducer(PlayerReducer, initialState);
  return (
    <PlayerStateContext.Provider value={state}>
      <PlayerDispatchContext.Provider value={dispatch}>
        {children}
      </PlayerDispatchContext.Provider>
    </PlayerStateContext.Provider>
  );
}

function usePlayerState() {
  const context = React.useContext(PlayerStateContext);
  if (context === undefined) {
    throw new Error(`usePlayerState must be used within the PlayerProvider`);
  }
  return context;
}

function usePlayerDispatch() {
  const context = React.useContext(PlayerDispatchContext);
  if (context === undefined) {
    throw new Error(`usePlayerDispatch must be used within the PlayerProvider`);
  }
  return context;
}

export { PlayerProvider, usePlayerState, usePlayerDispatch };
