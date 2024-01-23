import Input from "@/components/Input";
import ReactTable from "@/components/ReactTable";
import AuthContext from "@/context/auth-context";
import CBASContext from "@/context/cbas-context";
import CBASAgent from "@/interfaces/cbas/CBASAgent";
import CBASQue from "@/interfaces/cbas/CBASQue";
import ICBASNoResponse from "@/interfaces/cbas/ICBASNoResponse";
import styles from "@/styles/CBASQue.module.css";
import inputStyles from "@/styles/Input.module.css";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Column } from "react-table";

const CBASQueIndex: React.FC<{
  responseQueCbas?: { queueCbas: CBASQue[] };
  responseAgentCbas?: { agentCbas: CBASAgent[] };
  responseNoResponseCbas?: { agentNoResp: ICBASNoResponse[] };
  errorMessage?: string;
}> = ({
  responseQueCbas,
  responseAgentCbas,
  responseNoResponseCbas,
  errorMessage,
}) => {
  const authContext = useContext(AuthContext);
  const cbasContext = useContext(CBASContext);
  const router = useRouter();
  const [fetchTime, setFetchTime] = useState<Date>();
  const [refetchInterval, setRefetchInterval] = useState<number>(60);
  const [prevRefetchInterval, setPrevRefetchInterval] =
    useState<number>(refetchInterval);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [tableKey, setTableKey] = useState<string>("que");

  const [queCbasData, setQueCbasData] = useState<CBASQue[]>(
    responseQueCbas?.queueCbas || [
      {
        data_terakhir_masuk_pada: "",
        data_paling_awal_masuk_pada: "",
        ip_address: "",
        jumlah_queue: "",
        vip_code: "",
      },
    ]
  );
  const [agentCbasData, setAgentCbasData] = useState<CBASAgent[]>(
    responseAgentCbas?.agentCbas || [{ ip_address: "", userid: "" }]
  );

  const [noResponseCbasData, setNoResponseCbasData] = useState<
    ICBASNoResponse[]
  >(
    responseNoResponseCbas?.agentNoResp || [
      {
        no_resp_count: "",
        total_count: "",
        persentase_no_resp: "",
        vip_code: "",
      },
    ]
  );

  const refetchIntervalRef = useRef<HTMLInputElement>(null);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const safetyCheckRef = useRef<boolean>(false);

  const changeRefetchTimeHandler = (event: React.FormEvent) => {
    event.preventDefault();
    if (refetchIntervalRef.current?.value) {
      setRefetchInterval(+refetchIntervalRef.current.value);
      refetchIntervalRef.current.value = "";
    }
  };

  const pauseHandler = (event: React.MouseEvent) => {
    event.preventDefault();
    if (isPaused) {
      setIsPaused(false);
      setRefetchInterval(prevRefetchInterval);
    } else {
      setIsPaused(true);
      setPrevRefetchInterval(refetchInterval);
      setRefetchInterval(100000000);
    }
  };

  const getCbasData = async () => {
    let responseQue: { queueCbas: CBASQue[] };
    let responseAgent: { agentCbas: CBASAgent[] };
    let responseNoResponse: { agentNoResp: ICBASNoResponse[] };

    try {
      const requestQueCbas = await fetch("/api/get-que-cbas", {
        body: JSON.stringify({ kenapa: "post" }),
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const requestAgentCbas = await fetch("/api/get-agent-cbas", {
        body: JSON.stringify({ harusnya: "get" }),
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const requestNoResponseCbas = await fetch("/api/get-no-response-cbas");

      if (
        requestQueCbas.ok &&
        requestAgentCbas.ok &&
        requestNoResponseCbas.ok
      ) {
        responseQue = await requestQueCbas.json();
        responseAgent = await requestAgentCbas.json();
        responseNoResponse = await requestNoResponseCbas.json();

        const { queueCbas } = responseQue ?? { queueCbas: [] };
        const { agentCbas } = responseAgent ?? { agentCbas: [] };
        const { agentNoResp } = responseNoResponse ?? { agentNoResp: [] };

        setQueCbasData(queueCbas);
        setAgentCbasData(agentCbas);
        setNoResponseCbasData(agentNoResp);
      } else {
        throw new Error(
          "Something went wrong when fetch CBAS data. Error from getCbasData"
        );
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (errorMessage) {
      cbasContext.errorHandler(true, errorMessage);
      router.push("/");
      return;
    }
    if (!authContext.isAuth) {
      cbasContext.errorHandler(true, "Please verify yourself.");
      router.push("/");
      return;
    }
    safetyCheckRef.current = true;
    setFetchTime(new Date());
  }, []);

  useEffect(() => {
    if (!safetyCheckRef.current) {
      return;
    }

    if (isPaused) {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    } else {
      const intervalId = setInterval(() => {
        setFetchTime(new Date());
        getCbasData();
      }, refetchInterval * 1000);
      intervalIdRef.current = intervalId;
    }

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, [refetchInterval]);

  const queCbasDataMemo = useMemo(() => {
    return queCbasData;
  }, [JSON.stringify(queCbasData)]);
  const agentCbasDataMemo = useMemo(() => {
    return agentCbasData;
  }, [JSON.stringify(agentCbasData)]);
  const noResponseCbasDataMemo = useMemo(() => {
    return noResponseCbasData;
  }, [JSON.stringify(noResponseCbasData)]);

  const {
    queCbasTableColumns,
    agentCbasTableColumns,
    noResponseCbasTableColumns,
  } = createColumns();

  if (!safetyCheckRef.current) return;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ fontFamily: "Lato", marginBottom: 0 }}>
            Fetch time: {fetchTime?.toLocaleTimeString()}
          </h2>
          <h4 style={{ fontFamily: "Lato", marginTop: 0 }}>
            {isPaused
              ? "Fetching is paused."
              : `Interval @ ${refetchInterval} second(s).`}
          </h4>
          <form onSubmit={changeRefetchTimeHandler}>
            <Input
              labelName="Customize your interval! (sec)"
              idForName="interval"
              type="number"
              className={inputStyles.input}
              ref={refetchIntervalRef}
            />
            <motion.button
              whileTap={{ scale: 0.8 }}
              className={styles["interval-button"]}
              type="submit"
              disabled={isPaused}
            >
              OK
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.8 }}
              style={{ backgroundColor: isPaused ? "green" : "orange" }}
              className={styles["interval-button"]}
              onClick={pauseHandler}
            >
              {isPaused ? "Resume" : "Pause"}
            </motion.button>
            <AnimatePresence mode="wait">
              <motion.button
                key={tableKey}
                whileTap={{ scale: 0.8 }}
                style={{ backgroundColor: "purple" }}
                className={styles["interval-button"]}
                type="submit"
                onClick={() =>
                  setTableKey(
                    tableKey === "que"
                      ? "agent"
                      : tableKey === "agent"
                      ? "no-response"
                      : "que"
                  )
                }
              >
                <motion.span
                  key={`span-${tableKey}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                >
                  {tableKey === "que"
                    ? "CBAS Agent Table"
                    : tableKey === "agent"
                    ? "CBAS No Response Table"
                    : "CBAS Que Table"}
                </motion.span>
              </motion.button>
            </AnimatePresence>
          </form>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={tableKey}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 10, opacity: 0 }}
            transition={{ duration: 0.1 }}
            layout
            style={{
              margin: "0%",
              marginRight: "20%",
              marginTop: "5%",
            }}
          >
            <h1>
              {tableKey === "que"
                ? "CBAS Ques Table"
                : tableKey === "agent"
                ? "CBAS Agent Table"
                : "CBAS No Response Table"}
            </h1>
          </motion.div>
        </AnimatePresence>
      </div>
      {tableKey === "que" ? (
        <ReactTable
          inputData={queCbasDataMemo}
          inputColumns={queCbasTableColumns}
          className={styles["cbas-table"]}
          tableKey={"que"}
        />
      ) : tableKey === "agent" ? (
        <ReactTable
          inputData={agentCbasDataMemo}
          inputColumns={agentCbasTableColumns}
          className={styles["cbas-table"]}
          tableKey={"agent"}
        />
      ) : (
        <ReactTable
          inputData={noResponseCbasDataMemo}
          inputColumns={noResponseCbasTableColumns}
          className={styles["cbas-table"]}
          tableKey={"no-response"}
        />
      )}
    </div>
  );
};

export default CBASQueIndex;

const createColumns = () => {
  type CBASData = CBASQue | CBASAgent;

  const queCbasTableColumns: Column<CBASData>[] = useMemo(
    () => [
      { Header: "VIP Code", accessor: "vip_code" as keyof CBASData },
      { Header: "Que", accessor: "jumlah_queue" as keyof CBASData },
      {
        Header: "Latest Data Insertion",
        accessor: "data_terakhir_masuk_pada" as keyof CBASData,
      },
      {
        Header: "Earliest Data Insertion",
        accessor: "data_paling_awal_masuk_pada" as keyof CBASData,
      },
      { Header: "IP Address", accessor: "ip_address" },
    ],
    []
  );

  const agentCbasTableColumns: Column<CBASData>[] = useMemo(
    () => [
      { Header: "User ID", accessor: "userid" as keyof CBASData },
      { Header: "IP Address", accessor: "ip_address" },
    ],
    []
  );

  const noResponseCbasTableColumns: Column<ICBASNoResponse>[] = useMemo(
    () => [
      { Header: "VIP Code", accessor: "vip_code" as keyof ICBASNoResponse },
      {
        Header: "Total Que(s)",
        accessor: "total_count" as keyof ICBASNoResponse,
      },
      {
        Header: "Total No Response(s)",
        accessor: "no_resp_count" as keyof ICBASNoResponse,
      },
      {
        Header: "No Response Perc. (%)",
        accessor: "persentase_no_resp" as keyof ICBASNoResponse,
      },
    ],
    []
  );

  return {
    queCbasTableColumns,
    agentCbasTableColumns,
    noResponseCbasTableColumns,
  };
};

export async function getServerSideProps() {
  let responseQueCbas;
  let responseAgentCbas;
  let responseNoResponseCbas;
  let errorMessage;

  try {
    const requestQueCbas = await fetch(`${process.env.JAVA_CBAS_QUE}`, {
      body: JSON.stringify({ kenapa: "post" }),
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const requestAgentCbas = await fetch(`${process.env.JAVA_CBAS_AGENT}`, {
      body: JSON.stringify({ harusnya: "get" }),
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const requestNoResponseCbas = await fetch(
      `${process.env.JAVA_CBAS_NO_RESPONSE}`
    );

    if (requestQueCbas.ok && requestAgentCbas.ok && requestNoResponseCbas.ok) {
      errorMessage = null;
      responseQueCbas = await requestQueCbas.json();
      responseAgentCbas = await requestAgentCbas.json();
      responseNoResponseCbas = await requestNoResponseCbas.json();
    } else {
      errorMessage = "Please connect to the VPN.";
      responseQueCbas = null;
      responseAgentCbas = null;
      responseNoResponseCbas = null;
    }
  } catch (error: any) {
    console.error(error);
  }

  return {
    props: {
      responseQueCbas,
      responseAgentCbas,
      responseNoResponseCbas,
      errorMessage,
    },
  };
}
