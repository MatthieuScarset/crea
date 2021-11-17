import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Pricings from './Pricings';

describe('<Pricings />', () => {
  test('it should mount', () => {
    render(<Pricings />);
    
    const pricings = screen.getByTestId('Pricings');

    expect(pricings).toBeInTheDocument();
  });
});