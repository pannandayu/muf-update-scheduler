interface PushUpdateDataReturn {
  current: {
    data: UpdateDataCurrent;
  };
  message?: string;
}

interface UpdateDataRecord {
  record: {
    data: UpdateDataCurrent[];
    size: number;
  };
  message?: string;
}

interface UpdateDataCurrent {
  message: string;
  list: UpdateDataProps[];
  dateTime: string;
  size: number;
}

interface UpdateDataProps {
  request_id: string;
  application_no: string;
  app_id: string;
}

export type {
  PushUpdateDataReturn,
  UpdateDataRecord,
  UpdateDataCurrent,
  UpdateDataProps,
};
