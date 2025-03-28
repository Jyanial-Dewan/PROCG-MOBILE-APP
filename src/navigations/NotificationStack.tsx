import {StyleSheet} from 'react-native';
import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import SentScreen from '../modules/notification/SentScreen';
import InboxScreen from '../modules/notification/InboxScreen';
import DraftScreen from '../modules/notification/DraftScreen';
import RecycleBin from '../modules/notification/RecycleBin';
import RecycleBinDetail from '../modules/notification/RecycleBinDetail';
const {Navigator, Screen} = createNativeStackNavigator<any>();

export interface NavigationStackParamList {
  [key: string]: undefined | object;
  NotificationDetails: {_id: string};
}

export type NotificationDetailsNavigationProp = NativeStackNavigationProp<
  NavigationStackParamList,
  'NotificationDetails'
>;

const NotificationStack = () => {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Screen name="Inbox" component={InboxScreen} />
      <Screen name="Sent" component={SentScreen} />
      <Screen name="Drafts" component={DraftScreen} />
      <Screen name="Recycle_Bin" component={RecycleBin} />
    </Navigator>
  );
};

export default NotificationStack;

const styles = StyleSheet.create({});
