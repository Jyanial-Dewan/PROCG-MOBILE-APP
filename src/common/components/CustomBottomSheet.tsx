import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {COLORS, SIZES} from '../constant/Themes';
import RBSheet from '../packages/RBSheet/RBSheet';

interface ContainerProps extends React.ComponentProps<typeof ScrollView> {
  refRBSheet: any;
  sheetHeight?: number;
}
const CustomBottomSheetNew: React.FC<ContainerProps> = ({
  refRBSheet,
  sheetHeight,
  children,
  ...rest
}) => {
  return (
    <RBSheet
      ref={refRBSheet}
      width={SIZES.width}
      height={sheetHeight ? sheetHeight : SIZES.height / 1.7}
      duration={150}
      closeOnDragDown={true}
      animationType={'fade'}
      keyboardAvoidingViewEnabled={true}
      customStyles={{
        container: {
          borderTopRightRadius: 24,
          borderTopLeftRadius: 24,
          backgroundColor: COLORS.white,
        },
      }}
      {...rest}>
      <View style={styles.main}>{children}</View>
    </RBSheet>
  );
};

export default CustomBottomSheetNew;

const styles = StyleSheet.create({
  main: {
    paddingHorizontal: 20,
    zIndex: 99999,
  },
});
