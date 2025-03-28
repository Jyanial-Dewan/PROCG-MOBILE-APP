import {StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {COLORS} from '../constant/Themes';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackScreensParms} from '../../types/navigationTs/RootStackScreenParams';

const PlusButton = () => {
  const {navigate} =
    useNavigation<NativeStackNavigationProp<RootStackScreensParms>>();
  return (
    <TouchableOpacity
      style={styles.btn}
      onPress={() => navigate('New_Message')}>
      <AntDesign name="plus" size={30} color={COLORS.white} />
    </TouchableOpacity>
  );
};

export default PlusButton;

const styles = StyleSheet.create({
  btn: {
    position: 'absolute',
    right: 40,
    bottom: 20,
    backgroundColor: COLORS.primary,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 99,
    zIndex: 50,

    // iOS Shadow
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4,

    // Android Shadow
    elevation: 5,
  },
});
