import { render, screen } from '@testing-library/react';
import React from 'react';
import EventMessage from './event-message';

describe('Event message component', () => {
  it('should render message text', () => {
    const message = 'test message';
    render(<EventMessage message={message} />);
    screen.getByText(message);
  });
});
