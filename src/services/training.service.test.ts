import http from './http.service';
import TrainingService from './training.service';
import { IntentModel } from '../model/intent.model';

jest.mock('../services/http.service');

describe('Training Service', () => {
  it('should make a request to /cs-get-intents', () => {
    TrainingService.getIntents();
    expect(http.post).toHaveBeenCalledWith('/cs-get-intents');
  });

  it('should make a request to /cs-get-intent', () => {
    TrainingService.getIntent('1');
    expect(http.post).toHaveBeenCalledWith('/cs-get-intent', { intent: '1' });
  });

  it('should make a request to /cs-update-intent-example', () => {
    TrainingService.updateIntentExample('1', 'yes', 'no');
    expect(http.post).toHaveBeenCalledWith('/cs-update-intent-example', { intent: '1', oldExample: 'yes', newExample: 'no' });
  });

  it('should make a request to /cs-add-intent-to-model', () => {
    TrainingService.addIntentToModel('1');
    expect(http.post).toHaveBeenCalledWith('/cs-add-intent-to-model', { intent: '1' });
  });

  it('should make a request to /cs-remove-intent-from-model', () => {
    TrainingService.removeIntentFromModel('1');
    expect(http.post).toHaveBeenCalledWith('/cs-remove-intent-from-model', { intent: '1' });
  });

  it('should make a request to /cs-update-intent-response', () => {
    TrainingService.updateIntentResponse('1', 'test');
    expect(http.post).toHaveBeenCalledWith('/cs-update-intent-response', { intent: '1', response: 'test' });
  });

  it('should make a request to /cs-create-intent', () => {
    const intent: IntentModel = {
      name: '1',
      description: 'test',
      response: 'test',
      inModel: 'no',
      examples: [],
    };
    TrainingService.createIntent(intent);
    expect(http.post).toHaveBeenCalledWith('/cs-create-intent', { intent });
  });

  it('should make a request to /cs-create-intent-example', () => {
    TrainingService.createIntentExample('1', 'test');
    expect(http.post).toHaveBeenCalledWith('/cs-create-intent-example', { intent: '1', example: 'test' });
  });
});
