import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IntentModel } from '../model/intent.model';
import { RootState } from '../store';
import { TRAINING_STATUSES, TRAINING_TABS } from '../utils/constants';
import TrainingService from '../services/training.service';

export interface TrainingState {
  intents: IntentModel[];
  selectedIntentName: string;
  examples: string[];
  selectedExample: string;
  activeTab: string;
  intentsLoading: boolean;
  examplesLoading: boolean;
  intentResponseUpdating: boolean;
  successToast: string;
  warningToast: string;
  assignedTrainingDate: string;
  isTraining: boolean;
  areLatestTestResultsPositive: boolean;
  fetchingIsBotTraining: boolean;
  publishingModel: boolean;
  blacklistedIntentNames: string[];
}

const initialState: TrainingState = {
  intents: [],
  selectedIntentName: '',
  examples: [],
  selectedExample: '',
  activeTab: TRAINING_TABS.INTENTS,
  intentsLoading: false,
  examplesLoading: false,
  intentResponseUpdating: false,
  successToast: '',
  warningToast: '',
  assignedTrainingDate: '',
  isTraining: false,
  areLatestTestResultsPositive: true,
  fetchingIsBotTraining: false,
  publishingModel: false,
  blacklistedIntentNames: [],
};

const selectIntents = (state: RootState) => state.training.intents;
const selectSelectedIntentId = (state: RootState) => state.training.selectedIntentName;

export const selectSelectedIntent = createSelector([selectSelectedIntentId, selectIntents], (selectedIntentName, intents): IntentModel | undefined =>
  intents.find((intent: IntentModel) => intent.name === selectedIntentName),
);

export const getIntents = createAsyncThunk('training/getIntents', async () => TrainingService.getIntents());

export const getIntent = createAsyncThunk('training/getIntent', async (arg: string) => TrainingService.getIntent(arg));

export const addNewIntent = createAsyncThunk('training/addNewIntent', async (arg: IntentModel) => TrainingService.createIntent(arg));

export const addIntentToModel = createAsyncThunk('training/addIntentToModel', async (arg: string) => TrainingService.addIntentToModel(arg));

export const removeIntentFromModel = createAsyncThunk('training/removeIntentFromModel', async (arg: string) => TrainingService.removeIntentFromModel(arg));

export const deleteIntent = createAsyncThunk('training/deleteIntent', async (arg: string) => TrainingService.deleteIntent(arg));

export const saveIntentResponse = createAsyncThunk('training/saveIntentResponse', async (args: { intent: string; response: string }) =>
  TrainingService.updateIntentResponse(args.intent, args.response),
);

export const addNewExample = createAsyncThunk('training/addNewExample', async (args: { intent: string; example: string }) =>
  TrainingService.createIntentExample(args.intent, args.example),
);

export const updateIntentExample = createAsyncThunk('training/updateIntentExample', async (args: { intent: string; oldExample: string; newExample: string }) =>
  TrainingService.updateIntentExample(args.intent, args.oldExample, args.newExample),
);

export const deleteIntentExample = createAsyncThunk('training/deleteIntentExample', async (args: { intent: string; example: string }) =>
  TrainingService.deleteIntentExample(args.intent, args.example),
);

export const trainModelAt = createAsyncThunk('training/trainModelAt', async (args: { helperFunctionInput: string; trainingDate: string }) =>
  TrainingService.trainModelAt(args.helperFunctionInput, args.trainingDate),
);

export const trainModel = createAsyncThunk('training/trainBot', async (trainingDate: string) => TrainingService.trainModel(trainingDate));

export const publishModel = createAsyncThunk('training/publishModel', async () => TrainingService.publishModel());

export const removeTrainingDate = createAsyncThunk('training/removeTrainingDate', async () => TrainingService.removeTrainingDate());

export const getAssignedTrainingDate = createAsyncThunk('training/getAssignedTrainingDate', async () => TrainingService.getAssignedTrainingDate());

export const getTrainingMetaData = createAsyncThunk('training/getTrainingMetaData', async (lockTrainingCommands: boolean) =>
  TrainingService.getTrainingMetaData(),
);

export const trainingSlice = createSlice({
  name: 'training',
  initialState,
  reducers: {
    setSelectedIntent: (state, action) => {
      state.selectedIntentName = action.payload;
    },
    clearSelectedIntent: (state) => {
      state.selectedIntentName = '';
    },
    setSelectedIntentExample: (state, action) => {
      state.selectedExample = action.payload;
    },
    setSelectedIntentExampleValue: (state, action) => {
      state.examples = state.examples.map((example) => (example === state.selectedExample ? action.payload : example));
      state.selectedExample = action.payload;
    },
    clearSelectedIntentExample: (state) => {
      state.selectedExample = '';
    },
    setActiveTrainingTab: (state, action: PayloadAction<string>) => {
      state.selectedIntentName = '';
      state.selectedExample = '';
      state.activeTab = action.payload;
    },
    setSelectedIntentResponse: (state, action) => {
      state.intents = state.intents.map((intent) => (intent.name === state.selectedIntentName ? { ...intent, response: action.payload } : intent));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getIntents.pending, (state) => {
      state.intentsLoading = true;
      state.warningToast = '';
      state.examples = [];
    });
    builder.addCase(getIntents.fulfilled, (state, action) => {
      if (action.payload?.intents.length) {
        state.intents = action.payload.intents;
        state.blacklistedIntentNames = action.payload.blacklistedIntentNames;
        state.intentsLoading = false;
      }
    });
    builder.addCase(getIntents.rejected, (state) => {
      state.intentsLoading = false;
    });
    builder.addCase(getIntent.pending, (state) => {
      state.examplesLoading = true;
      state.examples = [];
    });
    builder.addCase(getIntent.fulfilled, (state, action) => {
      state.examples = action.payload.examples;
      state.intents = state.intents.map((intent) => (intent.name === action.payload.name ? { ...intent, response: action.payload.response } : intent));
      state.examplesLoading = false;
    });
    builder.addCase(getIntent.rejected, (state) => {
      state.examplesLoading = false;
    });
    builder.addCase(removeIntentFromModel.pending, (state) => {
      state.examplesLoading = true;
    });
    builder.addCase(removeIntentFromModel.fulfilled, (state, action) => {
      state.examplesLoading = false;
      state.intents = state.intents.map((intent) => (intent.name === action.meta.arg ? { ...intent, inModel: '.tmp' } : intent));
    });
    builder.addCase(removeIntentFromModel.rejected, (state) => {
      state.examplesLoading = false;
    });
    builder.addCase(addIntentToModel.pending, (state) => {
      state.examplesLoading = true;
    });
    builder.addCase(addIntentToModel.fulfilled, (state, action) => {
      state.examplesLoading = false;
      state.intents = state.intents.map((intent) => (intent.name === action.meta.arg ? { ...intent, inModel: '.yml' } : intent));
    });
    builder.addCase(addIntentToModel.rejected, (state) => {
      state.examplesLoading = false;
    });
    builder.addCase(saveIntentResponse.pending, (state) => {
      state.intentResponseUpdating = true;
    });
    builder.addCase(saveIntentResponse.fulfilled, (state, action) => {
      state.intentResponseUpdating = false;
      state.intents = state.intents.map((intent) => (intent.name === state.selectedIntentName ? { ...intent, response: action.meta.arg.response } : intent));
    });
    builder.addCase(saveIntentResponse.rejected, (state) => {
      state.intentResponseUpdating = false;
    });
    builder.addCase(addNewIntent.pending, (state, action) => {
      state.intents.push(action.meta.arg);
      state.selectedIntentName = action.meta.arg.name;
      state.successToast = '';
      state.examplesLoading = true;
      state.warningToast = 'addIntent.intentPending';
    });
    builder.addCase(addNewIntent.fulfilled, (state, action) => {
      state.examples = action.meta.arg.examples;
      state.examplesLoading = false;
      state.successToast = 'addIntent.confirmation';
      state.warningToast = '';
    });
    builder.addCase(addNewIntent.rejected, (state, action) => {
      state.intents = state.intents.filter((intent) => intent.name !== action.meta.arg.name);
      state.selectedIntentName = '';
      state.examplesLoading = false;
    });
    builder.addCase(addNewExample.pending, (state) => {
      state.examplesLoading = true;
      state.successToast = '';
      state.warningToast = 'addIntent.examplePending';
    });
    builder.addCase(addNewExample.fulfilled, (state, action) => {
      state.examples.push(action.meta.arg.example);
      state.examplesLoading = false;
      state.successToast = 'addExample.confirmation';
      state.warningToast = '';
    });
    builder.addCase(addNewExample.rejected, (state) => {
      state.examplesLoading = false;
    });
    builder.addCase(deleteIntentExample.pending, (state) => {
      state.examplesLoading = true;
    });
    builder.addCase(deleteIntentExample.fulfilled, (state, action) => {
      state.examplesLoading = false;
      state.examples = state.examples.filter((example) => example !== action.meta.arg.example);
    });
    builder.addCase(deleteIntentExample.rejected, (state) => {
      state.examplesLoading = false;
    });
    builder.addCase(deleteIntent.pending, (state) => {
      state.examplesLoading = true;
    });
    builder.addCase(deleteIntent.fulfilled, (state, action) => {
      state.examplesLoading = false;
      state.selectedIntentName = '';
      state.examples = [];
      state.intents = state.intents.filter((intent) => intent.name !== action.meta.arg);
    });
    builder.addCase(deleteIntent.rejected, (state) => {
      state.examplesLoading = false;
    });
    builder.addCase(removeTrainingDate.fulfilled, (state) => {
      state.isTraining = false;
      state.assignedTrainingDate = '';
      state.successToast = 'trainingCommands.trainingCanceled';
    });
    builder.addCase(getAssignedTrainingDate.pending, (state) => {
      state.assignedTrainingDate = '';
    });
    builder.addCase(getAssignedTrainingDate.fulfilled, (state, action) => {
      if (!action.payload[0]) return;
      state.assignedTrainingDate = action.payload[0].value;
    });
    builder.addCase(getAssignedTrainingDate.rejected, (state) => {
      state.assignedTrainingDate = '';
    });
    builder.addCase(trainModelAt.pending, (state, action) => {
      state.assignedTrainingDate = action.meta.arg.trainingDate;
    });
    builder.addCase(trainModelAt.fulfilled, (state, action) => {
      if (action.payload === TRAINING_STATUSES.BOT_IS_TRAINING) state.isTraining = true;
    });
    builder.addCase(trainModel.pending, (state, action) => {
      state.assignedTrainingDate = action.meta.arg;
      state.isTraining = true;
    });
    builder.addCase(getTrainingMetaData.pending, (state, action) => {
      if (action.meta.arg) state.fetchingIsBotTraining = true;
    });
    builder.addCase(getTrainingMetaData.fulfilled, (state, action) => {
      state.areLatestTestResultsPositive = action.payload.areTrainingResultsPositive;
      state.isTraining = action.payload.isBotTraining;
      state.fetchingIsBotTraining = false;
    });
    builder.addCase(getTrainingMetaData.rejected, (state) => {
      state.fetchingIsBotTraining = false;
    });
    builder.addCase(publishModel.pending, (state) => {
      state.publishingModel = true;
      state.successToast = '';
    });
    builder.addCase(publishModel.fulfilled, (state, action) => {
      switch (action.payload) {
        case TRAINING_STATUSES.BOT_IS_TRAINING:
          state.isTraining = true;
          state.warningToast = 'trainingCommands.modelTraining';
          break;
        case TRAINING_STATUSES.MODEL_TESTS_FAILED:
          state.areLatestTestResultsPositive = false;
          state.warningToast = 'trainingCommands.unableToPublish';
          break;
        case TRAINING_STATUSES.MODEL_PUBLISHED:
          state.successToast = 'trainingCommands.modelPublished';
          break;
        default:
          state.warningToast = 'trainingCommands.publishError';
          break;
      }
      state.publishingModel = false;
    });
    builder.addCase(publishModel.rejected, (state) => {
      state.publishingModel = false;
    });
  },
});

export const {
  setSelectedIntent,
  clearSelectedIntent,
  setSelectedIntentExample,
  setSelectedIntentExampleValue,
  clearSelectedIntentExample,
  setActiveTrainingTab,
  setSelectedIntentResponse,
} = trainingSlice.actions;

export default trainingSlice.reducer;
