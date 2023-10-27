import http from './http.service';
import { IntentModel } from '../model/intent.model';
import { ConfigurationValue } from '../model/configuration-value.model';

class TrainingService {
  getIntents(): Promise<{ intents: IntentModel[]; blacklistedIntentNames: string[] }> {
    return http.post('/cs-get-intents');
  }

  getIntent(intent: string): Promise<IntentModel> {
    return http.post('/cs-get-intent', { intent });
  }

  updateIntentExample(intent: string, oldExample: string, newExample: string): Promise<void> {
    return http.post('/cs-update-intent-example', { intent, oldExample, newExample });
  }

  addIntentToModel(intent: string): Promise<void> {
    return http.post('/cs-add-intent-to-model', { intent });
  }

  removeIntentFromModel(intent: string): Promise<void> {
    return http.post('/cs-remove-intent-from-model', { intent });
  }

  updateIntentResponse(intent: string, response: string): Promise<void> {
    return http.post('/cs-update-intent-response', { intent, response });
  }

  createIntent(intent: IntentModel): Promise<void> {
    return http.post('/cs-create-intent', { intent });
  }

  createIntentExample(intent: string, example: string): Promise<void> {
    return http.post('/cs-create-intent-example', { intent, example });
  }

  deleteIntentExample(intent: string, example: string): Promise<void> {
    return http.post('/cs-delete-intent-example', { intent, example });
  }

  deleteIntent(intent: string): Promise<void> {
    return http.post('/cs-delete-intent', { intent });
  }

  removeTrainingDate(): Promise<void> {
    return http.post('/cs-remove-training-date');
  }

  getAssignedTrainingDate(): Promise<ConfigurationValue[]> {
    return http.post('/cs-get-training-date');
  }

  getTrainingMetaData(): Promise<{ areTrainingResultsPositive: boolean; isBotTraining: boolean }> {
    return http.post('/cs-get-training-metadata');
  }

  trainModel(trainingDate: string): Promise<string> {
    return http.post('/cs-train-model', { trainingDate });
  }

  trainModelAt(helperFunctionInput: string, trainingDate: string): Promise<string> {
    return http.post('/cs-train-model-at', { helperFunctionInput, trainingDate });
  }

  publishModel(): Promise<string> {
    return http.post('/cs-publish-model');
  }
}

export default new TrainingService();
