import {StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import {COLORS} from '../constant/Themes';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackScreensParms} from '../../types/navigationTs/RootStackScreenParams';

interface ReplyButtonProps {
  parentId: string;
}

const ReplyButton = ({parentId}: ReplyButtonProps) => {
  const {navigate} =
    useNavigation<NativeStackNavigationProp<RootStackScreensParms>>();
  return (
    <TouchableOpacity
      style={styles.btn}
      onPress={() => navigate('Reply', {_id: parentId})}>
      <Feather name="corner-up-right" size={24} color={COLORS.white} />
    </TouchableOpacity>
  );
};

export default ReplyButton;

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
