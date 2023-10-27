import { Toast } from 'primereact/toast';

export const successNotification = (toastContext: React.RefObject<Toast> | null, notificationMessage: string, notificationSummary: string): void => {
  toastContext?.current?.show({ severity: 'success', summary: notificationSummary, detail: notificationMessage });
};

export const warningNotification = (toastContext: React.RefObject<Toast> | null, notificationMessage: string, notificationSummary: string): void => {
  toastContext?.current?.show({ severity: 'warn', summary: notificationSummary, detail: notificationMessage });
};
