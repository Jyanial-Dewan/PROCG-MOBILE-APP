import {api} from './api';
const withoutEncryptionApi = [
  api.AuthAppsLogin,
  api.AddDeviceInfo,
  api.UpdateDeviceInfo,
  api.Users,
  api.Messages,
  api.ReceivedMessages,
  api.SentMessages,
  api.DraftMessages,
  api.RecycleBinMessages,
  api.totalReceived,
  api.totalSent,
  api.totalDraft,
  api.totalRecycleBin,
  api.Notifications,
  api.UpdateReaders,
  api.ReplyMessages,
  api.DeleteMessage,
  api.DeleteFromRecycle,
  api.MoveMultipleToRecycleBin,
  api.MoveMultipleFromRecycleBin,
  api.ProfilePicture,
  api.RegisterToken,
  api.UnregisterToken,
  api.SendNotification,
];

export {withoutEncryptionApi};
