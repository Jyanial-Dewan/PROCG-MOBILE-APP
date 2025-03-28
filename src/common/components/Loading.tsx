import React from 'react';
import {ActivityIndicator, ScrollView, StyleSheet, View} from 'react-native';
import {COLORS} from '../constant/Themes';

interface LoadingContainerProps
  extends React.ComponentProps<typeof ScrollView> {
  isLoading?: boolean;
  size?: any;
}
const LoadingContainer: React.FC<LoadingContainerProps> = ({
  isLoading = 'false',
  size = 'small',
}) => {
  return (
    <>
      {isLoading ? (
        <View style={styles.cont}>
          <ActivityIndicator
            color={COLORS.primary}
            size={size}
            style={styles.container}
          />
        </View>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  cont: {
    // marginTop: 16,
  },
  container: {
    position: 'absolute',
    zIndex: 999999,
    alignContent: 'center',
    alignSelf: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: 100,
    padding: 10,
    justifyContent: 'center',
    elevation: 10,
    flex: 1,
  },
});

export default LoadingContainer;
