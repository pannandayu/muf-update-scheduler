import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { accessThunk, pushUpdateThunk } from "@/redux/thunks";
import Router from "next/router";
import {
  FormEvent,
  FormEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "@/styles/Home.module.css";

const Home: React.FC = () => {
  const authSelector = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const [error, setError] = useState<string>();

  const keyRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const accessCheck = async () => {
      try {
        await dispatch(accessThunk(authSelector.token)).unwrap();
      } catch (err: any) {
        Router.push("/");
      }
    };

    accessCheck();
  }, []);

  const pushUpdateHandler: FormEventHandler = (event: FormEvent) => {
    event.preventDefault();
    setError(undefined);
    try {
      const key = { key: keyRef.current?.value.trim() || "" };

      if (key.key === "") {
        throw new Error("Key is empty");
      }

      proceedUpdate(key);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const proceedUpdate = async (key: { key: string }) => {
    try {
      await dispatch(pushUpdateThunk(key)).unwrap();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.home}>
      <div className={styles["home-title"]}>
        <h1>Welcome {authSelector.username}.</h1>
        <p>Refresh means login</p>
      </div>
      <div className={styles["home-push-button"]}>
        <form onSubmit={pushUpdateHandler}>
          <label htmlFor="key">Key</label>
          <input type="password" id="key" name="key" ref={keyRef} />
          <p style={{ color: "red" }}>{error}</p>
          <button type="submit">Push Update</button>
        </form>
      </div>
    </div>
  );
};

export default Home;
