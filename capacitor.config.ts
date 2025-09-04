import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.5bdd19a62450429e92588b968c43ad4d',
  appName: 'breathe-buddy-tracker',
  webDir: 'dist',
  // Remove server config for production build to use local files
  // server: {
  //   url: "https://5bdd19a6-2450-429e-9258-8b968c43ad4d.lovableproject.com?forceHideBadge=true",
  //   cleartext: true
  // },
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