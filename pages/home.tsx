import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { monitorThunk, pushUpdateThunk } from "@/redux/thunks";
import Router from "next/router";
import {
  FormEvent,
  FormEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "@/styles/Home.module.css";
import { ThunkData } from "@/interfaces/IThunk";
import { UpdateDataRecord } from "@/interfaces/IMonitor";

const Home: React.FC = () => {
  const loginSelector = useAppSelector((state) => state.auth.login);
  const dataSelector = useAppSelector((state) => state.data);
  const dispatch = useAppDispatch();

  const [error, setError] = useState<string>();
  const [noUpdate, setNoUpdate] = useState<string>();

  const keyRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    try {
      const response = (await dispatch(
        monitorThunk(loginSelector.token)
      )) as ThunkData<UpdateDataRecord["record"], string>;

      if (response.error) {
        if (
          response.meta.arg === "" ||
          !response.error.message.endsWith("yet")
        ) {
          return Router.push("/");
        } else {
          setNoUpdate(response.error.message);
        }
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch, loginSelector.token]);

  const pushUpdateHandler: FormEventHandler = (event: FormEvent) => {
    event.preventDefault();
    setError(undefined);
    try {
      const key = { updateKey: keyRef.current?.value.trim() || "" };

      if (key.updateKey === "") {
        throw new Error("Key is empty");
      }

      keyRef.current!.value = "";

      proceedUpdate(key);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const proceedUpdate = async (key: { updateKey: string }) => {
    try {
      await dispatch(pushUpdateThunk(key));
      await fetchData();

      setNoUpdate(undefined);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.home}>
      <div style={{ display: "flex", gap: "5rem" }}>
        <div>
          <div className={styles["home-title"]}>
            <h1>Welcome {loginSelector.username}.</h1>
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
        <div>
          <h1>{new Date().toDateString()}</h1>
          <h2>Today's Update</h2>
          {noUpdate && <h3>{noUpdate}</h3>}
          <h3>
            {/* {JSON.stringify(dataSelector.record.data.map(el => el))} TODO */}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Home;
