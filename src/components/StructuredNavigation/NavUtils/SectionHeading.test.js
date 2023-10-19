import React from 'react';
import { render, screen } from '@testing-library/react';
import SectionHeading from './SectionHeading';

describe('SectionButon component', () => {
  const handleClickMock = jest.fn();
  test('renders canvas with children items', () => {
    const sectionRef = { current: '' };
    render(
      <SectionHeading
        duration={'09:32'}
        label={'Lunchroom Manners'}
        itemsLength={2}
        itemIndex={1}
        canvasIndex={0}
        sectionRef={sectionRef}
        handleClick={handleClickMock}
      />
    );
    expect(screen.queryAllByTestId('listitem-section-span')).toHaveLength(1);
    expect(screen.queryAllByTestId('listitem-section-button')).toHaveLength(0);
    expect(screen.getByTestId('listitem-section-span'))
      .toHaveTextContent('1. Lunchroom Manners09:32');
  });

  test('renders canvas without children items', () => {
    const sectionRef = { current: '' };
    render(
      <SectionHeading
        duration={'09:32'}
        label={'Lunchroom Manners'}
        itemsLength={0}
        itemIndex={1}
        canvasIndex={0}
        sectionRef={sectionRef}
        handleClick={handleClickMock}
      />
    );
    expect(screen.queryAllByTestId('listitem-section-span')).toHaveLength(1);
    expect(screen.queryAllByTestId('listitem-section-button')).toHaveLength(0);
    expect(screen.getByTestId('listitem-section-span'))
      .toHaveTextContent('1. Lunchroom Manners09:32');
  });

  test('renders canvas with mediafragment as a button', () => {
    const sectionRef = { current: '' };
    render(
      <SectionHeading
        duration={'09:32'}
        label={'Lunchroom Manners'}
        itemsLength={0}
        itemIndex={1}
        canvasIndex={0}
        sectionRef={sectionRef}
        itemId='https://example.com/manifest/canvas#t=0.0,572'
        handleClick={handleClickMock}
      />
    );
    expect(screen.queryAllByTestId('listitem-section-span')).toHaveLength(0);
    expect(screen.queryAllByTestId('listitem-section-button')).toHaveLength(1);
    expect(screen.getByTestId('listitem-section-button'))
      .toHaveTextContent('1. Lunchroom Manners09:32');
  });

  test('renders canvas w/o mediafragment as a span', () => {
    const sectionRef = { current: '' };
    render(
      <SectionHeading
        duration={'09:32'}
        label={'Lunchroom Manners'}
        itemsLength={0}
        itemIndex={1}
        canvasIndex={0}
        sectionRef={sectionRef}
        itemId={undefined}
        handleClick={handleClickMock}
      />
    );
    expect(screen.queryAllByTestId('listitem-section-span')).toHaveLength(1);
    expect(screen.queryAllByTestId('listitem-section-button')).toHaveLength(0);
    expect(screen.getByTestId('listitem-section-span'))
      .toHaveTextContent('1. Lunchroom Manners09:32');
  });

  test('has active class when currentNavItem is within the Canvas', () => {
    const sectionRef = { current: '' };
    render(
      <SectionHeading
        duration={'09:32'}
        label={'Lunchroom Manners'}
        itemsLength={0}
        itemIndex={1}
        canvasIndex={0}
        sectionRef={sectionRef}
        itemId={undefined}
        handleClick={handleClickMock}
      />
    );
    expect(screen.queryAllByTestId('listitem-section-span')).toHaveLength(1);
    expect(screen.getByTestId('listitem-section-span')).toHaveClass('active');
  });
});
