import React from "react";
import { fireEvent, render, screen } from '@testing-library/react';
import SupplementalFiles from "./SupplementalFiles";
import manifest from '@TestData/lunchroom-manners';
import noFilesManifest from '@TestData/transcript-canvas';
import { withManifestProvider } from '../../services/testing-helpers';
import * as utils from '@Services/utility-helpers';

describe('SupplementalFiles', () => {
  describe('with manifest including supplemental files', () => {
    beforeEach(() => {
      const SupplementalFileWrapped = withManifestProvider(SupplementalFiles, {
        initialState: { manifest, canvasIndex: 0 },
      });
      render(<SupplementalFileWrapped />);
    });
    test('renders files successfully', () => {
      expect(screen.queryByTestId('supplemental-files')).toBeInTheDocument();
      expect(screen.queryByTestId('supplemental-files-heading')).toBeInTheDocument();
      expect(screen.queryByTestId('supplemental-files-display-content')).toBeInTheDocument();
      expect(screen.queryByTestId('supplemental-files-empty')).not.toBeInTheDocument();
    });
    test('renders file labels', () => {
      expect(screen.getByText('Captions in WebVTT format (.vtt)')).toBeInTheDocument();
      expect(screen.getByText('Transcript file (.vtt)')).toBeInTheDocument();
    });
    test('file download is invoked by clicking on links', () => {
      let fileDownloadMock = jest.spyOn(utils, 'fileDownload')
        .mockImplementation(jest.fn());
      let fileLink = screen.getByText('Captions in WebVTT format (.vtt)');
      expect(fileLink.getAttribute('href')).toEqual('https://example.com/manifest/lunchroom_manners.vtt');

      // Click on file link
      fireEvent.click(fileLink);

      expect(fileDownloadMock).toHaveBeenCalledTimes(1);
      expect(fileDownloadMock).toHaveBeenCalledWith(
        'https://example.com/manifest/lunchroom_manners.vtt',
        'Captions in WebVTT format'
      );
    });
  });

  test('renders a message without supplemental files in manifest', () => {
    const SupplementalFileWrapped = withManifestProvider(SupplementalFiles, {
      initialState: { manifest: noFilesManifest, canvasIndex: 0 },
    });
    render(<SupplementalFileWrapped />);
    expect(screen.queryByTestId('supplemental-files')).toBeInTheDocument();
    expect(screen.queryByTestId('supplemental-files-display-content')).not.toBeInTheDocument();
    expect(screen.queryByTestId('supplemental-files-empty')).toBeInTheDocument();
    expect(screen.getByText('No Supplemental Files in Manifest')).toBeInTheDocument();
  });

  test('with showHeading=false renders without header', () => {
    const SupplementalFileWrapped = withManifestProvider(SupplementalFiles, {
      initialState: { manifest, canvasIndex: 0 }, showHeading: false
    });
    render(<SupplementalFileWrapped />);
    expect(screen.queryByTestId('supplemental-files')).toBeInTheDocument();
    expect(screen.queryByTestId('supplemental-files-heading')).not.toBeInTheDocument();
  });

  describe('renders given titles', () => {
    test('with itemHeading="Manifest files"', () => {
      const SupplementalFileWrapped = withManifestProvider(SupplementalFiles, {
        initialState: { manifest, canvasIndex: 0 }, itemHeading: 'Manifest files'
      });
      render(<SupplementalFileWrapped />);
      expect(screen.getByText('Manifest files')).toBeInTheDocument();
    });

    test('with sectionHeading="Canvas files"', () => {
      const SupplementalFileWrapped = withManifestProvider(SupplementalFiles, {
        initialState: { manifest, canvasIndex: 0 }, sectionHeading: 'Canvas files'
      });
      render(<SupplementalFileWrapped />);
      expect(screen.getByText('Canvas files')).toBeInTheDocument();
    });
  });
});

