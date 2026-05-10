// FILE: app/layout.tsx
import './globals.css';
import { AppProviders } from '../components/providers/AppProviders';
import { ToastProvider } from '../context/ToastContext'; 
import PlatformUI from '../components/layout/PlatformUI'; // 💡 استدعاء المُغلف الذكي

// 💡 استدعاء مزود الإشعارات اللي عملناه
import { NotificationProvider } from '../features/notifications/hooks/useNotifications';

export const metadata = {
  title: 'Pixel Academy',
  description: 'أكاديمية بيكسل.. خطوتك الأولى نحو التفوق',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <ToastProvider>
          <AppProviders>
            
            {/* 💣 تغليف المنصة بنظام الإشعارات عشان يشتغل في كل مكان */}
            <NotificationProvider>
              
              {/* 💡 المُغلف الذكي هو اللي هيقرر يعرض الهيدر والفوتر ولا يخفيهم */}
              <PlatformUI>
                {children}
              </PlatformUI>

            </NotificationProvider>

          </AppProviders>
        </ToastProvider>
      </body>
    </html>
  );
}