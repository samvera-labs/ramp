import React from 'react';
import { render, screen } from '@testing-library/react';
import MetadataDisplay from './MetadataDisplay';
import manifest from '@TestData/lunchroom-manners';
import manifestWoMetadata from '@TestData/volleyball-for-boys';
import manifestWoCanvases from '@TestData/empty-playlist';
import noRightsManifest from '@TestData/transcript-annotation';
import playlistManifest from '@TestData/playlist';
import { withManifestProvider } from '../../services/testing-helpers';

describe('MetadataDisplay component', () => {
  let originalLogger;
  beforeAll(() => {
    // Mock console.log function
    originalLogger = console.log;
    console.log = jest.fn();
  });
  afterAll(() => {
    // Clen up mock
    console.log = originalLogger;
  });

  describe('with manifest with metadata', () => {
    describe('with prop, displayTitle', () => {
      test('with default value displays title in metadata', () => {
        const MetadataDisp = withManifestProvider(MetadataDisplay, {
          initialState: { manifest },
        });
        render(<MetadataDisp />);
        expect(screen.getByText('Title')).toBeInTheDocument();
      });

      test('set to false, doesn\'t display title in metadata', () => {
        const MetadataDisp = withManifestProvider(MetadataDisplay, {
          initialState: { manifest },
          displayTitle: false,
        });
        render(<MetadataDisp />);
        expect(screen.queryByTestId('metadata-display')).toBeInTheDocument();
        expect(screen.queryByTestId('metadata-display-title')).toBeInTheDocument();
        expect(screen.queryByText('Title')).not.toBeInTheDocument();
      });

    });

    describe('with prop, showHeading', () => {
      it('with default value displays Details heading', () => {
        const MetadataDisp = withManifestProvider(MetadataDisplay, {
          initialState: { manifest }
        });
        render(<MetadataDisp />);
        expect(screen.queryByTestId('metadata-display')).toBeInTheDocument();
        expect(screen.queryByTestId('metadata-display-title')).toBeInTheDocument();
        expect(screen.queryByTestId('manifest-rights')).toBeInTheDocument();
      });

      it('set to false doesn\'t display Details heading', () => {
        const MetadataDisp = withManifestProvider(MetadataDisplay, {
          initialState: { manifest },
          showHeading: false,
        });
        render(<MetadataDisp />);
        expect(screen.queryByTestId('metadata-display')).toBeInTheDocument();
        expect(screen.queryByTestId('metadata-display-title')).not.toBeInTheDocument();
      });
    });

    describe('with prop, displayOnlyCanvasMetadata', () => {
      it('with default value displays Manifest metadata', () => {
        const MetadataDisp = withManifestProvider(MetadataDisplay, {
          initialState: { manifest: playlistManifest }
        });
        render(<MetadataDisp />);
        expect(screen.queryByTestId('metadata-display')).toBeInTheDocument();
        expect(screen.queryByTestId('metadata-display-title')).toBeInTheDocument();

        // Has one title field with Manifest metadata
        expect(screen.queryAllByText('Title')).toHaveLength(1);
        expect(screen.queryByText('Playlist Manifest [Playlist]')).toBeInTheDocument();
        expect(screen.queryByText('Second Playlist Item')).not.toBeInTheDocument();
      });

      it('set to true displays only Canvas metadata', () => {
        const MetadataDisp = withManifestProvider(MetadataDisplay, {
          initialState: { manifest: playlistManifest, canvasIndex: 2 },
          displayOnlyCanvasMetadata: true
        });
        render(<MetadataDisp />);
        expect(screen.queryByTestId('metadata-display')).toBeInTheDocument();
        expect(screen.queryByTestId('metadata-display-title')).toBeInTheDocument();

        // Has one title field with Manifest metadata
        expect(screen.queryAllByText('Title')).toHaveLength(1);
        expect(screen.queryByText('Playlist Manifest [Playlist]')).not.toBeInTheDocument();
        expect(screen.queryByText('Second Playlist Item')).toBeInTheDocument();

        expect(console.log).toBeCalled();
      });

      it('set to true with displayTitle set to false displays Canvas metadata w/o title', () => {
        const MetadataDisp = withManifestProvider(MetadataDisplay, {
          initialState: { manifest: playlistManifest, canvasIndex: 2 },
          displayOnlyCanvasMetadata: true,
          displayTitle: false
        });
        render(<MetadataDisp />);
        expect(screen.queryByTestId('metadata-display')).toBeInTheDocument();
        expect(screen.queryByTestId('metadata-display-title')).toBeInTheDocument();

        // Doesn't display title
        expect(screen.queryByText('Title')).not.toBeInTheDocument();
        expect(screen.queryByText('Second Playlist Item')).not.toBeInTheDocument();

        // Displays other metadata
        expect(screen.queryByText('Date')).toBeInTheDocument();
        expect(screen.queryByText('2023')).toBeInTheDocument();

        expect(console.log).toBeCalled();
      });
    });

    describe('with prop, displayAllMetadata', () => {
      it('with default value displays only Manifest metadata', () => {
        const MetadataDisp = withManifestProvider(MetadataDisplay, {
          initialState: { manifest: playlistManifest }
        });
        render(<MetadataDisp />);
        expect(screen.queryByTestId('metadata-display')).toBeInTheDocument();
        expect(screen.queryByTestId('metadata-display-title')).toBeInTheDocument();

        // Has one title field with Manifest metadata
        expect(screen.queryAllByText('Title')).toHaveLength(1);
        expect(screen.queryByText('Playlist Manifest [Playlist]')).toBeInTheDocument();
        expect(screen.queryByText('First Playlist Item')).not.toBeInTheDocument();
      });

      it('set to true displays both Manifest and Canvas metadata', () => {
        const MetadataDisp = withManifestProvider(MetadataDisplay, {
          initialState: { manifest: playlistManifest, canvasIndex: 2 },
          displayAllMetadata: true
        });
        render(<MetadataDisp />);
        expect(screen.queryByTestId('metadata-display')).toBeInTheDocument();
        expect(screen.queryByTestId('metadata-display-title')).toBeInTheDocument();

        // Has two title fields with both Manifest and Canvas metadata
        expect(screen.queryAllByText('Title')).toHaveLength(2);
        expect(screen.queryByText('Playlist Manifest [Playlist]')).toBeInTheDocument();
        expect(screen.queryByText('Second Playlist Item')).toBeInTheDocument();

        expect(console.log).toBeCalled();
      });

      it('set to true with displayTitle set to false hides title in all metadata', () => {
        const MetadataDisp = withManifestProvider(MetadataDisplay, {
          initialState: { manifest: playlistManifest, canvasIndex: 2 },
          displayAllMetadata: true,
          displayTitle: false
        });
        render(<MetadataDisp />);
        expect(screen.queryByTestId('metadata-display')).toBeInTheDocument();
        expect(screen.queryByTestId('metadata-display-title')).toBeInTheDocument();

        // Has one title fields for only Canvas metadata
        expect(screen.queryAllByText('Title')).toHaveLength(0);
        expect(screen.queryByText('Playlist Manifest [Playlist]')).not.toBeInTheDocument();
        expect(screen.queryByText('First Playlist Item')).not.toBeInTheDocument();

        expect(console.log).toBeCalled();
      });
    });

    describe('rights section', () => {
      describe('displays when rights/requiredStatement is present', () => {
        test('with manifest metadata', () => {
          const MetadataDisp = withManifestProvider(MetadataDisplay, {
            initialState: { manifest }
          });
          render(<MetadataDisp />);
          expect(screen.queryByTestId('metadata-display')).toBeInTheDocument();
          expect(screen.queryByTestId('metadata-display-title')).toBeInTheDocument();
          expect(screen.queryByTestId('manifest-rights')).toBeInTheDocument();
          expect(screen.getByText('License')).toBeInTheDocument();
          expect(screen.queryByTestId('canvas-rights')).not.toBeInTheDocument();
        });

        test('with canvas metadata', () => {
          const MetadataDisp = withManifestProvider(MetadataDisplay, {
            initialState: { manifest: playlistManifest, canvasIndex: 2 },
            displayOnlyCanvasMetadata: true,
          });
          render(<MetadataDisp />);
          expect(screen.queryByTestId('metadata-display')).toBeInTheDocument();
          expect(screen.queryByTestId('metadata-display-title')).toBeInTheDocument();
          expect(screen.queryByTestId('manifest-rights')).not.toBeInTheDocument();
          expect(screen.queryByTestId('canvas-rights')).toBeInTheDocument();
          expect(screen.getByText('Attribution')).toBeInTheDocument();
        });

        test('with manifest and canvas metadata', () => {
          const MetadataDisp = withManifestProvider(MetadataDisplay, {
            initialState: { manifest: playlistManifest, canvasIndex: 2 },
            displayAllMetadata: true,
          });
          render(<MetadataDisp />);
          expect(screen.queryByTestId('metadata-display')).toBeInTheDocument();
          expect(screen.queryByTestId('metadata-display-title')).toBeInTheDocument();
          expect(screen.queryByTestId('manifest-rights')).toBeInTheDocument();
          expect(screen.getByText('License')).toBeInTheDocument();
          expect(screen.queryByTestId('canvas-rights')).toBeInTheDocument();
          expect(screen.getByText('Attribution')).toBeInTheDocument();
        });
      });

      describe('does not display when rights/requiredStatement is not present', () => {
        test('with manifest metadata', () => {
          const MetadataDisp = withManifestProvider(MetadataDisplay, {
            initialState: { manifest: noRightsManifest }
          });
          render(<MetadataDisp />);
          expect(screen.queryByTestId('metadata-display')).toBeInTheDocument();
          expect(screen.queryByTestId('metadata-display-title')).toBeInTheDocument();
          expect(screen.queryByTestId('manifest-rights')).not.toBeInTheDocument();
        });

        test('with canvas metadata', () => {
          const MetadataDisp = withManifestProvider(MetadataDisplay, {
            initialState: { manifest: noRightsManifest, canvasIndex: 0 },
            displayOnlyCanvasMetadata: true,
          });
          render(<MetadataDisp />);
          expect(screen.queryByTestId('metadata-display')).toBeInTheDocument();
          expect(screen.queryByTestId('metadata-display-title')).toBeInTheDocument();
          expect(screen.queryByTestId('canvas-rights')).not.toBeInTheDocument();
        });

        test('with manifest and canvas metadata', () => {
          const MetadataDisp = withManifestProvider(MetadataDisplay, {
            initialState: { manifest: noRightsManifest, canvasIndex: 0 },
            displayAllMetadata: true,
          });
          render(<MetadataDisp />);
          expect(screen.queryByTestId('metadata-display')).toBeInTheDocument();
          expect(screen.queryByTestId('metadata-display-title')).toBeInTheDocument();
          expect(screen.queryByTestId('manifest-rights')).not.toBeInTheDocument();
          expect(screen.queryByTestId('canvas-rights')).not.toBeInTheDocument();
        });
      });
    });
  });

  it('with manifest without metadata renders a message', () => {
    const MetadataDisp = withManifestProvider(MetadataDisplay, {
      initialState: { manifest: manifestWoMetadata },
    });
    render(<MetadataDisp />);
    expect(screen.queryByTestId('metadata-display')).toBeInTheDocument();
    expect(screen.queryByTestId('metadata-display-message')).toBeInTheDocument();
    expect(screen.getByText('No valid Metadata is in the Manifest/Canvas(es)')).toBeInTheDocument();
    expect(console.log).toBeCalledTimes(1);
  });

  it('with manifest without canavses renders a message', () => {
    const MetadataDisp = withManifestProvider(MetadataDisplay, {
      initialState: { manifest: manifestWoCanvases },
      displayOnlyCanvasMetadata: true,
      displayTitle: false
    });
    render(<MetadataDisp />);
    expect(screen.queryByTestId('metadata-display')).toBeInTheDocument();
    expect(screen.queryByTestId('metadata-display-message')).toBeInTheDocument();
    expect(screen.getByText('No valid Metadata is in the Manifest/Canvas(es)')).toBeInTheDocument();
    expect(console.log).toBeCalledTimes(0);
  });
});
