import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import ContainerNew from '../../common/components/Container';
import MainHeader from '../../common/components/MainHeader';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {observer} from 'mobx-react-lite';
import {useRootStore} from '../../stores/rootStore';
import {RootStackScreenProps} from '../../navigations/RootStack';
import {COLORS} from '../../common/constant/Themes';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

export interface NavigationStackParamList {
  [key: string]: undefined | object;
  ChooseConnection: {url: string};
}

export type ChooseConnectionNavigationProp = NativeStackNavigationProp<
  NavigationStackParamList,
  'ChooseConnection'
>;

interface PayloadType {
  link: string;
}

const initValue = {
  link: '',
};

const CustomMarker = () => (
  <View style={styles.customMarkerContainer}>
    <View style={styles.borderTopLeft} />
    <View style={styles.borderTopRight} />
    <View style={styles.borderBottomLeft} />
    <View style={styles.borderBottomRight} />
  </View>
);

const ScanQrConnection = observer<RootStackScreenProps<'ScanQrConnection'>>(
  () => {
    const rootStore = useRootStore();
    const navigation = useNavigation<ChooseConnectionNavigationProp>();
    const handleScanQrCode = (e: any) => {
      const url = JSON.parse(e.data);
      const urlPattern = /^(https?:\/\/[^\s$.?#].[^\s]*)$/i;
      if (urlPattern.test(url)) {
        rootStore.addUrl(url);
        rootStore.setSelectedUrl(url);
        navigation.navigate('ChooseConnection', {
          url: '',
        });
      } else {
        navigation.navigate('ChooseConnection', {
          url: 'Invalid',
        });
      }
    };

    return (
      <ContainerNew
        header={
          <MainHeader
            style={{color: 'red'}}
            routeName="Scan_QR_for_Connection"
          />
        }>
        <QRCodeScanner
          containerStyle={styles.container}
          cameraStyle={styles.camera}
          onRead={e => handleScanQrCode(e)}
          reactivate={true}
          reactivateTimeout={3000}
          showMarker={true}
          customMarker={<CustomMarker />}
        />
      </ContainerNew>
    );
  },
);

export default ScanQrConnection;

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
