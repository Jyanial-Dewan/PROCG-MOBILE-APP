import {Instance, SnapshotOut, types} from 'mobx-state-tree';

export const DeviceInfoStore = types.model('DeviceInfoStore', {
  id: types.maybeNull(types.number),
  user_id: types.maybeNull(types.number),
  os: types.maybeNull(types.string),
  browser_name: types.maybeNull(types.string),
  device_type: types.maybeNull(types.string),
  browser_version: types.maybeNull(types.string),
  user_agent: types.maybeNull(types.string),
  is_active: types.maybeNull(types.number),
  added_at: types.maybeNull(types.string),
  user: types.maybeNull(types.string),
  ip_address: types.maybeNull(types.string),
  location: types.maybeNull(types.string),
});

export type DeviceInfoStoreType = Instance<typeof DeviceInfoStore>;
export type DeviceInfoSnapshotType = SnapshotOut<typeof DeviceInfoStore>;
