import {StyleSheet, View} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import QRCodeScanner from 'react-native-qrcode-scanner';
import MainHeader from '../../common/components/MainHeader';
import {useRootStore} from '../../stores/rootStore';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackScreensParms} from '../../types/navigationTs/RootStackScreenParams';
import ContainerNew from '../../common/components/Container';
import {COLORS} from '../../common/constant/Themes';

const ScanProfiles = () => {
  const {saveProfiles} = useRootStore();
  const {navigate} =
    useNavigation<NativeStackNavigationProp<RootStackScreensParms>>();
  const formArray = (scannedString: string) => {
    const profileArray = scannedString.replace(/"/g, '').split(',');
    saveProfiles(profileArray);
    navigate('Profiles');
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
        onRead={({data}) => formArray(data)}
        reactivate={true}
        reactivateTimeout={3000}
        showMarker={true}
        customMarker={<CustomMarker />}
      />
    </ContainerNew>
  );
};

export default ScanProfiles;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  camera: {
    height: 785,
  },
  btnContainer: {
    alignItems: 'center',
    backgroundColor: '#F8D8D9',
    paddingVertical: 20,
  },
  btnText: {
    color: '#E20006',
    fontSize: 16,
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
