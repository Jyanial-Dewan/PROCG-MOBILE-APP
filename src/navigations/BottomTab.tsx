/* eslint-disable react/no-unstable-nested-components */
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import React, {useState} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {COLORS} from '../common/constant/Themes';
import HomeMainIndex from '../modules/home/HomeMainIndex';
import ActionItemMainIndex from '../modules/action-item/ActionItemMainIndex';
import MenuMainIndex from '../modules/menu/MenuMainIndex';
import {useRootStore} from '../stores/rootStore';
import NotificationStack from './NotificationStack';
import {View} from 'react-native';
import {Badge} from 'react-native-paper';
import useAsyncEffect from '../common/packages/useAsyncEffect/useAsyncEffect';
import {ProcgURL} from '../../App';
import {httpRequest} from '../common/constant/httpRequest';
import {useIsFocused} from '@react-navigation/native';
import {api} from '../common/api/api';
import {observer} from 'mobx-react-lite';
import SVGController from '../common/components/SVGController';

const {Navigator, Screen} = createMaterialBottomTabNavigator<any>();
const BottomTab = observer(() => {
  const isFocused = useIsFocused();
  const {bottom} = useSafeAreaInsets();
  const {userInfo, messageStore} = useRootStore();
  const [isLoading, setIsLoading] = useState(false);

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      const api_params = {
        url: api.Notifications + userInfo?.user_name,
        baseURL: ProcgURL,
        // isConsole: true,
        // isConsoleParams: true,
      };
      const res = await httpRequest(api_params, setIsLoading);
      if (res) {
        const formattedRes = res.map((msg: any) => ({
          ...msg,
          date: new Date(msg.date),
        }));

        messageStore.saveNotificationMessages(formattedRes);
      }
    },
    [
      isFocused,
      messageStore.notificationMessages.length,
      messageStore.refreshing,
    ],
  );

  return (
    <Navigator
      sceneAnimationEnabled={true}
      initialRouteName="Home"
      activeColor={COLORS.primary}
      inactiveColor={COLORS.newGray}
      barStyle={{backgroundColor: COLORS.lightGray3}}
      safeAreaInsets={{bottom}}
      labeled={true}
      shifting={false}>
      <Screen
        name="Home"
        component={HomeMainIndex}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, focused}) => (
            <SVGController
              name="Home"
              color={focused ? color : COLORS.newGray}
              height={26}
              width={26}
            />
          ),
        }}
      />
      <Screen
        name="ActionItem"
        component={ActionItemMainIndex}
        options={{
          tabBarLabel: 'Action Items',
          tabBarIcon: ({color, focused}) => (
            <SVGController
              name="List"
              color={focused ? color : COLORS.newGray}
              height={26}
              width={26}
            />
          ),
        }}
      />

      <Screen
        name="Notification"
        component={NotificationStack}
        options={{
          tabBarLabel: 'Notifications',
          tabBarIcon: ({color, focused}) => (
            <View>
              <SVGController
                name="Mail"
                color={focused ? color : COLORS.newGray}
                height={26}
                width={26}
              />
              {messageStore.notificationMessages.length > 0 && (
                <Badge
                  visible={true}
                  size={25}
                  style={{
                    position: 'absolute',
                    top: -15,
                    right: -15,
                    fontWeight: '700',
                    backgroundColor: COLORS.highLight,
                  }}>
                  {messageStore.notificationMessages?.length}
                </Badge>
              )}
            </View>
          ),
        }}
      />
      <Screen
        name="Menu"
        component={MenuMainIndex}
        options={{
          tabBarLabel: 'Menu',

          tabBarIcon: ({color, focused}) => (
            <SVGController
              name="Menu"
              color={focused ? color : COLORS.newGray}
              height={26}
              width={26}
            />
          ),
        }}
      />
    </Navigator>
  );
});

export default BottomTab;
