import {Instance, SnapshotOut, types} from 'mobx-state-tree';

const ProfilePictureModel = types.model('ProfilePictureModel', {
  original: types.string,
  thumbnail: types.string,
});

export const UserInfoStore = types.model('UserInfoStore', {
  isLoggedIn: types.maybeNull(types.boolean),
  user_id: types.maybeNull(types.number),
  user_type: types.maybeNull(types.string),
  user_name: types.maybeNull(types.string),
  tenant_id: types.maybeNull(types.number),
  access_token: types.maybeNull(types.string),
  refresh_token: types.maybeNull(types.string),
  issuedAt: types.maybeNull(types.string),
  profile_picture: ProfilePictureModel,
});

export type UserInfoStoreType = Instance<typeof UserInfoStore>;
export type UserInfoSnapshotType = SnapshotOut<typeof UserInfoStore>;
