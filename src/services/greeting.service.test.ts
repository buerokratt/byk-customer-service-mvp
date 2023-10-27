import GreetingService from './greeting.service';
import http from './http.service';

jest.mock('../services/http.service');

describe('Greeting Service', () => {
  it('should make a request to /cs-get-greeting-message', () => {
    GreetingService.getGreetingMessage();
    expect(http.post).toHaveBeenCalledWith('/cs-get-greeting-message');
  });

  it('should make a request to /cs-set-greeting-message', () => {
    const DTO = {
      eng: 'Good Day',
      est: 'Tere päevast',
    };
    GreetingService.setGreetingMessage('Tere päevast', 'Good Day');
    expect(http.post).toHaveBeenCalledWith('/cs-set-greeting-message', DTO);
  });

  it('should make a request to /cs-set-is-greeting-active', () => {
    GreetingService.setIsGreetingActive(true);
    expect(http.post).toHaveBeenCalledWith('/cs-set-is-greeting-active', { isActive: true });
  });

  it('should make a request to /cs-get-is-bot-active', () => {
    GreetingService.getIsBotActive();
    expect(http.post).toHaveBeenCalledWith('/cs-get-is-bot-active');
  });

  it('should make a request to /cs-set-is-bot-active', () => {
    GreetingService.setIsBotActive(false);
    expect(http.post).toHaveBeenCalledWith('/cs-set-is-bot-active', { isActive: false });
  });
});
