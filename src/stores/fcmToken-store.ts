import {Instance, SnapshotOut, types} from 'mobx-state-tree';

export const FcmTokenStore = types.model('FcmTokenStore', {
  fcmToken: types.string,
});

export type FcmTokenType = Instance<typeof FcmTokenStore>;
export type FcmTokenSnapshotType = SnapshotOut<typeof FcmTokenStore>;
