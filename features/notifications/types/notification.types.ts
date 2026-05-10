export type PermissionStatus = 'idle' | 'loading' | 'granted' | 'denied';
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface AppNotification {
    id: string;
    title: string;
    body: string;
    createdAt: string;
    isRead: boolean;
    type?: NotificationType;
}