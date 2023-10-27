import http from './http.service';
import { GreetingMessage } from '../slices/configuration.slice';
import { ConfigurationValue } from '../model/configuration-value.model';

class GreetingService {
  getGreetingMessage(): Promise<GreetingMessage> {
    return http.post('/cs-get-greeting-message');
  }

  setGreetingMessage(est: string, eng: string): Promise<string> {
    return http.post('/cs-set-greeting-message', { eng, est });
  }

  setIsGreetingActive(newValue: boolean): Promise<string> {
    return http.post('/cs-set-is-greeting-active', { isActive: newValue });
  }

  getIsBotActive(): Promise<ConfigurationValue> {
    return http.post('/cs-get-is-bot-active');
  }

  setIsBotActive(isActive: boolean): Promise<ConfigurationValue> {
    return http.post('/cs-set-is-bot-active', { isActive });
  }
}

export default new GreetingService();
