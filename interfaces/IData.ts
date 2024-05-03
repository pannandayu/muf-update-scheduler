interface UpdateDataID {
  request_id: string;
  application_no: string;
  app_id?: string;
}

interface LogResult {
  data: UpdateDataID;
  status: string;
}

interface LogData {
  _id?: string;
  screening?: number;
  category?: string;
  batch?: number;
  date?: string;
  time?: string;
  size?: number;
  results?: LogResult[];
  validUpdates?: number;
  elapsedTime?: number;
}

interface PushUpdateData {
  updateKey: string;
  screening: number;
  token: string;
}

export type { UpdateDataID, LogResult, LogData, PushUpdateData };
