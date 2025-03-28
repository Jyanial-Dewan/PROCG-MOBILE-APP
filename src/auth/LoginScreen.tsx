/* eslint-disable react-native/no-inline-styles */
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useIsFocused, useRoute} from '@react-navigation/native';
import axios from 'axios';
import {observer} from 'mobx-react-lite';
import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {
  BackHandler,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import OcIcon from 'react-native-vector-icons/Octicons';
import {ProcgURL} from '../../App';
import Column from '../common/components/Column';
import ContainerNew from '../common/components/Container';
import CustomButtonNew from '../common/components/CustomButton';
import CustomInputNew from '../common/components/CustomInput';
import {useToast} from '../common/components/CustomToast';
import {COLORS, SIZES} from '../common/constant/Index';
import {httpRequest} from '../common/constant/httpRequest';
import useAsyncEffect from '../common/packages/useAsyncEffect/useAsyncEffect';
import {clearAllStorage} from '../common/services/clearStorage';
import {RootStackScreenProps} from '../navigations/RootStack';
import {useRootStore} from '../stores/rootStore';
import {api} from '../common/api/api';
import Images from '../common/constant/Images';
import messaging from '@react-native-firebase/messaging';
import CustomInvalidModal from '../common/components/CustomInvalidModal';
import CustomTextNew from '../common/components/CustomText';
import Row from '../common/components/Row';
import {Checkbox} from 'react-native-paper';
import {useSocketContext} from '../context/SocketContext';

interface PayloadType {
  email: string;
  password: string;
}

const Login = observer<RootStackScreenProps<'Login'>>(({navigation}) => {
  const [isModalShow, setIsModalShow] = useState(false);
  const route = useRoute();

  const {
    userInfoSave,
    deviceInfoData,
    deviceInfoSave,
    selectedUrl,
    fcmTokenSave,
  } = useRootStore();

  const initValue = {
    email: '',
    password: '',
  };
  //@ts-ignore
  const {fromReset, email} = route?.params || {};
  const [showPass, setShowPass] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const toaster = useToast();
  const isFocused = useIsFocused();

  const {control, handleSubmit, setValue, reset} = useForm({
    defaultValues: initValue,
  });

  if (fromReset) {
    setValue('email', email);
  }
  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      GoogleSignin?.configure({
        webClientId: '',
      });

      const backAction = () => {
        if (navigation.isFocused()) {
          BackHandler.exitApp();
          return true;
        } else {
          console.log('hello');
        }
      };
      // if (JailMonkey?.trustFall() || JailMonkey.AdbEnabled()) {
      //   clearAllStorage();
      // }
      BackHandler.addEventListener('hardwareBackPress', backAction);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', backAction);
    },
    [isFocused],
  );

  const onSubmit = async (data: PayloadType) => {
    // Create FCM Token
    const fcmToken = await messaging().getToken();
    fcmTokenSave({fcmToken: fcmToken});

    const payload = {
      email: data?.email?.trim(),
      password: data?.password?.trim(),
      strDeviceId: fcmToken,
    };
    const api_params = {
      url: api.AuthAppsLogin,
      data: payload,
      method: 'post',
      baseURL: ProcgURL,
      isConsole: true,
      isConsoleParams: true,
    };
    const res = await httpRequest(api_params, setIsLoading);

    if (res?.access_token) {
      const deviceInfoPayload = {
        user_id: res.user_id,
        deviceInfo: {
          device_type: deviceInfoData?.device_type,
          browser_name: 'App',
          browser_version: '1.0',
          os: deviceInfoData?.os,
          user_agent: deviceInfoData?.user_agent,
          is_active: 1,
          ip_address: deviceInfoData?.ip_address,
          location: deviceInfoData?.location || 'Unknown (Location off)',
        },
      };
      const deviceInfoApi_params = {
        url: api.AddDeviceInfo,
        data: deviceInfoPayload,
        method: 'post',
        baseURL: ProcgURL,
        isConsole: true,
        isConsoleParams: true,
      };
      axios.defaults.baseURL = selectedUrl || ProcgURL;
      axios.defaults.headers.common['Authorization'] =
        `Bearer ${res?.access_token}`;
      userInfoSave(res);
      // navigation.replace('HomeScreen');
      navigation.push('Drawer');
      toaster.show({message: 'Login Successfully', type: 'success'});
      const response = await httpRequest(deviceInfoApi_params, setIsLoading);

      if (response && deviceInfoData) {
        deviceInfoSave({...deviceInfoData, id: response.id});
      }
    } else if (res === undefined || res === 401) {
      setIsModalShow(true);
      return;
    } else {
      reset();
      signOut();
      toaster.show({message: 'Something Went Wrong!', type: 'warning'});
    }
  };
  const signOut = async () => {
    clearAllStorage();
  };
  return (
    <ContainerNew edges={['top', 'left', 'right']} style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={styles.settings}>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <OcIcon name="gear" size={24} color="#9CA3AFBF" />
        </TouchableOpacity>
      </View>
      <View style={styles.main}>
        <View>
          <Image source={Images.AppLogoWithNameLarge} style={styles.logo} />
          {/* <Text style={styles.appName}>PRO-CG</Text> */}
        </View>
        {/* To Login */}
        <Column>
          <Column>
            <CustomTextNew
              text="Email"
              txtSize={16}
              txtWeight={'500'}
              padBottom={14}
            />
            <CustomInputNew
              setValue={setValue}
              control={control}
              name="email"
              label="Enter your email"
              rules={{required: true}}
            />
          </Column>

          <Column
            colStyle={{
              marginTop: 16,
            }}>
            <CustomTextNew
              text="Password"
              txtSize={16}
              txtWeight={'500'}
              padBottom={14}
            />
            <CustomInputNew
              setValue={setValue}
              control={control}
              name="password"
              label="Enter your password"
              rules={{required: true}}
              secureTextEntry={showPass}
              rightIcon={() => (
                <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                  <Icon
                    name={showPass ? 'eye-off' : 'eye'}
                    color={COLORS.iconColor}
                    size={22}
                  />
                </TouchableOpacity>
              )}
            />
            <Row justify="space-between" align="center">
              <Checkbox.Item
                style={{marginVertical: 0, paddingHorizontal: 0}}
                labelStyle={{color: COLORS.headerText, paddingLeft: 0}}
                label="Remember"
                status={checked ? 'checked' : 'unchecked'}
                onPress={() => {
                  setChecked(!checked);
                }}
                position="leading"
              />
              <Column>
                <TouchableOpacity
                  onPress={() => console.log('Forgot Password')}>
                  <Text style={styles.forgotPassword}>Forgot Password?</Text>
                </TouchableOpacity>
              </Column>
            </Row>
            <CustomButtonNew
              disabled={isLoading}
              btnText="Login"
              isLoading={isLoading}
              onBtnPress={handleSubmit(onSubmit)}
              btnstyle={styles.btn}
              btnTextStyle={styles.btnTxt}
            />
          </Column>
        </Column>
        {/* Wrapper */}
        <Row justify="space-between" align="center">
          <View style={styles.itemListWrapper} />
          <CustomTextNew txtStyle={styles.orText} text={'or'} />
          <View style={styles.itemListWrapper} />
        </Row>

        <Column colWidth={Platform.OS === 'ios' ? '100%' : '100%'}>
          <Column colWidth={'100%'}>
            <TouchableOpacity onPress={() => console.log('Login with SSO')}>
              <View style={styles.buttonContainer}>
                <Text style={styles.buttonText}>Login with SSO</Text>
              </View>
            </TouchableOpacity>
          </Column>
          <Column
            colWidth={'100%'}
            colStyle={{
              paddingTop: 20,
            }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ScanLoginQrCode')}>
              <View style={styles.buttonContainer}>
                <Text style={styles.buttonText}>Login using QR Code</Text>
              </View>
            </TouchableOpacity>
          </Column>
          <Column
            colWidth={'100%'}
            colStyle={{
              paddingTop: 20,
            }}></Column>
        </Column>
      </View>
      <CustomInvalidModal
        isModalShow={isModalShow}
        setIsModalShow={setIsModalShow}
        showText="Unable to Login"
        invalidText="Something Went Wrong. Please try again"
      />
    </ContainerNew>
  );
});

export default Login;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
  },
  main: {
    backgroundColor: COLORS.white,
    // marginTop: SIZES.height / 10,
    marginHorizontal: 30,
  },
  logo: {
    marginTop: 22,
    marginBottom: 79,
    alignSelf: 'center',
    height: 60,
    width: 186,
    resizeMode: 'contain',
  },
  appName: {
    color: COLORS.transparentDark,
    fontSize: 30,
    fontWeight: 'bold',
    lineHeight: 38,
    textAlign: 'center',
    paddingBottom: 30,
  },
  btn: {
    borderRadius: 8,
    justifyContent: 'center',
    paddingVertical: 9,
  },
  btnTxt: {
    fontSize: 14,
    fontWeight: '500',
    alignSelf: 'center',
  },
  google: {
    width: '100%',
  },
  googleBtnContainer: {
    marginHorizontal: 14,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  buttonContainer: {
    borderRadius: Platform.OS === 'ios' ? 8 : 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  buttonText: {
    paddingVertical: 13,
    fontSize: 14,
    fontWeight: '400',
    alignSelf: 'center',
    color: COLORS.black,
  },
  reg: {
    fontSize: 15,
    color: COLORS.primary,
    paddingHorizontal: 4,
    fontWeight: '600',
  },
  iconDesign: {
    marginVertical: 4,
    padding: 8,
    borderRadius: 50,
    backgroundColor: COLORS.iconGrayBackground,
  },
  pad: {
    padding: 8,
  },
  businessPartnerTypeTxt: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
    marginLeft: 16,
    marginTop: 14,
  },
  rowTxt: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    color: COLORS.textNewColor,
    paddingBottom: 10,
  },
  appContainer: {
    padding: 16,
  },
  forgotPassword: {
    marginTop: 18,
    textAlign: 'right',
    color: '#F7941D',
    fontSize: 14,
    fontWeight: '500',
  },
  settings: {
    paddingTop: 14,
    marginRight: 20,
    alignSelf: 'flex-end',
  },
  itemListWrapper: {
    flex: 1,
    height: 1,
    backgroundColor: '#E4E9F2',
    marginVertical: 27,
  },
  orText: {
    color: COLORS.black,
    marginHorizontal: 10,
    fontSize: 12,
    fontWeight: '400',
  },
});
