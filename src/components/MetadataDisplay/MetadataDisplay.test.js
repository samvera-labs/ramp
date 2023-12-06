import React from 'react';
import { render, screen } from '@testing-library/react';
import MetadataDisplay from './MetadataDisplay';
import manifest from '@TestData/lunchroom-manners';
import manfiestWoMetadata from '@TestData/volleyball-for-boys';
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
        expect(screen.queryByText('First Playlist Item')).not.toBeInTheDocument();
      });

      it('set to true displays only Canvas metadata', () => {
        const MetadataDisp = withManifestProvider(MetadataDisplay, {
          initialState: { manifest: playlistManifest, canvasIndex: 0 },
          displayOnlyCanvasMetadata: true
        });
        render(<MetadataDisp />);
        expect(screen.queryByTestId('metadata-display')).toBeInTheDocument();
        expect(screen.queryByTestId('metadata-display-title')).toBeInTheDocument();

        // Has one title field with Manifest metadata
        expect(screen.queryAllByText('Title')).toHaveLength(1);
        expect(screen.queryByText('Playlist Manifest [Playlist]')).not.toBeInTheDocument();
        expect(screen.queryByText('First Playlist Item')).toBeInTheDocument();

        // console.log is called twice for the 2 canvases without metadata
        expect(console.log).toBeCalledTimes(2);
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
          initialState: { manifest: playlistManifest, canvasIndex: 0 },
          displayAllMetadata: true
        });
        render(<MetadataDisp />);
        expect(screen.queryByTestId('metadata-display')).toBeInTheDocument();
        expect(screen.queryByTestId('metadata-display-title')).toBeInTheDocument();

        // Has two title fields with both Manifest and Canvas metadata
        expect(screen.queryAllByText('Title')).toHaveLength(2);
        expect(screen.queryByText('Playlist Manifest [Playlist]')).toBeInTheDocument();
        expect(screen.queryByText('First Playlist Item')).toBeInTheDocument();

        // console.log is called twice for the 2 canvases without metadata
        expect(console.log).toBeCalledTimes(2);
      });
    });
  });

  it('with manifest without metadata renders a message', () => {
    const MetadataDisp = withManifestProvider(MetadataDisplay, {
      initialState: { manifest: manfiestWoMetadata },
    });
    render(<MetadataDisp />);
    expect(screen.queryByTestId('metadata-display')).toBeInTheDocument();
    expect(screen.queryByTestId('metadata-display-message')).toBeInTheDocument();
    expect(screen.getByText('No valid Metadata is in the Manifest/Canvas(es)')).toBeInTheDocument();
    expect(console.log).toBeCalledTimes(1);
  });
});
