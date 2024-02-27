import { PushUpdateDataReturn } from "./../types/Monitor";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { LoginDataReturn, LoginDataInput } from "../types/Login";

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

const accessThunk = createAsyncThunk(
  "authentication/access",
  async (token: string) => {
    const response = await fetch("/api/monitor", {
      method: "GET",
      headers: { Authorization: "Bearer: " + token },
    });

    const result = await response.json();

    if (response.status !== 200) {
      throw new Error(
        result.message === "fetch failed"
          ? "Authentication logic (server) error"
          : result.message
      );
    }

    return result;
  }
);

const pushUpdateThunk = createAsyncThunk(
  "data/push-update",
  async (key: { key: string }) => {
    const response = await fetch("/api/push-update", {
      method: "POST",
      body: JSON.stringify(key),
      headers: { "Content-Type": "application/json" },
    });

    const result: PushUpdateDataReturn = await response.json();

    if (response.status !== 200) {
      throw new Error(
        result.error!.message === "fetch failed"
          ? "Push update logic (server) error"
          : result.error!.message
      );
    }

    return result;
  }
);

export { accessThunk, loginThunk, pushUpdateThunk };
