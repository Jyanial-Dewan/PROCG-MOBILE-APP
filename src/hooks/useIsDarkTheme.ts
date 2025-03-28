import {useMemo} from 'react';
import {useColorScheme} from 'react-native';
import {useRootStore} from '../stores/rootStore'; // Ensure the correct path

const useIsDarkTheme = (): [boolean, boolean] => {
  const {userColorScheme} = useRootStore();
  const systemColorScheme = useColorScheme();

  const isDark = useMemo(
    () =>
      userColorScheme === 'dark' ||
      (!userColorScheme && systemColorScheme === 'dark'),
    [systemColorScheme, userColorScheme],
  );

  return [isDark, !userColorScheme]; // [isDarkTheme, isUserPreferenceSet]
};

export default useIsDarkTheme;
