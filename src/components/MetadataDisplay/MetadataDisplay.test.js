import React from 'react';
import { render, screen } from '@testing-library/react';
import MetadataDisplay from './MetadataDisplay';
import manifest from '@TestData/lunchroom-manners';
import manfiestWoMetadata from '@TestData/volleyball-for-boys';
import playlistManifest from '@TestData/playlist';
import { withManifestProvider } from '../../services/testing-helpers';

describe('MetadataDisplay component', () => {
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

    describe('with prop, readCanvasMetadata', () => {
      it('with default value displays Manifest-level metadata', () => {
        const MetadataDisp = withManifestProvider(MetadataDisplay, {
          initialState: { manifest: playlistManifest }
        });
        render(<MetadataDisp />);
        expect(screen.queryByTestId('metadata-display')).toBeInTheDocument();
        expect(screen.queryByTestId('metadata-display-title')).toBeInTheDocument();
        expect(screen.queryByText('Title')).toBeInTheDocument();
        expect(screen.queryByText('Playlist Manifest [Playlist]')).toBeInTheDocument();
      });

      it('set to true displays Canvas-level metadata', () => {
        let originalError = console.error;
        console.error = jest.fn();
        const MetadataDisp = withManifestProvider(MetadataDisplay, {
          initialState: { manifest: playlistManifest, canvasIndex: 0 },
          readCanvasMetadata: true
        });
        render(<MetadataDisp />);
        expect(screen.queryByTestId('metadata-display')).toBeInTheDocument();
        expect(screen.queryByTestId('metadata-display-title')).toBeInTheDocument();
        expect(screen.queryByText('Title')).toBeInTheDocument();
        expect(screen.queryByText('First Playlist Item')).toBeInTheDocument();
        console.error = originalError;
      });
    });
  });

  it('with manifest without metadata renders a message', () => {
    // Mock console.error
    let originalError = console.error;
    console.error = jest.fn();
    const MetadataDisp = withManifestProvider(MetadataDisplay, {
      initialState: { manifest: manfiestWoMetadata },
    });
    render(<MetadataDisp />);
    expect(screen.queryByTestId('metadata-display')).toBeInTheDocument();
    expect(screen.getByText('No valid Metadata is in the Manifest/Canvas(es)')).toBeInTheDocument();
    expect(console.error).toBeCalledTimes(1);
    console.error = originalError;
  });
});
