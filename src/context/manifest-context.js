import React from 'react';

export const ManifestStateContext = React.createContext();
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
    markers: [], // [{ canvasIndex: Number, canvasMarkers: Array, error: String }]
    isEditing: false,
    isPlaylist: false,
    hasAnnotationService: false,
    annotationServiceId: '',
  },
  structures: [],
  canvasSegments: [],
  hasStructure: false, // current Canvas has structure timespans
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
      // Update hasStructure flag when canvas changes
      const canvasStructures =
        state.canvasSegments?.length > 0
          ? state.canvasSegments.filter((c) =>
            c.canvasIndex == action.canvasIndex + 1 && !c.isCanvas
          )
          : false;
      return {
        ...state,
        canvasIndex: action.canvasIndex,
        hasStructure: canvasStructures.length > 0,
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
      // Set a new set of markers for the canvases in the Manifest
      if (action.markers) {
        return {
          ...state,
          playlist: {
            ...state.playlist,
            markers: action.markers,
          }
        };
      }
      // Update the existing markers for the current canvas on CRUD ops
      if (action.updatedMarkers) {
        return {
          ...state,
          playlist: {
            ...state.playlist,
            markers: state.playlist.markers.map((m) => {
              if (m.canvasIndex === state.canvasIndex) {
                m.canvasMarkers = action.updatedMarkers;
              }
              return m;
            })
          }
        };

      }
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
    case 'setAnnotationService': {
      return {
        ...state,
        playlist: {
          ...state.playlist,
          annotationServiceId: action.annotationService,
          hasAnnotationService: action.annotationService ? true : false,
        }
      };
    }
    case 'setStructures': {
      return {
        ...state,
        structures: action.structures,
      };
    }
    case 'setCanvasSegments': {
      // Update hasStructure flag when canvasSegments are calculated
      const canvasStructures =
        action.timespans.filter((c) =>
          c.canvasIndex == state.canvasIndex + 1 && !c.isCanvas
        );
      return {
        ...state,
        canvasSegments: action.timespans,
        hasStructure: canvasStructures.length > 0,
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
