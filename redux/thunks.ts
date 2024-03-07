import { SignupDataInput } from "@/interfaces/IAuth";
import { UpdateDataCurrent, UpdateDataRecord } from "@/interfaces/IMonitor";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { LoginDataInput, LoginDataReturn } from "../interfaces/IAuth";
import { PushUpdateDataReturn } from "../interfaces/IMonitor";

const loginThunk = createAsyncThunk(
  "authentication/login",
  async (loginData: LoginDataInput) => {
    const response = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(loginData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result: LoginDataReturn = await response.json();

    if (response.status !== 200) {
      throw new Error(
        result.message === "fetch failed"
          ? "Login logic (server) error"
          : result.message
      );
    }

    return result;
  }
);
const signupThunk = createAsyncThunk(
  "authentication/signup",
  async (signupData: SignupDataInput) => {
    const response = await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify(signupData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result: { message: string } = await response.json();

    if (response.status !== 200) {
      throw new Error(
        result.message === "fetch failed"
          ? "Signup logic (server) error"
          : result.message
      );
    }

    return result;
  }
);

const monitorThunk = createAsyncThunk(
  "data/monitor",
  async (data: { token: string; screening: string }) => {
    const response = await fetch("/api/monitor", {
      method: "GET",
      headers: {
        Authorization: "Bearer: " + data.token,
        Etag: data.screening,
      },
    });

    const result: UpdateDataRecord = await response.json();

    if (response.status !== 200) {
      throw new Error(
        result.message === "fetch failed"
          ? "Get monitoring data logic (server) error"
          : result.message
      );
    }

    return result;
  }
);

const pushUpdateThunk = createAsyncThunk(
  "data/push-update",
  async (key: { updateKey: string }) => {
    const response = await fetch("/api/push-update", {
      method: "POST",
      body: JSON.stringify(key),
      headers: { "Content-Type": "application/json" },
    });

    const result: PushUpdateDataReturn = await response.json();

    if (response.status !== 200) {
      throw new Error(
        result.message === "fetch failed"
          ? "Push update logic (server) error"
          : result.message
      );
    }

    return result;
  }
);

const getBatchDataThunk = createAsyncThunk(
  "data/get-batch-data",
  async (data: { dateTime: string; token: string }) => {
    const response = await fetch("/api/get-batch-data", {
      method: "POST",
      body: JSON.stringify({ dateTime: data.dateTime }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer: " + data.token,
      },
    });

    interface GetBatchDataExpectedResult {
      message?: string;
      data?: UpdateDataCurrent;
    }

    const result: GetBatchDataExpectedResult = await response.json();

    if (response.status !== 200) {
      throw new Error(
        result.message === "fetch failed"
          ? "Get Batch logic (server) error"
          : result.message
      );
    }

    return result;
  }
);

export {
  getBatchDataThunk,
  loginThunk,
  monitorThunk,
  pushUpdateThunk,
  signupThunk,
};
