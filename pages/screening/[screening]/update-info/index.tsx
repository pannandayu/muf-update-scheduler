import Checkbox from "@/components/Checkbox";
import { LogData } from "@/interfaces/IData";
import { useAppSelector } from "@/redux/hooks";
import styles from "@/styles/UpdateInfo.module.css";
import { gql, useLazyQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { FormEvent, Fragment, useEffect, useState } from "react";

const UpdateInfo: React.FC = () => {
  const loginSelector = useAppSelector((state) => state.auth.login);

  const [queryParams, setQueryParams] = useState<FormDataEntryValue[]>();
  const [resultsQueryParams, setResultsQueryParams] =
    useState<FormDataEntryValue[]>();
  const [resultsChecked, setResultsChecked] = useState<boolean>();
  const [logData, setLogData] = useState<LogData>();

  const router = useRouter();
  const { batch, date, screening, category } = router.query;

  const handleQuery = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new FormData(event.currentTarget).getAll("parameter");
    const resultParams = new FormData(event.currentTarget).getAll(
      "results-parameter"
    );

    setQueryParams(params);
    setResultsQueryParams(resultParams);
  };

  const GET_LOG = gql`
  query GetLog($screening: Int!, $date: String!, $batch: Int!, $category: String) {
    log(screening: $screening, date: $date, batch: $batch, category: $category) {
      _id
      ${
        queryParams
          ? queryParams.map((el) => {
              if (el.toString() === "results") {
                if (resultsQueryParams?.length != 0) {
                  return `
                  results {
                    ${resultsQueryParams?.map((el) => {
                      if (el === "data") {
                        return `data {
                          request_id
                          app_id
                          application_no
                        }`;
                      }
                      return el;
                    })}
                  }
                `;
                }
              } else {
                return el;
              }
            })
          : ""
      }
    }
  }`;

  const [getLog, { called, loading, data }] = useLazyQuery(GET_LOG, {
    context: {
      headers: {
        authorization: `Bearer ${
          loginSelector.token ? loginSelector.token : ""
        }`,
      },
    },
    variables: {
      screening: +screening!,
      date: date,
      batch: +batch!,
      category: category || null,
    },
  });

  useEffect(() => {
    if (loginSelector.token === "") {
      router.push("/");
    }

    if (called && !loading) {
      setLogData(data.log);
    }
  }, [loginSelector.token, called, loading, data]);

  return (
    <div>
      <div>
        <h1>Select the data that you want to retrieve.</h1>
      </div>
      <div
        style={{
          display: "flex",
          gap: "1rem",
        }}
      >
        <div className={styles["param-box"]}>
          <form onSubmit={handleQuery}>
            <Checkbox name="parameter" id="screening" value="screening">
              Screening
            </Checkbox>

            {/* search category for screening 2 and 3 */}
            {screening !== "1" && (
              <Checkbox name="parameter" id="category" value="category">
                Category
              </Checkbox>
            )}

            <Checkbox name="parameter" id="batch" value="batch">
              Batch
            </Checkbox>
            <Checkbox name="parameter" id="date" value="date">
              Date
            </Checkbox>
            <Checkbox name="parameter" id="time" value="time">
              Time
            </Checkbox>
            <Checkbox name="parameter" id="size" value="size">
              Size
            </Checkbox>
            <Checkbox name="parameter" id="validUpdates" value="validUpdates">
              Valid Updates
            </Checkbox>
            <Checkbox name="parameter" id="elapsedTime" value="elapsedTime">
              Elapsed Time
            </Checkbox>
            <Checkbox
              name="parameter"
              id="results"
              value="results"
              changeHandler={(event) => setResultsChecked(event.target.checked)}
            >
              Results
            </Checkbox>

            {/* 
            expose data and status if want to fetch results
            checklist results without data or status won't return anyting
           */}
            {resultsChecked && (
              <Fragment>
                <Checkbox name="results-parameter" id="data" value="data">
                  Results - Data
                </Checkbox>
                <Checkbox name="results-parameter" id="status" value="status">
                  Results - Status
                </Checkbox>
              </Fragment>
            )}
            <div>
              <button
                className={styles.button}
                type="submit"
                onClick={() => getLog()}
              >
                Submit
              </button>
            </div>
          </form>
          <button
            className={styles.button}
            onClick={() => router.push(`/screening/${screening}`)}
            type="submit"
          >
            Back to screening page
          </button>
        </div>

        {logData && (
          <div className={styles["data-box"]}>
            <h2>The Data</h2>
            {logData.screening && <h3>Screening: {logData.screening}</h3>}
            {logData.batch && <h3>Batch: {logData.batch}</h3>}
            {logData.category && <h3>Category: {logData.category}</h3>}
            {logData.date && <h3>Date: {logData.date}</h3>}
            {logData.time && <h3>Time: {logData.time}</h3>}
            {logData.size !== undefined && <h3>Size: {logData.size}</h3>}
            {logData.validUpdates !== undefined && (
              <h3>Valid updates: {logData.validUpdates}</h3>
            )}
            {logData.elapsedTime !== undefined && (
              <h3>Elapsed time: {logData.elapsedTime}</h3>
            )}

            {logData.results && (
              <table className={styles.table}>
                <thead>
                  <tr>
                    {logData.results.map((e) => e.data !== undefined)[0] && (
                      <Fragment>
                        <th>Application No</th>
                        <th>Request ID</th>
                        <th>App ID</th>
                      </Fragment>
                    )}
                    {logData.results.find((e) => e.status) && <th>Status</th>}
                  </tr>
                </thead>
                <tbody>
                  {logData.results.map((e) => (
                    <tr key={Math.random().toString()}>
                      {e.data && (
                        <>
                          <td>{e.data.application_no}</td>
                          <td>{e.data.request_id}</td>
                          <td>{e.data.app_id}</td>
                        </>
                      )}
                      {e.status && (
                        <td>
                          {formatStatus(e.status).map((el) => {
                            if (el !== "STATUS") {
                              return el + ", ";
                            }
                          })}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateInfo;

const formatStatus = (str: string): string[] => {
  return str
    .replaceAll(/[[\]']+/g, "")
    .split("--")
    .map((el) => el.trim());
};
