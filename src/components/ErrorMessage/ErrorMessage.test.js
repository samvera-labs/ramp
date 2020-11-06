import React from 'react';
import { render } from '@testing-library/react';
import ErrorMessage from './ErrorMessage';

describe('ErrorMessage component', () => {
  it('renders a message', () => {
    render(<ErrorMessage message="yo" />);
  });
});
