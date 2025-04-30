import {ProcgURL} from '../../App';
import axios from 'axios';
import {flow, Instance, SnapshotOut, types} from 'mobx-state-tree';
import {api} from '../common/api/api';

export const viewRequestModel = types.model('RequestModel', {
  request_id: types.number,
  timestamp: types.string,
  status: types.string,
  user_task_name: types.string,
  user_schedule_name: types.string,
  parameters: types.optional(types.map(types.integer), {}),
  result: types.map(types.union(types.string, types.number)),
});

export const viewRequestStore = types
  .model('RequestStore', {
    requests: types.array(viewRequestModel),
    loading: types.optional(types.boolean, false),
  })
  .actions(self => ({
    getRequests: flow(function* (page: number, limit: number) {
      self.loading = true;
      try {
        const res = yield axios.get(
          `${ProcgURL}${api.getViewRequest}${page}/${limit}`,
        );

        if (page === 1) {
          self.requests.replace(res.data.requests);
        } else {
          const newUniqueRequests = res.data.requests.filter(
            (req: any) =>
              !self.requests.some((r: any) => r.request_id === req.request_id),
          );
          self.requests.push(...newUniqueRequests);
        }
      } catch (error) {
        console.error('Failed to fetch requests:', error);
      } finally {
        self.loading = false;
      }
    }),
  }));

export type viewRequestType = Instance<typeof viewRequestModel>;
export type viewRequestSnapshotType = SnapshotOut<typeof viewRequestModel>;
