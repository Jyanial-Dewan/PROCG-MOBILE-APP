/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {COLORS} from '../constant/Themes';

interface Props extends React.ComponentProps<typeof Pressable> {
  disabled?: boolean;
  bgColor?: string;
  btnstyle?: {};
  onBtnPress?: () => void;
  btnTextStyle?: {};
  btnText?: string;
  isLoading?: boolean;
  center?: boolean;
}
const CustomButtonNew: React.FC<Props> = ({
  bgColor = COLORS.primaryBtn,
  disabled = false,
  btnstyle = {},
  onBtnPress,
  btnTextStyle,
  btnText,
  isLoading = false,
  center = true,
}: Props) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[
        styles.btnStyle,
        {backgroundColor: disabled ? COLORS.lightGray : bgColor},
        btnstyle || {},
      ]}
      onPress={onBtnPress}>
      <View
        style={[
          styles.btnContentWrapperView,
          {
            alignSelf: center ? 'center' : 'auto',
          },
        ]}>
        {btnText && (
          <Text style={[styles.btnText, btnTextStyle || {}]}>{btnText}</Text>
        )}
        {isLoading && (
          <ActivityIndicator
            size="small"
            color={COLORS.white}
            style={styles.loadingStyle}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CustomButtonNew;

const styles = StyleSheet.create({
  btnText: {
    color: COLORS.white,
    fontWeight: '500',
    fontSize: 14,
    textAlign: 'center',
  },
  btnStyle: {
    paddingVertical: 12,
    borderRadius: 6,
    justifyContent: 'center',
  },
  btnContentWrapperView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  loadingStyle: {transform: [{scaleX: 0.8}, {scaleY: 0.8}], paddingLeft: 10},
});
