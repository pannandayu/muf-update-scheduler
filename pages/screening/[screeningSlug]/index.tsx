import Loading from "@/components/Loading";
import Table from "@/components/Table/Table";
import TableRow from "@/components/Table/TableRow";
import { UpdateDataRecord } from "@/interfaces/IMonitor";
import { ThunkData } from "@/interfaces/IThunk";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { monitorThunk, pushUpdateThunk } from "@/redux/thunks";
import styles from "@/styles/Screening.module.css";
import Status from "@/wrappers/Status";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  FormEvent,
  FormEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";

const Screening: React.FC = () => {
  const loginSelector = useAppSelector((state) => state.auth.login);
  const dataSelector = useAppSelector((state) => state.data);
  const dispatch = useAppDispatch();

  const [error, setError] = useState<string>();
  const [noUpdate, setNoUpdate] = useState<string>();

  const keyRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const { screeningSlug } = router.query;

  const fetchData = async () => {
    try {
      const response = (await dispatch(
        monitorThunk({
          token: loginSelector.token,
          screening: screeningSlug as string,
        })
      )) as ThunkData<
        UpdateDataRecord["record"],
        { token: string; screening: string }
      >;

      if (response.error) {
        if (
          response.meta.arg?.token === "" ||
          !response.error.message.endsWith("yet")
        ) {
          return router.push("/");
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
  }, []);

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
      await dispatch(pushUpdateThunk(key)).unwrap();
      await fetchData();

      setNoUpdate(undefined);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.screening}>
      <div style={{ display: "flex", gap: "5rem" }}>
        <div>
          <div className={styles["screening-title"]}>
            <h1>Logged in as {loginSelector.username}.</h1>
            <p>Refresh means login</p>
          </div>
          <div className={styles["screening-push-button"]}>
            <form onSubmit={pushUpdateHandler}>
              <label htmlFor="key">Key</label>
              <input
                type="password"
                id="key"
                name="key"
                ref={keyRef}
                placeholder="Push update manually"
              />
              {error && <p style={{ color: "red" }}>{error}</p>}
              <button type="submit">Push Update</button>
            </form>
          </div>

          <Status>
            <p>Total update(s) (batch)</p>
            <p>{dataSelector.record.data.length}</p>
          </Status>
          <Status>
            <p>Latest update</p>
            <p>
              {
                dataSelector.record.data[dataSelector.record.data.length - 1]
                  ?.dateTime
              }
            </p>
          </Status>

          <div className={styles["screening-push-button"]}>
            <Link
              style={{ textDecoration: "none", color: "white" }}
              href={"/home"}
            >
              <button type="button">Back to Home</button>
            </Link>
          </div>
        </div>
        <div>
          <h1>{new Date().toDateString()}</h1>
          <h2>Today&apos;s Update</h2>
          {noUpdate && <h3>{noUpdate}</h3>}
          <div className={styles["data-container"]}>
            {dataSelector.record.data.length !== 0 ? (
              <Table
                data={dataSelector.record.data}
                dataKeyFn={(recordData) => recordData.app_id}
                full={false}
              >
                {(recordData) => <TableRow props={recordData} />}
              </Table>
            ) : (
              <Loading />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Screening;
