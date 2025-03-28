import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {observer} from 'mobx-react-lite';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import MainHeader from '../../common/components/MainHeader';
import {RootStackScreensParms} from '../../types/navigationTs/RootStackScreenParams';
import {UserInfoStoreType} from '../../stores/userInfo';
import {useRootStore} from '../../stores/rootStore';
import {Buffer} from 'buffer';
import {api} from '../..//common/api/api';
import {ProcgURL} from '../../../App';
import {httpRequest} from '../../common/constant/httpRequest';
import axios from 'axios';
import ContainerNew from '../../common/components/Container';
import {COLORS} from '../../common/constant/Themes';

const ScanLoginQrCode = observer(() => {
  const [accessToken, setAccessToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {userInfoSave, deviceInfoData, deviceInfoSave, selectedUrl} =
    useRootStore();
  const {navigate} =
    useNavigation<NativeStackNavigationProp<RootStackScreensParms>>();
  const url = selectedUrl || ProcgURL;

  const decode = async (token: string) => {
    console.log(token, '29');
    let cleanedToken = token.replace(/^"|"$/g, '');
    console.log(cleanedToken, '31');
    axios.defaults.baseURL = selectedUrl || ProcgURL;
    axios.defaults.headers.common['Authorization'] = `Bearer ${cleanedToken}`;
    setAccessToken(token);
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT structure');
    }

    const payload = parts[1];

    const decodedPayload = Buffer.from(payload, 'base64').toString('utf-8');
    const parsedPayload = JSON.parse(decodedPayload) as UserInfoStoreType;
    console.log(parsedPayload);

    if (parsedPayload.isLoggedIn) {
      userInfoSave(parsedPayload);

      const deviceInfoPayload = {
        user_id: parsedPayload.user_id,
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
        baseURL: url,
        isConsole: true,
        isConsoleParams: true,
      };

      const response = await httpRequest(deviceInfoApi_params, setIsLoading);
      if (response && deviceInfoData) {
        deviceInfoSave({...deviceInfoData, id: response.id});
      }
    }

    navigate('Drawer');
  };

  const CustomMarker = () => (
    <View style={styles.customMarkerContainer}>
      <View style={styles.borderTopLeft} />
      <View style={styles.borderTopRight} />
      <View style={styles.borderBottomLeft} />
      <View style={styles.borderBottomRight} />
    </View>
  );

  return (
    <ContainerNew
      header={
        <MainHeader style={{color: 'red'}} routeName="Scan_QR_for_Connection" />
      }>
      <QRCodeScanner
        containerStyle={styles.container}
        cameraStyle={styles.camera}
        onRead={({data}) => decode(data)}
        reactivate={true}
        reactivateTimeout={3000}
        showMarker={true}
        customMarker={<CustomMarker />}
      />
    </ContainerNew>
  );
});

export default ScanLoginQrCode;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  camera: {
    height: 785,
  },
  btn: {
    height: 54,
    paddingVertical: 0,
    justifyContent: 'center',
    backgroundColor: '#F8D8D9',
  },
  btnTxt: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 20,
    alignSelf: 'center',
    color: 'red',
  },

  customMarkerContainer: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    borderColor: '#0C5F20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  borderTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 40,
    height: 40,
    borderLeftWidth: 4,
    borderTopWidth: 4,
    borderColor: COLORS.primary,
  },
  borderTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderColor: COLORS.primary,
  },
  borderBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 40,
    height: 40,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderColor: COLORS.primary,
  },
  borderBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderColor: COLORS.primary,
  },
});
