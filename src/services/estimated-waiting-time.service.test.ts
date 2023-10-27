import EstimatedWaitingTimeService from './estimated-waiting-time.service';
import http from './http.service';

jest.mock('../services/http.service');

describe('Estimate waiting time service', () => {
  it('should make a request to /cs-set-estimated-waiting-time', () => {
    EstimatedWaitingTimeService.setEstimatedWaitingTime(30);
    expect(http.post).toHaveBeenCalledWith('/cs-set-estimated-waiting-time', { waitingTime: 30 });
  });

  it('should make a request to /cs-get-estimated-waiting-time', () => {
    EstimatedWaitingTimeService.getEstimatedWaitingTime();
    expect(http.post).toHaveBeenCalledWith('/cs-get-estimated-waiting-time');
  });

  it('should make a request to /cs-set-is-estimated-waiting-time-active', () => {
    EstimatedWaitingTimeService.setIsEstimatedWaitingTimeActive(true);
    expect(http.post).toHaveBeenCalledWith('/cs-set-is-estimated-waiting-time-active', { isActive: true });
  });
});
