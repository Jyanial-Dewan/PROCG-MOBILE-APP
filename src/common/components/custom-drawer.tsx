import {useNavigation} from '@react-navigation/core';
import {DrawerContentComponentProps} from '@react-navigation/drawer';
import {observer} from 'mobx-react-lite';
import React, {useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {useToast} from './CustomToast';
import FixedContainer from './fixed-container';
import {useRootStore} from '../../stores/rootStore';
import {COLORS, SIZES} from '../constant/Index';
import FastImage from 'react-native-fast-image';
import {ProcgURL} from '../../../App';
import {httpRequest} from '../constant/httpRequest';
import {api} from '../api/api';
import SVGController from './SVGController';
import {MMKV} from 'react-native-mmkv';
import Image from 'react-native-image-fallback';
import {useSocketContext} from '../../context/SocketContext';

const CustomDrawer = observer<DrawerContentComponentProps>(props => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigation = useNavigation();
  const toaster = useToast();

  const {userInfo, logout, deviceInfoData, fcmToken, selectedUrl} =
    useRootStore();
  const {socket} = useSocketContext();
  const storage = new MMKV();
  const url = selectedUrl || ProcgURL;
  const source = {
    uri: `${url}/${userInfo?.profile_picture.original}`,
    headers: {
      Authorization: `Bearer ${userInfo?.access_token}`,
    },
  };

  const fallbacks = [require('../../assets/prifileImages/profile.jpg')];

  const handleSignOut = async () => {
    socket?.disconnect();
    const payload = {
      is_active: 0,
    };

    const api_params = {
      url: `${api.UpdateDeviceInfo}/${userInfo?.user_id}/${deviceInfoData?.id}`,
      data: payload,
      method: 'put',
      baseURL: url,
      isConsole: true,
      isConsoleParams: true,
    };

    const tokenPayload = {
      token: fcmToken?.fcmToken,
      username: userInfo?.user_name,
    };
    const tokenParams = {
      url: api.UnregisterToken,
      data: tokenPayload,
      method: 'post',
      baseURL: url,
      isConsole: true,
      isConsoleParams: true,
    };

    logout(); // Ensure logout clears user state
    navigation.navigate('Login');
    await httpRequest(api_params, setIsLoading);
    await httpRequest(tokenParams, setIsLoading);
    await FastImage.clearDiskCache();
    await FastImage.clearMemoryCache();
    storage.clearAll();
  };

  return (
    <FixedContainer style={styles.drawer} edges={['top', 'bottom', 'left']}>
      <TouchableOpacity activeOpacity={0.8}>
        <View
          style={{
            backgroundColor: COLORS.primary,
            width: '100%',
            height: 160,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            style={styles.profileImage}
            source={source}
            fallback={fallbacks}
          />
          <Text
            style={{
              color: COLORS.white,
              fontWeight: '400',
              fontSize: 13,
              marginTop: 4,
            }}>
            {userInfo?.user_name}
          </Text>
        </View>
      </TouchableOpacity>
      <View
        style={{
          width: '100%',
          marginTop: 20,
          paddingHorizontal: 20,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ProfileScreen');
          }}>
          <View style={styles.lineContainer}>
            <SVGController name="User" />
            <Text style={{fontSize: 13, color: COLORS.newGray}}>
              Edit Profile
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={styles.lineContainer}>
            <SVGController name="Security" />
            <Text style={{fontSize: 13, color: COLORS.newGray}}>Security</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity>
          <View style={styles.lineContainer}>
            <SVGController name="Key" />
            <Text style={{fontSize: 13, color: COLORS.newGray}}>
              Change Password
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity>
          <View style={styles.lineContainer}>
            <SVGController name="Settings" />
            <Text style={{fontSize: 13, color: COLORS.newGray}}>Settings</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSignOut}>
          <View style={styles.lineContainer}>
            <SVGController name="Logout" color={COLORS.primary} />
            <Text style={{fontSize: 13, color: COLORS.primary}}>Logout</Text>
          </View>
        </TouchableOpacity>
      </View>
    </FixedContainer>
  );
});

const styles = StyleSheet.create({
  drawer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  contents: {
    paddingHorizontal: 10,
    paddingTop: 20,
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    // marginLeft: 15,
    fontSize: SIZES.p1,
    fontWeight: 'bold',
    flexShrink: 1,
    textAlign: 'left',
  },
  title2: {
    // marginLeft: 15,
    fontSize: 12,
    textAlign: 'left',
  },
  footer: {
    // marginTop: 'auto',
  },
  toggle: {
    alignItems: 'center',
    marginLeft: 9,
    marginBottom: 30,
  },
  logoutIconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 5,
  },
  logoutIconText: {fontSize: SIZES.h2, marginLeft: 5, color: COLORS.primary},
  logoImg: {
    width: 80,
    height: 60,
    resizeMode: 'contain',
  },
  profileImage: {
    width: 65,
    height: 65,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    objectFit: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lineContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderBottomColor: COLORS.borderColor,
    borderBottomWidth: 1,
    marginBottom: 4,
  },
});

export default CustomDrawer;
