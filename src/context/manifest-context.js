import { parseAnnotationSets } from '@Services/annotations-parser';
import { canvasesInManifest, parseAutoAdvance } from '../services/iiif-parser';
import { getAnnotationService, getIsPlaylist } from '@Services/playlist-parser';
import React, { createContext, useContext, useReducer } from 'react';

export const ManifestStateContext = createContext();
export const ManifestDispatchContext = createContext();

/**
 * Definition of all state variables in this Context
 */
const defaultState = {
  manifest: null,
  allCanvases: [],
  canvasIndex: 0, // index for active canvas
  currentNavItem: null,
  canvasDuration: 0,
  canvasLink: null,
  canvasIsEmpty: false,
  customStart: {
    startIndex: 0,
    startTime: 0,
  },
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
  renderings: {},
  canvasSegments: [],
  structures: {
    hasStructure: false, // current Canvas has structure timespans
    isCollapsed: false, // all sections are expanded by default
    structItems: [],
  },
  annotations: [], // [{ canvasIndex: Number, annotationSets: Array }]
  clickedAnnotation: null, // clicked annotation in the Canvas
};

function getHasStructure(canvasSegments, canvasIndex) {
  // Update hasStructure flag when canvas changes
  const canvasStructures =
    canvasSegments?.length > 0
      ? canvasSegments.filter((c) =>
        c.canvasIndex == canvasIndex + 1 && !c.isCanvas
      )
      : [];

  return canvasStructures.length > 0;
}

function hasParsedCanvasAnnotations(annotations, canvasIndex) {
  const parsedAnnotations = annotations.filter((a) => a.canvasIndex == canvasIndex);
  return parsedAnnotations?.length > 0;
}

function manifestReducer(state = defaultState, action) {
  switch (action.type) {
    case 'updateManifest': {
      const manifest = action.manifest;
      const canvases = canvasesInManifest(manifest);
      const manifestBehavior = parseAutoAdvance(manifest.behavior);
      const isPlaylist = getIsPlaylist(manifest.label);
      const annotationService = getAnnotationService(manifest.service);

      return {
        ...state,
        manifest: manifest,
        allCanvases: canvases,
        autoAdvance: manifestBehavior,
        playlist: {
          ...state.playlist,
          isPlaylist: isPlaylist,
          annotationServiceId: annotationService,
          hasAnnotationService: annotationService ? true : false,
        },
      };
    }
    case 'switchCanvas': {
      const hasAnnotations = hasParsedCanvasAnnotations(state.annotations, action.canvasIndex);
      return {
        ...state,
        canvasIndex: action.canvasIndex,
        structures: {
          ...state.structures,
          hasStructure: getHasStructure(state.canvasSegments, action.canvasIndex),
        },
        annotations: hasAnnotations
          ? [...state.annotations]
          : [...state.annotations, parseAnnotationSets(state.manifest, action.canvasIndex)]
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
    case 'canvasLink': {
      return {
        ...state,
        canvasLink: action.canvasLink,
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
      // Set a new set of markers for a Canvas in the Manifest
      if (action.markers) {
        return {
          ...state,
          playlist: {
            ...state.playlist,
            markers: [...state.playlist.markers, action.markers],
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
    case 'setCanvasIsEmpty': {
      return {
        ...state,
        canvasIsEmpty: action.isEmpty,
      };
    }
    case 'setStructures': {
      return {
        ...state,
        structures: {
          ...state.structures,
          structItems: action.structures,
        }
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
        structures: {
          ...state.structures,
          hasStructure: canvasStructures.length > 0,
        },
      };
    }
    case 'setCustomStart': {
      const { canvas, time } = action.customStart;
      return {
        ...state,
        customStart: {
          startIndex: canvas,
          startTime: time,
        },
        canvasIndex: canvas,
        structures: {
          ...state.structures,
          hasStructure: getHasStructure(state.canvasSegments, canvas),
        },
      };
    }
    case 'setRenderingFiles': {
      return {
        ...state,
        renderings: { ...action.renderings }
      };
    }
    case 'setIsCollapsed': {
      return {
        ...state,
        structures: {
          ...state.structures,
          isCollapsed: action.isCollapsed
        }
      };
    }
    case 'setAnnotations': {
      return {
        ...state,
        annotations: [...state.annotations, action.annotations]
      };
    }
    case 'setClickedAnnotation': {
      return {
        ...state,
        clickedAnnotation: action.clickedAnnotation,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function ManifestProvider({ initialState = defaultState, children }) {
  const [state, dispatch] = useReducer(manifestReducer, initialState);
  return (
    <ManifestStateContext.Provider value={state}>
      <ManifestDispatchContext.Provider value={dispatch}>
        {children}
      </ManifestDispatchContext.Provider>
    </ManifestStateContext.Provider>
  );
}

function useManifestState() {
  const context = useContext(ManifestStateContext);
  if (context === undefined) {
    throw new Error('useManifestState must be used within a ManifestProvider');
  }
  return context;
}

function useManifestDispatch() {
  const context = useContext(ManifestDispatchContext);
  if (context === undefined) {
    throw new Error(
      'useManifestDispatch must be used within a ManifestProvider'
    );
  }
  return context;
}

export { ManifestProvider, useManifestDispatch, useManifestState };
