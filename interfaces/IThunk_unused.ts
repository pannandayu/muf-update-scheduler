interface ThunkData<T, K> {
  error?: { message: string; name: string; stack: string };
  meta: {
    arg: K | undefined;
    requestId: string;
    requestStatus: string;
    rejectedWithValue: false;
    aborted: boolean;
    condition: boolean;
  };
  payload: T | undefined;
  type: string;
}
export type { ThunkData };
