import React from 'react';
import CollapseExpandButton from './CollapseExpandButton';
import * as hooks from '@Services/ramp-hooks';
import { render, screen } from '@testing-library/react';

describe('CollapseExpandButton component', () => {
  const collapseExpandAllMock = jest.fn(() => { return false; });
  test('renders down arrow when isCollapsed = true', () => {
    jest.spyOn(hooks, 'useCollapseExpandAll').mockImplementation(() => ({
      isCollapsed: true,
      collapseExpandAll: collapseExpandAllMock
    }));
    render(<CollapseExpandButton numberOfSections={10} />);

    expect(screen.queryByTestId('collapse-expand-all-btn')).toBeInTheDocument();
    expect(screen.getByText('Expand Sections')).toBeInTheDocument();
    expect(screen.getByTestId('collapse-expand-all-btn').children[0])
      .toHaveClass('arrow down');
  });

  test('renders up arrow when isCollapsed = false', () => {
    jest.spyOn(hooks, 'useCollapseExpandAll').mockImplementation(() => ({
      isCollapsed: false,
      collapseExpandAll: collapseExpandAllMock
    }));
    render(<CollapseExpandButton numberOfSections={10} />);

    expect(screen.queryByTestId('collapse-expand-all-btn')).toBeInTheDocument();
    expect(screen.getByText('Close Sections')).toBeInTheDocument();
    expect(screen.getByTestId('collapse-expand-all-btn').children[0])
      .toHaveClass('arrow up');
  });
});
