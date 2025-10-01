import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.breathebuddytracker',
  appName: 'PeakFlow-Tracker',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#E0F2FE",
      showSpinner: true,
      spinnerColor: "#0EA5E9"
    }
  }
};

export default config;
