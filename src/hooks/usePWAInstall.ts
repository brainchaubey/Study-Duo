
import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const [isInstalled, setIsInstalled] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    const checkInstalled = () => {
      const standalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as Navigator & { standalone?: boolean })
          .standalone === true;

      setIsInstalled(standalone);
    };

    checkInstalled();

    setIsAndroid(/android/i.test(navigator.userAgent));

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener(
      'beforeinstallprompt',
      handleBeforeInstallPrompt
    );

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );

      window.removeEventListener(
        'appinstalled',
        handleAppInstalled
      );
    };
  }, []);

  const install = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();

        const { outcome } = await deferredPrompt.userChoice;

        setDeferredPrompt(null);

        if (outcome === 'accepted') {
          setIsInstalled(true);
          return true;
        }

        return false;
      } catch {
        // If the native prompt fails, show manual instructions.
      }
    }

    if (isAndroid) {
      window.alert(
        'Install StudyDuo on your Android phone:\n\n' +
        '1. Open StudyDuo in Google Chrome.\n' +
        '2. Tap the three dots (⋮) in the top-right corner.\n' +
        '3. Tap "Install app" or "Add to Home screen".\n' +
        '4. Confirm by tapping Install or Add.\n\n' +
        'If neither option appears, Chrome is not currently ' +
        'offering installation on this device.'
      );
    } else {
      window.alert(
        'Open StudyDuo in Google Chrome on your Android phone ' +
        'to install it.'
      );
    }

    return false;
  };

  return {
    isInstallable: !!deferredPrompt || (isAndroid && !isInstalled),
    isInstalled,
    isAndroid,
    install,
  };
}
