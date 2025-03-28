import {Instance, SnapshotOut, types} from 'mobx-state-tree';

const ProfilePictureModel = types.model('ProfilePictureModel', {
  original: types.string,
  thumbnail: types.string,
});

export const UserModel = types.model('UserModel', {
  user_id: types.number,
  user_name: types.string,
  user_type: types.maybe(types.string),
  email_addresses: types.array(types.string),
  created_by: types.maybeNull(types.number),
  created_on: types.maybeNull(types.string),
  last_updated_by: types.maybeNull(types.number),
  last_updated_on: types.maybeNull(types.string),
  tenant_id: types.number,
  profile_picture: ProfilePictureModel,
});

export const UsersStore = types
  .model('UsersStore', {
    users: types.array(UserModel),
  })
  .actions(self => ({
    saveUsers(usrs: Array<UserSnapshotType>) {
      const validUsers = usrs.map(usr => UserModel.create(usr));
      self.users.replace(validUsers);
    },
  }));

export type UserType = Instance<typeof UserModel>;
export type UserSnapshotType = SnapshotOut<typeof UserModel>;
