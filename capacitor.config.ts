import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig & { [key: string]: any } = {
  appId: 'com.emma.greenwaybuddy',
  appName: 'GreenWayBuddy',
  webDir: 'dist',
  bundledWebRuntime: false
};

export default config;
