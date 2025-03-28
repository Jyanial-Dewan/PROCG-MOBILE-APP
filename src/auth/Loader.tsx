/* eslint-disable react-hooks/exhaustive-deps */
import {observer} from 'mobx-react-lite';
import React, {useEffect} from 'react';
import {Image, Platform, StyleSheet, View} from 'react-native';
import {COLORS, IMAGES, SIZES} from '../common/constant/Index';
import delay from '../common/services/delay';
import {RootStackScreenProps} from '../navigations/RootStack';
import BootSplash from 'react-native-bootsplash';
import {useRootStore} from '../stores/rootStore';
import axios from 'axios';
import {ProcgURL} from '../../App';

const Loader = observer<RootStackScreenProps<'Loader'>>(
  ({navigation, route}) => {
    const {hydrate, hydrated, userInfo, selectedUrl} = useRootStore();

    useEffect(() => {
      (async () => {
        try {
          const isVisible = await BootSplash.isVisible();
          if (isVisible) {
            await delay(500);
            await BootSplash.hide({fade: true});
            hydrate();
          } else if (!hydrated) {
            hydrate();
          }
        } catch (error) {
          console.error(error);
        }
      })();
    }, [hydrate, hydrated]);

    useEffect(() => {
      if (hydrated) {
        delay(1000).then(() => {
          if (userInfo?.access_token) {
            axios.defaults.baseURL = selectedUrl || `${ProcgURL}`;
            axios.defaults.headers.common['Authorization'] =
              `Bearer ${userInfo?.access_token}`;
            navigation.replace('Drawer');
          } else {
            navigation.replace('Login');
          }
        });
      }
    }, [hydrated, navigation, route.params]);

    // useEffect(() => {
    //   if (hydrated) {
    //     delay(1000).then(() => {
    //       if (userInfo?.intAccountId) {
    //         if (userInfo?.strUrl !== arlURL) {
    //           navigation.replace('EmpDrawer');
    //         } else {
    //           if (userInfo?.intUserTypeId === 1) {
    //             navigation.replace('ArlDrawer');
    //           } else if (userInfo?.intUserTypeId === 2) {
    //             navigation.replace('SupDrawer');
    //           }
    //         }
    //       } else {
    //         navigation.replace('Login');
    //       }
    //     });
    //   }
    // }, [navigation, hydrated]);

    return (
      <View style={styles.center}>
        <Image style={styles.logo} source={IMAGES.AppLogo} />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  center: {
    justifyContent: Platform.OS === 'ios' ? 'flex-start' : 'center',
    paddingTop: Platform.OS === 'ios' ? SIZES.height / 2.6 : 0.001,
    backgroundColor: COLORS.white,
    flex: 1,
  },
  logo: {
    width: Platform.OS === 'ios' ? 90 : 100,
    height: Platform.OS === 'ios' ? 98 : 90,
    alignSelf: 'center',
  },
});

export default Loader;
