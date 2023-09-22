import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SectionButton from './SectionButton';

describe('SectionButon component', () => {
  test('renders canvas with children items', () => {
    const sectionRef = { current: '' };
    render(
      <SectionButton
        duration={'09:32'}
        label={'Lunchroom Manners'}
        itemsLength={2}
        itemIndex={1}
        sectionRef={sectionRef}
      />
    );
    expect(screen.queryAllByTestId('listitem-section-button')).toHaveLength(1);
    expect(screen.getByTestId('listitem-section-button')).toHaveTextContent('1. Lunchroom Manners09:32');
  });

  test('renders canvas without children items', () => {
    const sectionRef = { current: '' };
    render(
      <SectionButton
        duration={'09:32'}
        label={'Lunchroom Manners'}
        itemsLength={0}
        itemIndex={1}
        sectionRef={sectionRef}
      />
    );
    expect(screen.queryAllByTestId('listitem-section-button')).toHaveLength(1);
    expect(screen.getByTestId('listitem-section-button')).toHaveTextContent('1. Lunchroom Manners09:32');
  });
});
