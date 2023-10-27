import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { ProgressSpinner } from 'primereact/progressspinner';
import ChatArchive from '../../components/chat-archive/chat-archive';
import { TRAINING_TABS } from '../../utils/constants';
import TrainingHeader from '../../components/training/training-header';
import { useAppDispatch, useAppSelector } from '../../store';
import IntentList from '../../components/training/intent-list';
import IntentHeader from '../../components/training/intent-header';
import IntentExampleList from '../../components/training/intent-example-list';
import IntentExampleToolbox from '../../components/training/intent-example-toolbox';
import { getIntents, selectSelectedIntent } from '../../slices/training.slice';
import { ToastContext } from '../../App';
import { successNotification, warningNotification } from '../../utils/toast-notifications';
import TrainingCommands from '../../components/training/training-commands';

const Training = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const toastContext = useContext(ToastContext);
  const activeTab = useAppSelector((state) => state.training.activeTab);
  const examples = useAppSelector((state) => state.training.examples);
  const intentsLoading = useAppSelector((state) => state.training.intentsLoading);
  const examplesLoading = useAppSelector((state) => state.training.examplesLoading);
  const successToast = useAppSelector((state) => state.training.successToast);
  const warningToast = useAppSelector((state) => state.training.warningToast);
  const selectedIntent = useAppSelector((state) => selectSelectedIntent(state));

  useEffect(() => {
    dispatch(getIntents());
  }, [dispatch]);

  useEffect(() => {
    if (successToast !== '') successNotification(toastContext, t(successToast), t('toast.success'));
    if (warningToast !== '') warningNotification(toastContext, t(warningToast), t('toast.warning'));
  }, [t, toastContext, successToast, warningToast]);

  return (
    <ChatStyles>
      <TrainingHeader />
      <main className="training-tab">
        {activeTab === TRAINING_TABS.ARCHIVE && <ChatArchive />}
        {activeTab === TRAINING_TABS.TRAINING && <TrainingCommands />}
        {activeTab === TRAINING_TABS.INTENTS &&
          (intentsLoading ? (
            <ProgressSpinner className="intent-spinner" />
          ) : (
            <>
              <IntentList className="intent-list" />
              {selectedIntent ? (
                <>
                  <div className="intent-content">
                    <div className="intent-examples">
                      <IntentHeader selectedIntent={{ ...selectedIntent, examples }} displayMetaData={!examplesLoading} />
                      {examplesLoading && <ProgressSpinner className="intent-spinner" />}
                      {!examplesLoading && <IntentExampleList examples={examples} />}
                    </div>
                    {examples.length > 0 && <IntentExampleToolbox selectedIntent={selectedIntent} />}
                  </div>
                </>
              ) : (
                <h1 className="intent-unselected">{t('intents.unselected')}</h1>
              )}
            </>
          ))}
      </main>
    </ChatStyles>
  );
};

const ChatStyles = styled.div`
  display: flex;
  flex-flow: column nowrap;
  flex: 1;
  overflow: hidden;

  .intent-spinner {
    margin: auto auto;
  }

  .intent-list {
    border-right: 2px solid #f0f1f2;
    flex-basis: calc(400px - 0.25rem);
    flex-shrink: 0;
  }

  .intent-content {
    display: flex;
    flex: 1;
    height: 100%;
    position: relative;
  }

  .training-tab {
    display: flex;
    flex: 1;
    overflow-y: auto;
  }

  .intent-examples {
    width: 100%;
    display: flex;
    flex-direction: column;
    border-right: 2px solid #f0f1f2;
  }

  .intent-unselected {
    color: #a7a9ab;
    cursor: default;
    font-size: 1.5em;
    font-weight: bold;
    margin: auto;
  }
`;

export default Training;
