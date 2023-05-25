import React from 'react';
import { render, screen } from '@testing-library/react';
import DescriptiveMetadata from './DescriptiveMetadata';
import manifest from '@Json/test_data/lunchroom-manners';
import manfiestWoMetadata from '@Json/test_data/volleyball-for-boys';
import { withManifestProvider } from '../../services/testing-helpers';

describe('DescriptiveMetadata component', () => {
  describe('with manifest with metadata', () => {
    describe('with default prop, displayTitle=true', () => {
      beforeEach(() => {
        const DescMetadata = withManifestProvider(DescriptiveMetadata, {
          initialState: { manifest },
        });
        render(<DescMetadata />);
      });

      test('renders successfully', () => {
        expect(screen.queryByTestId('descriptive-metadata')).toBeInTheDocument();
      });

      test('renders title', () => {
        expect(screen.getByText('Title')).toBeInTheDocument();
      });
    });

    describe('with displayTitle=false', () => {
      beforeEach(() => {
        const DescMetadata = withManifestProvider(DescriptiveMetadata, {
          initialState: { manifest },
          displayTitle: false,
        });
        render(<DescMetadata />);
      });

      test('renders successfully', () => {
        expect(screen.queryByTestId('descriptive-metadata')).toBeInTheDocument();
      });

      test('renders title', () => {
        expect(screen.queryByText('Title')).not.toBeInTheDocument();
      });
    });
  });

  it('with manifest without metadata renders nothing', () => {
    const DescMetadata = withManifestProvider(DescriptiveMetadata, {
      initialState: { manifest: manfiestWoMetadata },
    });
    render(<DescMetadata />);
    expect(screen.queryByTestId('descriptive-metadata')).not.toBeInTheDocument();
  });
});
