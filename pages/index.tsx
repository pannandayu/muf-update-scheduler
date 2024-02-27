import styles from "@/styles/Index.module.css";
import loginValidationSchema from "@/validations/LoginValidation";
import { FormEventHandler, Fragment, useRef, useState } from "react";
import { ZodError } from "zod";

import { useAppDispatch } from "@/redux/hooks";
import { loginThunk } from "@/redux/thunks";
import Router from "next/router";

type LoginData = {
  username: string;
  password: string;
};

const Index: React.FC = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [validationError, setValidationError] = useState<ZodError>();
  const [authError, setAuthError] = useState<string>();

  const dispatch = useAppDispatch();

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

  const proceedLogin = async (loginData: LoginData) => {
    try {
      await dispatch(loginThunk(loginData)).unwrap();
      Router.push("/home");
    } catch (err: any) {
      setAuthError(err.message);
    }
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
              <p key={el.path[0]} style={{ color: "red" }}>
                {el.path + el.message.replace("String", "")}
              </p>
            </Fragment>
          );
        })}
    </div>
  );
};
export default Index;
