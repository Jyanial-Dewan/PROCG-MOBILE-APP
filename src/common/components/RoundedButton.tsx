import {Pressable, StyleSheet} from 'react-native';
import React from 'react';

interface RoundedButtonProps {
  child: React.ReactNode;
  onPress: () => void;
}

const RoundedButton = ({child, onPress}: RoundedButtonProps) => {
  return (
    <Pressable onPress={onPress} style={styles.btnContainer}>
      {child}
    </Pressable>
  );
};

export default RoundedButton;

const styles = StyleSheet.create({
  btnContainer: {
    width: 36,
    height: 36,
    backgroundColor: '#F5F7FA',
    borderRadius: 91,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
