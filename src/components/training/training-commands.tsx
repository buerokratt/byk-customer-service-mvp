import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Calendar } from 'primereact/calendar';
import { DateTime } from 'luxon';
import StyledButton, { StyledButtonType } from '../../styled-components/StyledButton';
import { useAppDispatch, useAppSelector } from '../../store';
import { getAssignedTrainingDate, getTrainingMetaData, publishModel, removeTrainingDate, trainModel, trainModelAt } from '../../slices/training.slice';
import { warningNotification } from '../../utils/toast-notifications';
import { ToastContext } from '../../App';
import { GET_IS_TRAINING_INTERVAL } from '../../utils/constants';
import ConfirmationModal from '../confirmation-modal/confirmation-modal';

const TrainingCommands = (): JSX.Element => {
  const { t } = useTranslation();
  const [date, setDate] = useState<Date | Date[] | undefined>();
  const isTraining = useAppSelector((state) => state.training.isTraining);
  const assignedTrainingDate = useAppSelector((state) => state.training.assignedTrainingDate);
  const areTestsPositive = useAppSelector((state) => state.training.areLatestTestResultsPositive);
  const publishingModel = useAppSelector((state) => state.training.publishingModel);
  const fetchingIsBotTraining = useAppSelector((state) => state.training.fetchingIsBotTraining);
  const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
  const dispatch = useAppDispatch();
  const toastContext = useContext(ToastContext);
  const formattedTrainingDate = DateTime.fromISO(assignedTrainingDate).setLocale('et').toLocaleString(DateTime.DATETIME_MED);

  useEffect(() => {
    dispatch(getTrainingMetaData(true));
    dispatch(getAssignedTrainingDate());
  }, [dispatch]);

  useEffect(() => {
    if (!isTraining) return () => null;
    const interval = setInterval(() => dispatch(getTrainingMetaData(false)), GET_IS_TRAINING_INTERVAL);
    return () => clearInterval(interval);
  }, [dispatch, isTraining]);

  const dispatchTrainModelRequest = (trainAt?: Date | Date[]) => {
    if (trainAt && trainAt <= new Date()) {
      warningNotification(toastContext, t('trainingCommands.pastDate'), t('toast.error'));
      return;
    }
    const trainingDate = (trainAt ? new Date(trainAt.toString()) : new Date()).toISOString();
    const dispatchArg = { helperFunctionInput: DateTime.fromISO(trainingDate).setLocale('et').toFormat('yyyyMMddHHmm'), trainingDate };
    if (trainAt) dispatch(trainModelAt(dispatchArg));
    else dispatch(trainModel(trainingDate));
  };

  return (
    <TrainingCommandsStyles>
      {fetchingIsBotTraining ? (
        <ProgressSpinner className="intent-spinner" />
      ) : (
        <div>
          <div className="training-commands-header">
            <div className="training-commands-label">{t('trainingCommands.label')}</div>
            <div className="training-commands-calendar">
              <Calendar
                disabled={(!!assignedTrainingDate && new Date(assignedTrainingDate) > new Date()) || isTraining}
                showButtonBar
                showTime
                dateFormat="dd. M yy"
                showIcon
                locale="et"
                value={date}
                onChange={(e) => setDate(e.value)}
              />
            </div>
          </div>
          <div className="training-commands-header">
            <div className="training-commands-toggle-buttons">
              {assignedTrainingDate && new Date(assignedTrainingDate) > new Date() ? (
                <div>
                  <div>{`${t('trainingCommands.assignedDateDescription')} ${formattedTrainingDate}`}</div>
                  <StyledButton
                    tabIndex={0}
                    role="button"
                    styleType={StyledButtonType.GRAY}
                    className="cancel-training"
                    onClick={() => dispatch(removeTrainingDate())}
                  >
                    {t('trainingCommands.cancelTraining')}
                  </StyledButton>
                </div>
              ) : (
                <>
                  {isTraining ? (
                    <div className="training-commands-loading">
                      <div>{`${t('trainingCommands.inTraining')} ${formattedTrainingDate}`}</div>
                      <ProgressSpinner className="training-commands-spinner" />
                    </div>
                  ) : (
                    <div>
                      <StyledButton
                        tabIndex={0}
                        role="button"
                        styleType={StyledButtonType.GRAY}
                        className="begin-training"
                        onClick={() => dispatchTrainModelRequest()}
                      >
                        {t('trainingCommands.trainNow')}
                      </StyledButton>
                      <StyledButton
                        tabIndex={0}
                        role="button"
                        styleType={StyledButtonType.GRAY}
                        className="begin-training"
                        disabled={!date}
                        onClick={() => dispatchTrainModelRequest(date)}
                      >
                        {t('trainingCommands.trainLater')}
                      </StyledButton>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          <small className="training-commands">{t('trainingCommands.information')}</small>
          <div className="training-commands-footer">
            <div className="training-commands-label">{t('trainingCommands.publishLabel')}</div>
            <StyledButton
              tabIndex={0}
              role="button"
              className={isTraining || areTestsPositive ? 'publish-model' : 'publish-model unable'}
              styleType={StyledButtonType.GREEN}
              onClick={() => setDisplayConfirmationModal(true)}
              disabled={publishingModel || isTraining || !areTestsPositive}
            >
              {areTestsPositive ? t('trainingCommands.publishButton') : t('trainingCommands.unableToPublish')}
            </StyledButton>
          </div>
        </div>
      )}
      <ConfirmationModal
        isActive={displayConfirmationModal}
        setActive={(e) => setDisplayConfirmationModal(e)}
        affirmativeAction={() => {
          setDisplayConfirmationModal(false);
          dispatch(publishModel());
        }}
        negativeAction={() => setDisplayConfirmationModal(false)}
        headerText={t('trainingCommands.confirmPublish')}
      />
    </TrainingCommandsStyles>
  );
};

const TrainingCommandsStyles = styled.div`
  display: flex;
  margin: 3rem auto 0 auto;
  max-width: 50rem;

  .training-commands-calendar,
  .training-commands-toggle-buttons {
    margin: 0 0 0.25rem auto;
  }

  .training-commands-header {
    display: flex;
    margin-bottom: 1rem;
    align-items: center;
    justify-content: space-between;
  }

  .training-commands-loading {
    display: flex;
    margin-top: 1.2rem;
    align-items: center;
    justify-content: space-between;
  }

  .training-commands-footer {
    display: flex;
    align-items: center;
    margin-top: 3rem;
    justify-content: space-between;
  }

  .training-commands-label {
    display: flex;
    align-items: center;
  }

  .training-commands-spinner {
    height: 1.5rem;
    width: 2.5rem;
  }

  .training-commands {
    color: #a7a9ab;
    margin-bottom: 2rem;
  }

  .begin-training {
    margin: 1rem 0 0 1rem;
  }

  .cancel-training {
    margin: 1rem 0 0 auto;
    float: right;
  }

  .publish-model {
    margin: 1rem;

    &.unable {
      &[disabled] {
        background-color: #bf4242;
        color: #f0f1f2;
      }
    }
  }
`;

export default TrainingCommands;
