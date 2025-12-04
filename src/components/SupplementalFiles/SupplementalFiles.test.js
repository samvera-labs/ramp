import React from "react";
import { fireEvent, render, screen } from '@testing-library/react';
import SupplementalFiles from "./SupplementalFiles";
import { ErrorBoundary } from "react-error-boundary";
import manifest from '@TestData/lunchroom-manners';
import canvasFilesManifest from '@TestData/transcript-annotation';
import manifestFiles from '@TestData/transcript-canvas';
import multiCanvas from '@TestData/transcript-multiple-canvas';
import noFilesManifest from '@TestData/multiple-canvas-auto-advance';
import { withManifestProvider } from '../../services/testing-helpers';
import * as utils from '@Services/utility-helpers';
import { getRenderingFiles } from "@Services/iiif-parser";

describe('SupplementalFiles', () => {
  describe('with manifest including supplemental files', () => {
    beforeEach(() => {
      const SupplementalFileWrapped = withManifestProvider(SupplementalFiles, {
        initialState: { renderings: getRenderingFiles(manifest), canvasIndex: 0 },
      });
      render(
        <ErrorBoundary>
          <SupplementalFileWrapped />
        </ErrorBoundary>
      );
    });
    test('displays files successfully', () => {
      expect(screen.queryByTestId('supplemental-files')).toBeInTheDocument();
      expect(screen.queryByTestId('supplemental-files-heading')).toBeInTheDocument();
      expect(screen.queryByTestId('supplemental-files-display-content')).toBeInTheDocument();
      expect(screen.queryByTestId('supplemental-files-empty')).not.toBeInTheDocument();
    });
    test('displays file labels only for rendering files', () => {
      expect(screen.getByText('Transcript rendering file (.vtt)')).toBeInTheDocument();
      expect(screen.getByText('Canvas - Supplement file (.vtt)')).toBeInTheDocument();
      expect(screen.queryAllByText('Captions in WebVTT format (.vtt)')).toHaveLength(0);
    });
  });

  test('does not display section title when canvases have no supplemental files', () => {
    const SupplementalFileWrapped = withManifestProvider(SupplementalFiles, {
      initialState: { renderings: getRenderingFiles(multiCanvas), canvasIndex: 0 },
    });
    render(
      <ErrorBoundary>
        <SupplementalFileWrapped />
      </ErrorBoundary>
    );
    expect(screen.queryByTestId('supplemental-files')).toBeInTheDocument();
    expect(screen.queryByTestId('supplemental-files-heading')).toBeInTheDocument();
    expect(screen.queryByTestId('supplemental-files-display-content')).toBeInTheDocument();
    expect(screen.queryByText('Section files')).not.toBeInTheDocument();
    expect(screen.queryByText('Item files')).toBeInTheDocument();
  });

  test('displays files when supplemental files are only at Canvas level', () => {
    const SupplementalFileWrapped = withManifestProvider(SupplementalFiles, {
      initialState: { renderings: getRenderingFiles(canvasFilesManifest), canvasIndex: 0 },
    });
    render(
      <ErrorBoundary>
        <SupplementalFileWrapped />
      </ErrorBoundary>
    );
    expect(screen.queryByTestId('supplemental-files')).toBeInTheDocument();
    expect(screen.queryByTestId('supplemental-files-heading')).toBeInTheDocument();
    expect(screen.queryByTestId('supplemental-files-display-content')).toBeInTheDocument();
    expect(screen.getByText('Poster image (.jpg)')).toBeInTheDocument();
    expect(screen.queryByTestId('supplemental-files-empty')).not.toBeInTheDocument();
  });

  test('displays files when suppelemental files are only at Manifest level', () => {
    const SupplementalFileWrapped = withManifestProvider(SupplementalFiles, {
      initialState: { renderings: getRenderingFiles(manifestFiles), canvasIndex: 0 },
    });
    render(
      <ErrorBoundary>
        <SupplementalFileWrapped />
      </ErrorBoundary>
    );
    expect(screen.queryByTestId('supplemental-files')).toBeInTheDocument();
    expect(screen.queryByTestId('supplemental-files-heading')).toBeInTheDocument();
    expect(screen.queryByTestId('supplemental-files-display-content')).toBeInTheDocument();
    expect(screen.getByText('Transcript file (.vtt)')).toBeInTheDocument();
    expect(screen.queryByTestId('supplemental-files-empty')).not.toBeInTheDocument();
  });

  test('displays a message without supplemental files in manifest', () => {
    const SupplementalFileWrapped = withManifestProvider(SupplementalFiles, {
      initialState: { renderings: getRenderingFiles(noFilesManifest), canvasIndex: 0 },
    });
    render(
      <ErrorBoundary>
        <SupplementalFileWrapped />
      </ErrorBoundary>
    );
    expect(screen.queryByTestId('supplemental-files')).toBeInTheDocument();
    expect(screen.queryByTestId('supplemental-files-display-content')).not.toBeInTheDocument();
    expect(screen.queryByTestId('supplemental-files-empty')).toBeInTheDocument();
    expect(screen.getByText('No Supplemental file(s) in Manifest')).toBeInTheDocument();
  });

  test('with showHeading=false renders without header', () => {
    const SupplementalFileWrapped = withManifestProvider(SupplementalFiles, {
      initialState: { renderings: getRenderingFiles(manifest), canvasIndex: 0 }, showHeading: false
    });
    render(
      <ErrorBoundary>
        <SupplementalFileWrapped />
      </ErrorBoundary>
    );
    expect(screen.queryByTestId('supplemental-files')).toBeInTheDocument();
    expect(screen.queryByTestId('supplemental-files-heading')).not.toBeInTheDocument();
  });

  describe('displays given titles', () => {
    test('with itemHeading="Manifest files"', () => {
      const SupplementalFileWrapped = withManifestProvider(SupplementalFiles, {
        initialState: { renderings: getRenderingFiles(manifest), canvasIndex: 0 }, itemHeading: 'Manifest files'
      });
      render(
        <ErrorBoundary>
          <SupplementalFileWrapped />
        </ErrorBoundary>
      );
      expect(screen.getByText('Manifest files')).toBeInTheDocument();
    });

    test('with sectionHeading="Canvas files"', () => {
      const SupplementalFileWrapped = withManifestProvider(SupplementalFiles, {
        initialState: { renderings: getRenderingFiles(manifest), canvasIndex: 0 }, sectionHeading: 'Canvas files'
      });
      render(
        <ErrorBoundary>
          <SupplementalFileWrapped />
        </ErrorBoundary>
      );
      expect(screen.getByText('Canvas files')).toBeInTheDocument();
    });
  });
});

