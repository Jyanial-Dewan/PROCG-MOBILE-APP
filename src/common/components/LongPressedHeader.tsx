import {StyleSheet, View} from 'react-native';
import React from 'react';
import RoundedButton from './RoundedButton';
import Feather from 'react-native-vector-icons/Feather';

interface LongPressedHeaderProps {
  from?: string;
  handleCancelLongPress: () => void;
  handleMultipleDelete?: () => Promise<void>;
  handleShowModal?: () => void;
}

const LongPressedHeader = ({
  from,
  handleCancelLongPress,
  handleShowModal,
  handleMultipleDelete,
}: LongPressedHeaderProps) => {
  const defaultHandler = () => {};

  return (
    <View style={styles.longPressedHeaderContainer}>
      <RoundedButton
        onPress={handleCancelLongPress}
        child={<Feather name="x" size={24} color="black" />}
      />
      {from === 'Recycle_Bin' ? (
        <RoundedButton
          onPress={handleShowModal || defaultHandler}
          child={<Feather name="trash" size={24} color="black" />}
        />
      ) : (
        <RoundedButton
          onPress={handleMultipleDelete || defaultHandler}
          child={<Feather name="trash" size={24} color="black" />}
        />
      )}
    </View>
  );
};

export default LongPressedHeader;

const styles = StyleSheet.create({
  longPressedHeaderContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
});
