import {useIsFocused, useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  PermissionsAndroid,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import ContainerNew from '../../common/components/Container';
import {COLORS} from '../../common/constant/Index';
import {httpRequest} from '../../common/constant/httpRequest';
import useAsyncEffect from '../../common/packages/useAsyncEffect/useAsyncEffect';
import {useRootStore} from '../../stores/rootStore';
import {api} from '../../common/api/api';
import {ProcgURL} from '../../../App';
import messaging from '@react-native-firebase/messaging';
import SVGController from '../../common/components/SVGController';
import Image from 'react-native-image-fallback';
import {useSocketContext} from '../../context/SocketContext';

const edges: Edge[] = ['right', 'left'];
const wait = (timeout: any) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const HomeMainIndex = () => {
  const navigation = useNavigation();

  const {
    userInfo,
    hydrate,
    usersStore,
    deviceInfoData,
    logout,
    fcmTokenSave,
    fcmToken,
    selectedUrl,
  } = useRootStore();
  const {socket} = useSocketContext();
  const [isScanShow, setIsScanShow] = useState(false);
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(false);
  const url = selectedUrl || ProcgURL;
  const source = {
    uri: `${url}/${userInfo?.profile_picture.original}`,
    headers: {
      Authorization: `Bearer ${userInfo?.access_token}`,
    },
  };

  const fallbacks = [require('../../assets/prifileImages/profile.jpg')];

  // const getFCMToken = async () => {
  //   const token = await messaging().getToken();
  //   fcmTokenSave({fcmToken: token});
  //   console.log('FCM Token:', token);
  // };

  //Post_Notification Permission
  useEffect(() => {
    const requenstPermissionAndroid = async () => {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const token = await messaging().getToken();
        fcmTokenSave({fcmToken: token});
        console.log('FCM Token:', token);
        // getFCMToken();

        const tokenPayload = {
          token: token,
          username: userInfo?.user_name,
        };
        const tokenParams = {
          url: api.RegisterToken,
          data: tokenPayload,
          method: 'post',
          baseURL: url,
          isConsole: true,
          isConsoleParams: true,
        };
        await httpRequest(tokenParams, setIsLoading);
      } else {
        Alert.alert('Permission Denied');
      }
    };
    requenstPermissionAndroid();
  }, []);

  //Fetch Users
  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      const api_params = {
        url: api.Users,
        baseURL: url,
        // isConsole: true,
        // isConsoleParams: true,
      };
      const res = await httpRequest(api_params, setIsLoading);
      usersStore.saveUsers(res);
    },
    [isFocused],
  );

  //Scket Connection
  useEffect(() => {
    // hydrate();
    // if (userInfo?.user_name) {
    //   connectSocket(userInfo?.user_name);
    //   socket?.connect();
    // }

    socket?.on('inactiveDevice', data => {
      socket.disconnect();
      if (deviceInfoData && deviceInfoData.id === data.id) {
        console.log(data, 'inactive device App.tsx');
        logout();
        navigation.navigate('Login');
      }
    });
    // if (socket) {
    // }
    return () => {
      socket?.off('inactiveDevice');
      // socket?.disconnect();
    };
  }, [socket]);

  return (
    <ContainerNew style={styles.container}>
      <View style={styles.topContainer}>
        <TouchableOpacity
          onPress={navigation.toggleDrawer}
          style={{flexDirection: 'row', gap: 4, alignItems: 'center'}}>
          <Image
            style={styles.profileImage}
            source={source}
            fallback={fallbacks}
          />
          <View>
            <Text
              style={{color: COLORS.black, fontWeight: '600', fontSize: 14}}>
              Welcome!
            </Text>
            <Text style={{color: COLORS.darkGray, fontSize: 14}}>
              {userInfo?.user_name}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <SVGController name="Bell" />
        </TouchableOpacity>
      </View>
    </ContainerNew>
  );
};

export default observer(HomeMainIndex);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  topContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 99,
    borderWidth: 0.5,
    borderColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
