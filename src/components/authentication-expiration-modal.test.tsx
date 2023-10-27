import React from 'react';
import { render } from '../utils/test.utils';
import AuthenticationExpirationModal from './authentication-expiration-modal';

describe('Authentication Expiration Modal', () => {
  it('should be rendered', () => {
    render(<AuthenticationExpirationModal />);
  });
});
