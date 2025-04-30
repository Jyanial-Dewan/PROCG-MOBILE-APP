import {applySnapshot, flow, onSnapshot, types} from 'mobx-state-tree';
import createPersistentStore from 'mst-persistent-store';
import {UserInfoStore, UserInfoStoreType} from './userInfo';
import {DeviceInfoStore, DeviceInfoStoreType} from './deviceInfo';
import {MMKV} from 'react-native-mmkv';
import {secureStorageKey} from '../../App';
import {MessageStore} from './messageStore';
import {UsersStore} from './usersStore';
import {MenuStore} from './mobileMenuStore';
import {FcmTokenStore, FcmTokenType} from '../stores/fcmToken-store';
import {viewRequestStore} from './viewRequestStore';

const RootStore = types
  .model('RootStore', {
    userColorScheme: types.maybeNull(
      types.union(types.literal('light'), types.literal('dark')),
    ),
    hydrated: false,
    userInfo: types.maybe(UserInfoStore),
    usersStore: UsersStore,
    deviceInfoData: types.maybe(DeviceInfoStore),
    urls: types.array(types.string),
    selectedUrl: types.maybeNull(types.string),
    profiles: types.array(types.string),
    selectedProfile: types.string,
    messageStore: MessageStore,
    fcmToken: types.maybe(FcmTokenStore),
    menuStore: types.optional(MenuStore, {menu: []}),
    viewRequestStore: viewRequestStore,
  })

  .actions(self => ({
    setUserColorScheme(colorScheme: typeof self.userColorScheme | 'auto') {
      if (colorScheme === 'auto') {
        self.userColorScheme = null;
      } else {
        self.userColorScheme = colorScheme;
      }
    },

    hydrate: flow(function* hydrate() {
      try {
        const savedUrls = secureStorage.getItem('app_url');
        const selectedUrl = secureStorage.getItem('selectedUrl');
        const deviceInfo = secureStorage.getItem('deviceInfo');

        if (savedUrls) {
          self.urls = savedUrls;
        }
        if (selectedUrl) {
          self.selectedUrl = selectedUrl;
        }
        if (deviceInfo) {
          self.deviceInfoData = deviceInfo;
        }
        self.hydrated = true;
      } catch (error) {
        console.error(error);
        self.hydrated = true;
      }
    }),
    userInfoSave(userInfo: UserInfoStoreType) {
      self.userInfo = userInfo;
    },
    addUrl(url: string) {
      if (!self.urls.includes(url)) {
        self.urls.push(url);
        secureStorage.setItem('app_url', self.urls.slice());
      }
    },
    removeUrl(index: number) {
      self.urls.splice(index, 1);
      secureStorage.setItem('app_url', self.urls.slice());
    },
    clearUrls() {
      self.urls.clear();
      secureStorage.removeItem('app_url');
      self.selectedUrl = null;
    },

    setSelectedUrl(url: string | null) {
      if (url === null && self.urls.length === 1) {
        return;
      }
      self.selectedUrl = url;
      secureStorage.setItem('selectedUrl', url);
    },

    saveProfiles(prfls: string[]) {
      self.profiles.replace(prfls);
    },

    setSelectedProfile(prfl: string) {
      self.selectedProfile = prfl;
    },

    deviceInfoSave(deviceInfo: DeviceInfoStoreType) {
      self.deviceInfoData = deviceInfo;
      secureStorage.setItem('deviceInfo', deviceInfo);
    },

    logout() {
      self.userInfo = undefined;
      self.fcmToken = undefined;
      secureStorage.removeItem('deviceInfo');
      applySnapshot(self.messageStore, {
        totalReceived: 0,
        totalSent: 0,
        totalDraft: 0,
        totalBin: 0,
      });
      applySnapshot(self.viewRequestStore, {
        requests: [],
      });
    },
    fcmTokenSave(fcmToken: FcmTokenType) {
      self.fcmToken = fcmToken;
    },
  }))
  .views(self => ({
    get currentColorScheme() {
      if (self.userColorScheme) {
        return self.userColorScheme;
      }
      return 'auto';
    },

    isSelected(url: string) {
      return self.selectedUrl === url;
    },
  }));

export const mmkv = new MMKV({
  id: 'mmkv.default',
  encryptionKey: secureStorageKey,
});
mmkv.recrypt(secureStorageKey);
const setItem = (key: string, value: any) =>
  mmkv.set(key, JSON.stringify(value));

const getItem = (key: string) => {
  const value = mmkv.getString(key);
  if (value) {
    return JSON.parse(value);
  }
  return null;
};
const removeItem = (key: string) => mmkv.delete(key);

const secureStorage = {
  setItem,
  getItem,
  removeItem,
  deviceInfoData: {
    id: null,
    user_id: null,
    os: null,
    browser_name: 'App',
    device_type: null,
    browser_version: '1.0',
    user_agent: null,
    location: null,
  },
  selectedProfile: '',
  messageStore: {
    receivedMessages: [],
    sentMessages: [],
    draftMessages: [],
    binMessages: [],
    notificationMessages: [],
    totalReceived: 0,
    totalSent: 0,
    totalDraft: 0,
    totalBin: 0,
  },
  usersStore: {
    users: [],
  },
  menuStore: {menu: []},
  viewRequestStore: {
    requests: [],
  },
};

export const [RootStoreProvider, useRootStore] = createPersistentStore(
  RootStore,
  secureStorage,
  {
    hydrated: false,
  },
);
