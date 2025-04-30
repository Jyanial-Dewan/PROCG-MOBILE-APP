export interface AsynchronousTask {
  arm_task_id: number;
  script_name: string;
  script_path?: string;
  task_name: string;
  user_task_name: string;
  description: string;
  execution_method: string;
  executor?: string;
  cancelled_yn: string;
  created_by?: number;
  creation_date: string;
  last_update_date: string;
  last_updated_by?: number;
  srs?: string;
  sf?: string;
}

export interface ARMTaskParametersTypes {
  arm_param_id: number;
  created_by: number;
  creation_date: string;
  data_type: string;
  description: string;
  last_update_date: string;
  last_updated_by: number;
  parameter_name: string;
  task_name: string;
}
