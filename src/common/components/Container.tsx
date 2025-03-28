import {useNetInfo} from '@react-native-community/netinfo';
import React, {Fragment, useEffect, useState} from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Snackbar} from 'react-native-paper';
import {Edge, SafeAreaView} from 'react-native-safe-area-context';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS} from '../constant/Themes';
import CustomTextNew from './CustomText';

const wait = (timeout: number) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

interface ContainerNewProps extends React.ComponentProps<typeof ScrollView> {
  edges?: Edge[];
  header?: React.ReactNode;
  extraScrollHeight?: number;
  mode?: 'padding' | 'margin';
  isScrollView?: boolean;
  singleFloatBtmBtnStyle?: {};
  isFloatBottomButton?: boolean;
  singleFloatBtmBtnPress?: () => void;
  refreshing?: boolean;
  onRefresh?: () => void;
  setRefresh?: (arg: boolean) => void;
  apiCall?: () => void;
  btnText?: string;
  isKeyboardAware?: boolean;
  isBottomDoubleButton?: boolean;
  firstBtnStyle?: object;
  firstBtnTxtStyle?: object;
  firstBtnTxt?: string;
  secondBtnStyle?: object;
  secondBtnTxtStyle?: object;
  secondBtnTxt?: string;
  firstBtmBtnPress?: () => void;
  secondBtmBtnPress?: () => void;
  btnTextAndStyle?: {};
  isRefresh?: boolean;
  footer?: React.ReactNode;
  singleFloatBtmBtnIcon?: string;
  singleFloatBtmBtnDisable?: boolean;
  singleFloatBtmBtnLoading?: boolean;
  backgroundColor?: string;
}
const ContainerNew: React.FC<ContainerNewProps> = ({
  children,
  edges,
  header,
  extraScrollHeight,
  mode = 'padding',
  isScrollView = true,
  isFloatBottomButton = false,
  singleFloatBtmBtnPress,
  isBottomDoubleButton,
  singleFloatBtmBtnStyle = {},
  refreshing = false,
  setRefresh,
  apiCall,
  btnText,
  isKeyboardAware,
  firstBtnStyle,
  firstBtnTxtStyle,
  firstBtnTxt,
  secondBtnStyle,
  secondBtnTxtStyle,
  secondBtnTxt,
  firstBtmBtnPress,
  secondBtmBtnPress,
  isRefresh = true,
  btnTextAndStyle,
  footer,
  singleFloatBtmBtnDisable = false,
  singleFloatBtmBtnLoading = false,
  singleFloatBtmBtnIcon,
  backgroundColor,
  ...rest
}) => {
  const [isShowBar, setIsShowBar] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const netInfo = useNetInfo();

  useEffect(() => {
    if (!netInfo?.isConnected) {
      setIsShowBar(true);
    } else {
      setIsShowBar(false);
    }
  }, [netInfo?.isConnected]);

  const onRefresh = () => {
    setRefresh && setRefresh(true);
    wait(500).then(async () => {
      apiCall && apiCall();
      setRefresh && setRefresh(false);
    });
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard?.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard?.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );
    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  return (
    <SafeAreaView
      edges={edges}
      mode={mode}
      style={[
        styles.safeareaview,
        backgroundColor
          ? {backgroundColor: backgroundColor}
          : {backgroundColor: COLORS.white},
      ]}>
      {header}
      {isKeyboardAware ? (
        <KeyboardAwareScrollView
          scrollEnabled
          extraScrollHeight={extraScrollHeight || 90}
          enableOnAndroid
          enableAutomaticScroll
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          //@ts-ignore
          refreshControl={
            isRefresh && (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={COLORS.primary}
                colors={[COLORS.yellow, COLORS.primary]}
              />
            )
          }
          style={styles.keyboard}>
          {children}
          <View style={styles.emptyView} />
        </KeyboardAwareScrollView>
      ) : (
        <Fragment>
          {isScrollView ? (
            <ScrollView
              //@ts-ignore
              refreshControl={
                isRefresh && (
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor={COLORS.primary}
                    colors={[COLORS.yellow, COLORS.primary]}
                  />
                )
              }
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              style={[styles.scrollview]}
              {...rest}>
              {children}
              <View style={styles.emptyView} />
            </ScrollView>
          ) : (
            <View style={styles.view} {...rest}>
              {children}
            </View>
          )}
        </Fragment>
      )}

      {isFloatBottomButton && !isKeyboardVisible && (
        <Pressable
          disabled={singleFloatBtmBtnDisable}
          onPress={singleFloatBtmBtnPress}
          style={[
            singleFloatBtmBtnStyle,
            btnText && btnTextAndStyle && btnTextAndStyle,
            btnText && !btnTextAndStyle && styles.btnForTxt,
            styles.singleBtn,
          ]}>
          {btnText || btnTextAndStyle ? (
            <Text style={styles.btnTxt}>{btnText}</Text>
          ) : (
            <Icons
              name={singleFloatBtmBtnIcon ? singleFloatBtmBtnIcon : 'plus'}
              color={COLORS.white}
              size={30}
            />
          )}
          {singleFloatBtmBtnLoading ? (
            <ActivityIndicator
              size="small"
              color={COLORS.white}
              style={styles.loadingStyle}
            />
          ) : null}
        </Pressable>
      )}
      {isBottomDoubleButton && !isKeyboardVisible && (
        <View style={styles.doubleBtn}>
          <Pressable
            onPress={firstBtmBtnPress}
            style={[styles.firstButton, firstBtnStyle]}>
            <Text style={[styles.firstBtnTxt, firstBtnTxtStyle]}>
              {firstBtnTxt || 'First Button'}
            </Text>
          </Pressable>
          <Pressable
            onPress={secondBtmBtnPress}
            style={[styles.firstButton, secondBtnStyle]}>
            <Text style={[styles.firstBtnTxt, secondBtnTxtStyle]}>
              {secondBtnTxt || 'Second Button'}
            </Text>
          </Pressable>
        </View>
      )}
      {footer}
      {/* <Snackbar
        style={styles.snack}
        visible={isShowBar}
        onDismiss={() => console.log('hello')}>
        <CustomTextNew
          text={'You are offline. Please check your network.'}
          txtStyle={styles.snackText}
        />
      </Snackbar> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeareaview: {
    flex: 1,
  },
  scrollview: {
    flex: 1,
    flexDirection: 'column',
  },
  keyboard: {
    backgroundColor: COLORS.white,
  },
  view: {
    flex: 1,
  },
  snack: {
    backgroundColor: COLORS.darkGray,
  },
  singleBtn: {
    position: 'absolute',
    alignSelf: 'flex-end',
    bottom: 60,
    backgroundColor: COLORS.primaryBtn,
    right: 16,
    padding: 16,
    elevation: 10,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.08,
    shadowRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btnTxt: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '500',
    textAlign: 'center',
  },
  btnForTxt: {
    width: '91.5%',
    paddingVertical: 12,
    bottom: 50,
    // elevation: 10,
    // shadowColor: COLORS.black,
    // shadowOffset: { width: 0, height: 0 },
    // shadowOpacity: 0.08,
    // shadowRadius: 5,
  },
  emptyView: {
    paddingBottom: 100,
  },
  doubleBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 60,
    paddingHorizontal: 16,
    borderRadius: 6,
    width: '100%',
    // paddingBottom: 60,
    // backgroundColor: 'rgba(255,255,255,0.8)',
  },
  firstButton: {
    backgroundColor: COLORS.primaryBtn,
    borderRadius: 6,
    width: '48%',
  },
  firstBtnTxt: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    paddingVertical: 14,
    color: COLORS.white,
  },
  snackText: {
    color: COLORS.white,
    fontSize: 14,
  },
  loadingStyle: {
    paddingLeft: 5,
  },
});

export default ContainerNew;
