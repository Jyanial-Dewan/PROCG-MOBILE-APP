import React from 'react';
import {ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {COLORS} from '../constant/Themes';

interface ContainerProps extends React.ComponentProps<typeof ScrollView> {
  rowStyle?: object;
  align?: string;
  rowWidth?: string;
  justify?: string;
  direction?: string;
  isCard?: boolean;
  onCardPress?: any;
  onCardLongPress?: any;
  isPressOn?: boolean;
}
const Row: React.FC<ContainerProps> = ({
  children,
  rowStyle,
  align = 'stretch',
  justify = 'flex-start',
  rowWidth = '100%',
  direction = 'row',
  onCardPress,
  onCardLongPress,
  isPressOn = true,
  isCard = false,
  ...rest
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onCardPress}
      onLongPress={onCardLongPress}
      disabled={isPressOn}
      style={[
        rowStyle,
        styles.row,
        isCard && {...styles.card},
        {
          alignItems: align,
          width: rowWidth,
          justifyContent: justify,
          flexDirection: direction,
        },
      ]}
      {...rest}>
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    // flexDirection: 'row',
  },
  card: {
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 5,
    borderRadius: 8,
    marginTop: 10,
  },
});

export default Row;
