import { LoginDataInput } from "@/interfaces/IAuth";
import { useAppDispatch } from "@/redux/hooks";
import { loginThunk } from "@/redux/thunks";
import styles from "@/styles/Index.module.css";
import loginValidationSchema from "@/validations/LoginValidation";
import { useRouter } from "next/router";
import { FormEvent, Fragment, useRef, useState } from "react";
import { ZodError } from "zod";

const Index: React.FC = () => {
  const dispatch = useAppDispatch();

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [validationError, setValidationError] = useState<ZodError>();
  const [authError, setAuthError] = useState<string>();

  const router = useRouter();

  const loginHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError(undefined);
    setAuthError(undefined);

    const loginData: LoginDataInput = {
      username: usernameRef.current!.value,
      password: passwordRef.current!.value,
    };

    const validationResult = loginValidationSchema.safeParse(loginData);

    if (!validationResult.success) {
      setValidationError(validationResult.error);
      return;
    }

    proceedLogin(validationResult.data);
  };

  const proceedLogin = async (loginData: LoginDataInput) => {
    try {
      await dispatch(loginThunk(loginData)).unwrap();
      router.push("/home");
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  return (
    <div className={styles.display}>
      <h1>SLIK Update Scheduler</h1>
      <div>
        <form className={styles.form} onSubmit={loginHandler}>
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
          <br />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              router.push("/signup");
            }}
          >
            Signup
          </button>
        </form>
      </div>
      <br />
      {<p style={{ color: "red" }}>{authError}</p>}
      {validationError &&
        validationError.errors.map((el, index) => {
          return (
            <Fragment key={index}>
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
