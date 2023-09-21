import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SectionButton from './SectionButton';

describe('SectionButon component', () => {
  describe('renders canvas with children items', () => {
    beforeEach(() => {
      const sectionRef = { current: '' };
      render(
        <SectionButton
          duration={'09:32'}
          label={'Lunchroom Manners'}
          itemsLength={2}
          sectionRef={sectionRef}
        />
      );
    });

    test('displays title and time information', () => {
      expect(screen.queryAllByTestId('listitem-section-button')).toHaveLength(1);
      expect(screen.getByTestId('listitem-section-button')).toHaveTextContent('Lunchroom Manners09:32');
    });

    test('displays collapsible arrow', () => {
      expect(screen.queryAllByTestId('section-accordion-arrow')).toHaveLength(1);
    });

    test('collapses the section when clicked', () => {
      const sectionButton = screen.getByTestId('listitem-section-button');
      fireEvent.click(sectionButton);

      waitFor(() => {
        expect(sectionButton).toHaveClass('open');
      });
    });
  });

  describe('renders canvas without children items', () => {
    beforeEach(() => {
      const sectionRef = { current: '' };
      render(
        <SectionButton
          duration={'09:32'}
          label={'Lunchroom Manners'}
          itemsLength={0}
          sectionRef={sectionRef}
        />
      );
    });

    test('displays title and time information', () => {
      expect(screen.queryAllByTestId('listitem-section-button')).toHaveLength(1);
      expect(screen.getByTestId('listitem-section-button')).toHaveTextContent('Lunchroom Manners09:32');
    });

    test('does not display collapsible arrow', () => {
      expect(screen.queryAllByTestId('section-accordion-arrow')).toHaveLength(0);
    });
  });
});
