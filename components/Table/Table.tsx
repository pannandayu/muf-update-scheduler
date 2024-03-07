import { UpdateDataProps, UpdateDataRecord } from "@/interfaces/IMonitor";
import styles from "@/styles/Table.module.css";
import { useRouter } from "next/router";
import React, { Fragment, ReactElement } from "react";

const Table: React.FC<{
  data: UpdateDataRecord["record"]["data"];
  children: (recordData: UpdateDataProps) => ReactElement;
  dataKeyFn: (recordData: UpdateDataProps) => string;
  full?: boolean;
}> = ({ children, data, dataKeyFn, full }) => {
  const router = useRouter();

  const showDataHandler = (dateTime: string) => {
    router.push(`${router.asPath}/batch/${dateTime}`);
  };

  return data.map((el, index) => {
    return (
      <div key={el.dateTime} className={styles["table-box"]}>
        <h3
          style={{ cursor: "pointer", fontFamily: "Montserrat" }}
          onClick={() => showDataHandler(el.dateTime)}
        >
          Batch {index + 1} -{" "}
          {el.dateTime.split(" ")[el.dateTime.split(" ").length - 1]}
          {" - "}
          Data count: {el.size}
        </h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Request ID</th>
              <th>App ID</th>
              <th>Application No</th>
            </tr>
          </thead>
          <tbody>
            {full ? (
              <Fragment>
                {el.list.map((recordData, index) => (
                  <tr key={dataKeyFn(recordData)}>{children(recordData)}</tr>
                ))}
              </Fragment>
            ) : (
              <Fragment>
                {el.list.map(
                  (recordData, index) =>
                    index < 3 && (
                      <tr key={dataKeyFn(recordData)}>
                        {children(recordData)}
                      </tr>
                    )
                )}
                <tr>
                  <td>...</td>
                  <td>...</td>
                  <td>...</td>
                </tr>
              </Fragment>
            )}
          </tbody>
        </table>
      </div>
    );
  });
};

export default Table;
