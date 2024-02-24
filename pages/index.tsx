import Box from "@/wrappers/Box";
import styles from "@/styles/Index.module.css";
import { FormEventHandler, Fragment, useRef, useState } from "react";
import loginValidationSchema from "@/validations/LoginValidation";
import { ZodError } from "zod";
import { useDispatch } from "react-redux";
import { authSliceActions } from "@/store/store";
import Router from "next/router";

type LoginData = {
  username: string;
  password: string;
};

type ReturnData = {
  message: string;
  username?: string;
  role?: string;
  token?: string;
};

const Index: React.FC = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [validationError, setValidationError] = useState<ZodError>();
  const [authError, setAuthError] = useState<string>();

  const dispatch = useDispatch();

  const loginHandler: FormEventHandler = (event) => {
    event.preventDefault();
    setValidationError(undefined);
    setAuthError(undefined);

    const loginData: LoginData = {
      username: usernameRef.current!.value,
      password: passwordRef.current!.value,
    };

    const validationResult = loginValidationSchema.safeParse(loginData);

    if (!validationResult.success) {
      setValidationError(validationResult.error);
      return;
    }
    proceedLogin(loginData);
  };

  const proceedLogin = async (data: LoginData) => {
    setValidationError(undefined);
    setAuthError(undefined);

    const response = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result: ReturnData = await response.json();

    if (response.status !== 200) {
      setAuthError(result.message);
      return;
    }

    dispatch(
      authSliceActions.setUser({
        username: result.username,
        role: result.role,
        token: result.token,
      })
    );
    Router.push("/home");
  };

  return (
    <div className={styles.login}>
      <h1>Update Scheduler Monitoring</h1>
      <div>
        <form className={styles.form} method="POST" onSubmit={loginHandler}>
          <label htmlFor="username">Username</label>
          <input type="text" name="username" id="username" ref={usernameRef} />
          <br />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            ref={passwordRef}
          />
          <br />
          <button type="submit">Login</button>
        </form>
      </div>
      <br />
      {<p style={{ color: "red" }}>{authError}</p>}
      {validationError &&
        validationError.errors.map((el) => {
          return (
            <Fragment>
              <p style={{ color: "red" }}>
                {el.path + el.message.replace("String", "")}
              </p>
            </Fragment>
          );
        })}
    </div>
  );
};
export default Index;
