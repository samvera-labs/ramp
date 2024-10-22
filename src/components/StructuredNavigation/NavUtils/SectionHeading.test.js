import React from 'react';
import { render, screen } from '@testing-library/react';
import * as hooks from '@Services/ramp-hooks';
import SectionHeading from './SectionHeading';

describe('SectionHeading component', () => {
  const handleClickMock = jest.fn();
  const sectionRef = { current: '' };
  const structureContainerRef = { current: { scrollTop: 0 } };
  jest.spyOn(hooks, 'useActiveStructure').mockImplementation(() => ({
    isActiveSection: false
  }));
  jest.spyOn(hooks, 'useCollapseExpandAll').mockImplementation(() => ({
    isCollapsed: false
  }));
  test('renders canvas with children items', () => {
    render(
      <SectionHeading
        duration={'09:32'}
        label={'Lunchroom Manners'}
        itemIndex={1}
        sectionRef={sectionRef}
        structureContainerRef={structureContainerRef}
        hasChildren={true}
        items={[]}
      />
    );
    expect(screen.queryAllByTestId('listitem-section-span')).toHaveLength(1);
    expect(screen.queryAllByTestId('listitem-section-button')).toHaveLength(0);
    expect(screen.queryByTestId('section-collapse-icon')).toBeInTheDocument();
    expect(screen.getByTestId('listitem-section-span'))
      .toHaveTextContent('1. Lunchroom Manners09:32');
  });

  test('renders canvas without children items', () => {
    render(
      <SectionHeading
        duration={'09:32'}
        label={'Lunchroom Manners'}
        itemIndex={1}
        canvasIndex={0}
        sectionRef={sectionRef}
        handleClick={handleClickMock}
        structureContainerRef={structureContainerRef}
      />
    );
    expect(screen.queryAllByTestId('listitem-section-span')).toHaveLength(1);
    expect(screen.queryAllByTestId('listitem-section-button')).toHaveLength(0);
    expect(screen.queryByTestId('section-collapse-icon')).not.toBeInTheDocument();
    expect(screen.getByTestId('listitem-section-span'))
      .toHaveTextContent('1. Lunchroom Manners09:32');
  });

  test('renders canvas with mediafragment as a button', () => {
    render(
      <SectionHeading
        duration={'09:32'}
        label={'Lunchroom Manners'}
        itemIndex={1}
        canvasIndex={0}
        sectionRef={sectionRef}
        itemId='https://example.com/manifest/canvas#t=0.0,572'
        handleClick={handleClickMock}
        structureContainerRef={structureContainerRef}
      />
    );
    expect(screen.queryAllByTestId('listitem-section-span')).toHaveLength(0);
    expect(screen.queryAllByTestId('listitem-section-button')).toHaveLength(1);
    expect(screen.getByTestId('listitem-section-button'))
      .toHaveTextContent('1. Lunchroom Manners09:32');
    expect(screen.getByTestId('listitem-section')).toHaveAttribute('data-mediafrag');
    expect(screen.getByTestId('listitem-section').getAttribute('data-mediafrag'))
      .toEqual('https://example.com/manifest/canvas#t=0.0,572');
    expect(screen.getByTestId('listitem-section').getAttribute('data-label'))
      .toEqual('Lunchroom Manners');
  });

  test('renders canvas w/o mediafragment as a span', () => {
    render(
      <SectionHeading
        duration={'09:32'}
        label={'Lunchroom Manners'}
        itemIndex={1}
        canvasIndex={0}
        sectionRef={sectionRef}
        itemId={undefined}
        handleClick={handleClickMock}
        structureContainerRef={structureContainerRef}
      />
    );
    expect(screen.queryAllByTestId('listitem-section-span')).toHaveLength(1);
    expect(screen.queryAllByTestId('listitem-section-button')).toHaveLength(0);
    expect(screen.getByTestId('listitem-section-span'))
      .toHaveTextContent('1. Lunchroom Manners09:32');
    expect(screen.queryByTestId('section-collapse-icon')).not.toBeInTheDocument();
    expect(screen.getByTestId('listitem-section')).toHaveAttribute('data-mediafrag');
    expect(screen.getByTestId('listitem-section').getAttribute('data-mediafrag')).toEqual('');
    expect(screen.getByTestId('listitem-section').getAttribute('data-label'))
      .toEqual('Lunchroom Manners');
  });

  test('has active class when currentNavItem is within the Canvas', () => {
    jest.spyOn(hooks, 'useActiveStructure').mockImplementation(() => ({
      isActiveSection: true
    }));
    render(
      <SectionHeading
        duration={'09:32'}
        label={'Lunchroom Manners'}
        itemIndex={1}
        canvasIndex={0}
        sectionRef={sectionRef}
        itemId={undefined}
        handleClick={handleClickMock}
        structureContainerRef={structureContainerRef}
      />
    );
    expect(screen.queryAllByTestId('listitem-section')).toHaveLength(1);
    expect(screen.getByTestId('listitem-section')).toHaveClass('active');
    expect(screen.queryByTestId('section-collapse-icon')).not.toBeInTheDocument();
    expect(screen.getByTestId('listitem-section').className)
      .toEqual('ramp--structured-nav__section active');
  });

  test('renders root range as a span', () => {
    jest.spyOn(hooks, 'useActiveStructure').mockImplementation(() => ({
      isActiveSection: false
    }));
    render(
      <SectionHeading
        duration={'09:32'}
        label={'Table of Contents'}
        itemIndex={0}
        canvasIndex={0}
        isRoot={true}
        sectionRef={sectionRef}
        itemId={undefined}
        handleClick={handleClickMock}
        structureContainerRef={structureContainerRef}
        hasChildren={true}
        items={[]}
      />
    );
    expect(screen.queryAllByTestId('listitem-section-span')).toHaveLength(1);
    expect(screen.queryAllByTestId('listitem-section-button')).toHaveLength(0);
    expect(screen.getByTestId('listitem-section-span'))
      .toHaveTextContent('Table of Contents09:32');
    expect(screen.getByTestId('listitem-section')).not.toHaveClass('active');
    expect(screen.queryByTestId('section-collapse-icon')).toBeInTheDocument();
    expect(screen.getByTestId('listitem-section')).toHaveAttribute('data-mediafrag');
    expect(screen.getByTestId('listitem-section').getAttribute('data-mediafrag')).toEqual('');
    expect(screen.getByTestId('listitem-section').getAttribute('data-label'))
      .toEqual('Table of Contents');
  });
});
