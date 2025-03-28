import React, {Fragment} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {COLORS} from '../constant/Themes';

interface ContainerProps extends React.ComponentProps<typeof TouchableOpacity> {
  colStyle?: object;
  colWidth?: string | number;
  align?: string;
  isCard?: boolean;
  onCardPress?: any;
  onCardLongPress?: any;
  isPressOn?: boolean;
  isEmpty?: boolean;
  onCardFloatIcon?: React.ReactNode;
  onCardFloatIconPress?: any;
  cardBgColor?: any;
}
const Column: React.FC<ContainerProps> = ({
  children,
  colStyle,
  colWidth,
  align = 'flex-start',
  isCard = false,
  onCardPress,
  onCardLongPress,
  isPressOn = true,
  isEmpty = false,
  onCardFloatIcon,
  onCardFloatIconPress,
  cardBgColor,
  ...rest
}) => {
  return (
    <Fragment>
      <TouchableOpacity
        activeOpacity={0.9}
        onLongPress={onCardLongPress}
        onPress={onCardPress}
        disabled={isPressOn}
        style={[
          colStyle,
          isCard && {
            ...styles.card,
            backgroundColor: cardBgColor || COLORS.white,
          },
          {
            width: colWidth,
            height: isEmpty ? 100 : '',
            alignSelf: align,
          },
        ]}
        {...rest}>
        {children}
      </TouchableOpacity>

      {onCardFloatIcon ? (
        <TouchableOpacity
          onPress={onCardFloatIconPress}
          style={styles.floatCard}>
          {onCardFloatIcon}
        </TouchableOpacity>
      ) : null}
    </Fragment>
  );
};

export default Column;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 5,
    borderRadius: 8,
    padding: 16,
    marginTop: 10,
  },
  floatCard: {
    position: 'absolute',
    right: 16,
    top: 12,
    borderRadius: 100,
    justifyContent: 'center',
  },
});
