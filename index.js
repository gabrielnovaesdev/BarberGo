import { registerRootComponent } from 'expo';
import { Platform, Dimensions } from 'react-native';

if (Platform.OS === 'web') {
  const originalGet = Dimensions.get;
  Dimensions.get = (type) => {
    const res = originalGet.call(Dimensions, type);
    if (type === 'window' || type === 'screen') {
      const isDesktop = res.width > 768;
      const targetHeight = Math.min(880, res.height * 0.9);
      const targetWidth = Math.min(430, targetHeight * 0.49);
      return {
        ...res,
        width: isDesktop ? targetWidth : res.width,
        height: isDesktop ? targetHeight : res.height,
      };
    }
    return res;
  };
}

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
