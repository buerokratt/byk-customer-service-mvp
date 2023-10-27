import React from 'react';
import { render, screen } from '@testing-library/react';
import Linkifier from './linkifier';

describe('Linkifier', () => {
  it('should render message with anchor tags', () => {
    const acceptedLink = 'https://www.google.com';
    render(<Linkifier message={acceptedLink} />);
    expect(screen.getByText(acceptedLink)).toHaveProperty('href', `${acceptedLink}/`);
  });

  it('should render message with anchor tags 4', () => {
    const sentMessage = 'mine palun https://www.google.com/ eerfe';
    const link = 'https://www.google.com/';
    render(<Linkifier message={sentMessage} />);
    expect(screen.getByText(link)).toHaveProperty('href', link);
  });

  it('should render link with unicode characters', () => {
    const sentMessage = 'mine palun https://bürokröäõatt.ee/ eerfe';
    const link = 'https://bürokröäõatt.ee/';
    render(<Linkifier message={sentMessage} />);
    expect(screen.getByText(link)).toHaveProperty('href');
  });

  it.each`
    correctLink
    ${'https://wwdw.google.com/24ir/dir'}
    ${'https://www.google.com/'}
    ${'https://burokratt.ee/'}
    ${'https://test.ee/2020/09/29/te-st'}
  `("should linkify '$correctLink'", async ({ correctLink }) => {
    render(<Linkifier message={correctLink} />);
    expect(screen.getByText(correctLink)).toHaveProperty('href', correctLink);
  });

  it.each`
    inCorrectLink
    ${'ftps://www.google.com'}
    ${'ftp://www.google.com'}
    ${'http://www.google.com'}
    ${'google.com'}
    ${'mailto:test@eesti.ee?subject=kiri&html-body=<h1><a%20href="http://eriti-paha-sait.com">KLIKI%20SIIA</a>'}
    ${'https://eesti.ee:mingi-kasutaja-tahelepanu-hajutav-pikk-tekst@p0c.eu'}
    ${'https://kasutajatunnus:parool@veebisait.com'}
    ${'http://kasutaja@veebisait.com'}
    ${'https://kasutaja@veebisait.com'}
    ${'Terekest'}
  `("should not linkify '$inCorrectLink'", async ({ inCorrectLink }) => {
    render(<Linkifier message={inCorrectLink} />);
    expect(screen.getByText(inCorrectLink)).not.toHaveProperty('href');
  });
});
