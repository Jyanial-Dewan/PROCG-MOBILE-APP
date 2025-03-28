import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import React from 'react';
import Loader from '../auth/Loader';
import LoginScreen from '../auth/LoginScreen';
import {RootStackScreensParms} from '../types/navigationTs/RootStackScreenParams';
import BottomTab from './BottomTab';
import ProfileScreen from '../modules/profile/ProfileScreen';
import NotificationDetails from '../modules/notification/NotificationDetails';
import ScanLoginQrCode from '../modules/scan-login-qr-code/ScanLoginQrCode';
import ChooseConnection from '../modules/connection/ChooseConnection';
import AddConnection from '../modules/connection/AddConnection';
import ScanQrConnection from '../modules/connection/ScanQrConnection';
import ScanProfiles from '../modules/scan-profiles/ScanProfiles';
import SelectProfile from '../modules/select-profile/SelectProfile';
import InboxScreen from '../modules/notification/InboxScreen';
import SentScreen from '../modules/notification/SentScreen';
import DraftScreen from '../modules/notification/DraftScreen';
import RecycleBin from '../modules/notification/RecycleBin';
import SettingsScreen from '../modules/settings/SettingsScreen';
import NewMessage from '../modules/new-message/NewMessage';
import ReplyScreen from '../modules/reply/ReplyScree';
import DraftsDetails from '../modules/drafts-details/DraftsDetailt';
import RecycleBinDetail from '../modules/notification/RecycleBinDetail';
import Drawer from './drawer';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackScreensParms {}
  }
}
export type RootStackScreens = keyof RootStackScreensParms;

export type RootStackScreenProps<T extends RootStackScreens> =
  NativeStackScreenProps<RootStackScreensParms, T>;

const {Navigator, Screen} = createNativeStackNavigator<RootStackScreensParms>();

const RootStack = () => {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Screen name="Loader" component={Loader} initialParams={{delay: 15}} />
      {/* <Screen name="Drawer" component={Drawer} /> */}
      <Screen name="Login" component={LoginScreen} />
      {/* <Screen name="HomeScreen" component={BottomTab} /> */}

      {/* <Screen name="Inbox" component={InboxScreen} />
      <Screen name="Sent" component={SentScreen} />
      <Screen name="Drafts" component={DraftScreen} />
      <Screen name="Recycle_Bin" component={RecycleBin} /> */}
      <Screen name="ScanLoginQrCode" component={ScanLoginQrCode} />
      <Screen name="ChooseConnection" component={ChooseConnection} />
      <Screen name="AddConnection" component={AddConnection} />
      <Screen name="ScanQrConnection" component={ScanQrConnection} />
      <Screen name="ScanProfiles" component={ScanProfiles} />
      <Screen name="Profiles" component={SelectProfile} />
      <Screen name="Settings" component={SettingsScreen} />
    </Navigator>
  );
};

export default RootStack;
