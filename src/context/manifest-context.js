import React from 'react';

const ManifestStateContext = React.createContext();
const ManifestDispatchContext = React.createContext();

/**
 * Definition of all state variables in this Context
 */
const defaultState = {
  manifest: null,
  canvasIndex: 0, // index for active canvas
  currentNavItem: null,
  canvasDuration: 0,
  canvasIsEmpty: false,
  targets: [],
  hasMultiItems: false, // multiple resources in a single canvas
  srcIndex: 0, // index for multiple resources in a single canvas
  startTime: 0,
  autoAdvance: false,
  playlist: {
    markers: [],
    isEditing: false,
    isPlaylist: false
  }
};

function manifestReducer(state = defaultState, action) {
  switch (action.type) {
    case 'updateManifest': {
      return {
        ...state,
        manifest: { ...action.manifest },
      };
    }
    case 'switchCanvas': {
      return {
        ...state,
        canvasIndex: action.canvasIndex,
      };
    }
    case 'switchItem': {
      return {
        ...state,
        currentNavItem: action.item,
      };
    }
    case 'canvasDuration': {
      return {
        ...state,
        canvasDuration: action.canvasDuration,
      };
    }
    case 'canvasTargets': {
      return {
        ...state,
        targets: action.canvasTargets,
      };
    }
    case 'hasMultipleItems': {
      return {
        ...state,
        hasMultiItems: action.isMultiSource,
      };
    }
    case 'setSrcIndex': {
      return {
        ...state,
        srcIndex: action.srcIndex,
      };
    }
    case 'setItemStartTime': {
      return {
        ...state,
        startTime: action.startTime,
      };
    }
    case 'setAutoAdvance': {
      return {
        ...state,
        autoAdvance: action.autoAdvance,
      };
    }
    case 'setPlaylistMarkers': {
      return {
        ...state,
        playlist: {
          ...state.playlist,
          markers: action.markers,
        }
      };
    }
    case 'setIsEditing': {
      return {
        ...state,
        playlist: {
          ...state.playlist,
          isEditing: action.isEditing,
        }
      };
    }
    case 'setIsPlaylist': {
      return {
        ...state,
        playlist: {
          ...state.playlist,
          isPlaylist: action.isPlaylist,
        }
      };
    }
    case 'setCanvasIsEmpty': {
      return {
        ...state,
        canvasIsEmpty: action.isEmpty,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function ManifestProvider({ initialState = defaultState, children }) {
  const [state, dispatch] = React.useReducer(manifestReducer, initialState);
  return (
    <ManifestStateContext.Provider value={state}>
      <ManifestDispatchContext.Provider value={dispatch}>
        {children}
      </ManifestDispatchContext.Provider>
    </ManifestStateContext.Provider>
  );
}

function useManifestState() {
  const context = React.useContext(ManifestStateContext);
  if (context === undefined) {
    throw new Error('useManifestState must be used within a ManifestProvider');
  }
  return context;
}

function useManifestDispatch() {
  const context = React.useContext(ManifestDispatchContext);
  if (context === undefined) {
    throw new Error(
      'useManifestDispatch must be used within a ManifestProvider'
    );
  }
  return context;
}

export { ManifestProvider, useManifestDispatch, useManifestState };
