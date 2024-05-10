import Loading from "@/components/Loading";
import Modal from "@/components/Modal";
import Table from "@/components/Table/Table";
import { PushUpdateData, UpdateDataID } from "@/interfaces/IData";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { dataSliceActions } from "@/redux/slices/data-slice";
import styles from "@/styles/Screening.module.css";
import pushUpdateValidationSchema from "@/validations/PushUpdateValidation";
import { gql, useQuery } from "@apollo/client";
import { AnimatePresence, motion } from "framer-motion";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type UpdateDataRecord = UpdateDataID & { status_applicant?: string };
type UpdatedFailed = { error: { message: string; status: number } } | string;
type UpdateSuccess = { data: UpdateDataRecord[] };

const Screening: React.FC = () => {
  const loginSelector = useAppSelector((state) => state.auth.login);
  const dataSelector = useAppSelector((state) => state.data);
  const dispatch = useAppDispatch();

  const updateKey = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const { screening } = router.query;

  const [calendarVisible, setCalendarVisible] = useState<boolean>(false);
  const [menu, setMenu] = useState<boolean>(false);
  const [menuTextHover, setMenuTextHover] = useState<boolean>(false);
  const [modalScreening, setModalScreening] = useState<boolean>(false);
  const [modalUpdate, setModalUpdate] = useState<boolean>(false);
  const [pushUpdateStatus, setPushUpdateStatus] = useState<string>();

  const modalScreeningHandler = () => {
    setModalScreening((prevState) => !prevState);
  };

  const modalUpdateHandler = () => {
    setModalUpdate((prevState) => !prevState);
  };

  const toggleCalendar = () => {
    setCalendarVisible((prevState) => !prevState);
  };

  const pushUpdateHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const pushUpdateData = {
      updateKey: updateKey.current?.value || "",
      screening: +screening!,
    };

    const validationResult =
      pushUpdateValidationSchema.safeParse(pushUpdateData);

    if (!validationResult.success) {
      setPushUpdateStatus(validationResult.error.errors[0].message);
      return;
    }

    proceedPushUpdate({
      ...validationResult.data,
      token: loginSelector.token,
    });
  };

  const proceedPushUpdate = async (data: PushUpdateData) => {
    try {
      const resultSelf = await handleSelfUpdate(data);
      handleUpdateResult(resultSelf);
      if (data.screening !== 1) {
        const resultAggregate = await handleAggregateUpdate(data);
        handleUpdateResult(resultAggregate);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleSelfUpdate = async (data: PushUpdateData) => {
    const responseSelf = await fetch("/api/push-update-self", {
      method: "POST",
      body: JSON.stringify({
        updateKey: data.updateKey,
        screening: data.screening,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer: " + data.token,
      },
    });
    return await responseSelf.json();
  };

  const handleAggregateUpdate = async (data: PushUpdateData) => {
    const responseAggregate = await fetch("/api/push-update-aggregate", {
      method: "POST",
      body: JSON.stringify({
        updateKey: data.updateKey,
        screening: data.screening,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer: " + data.token,
      },
    });
    return await responseAggregate.json();
  };

  const handleUpdateResult = (updateResult: {
    response: UpdateSuccess | UpdatedFailed;
  }) => {
    if (typeof updateResult.response === "string") {
      toast.error(updateResult.response.toString(), {
        autoClose: 2000,
        theme: "dark",
      });
    } else {
      if ("error" in updateResult.response) {
        toast.error(updateResult.response.error.message, {
          autoClose: 2000,
          theme: "dark",
        });
      } else {
        toast.success("Push update successful!", {
          autoClose: 2000,
          theme: "dark",
        });
      }
    }
  };

  const GET_LOGS = gql`
    query GetLogs($screening: Int!, $date: String!) {
      logs(screening: $screening, date: $date) {
        batch
        category
        date
      }
    }
  `;

  const { loading, error, data, refetch } = useQuery(GET_LOGS, {
    pollInterval: 1000 * 60 * 5,
    fetchPolicy: "no-cache",
    context: {
      headers: {
        authorization: `Bearer ${
          loginSelector.token ? loginSelector.token : ""
        }`,
      },
    },
    variables: { screening: +screening!, date: dataSelector.date },
  });

  useEffect(() => {
    if (loginSelector.token === "") {
      router.push("/");
    }
  }, [loginSelector.token]);

  if (error) {
    console.log("GraphQL error:", error);
    return;
  }

  return (
    <div className={styles.screening}>
      <div className={styles["screening-title"]}>
        <div>
          <h1>Logged in as {loginSelector.username}.</h1>
          <h1 style={{ fontFamily: "Lato" }}>Date: {dataSelector.date}</h1>
        </div>

        <h3 style={{ marginTop: 0 }}>
          Displaying logs from <b>Screening {screening}</b>.
        </h3>
      </div>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          margin: "auto auto 1rem auto",
        }}
      ></div>
      <ToastContainer />
      {loading ? (
        <Loading />
      ) : data ? (
        data.logs.length == 0 ? (
          "No update(s) yet."
        ) : (
          <Table data={data} />
        )
      ) : null}
      <AnimatePresence mode="wait">
        {calendarVisible && (
          <motion.div
            key={"calendar"}
            className={styles.calendar}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            <Calendar
              onChange={(value) => {
                const selectedDate = moment(new Date(value!.toString())).format(
                  "DD-MM-YYYY"
                );
                dispatch(dataSliceActions.setDate(selectedDate));
                refetch();
              }}
            />
            <button onClick={() => setCalendarVisible(false)}>Close</button>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {menu && (
          <motion.div
            className={styles["menu-card"]}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 7 }}
            key={menu.toString()}
          >
            <p onClick={toggleCalendar}>Change date</p>
            <p onClick={modalUpdateHandler}>Push update manually</p>
            <Modal modalState={modalUpdate} modalHandler={modalUpdateHandler}>
              <h1 style={{ marginBottom: 0 }}>Input Update Key</h1>
              <div className={styles["modal"]}>
                <form
                  style={{ display: "flex", gap: "2rem" }}
                  onSubmit={pushUpdateHandler}
                >
                  <input type="password" ref={updateKey} />
                  <button>Send</button>
                </form>
                {pushUpdateStatus}
              </div>
            </Modal>
            <p onClick={modalScreeningHandler}>Select screening</p>
            <Modal
              modalState={modalScreening}
              modalHandler={modalScreeningHandler}
            >
              <h1 style={{ marginBottom: 0 }}>Screening</h1>
              <div className={styles["modal"]}>
                <Link href={"/screening/1"}>1</Link>
                <Link href={"/screening/2"}>2</Link>
                <Link href={"/screening/3"}>3</Link>
              </div>
            </Modal>
            <Link href={"/home"}>Back to home</Link>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        className={styles.menu}
        style={{
          backgroundColor: menu ? "white" : "black",
        }}
        whileHover={{
          cursor: "pointer",
          scale: 1.05,
        }}
        whileTap={{ scale: 0.95 }}
        onHoverStart={() => {
          setMenuTextHover((prevState) => !prevState);
        }}
        onHoverEnd={() => {
          setMenuTextHover((prevState) => !prevState);
        }}
        onClick={() => setMenu((prevState) => !prevState)}
      >
        <motion.p style={{ color: menu ? "black" : "white" }}>
          {menu ? (menuTextHover ? "Close" : "X") : "Menu"}
        </motion.p>
      </motion.div>
    </div>
  );
};
export default Screening;
