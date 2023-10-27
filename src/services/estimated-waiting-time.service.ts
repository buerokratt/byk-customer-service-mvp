import http from './http.service';
import { EstimatedWaiting } from '../slices/configuration.slice';

class EstimatedWaitingTimeService {
  setEstimatedWaitingTime(waitingTime: number): Promise<void> {
    return http.post('/cs-set-estimated-waiting-time', { waitingTime });
  }

  getEstimatedWaitingTime(): Promise<EstimatedWaiting> {
    return http.post('/cs-get-estimated-waiting-time');
  }

  setIsEstimatedWaitingTimeActive(newValue: boolean): Promise<string> {
    return http.post('/cs-set-is-estimated-waiting-time-active', { isActive: newValue });
  }
}

export default new EstimatedWaitingTimeService();
