import { render, screen } from '@testing-library/react';
import React from 'react';
import AdminMessage from './admin-message';

const mockMessage = {
  est: 'Hello World',
};

describe('Admin message component', () => {
  it('renders message text', () => {
    render(<AdminMessage message={mockMessage.est} />);
    const contentRegex = new RegExp(mockMessage.est, 'i');
    screen.getByText(contentRegex);
  });
});
