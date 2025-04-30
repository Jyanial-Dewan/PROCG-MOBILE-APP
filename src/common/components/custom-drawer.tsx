import {useIsFocused, useNavigation} from '@react-navigation/core';
import {DrawerContentComponentProps} from '@react-navigation/drawer';
import {observer} from 'mobx-react-lite';
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Button} from 'react-native';
import {useToast} from './CustomToast';
import FixedContainer from './fixed-container';
import {useRootStore} from '../../stores/rootStore';
import {COLORS, SIZES} from '../constant/Index';
import FastImage from 'react-native-fast-image';
import {ProcgURL} from '../../../App';
import {httpRequest} from '../constant/httpRequest';
import SVGController from './SVGController';
import {MMKV} from 'react-native-mmkv';
import Image from 'react-native-image-fallback';
import {useSocketContext} from '../../context/SocketContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RBSheet from '../packages/RBSheet/RBSheet';
import CustomBottomSheetNew from './CustomBottomSheet';
import CustomButtonNew from './CustomButton';
import ImageCropPicker from 'react-native-image-crop-picker';
import {api} from '../api/api';
import useAsyncEffect from '../packages/useAsyncEffect/useAsyncEffect';
import {UserType} from '../../stores/usersStore';

export interface Profile {
  uri: string;
}

const CustomDrawer = observer<DrawerContentComponentProps>(props => {
  const [isLoading, setIsLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<Profile>();
  const navigation = useNavigation();
  const toaster = useToast();
  const isFocused = useIsFocused();
  const refRBSheet = useRef<RBSheet>(null);

  const {userInfo, logout, deviceInfoData, fcmToken, selectedUrl} =
    useRootStore();
  const {socket} = useSocketContext();
  const storage = new MMKV();
  const url = selectedUrl || ProcgURL;

  //Fetch Unique User
  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      const api_params = {
        url: api.Users + `/${userInfo?.user_id}`,
        baseURL: url,
        // isConsole: true,
        // isConsoleParams: true,
      };
      const res = await httpRequest(api_params, setIsLoading);
      setProfilePhoto({uri: `${url}/${res.profile_picture.original}`});
    },
    [isFocused],
  );

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

  const handleOpenSheet = () => {
    refRBSheet.current?.open();
  };

  const handleCloseBottomSheet = () => {
    refRBSheet.current?.close();
  };

  {
    /* Take photo using camera */
  }
  const onTakePhoto = async () => {
    try {
      const image = await ImageCropPicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
        compressImageQuality: 0.6,
      });

      const profile_params = {
        url: api.ProfilePhoto + userInfo?.user_id,
        method: 'put',
        isParamsAndmediaFile: true,
        mediaFile: {
          uri: image.path,
          name: image.filename,
          type: image.mime,
        },
        baseURL: url,
        isConsole: true,
        isConsoleParams: true,
      };

      const res = await httpRequest(profile_params, setIsLoading);
      if (res && image) {
        setProfilePhoto({uri: image.path});
        refRBSheet.current?.close();
      }
    } catch (error) {
      console.error('Image picker error:', error);
    }
  };

  {
    /* Choose Image from gallery */
  }
  const onPickImage = async () => {
    try {
      const image = await ImageCropPicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
        compressImageQuality: 0.6,
      });

      const profile_params = {
        url: api.ProfilePhoto + userInfo?.user_id,
        method: 'put',
        isParamsAndmediaFile: true,
        mediaFile: {
          uri: image.path,
          name: image.filename,
          type: image.mime,
        },
        baseURL: url,
        isConsole: true,
        isConsoleParams: true,
      };

      const res = await httpRequest(profile_params, setIsLoading);
      if (res) {
        setProfilePhoto({uri: image.path});
        refRBSheet.current?.close();
      }
    } catch (error) {
      console.error('Image picker error:', error);
    }
  };

  return (
    <FixedContainer style={styles.drawer} edges={['top', 'bottom', 'left']}>
      <View
        style={{
          backgroundColor: COLORS.primary,
          width: '100%',
          height: 160,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={{position: 'relative'}}>
          <Image
            style={styles.profileImage}
            source={{uri: profilePhoto?.uri}}
            fallback={fallbacks}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleOpenSheet}
            style={{
              position: 'absolute',
              bottom: -5,
              right: -3,
              backgroundColor: COLORS.darkgray,
              borderRadius: 50,
              padding: 1,
            }}>
            <Icon name="account-edit-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
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

      {/* Bottom Sheet */}
      <CustomBottomSheetNew refRBSheet={refRBSheet} sheetHeight={300}>
        <Text
          style={{
            fontSize: 18,
            textAlign: 'center',
            fontWeight: '500',
            color: COLORS.black,
          }}>
          Upload Photo
        </Text>
        <Text
          style={{
            fontSize: 14,
            textAlign: 'center',

            color: COLORS.black,
          }}>
          Choose Your Profile Picture
        </Text>

        <CustomButtonNew
          disabled={isLoading}
          btnText="Take Photo"
          isLoading={isLoading}
          onBtnPress={() => onTakePhoto()}
          btnstyle={styles.btn}
          btnTextStyle={styles.btnTxt}
        />
        <CustomButtonNew
          disabled={isLoading}
          btnText="Choose from gallery"
          isLoading={isLoading}
          onBtnPress={() => onPickImage()}
          btnstyle={styles.btn}
          btnTextStyle={styles.btnTxt}
        />
        <CustomButtonNew
          disabled={isLoading}
          btnText="Cancel"
          isLoading={isLoading}
          onBtnPress={() => handleCloseBottomSheet()}
          btnstyle={styles.btn}
          btnTextStyle={styles.btnTxt}
        />
      </CustomBottomSheetNew>
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
  btn: {
    marginTop: 10,
    borderRadius: 8,
    justifyContent: 'center',
    paddingVertical: 13,
  },
  btnTxt: {
    fontSize: 14,
    fontWeight: '500',
    alignSelf: 'center',
  },
});

export default CustomDrawer;
