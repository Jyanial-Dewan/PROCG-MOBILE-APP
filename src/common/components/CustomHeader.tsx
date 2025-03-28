import React from 'react';
import {
  Image,
  StatusBar,
  StatusBarStyle,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Appbar, Card, useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useRoute} from '@react-navigation/native';
import {IMAGES} from '../constant/Index';

interface CustomHeaderProps {
  title: string;
  subtitle?: string;
  statusBarStyle?: StatusBarStyle;
  rightIcon?: string;
  content?: React.ReactNode;
  right?: () => React.ReactNode;
  onClosePress?: () => void;
  onBackPress?: () => void;
  onLeftMenuPress?: () => void;
  onRightMenuPress?: () => void;
  onRefreshMenuPress?: () => void;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  subtitle,
  statusBarStyle = 'light-content',
  onClosePress,
  onBackPress,
  onLeftMenuPress,
  onRightMenuPress,
  rightIcon,
  right,
  content,
  onRefreshMenuPress,
}) => {
  const {top} = useSafeAreaInsets();
  const {colors} = useTheme();
  const route = useRoute();
  return (
    <View
      style={{
        height: 85,
        width: '100%',
        backgroundColor: colors.primary,
        borderRadius: 24,
        position: 'relative',
        top: 0,
      }}>
      <Appbar.Header
        statusBarHeight={top}
        style={{
          backgroundColor: colors.primary,
          shadowOpacity: 0,
          elevation: 0,
          paddingBottom: 0,
        }}>
        <StatusBar
          barStyle={'dark-content'}
          backgroundColor={colors.primary}
          animated
        />
        {/* <Appbar.Action size={30} icon="menu" onPress={onLeftMenuPress} color={'white'} />  */}
        {onLeftMenuPress ? (
          <TouchableOpacity
            onPress={onLeftMenuPress}
            style={{
              paddingRight: 10,
              paddingVertical: 10,
            }}>
            <Image
              source={IMAGES.MENU}
              style={{
                width: 25,
                height: 25,
                marginLeft: 10,
              }}
            />
          </TouchableOpacity>
        ) : null}
        {onClosePress ? (
          <Appbar.Action
            size={30}
            icon="close"
            onPress={onClosePress}
            color={'white'}
          />
        ) : null}
        {onBackPress ? (
          <Appbar.BackAction size={30} onPress={onBackPress} color={'white'} />
        ) : null}
        {content ? (
          content
        ) : (
          <Appbar.Content
            title={title}
            subtitle={subtitle}
            color={'white'}
            titleStyle={{
              alignSelf: 'center',
              textAlign: 'center',
              fontSize: 20,
              fontWeight: '700',
              marginLeft: onBackPress ? -60 : 0,
              fontFamily: 'Montserrat',
            }}
          />
        )}
        {right && right()}

        {onRefreshMenuPress ? (
          <Appbar.Action
            size={30}
            icon={'refresh'}
            onPress={onRefreshMenuPress}
          />
        ) : null}
        {onRightMenuPress ? (
          rightIcon ? (
            <Appbar.Action
              size={30}
              icon={rightIcon || 'dots-vertical'}
              onPress={onRightMenuPress}
            />
          ) : (
            <Appbar.Action
              size={30}
              icon="dots-vertical"
              onPress={onRightMenuPress}
            />
          )
        ) : null}
      </Appbar.Header>
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    marginTop: 100,
    width: '100%',
    zIndex: 9999,
    overflow: 'hidden',
  },
  card: {
    width: '90%',
    borderRadius: 15,
    elevation: 10,
    height: 60,
    zIndex: 9999,
    overflow: 'hidden',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  icon: {
    paddingHorizontal: 8,
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    height: 40,
  },
});
