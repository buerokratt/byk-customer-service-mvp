import reducer, {
  addIntentToModel,
  addNewExample,
  addNewIntent,
  clearSelectedIntent,
  clearSelectedIntentExample,
  getIntent,
  getIntents,
  removeIntentFromModel,
  saveIntentResponse,
  setActiveTrainingTab,
  setSelectedIntent,
  setSelectedIntentExample,
  setSelectedIntentExampleValue,
  setSelectedIntentResponse,
  TrainingState,
} from './training.slice';
import { TRAINING_TABS } from '../utils/constants';
import { IntentModel } from '../model/intent.model';

const intent: IntentModel = {
  name: '1',
  description: 'naiss',
  response: 'ok',
  examples: ['yks', 'kaks'],
  inModel: '.yml',
};

const example = 'ABC';

const initialState: TrainingState = {
  intents: [],
  selectedIntentName: '1',
  examples: [example],
  selectedExample: '',
  activeTab: TRAINING_TABS.INTENTS,
  intentsLoading: false,
  examplesLoading: false,
  successToast: '',
  warningToast: '',
  intentResponseUpdating: false,
  areLatestTestResultsPositive: true,
  fetchingIsBotTraining: false,
  publishingModel: false,
  blacklistedIntentNames: [],
  assignedTrainingDate: '',
  isTraining: false,
};

describe('Intents slice', () => {
  it('should set selected intent', () => {
    expect(reducer(initialState, setSelectedIntent('1'))).toEqual({
      ...initialState,
      selectedIntentName: '1',
    });
  });

  it('should clear selected intent', () => {
    expect(reducer({ ...initialState, selectedIntentName: '1' }, clearSelectedIntent())).toEqual({
      ...initialState,
      selectedIntentName: '',
    });
  });

  it('should set selected intent example', () => {
    expect(reducer(initialState, setSelectedIntentExample('1'))).toEqual({
      ...initialState,
      selectedExample: '1',
    });
  });

  it('should clear selected intent example', () => {
    expect(reducer({ ...initialState, selectedExample: '1' }, clearSelectedIntentExample())).toEqual({
      ...initialState,
    });
  });

  it('should set example value', () => {
    expect(reducer({ ...initialState, selectedExample: 'ABC' }, setSelectedIntentExampleValue('new value'))).toEqual({
      ...initialState,
      selectedExample: 'new value',
      examples: ['new value'],
    });
  });

  it('should set active training tab', () => {
    expect(reducer(initialState, setActiveTrainingTab(TRAINING_TABS.INTENTS))).toEqual({
      ...initialState,
      activeTab: TRAINING_TABS.INTENTS,
      selectedIntentName: '',
      selectedExample: '',
    });
  });

  it('should set selected intent response', () => {
    expect(reducer({ ...initialState, selectedIntentName: '1', intents: [intent] }, setSelectedIntentResponse('new response'))).toEqual({
      ...initialState,
      selectedIntentName: '1',
      intents: [{ ...intent, response: 'new response' }],
    });
  });

  describe('extra reducers', () => {
    it('should set intentsLoading true and clear examples when getIntents is pending', () => {
      const action = { type: getIntents.pending.type };
      const state = reducer({ ...initialState, intentsLoading: false }, action);
      expect(state).toEqual({ ...initialState, intentsLoading: true, examples: [] });
    });

    it('should set intentsLoading false and set intents when getIntents is fulfilled', () => {
      const action = { type: getIntents.fulfilled.type, payload: { intents: [intent], blacklistedIntentNames: [] } };
      const state = reducer({ ...initialState, intentsLoading: true }, action);
      expect(state).toEqual({ ...initialState, intentsLoading: false, intents: [intent] });
    });

    it('should set intentsLoading false when getIntents is rejected', () => {
      const action = { type: getIntents.rejected.type };
      const state = reducer({ ...initialState, intentsLoading: true }, action);
      expect(state).toEqual({ ...initialState, intentsLoading: false });
    });

    it('should set examplesLoading true and clear examples when getIntent is pending', () => {
      const action = { type: getIntent.pending.type };
      const state = reducer({ ...initialState, examplesLoading: false }, action);
      expect(state).toEqual({ ...initialState, examplesLoading: true, examples: [] });
    });

    it('should set examplesLoading false, set examples and set intent response when getIntent is fulfilled', () => {
      const action = { type: getIntent.fulfilled.type, payload: { examples: [example], response: 'Bõnev!', name: intent.name } };
      const state = reducer({ ...initialState, examplesLoading: true, examples: [], intents: [intent] }, action);
      expect(state).toEqual({ ...initialState, examplesLoading: false, intents: [{ ...intent, response: 'Bõnev!' }], examples: [example] });
    });

    it('should set examplesLoading false when getIntent is rejected', () => {
      const action = { type: getIntent.rejected.type };
      const state = reducer({ ...initialState, examplesLoading: true }, action);
      expect(state).toEqual({ ...initialState, examplesLoading: false });
    });

    it('should set examplesLoading true when removeIntentFromModel is pending', () => {
      const action = { type: removeIntentFromModel.pending.type };
      const state = reducer({ ...initialState, examplesLoading: false }, action);
      expect(state).toEqual({ ...initialState, examplesLoading: true });
    });

    it('should set examplesLoading false and set intent inModel when removeIntentFromModel is fulfilled', () => {
      const action = { type: removeIntentFromModel.fulfilled.type, meta: { arg: intent.name } };
      const state = reducer({ ...initialState, examplesLoading: true, intents: [intent] }, action);
      expect(state).toEqual({ ...initialState, examplesLoading: false, intents: [{ ...intent, inModel: '.tmp' }] });
    });

    it('should set examplesLoading false when removeIntentFromModel is rejected', () => {
      const action = { type: removeIntentFromModel.rejected.type };
      const state = reducer({ ...initialState, examplesLoading: true }, action);
      expect(state).toEqual({ ...initialState, examplesLoading: false });
    });

    it('should set examplesLoading true when addIntentToModel is pending', () => {
      const action = { type: addIntentToModel.pending.type };
      const state = reducer({ ...initialState, examplesLoading: false }, action);
      expect(state).toEqual({ ...initialState, examplesLoading: true });
    });

    it('should set examplesLoading false and set intent inModel when addIntentToModel is fulfilled', () => {
      const action = { type: addIntentToModel.fulfilled.type, meta: { arg: intent.name } };
      const state = reducer({ ...initialState, examplesLoading: true, intents: [intent] }, action);
      expect(state).toEqual({ ...initialState, examplesLoading: false, intents: [{ ...intent, inModel: '.yml' }] });
    });

    it('should set examplesLoading false when addIntentToModel is rejected', () => {
      const action = { type: addIntentToModel.rejected.type };
      const state = reducer({ ...initialState, examplesLoading: true }, action);
      expect(state).toEqual({ ...initialState, examplesLoading: false });
    });

    it('should set intentResponseUpdating true when saveIntentResponse is pending', () => {
      const action = { type: saveIntentResponse.pending.type };
      const state = reducer({ ...initialState, intentResponseUpdating: false }, action);
      expect(state).toEqual({ ...initialState, intentResponseUpdating: true });
    });

    it('should set intentResponseUpdating false and set intent response when saveIntentResponse is fulfilled', () => {
      const action = { type: saveIntentResponse.fulfilled.type, meta: { arg: { response: 'Birn' } } };
      const state = reducer({ ...initialState, intentResponseUpdating: true, intents: [intent] }, action);
      expect(state).toEqual({ ...initialState, intentResponseUpdating: false, intents: [{ ...intent, response: 'Birn' }] });
    });

    it('should set intentResponseUpdating false when saveIntentResponse is rejected', () => {
      const action = { type: saveIntentResponse.rejected.type };
      const state = reducer({ ...initialState, intentResponseUpdating: true }, action);
      expect(state).toEqual({ ...initialState, intentResponseUpdating: false });
    });

    it('should add new intent to intents and set selectedIntentName when addNewIntent is pending', () => {
      const action = { type: addNewIntent.pending.type, meta: { arg: intent } };
      const state = reducer({ ...initialState, examplesLoading: false, intents: [], successToast: 'Borgand', selectedIntentName: '' }, action);
      expect(state).toEqual({
        ...initialState,
        examplesLoading: true,
        intents: [intent],
        successToast: '',
        warningToast: 'addIntent.intentPending',
        selectedIntentName: intent.name,
      });
    });

    it('should set examples, successToast and exampleLoading to false when addNewIntent is fulfilled', () => {
      const action = { type: addNewIntent.fulfilled.type, meta: { arg: { examples: [example] } } };
      const state = reducer({ ...initialState, examplesLoading: true, successToast: '', examples: [] }, action);
      expect(state).toEqual({ ...initialState, examplesLoading: false, successToast: 'addIntent.confirmation', examples: [example] });
    });

    it('should set exampleLoading to false, clear selectedIntent and remove intent from intents when addNewIntent is rejected', () => {
      const action = { type: addNewIntent.rejected.type, meta: { arg: { name: intent.name } } };
      const state = reducer({ ...initialState, examplesLoading: true, selectedIntentName: intent.name, intents: [intent] }, action);
      expect(state).toEqual({ ...initialState, examplesLoading: false, selectedIntentName: '', intents: [] });
    });

    it('should set examplesLoading true and clear successToast when addNewExample is pending', () => {
      const action = { type: addNewExample.pending.type };
      const state = reducer({ ...initialState, examplesLoading: false, successToast: 'Birukas' }, action);
      expect(state).toEqual({ ...initialState, examplesLoading: true, successToast: '', warningToast: 'addIntent.examplePending' });
    });

    it('should set examplesLoading false, set successToast and add example when addNewExample is fulfilled', () => {
      const action = { type: addNewExample.fulfilled.type, meta: { arg: { example } } };
      const state = reducer({ ...initialState, examplesLoading: true, successToast: '', examples: [] }, action);
      expect(state).toEqual({ ...initialState, examplesLoading: false, successToast: 'addExample.confirmation', examples: [example] });
    });

    it('should set exampleLoading false when addNewExample is rejected', () => {
      const action = { type: addNewExample.rejected.type };
      const state = reducer({ ...initialState, examplesLoading: true }, action);
      expect(state).toEqual({ ...initialState, examplesLoading: false });
    });
  });
});
