import { SignupDataInput } from "@/interfaces/IAuth";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { LoginDataInput, LoginDataReturn } from "../interfaces/IAuth";

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
export { loginThunk, signupThunk };
