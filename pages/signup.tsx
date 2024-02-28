import { SignupDataInput } from "@/interfaces/IAuth";
import { useAppDispatch } from "@/redux/hooks";
import { signupThunk } from "@/redux/thunks";
import styles from "@/styles/Index.module.css";
import signupValidationSchema from "@/validations/SignupValidation";
import Router from "next/router";
import { FormEventHandler, Fragment, useRef, useState } from "react";
import { ZodError } from "zod";

const Signup: React.FC = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const keyRef = useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();

  const [validationError, setValidationError] = useState<ZodError>();
  const [authError, setAuthError] = useState<string>();

  const signupHandler: FormEventHandler = (event) => {
    event.preventDefault();

    const signupData: SignupDataInput = {
      username: usernameRef.current?.value || "",
      password: passwordRef.current?.value || "",
      signupKey: keyRef.current?.value || "",
    };

    const validationResult = signupValidationSchema.safeParse(signupData);

    if (!validationResult.success) {
      setValidationError(validationResult.error);
      return;
    }

    proceedSignup(validationResult.data);
  };

  const proceedSignup = async (signupData: SignupDataInput) => {
    try {
      await dispatch(signupThunk(signupData)).unwrap();
      Router.push("/");
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  return (
    <div className={styles.display}>
      <h1>Signup Form</h1>
      <div>
        <form className={styles.form}>
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
          <label htmlFor="key">Key</label>
          <input type="password" name="key" id="key" ref={keyRef} />
          <br />
          <button onClick={signupHandler} type="submit">
            Submit
          </button>
          <br />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              Router.push("/");
            }}
          >
            Back to Login Page
          </button>
        </form>
      </div>
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

export default Signup;
