export type PushUpdateDataReturn = {
  current: {
    data: {
      message: string;
      currentData: UpdateDataProps[];
      dateTime: string;
      size: number;
    };
  };
  record: {
    data: UpdateDataProps[];
    size: number;
  };
  error?: {
    message: string;
  };
};

type UpdateDataProps = {
  request_id: string;
  application_no: string;
  app_id: string;
};
