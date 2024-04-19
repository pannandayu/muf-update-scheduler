import Loading from "@/components/Loading";
import Modal from "@/components/Modal";
import Table from "@/components/Table/Table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { dataSliceActions } from "@/redux/slices/data-slice";
import styles from "@/styles/Screening.module.css";
import { gql, useQuery } from "@apollo/client";
import { AnimatePresence, motion } from "framer-motion";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const Screening: React.FC = () => {
  const loginSelector = useAppSelector((state) => state.auth.login);
  const dataSelector = useAppSelector((state) => state.data);
  const dispatch = useAppDispatch();

  const router = useRouter();

  const { screening } = router.query;

  const [calendarVisible, setCalendarVisible] = useState<boolean>(false);
  const [menu, setMenu] = useState<boolean>(false);
  const [menuTextHover, setMenuTextHover] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);

  const modalHandler = () => {
    setModal((prevState) => !prevState);
  };

  const toggleCalendar = () => {
    setCalendarVisible((prevState) => !prevState);
  };

  const GET_LOGS = gql`
    query getLogs {
      logs(screening: ${screening}, date:"${dataSelector.date}") {
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
  });

  useEffect(() => {
    if (loginSelector.token == "") {
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
              onChange={(value, _) => {
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
            <p>Push update manually -- TODO</p>
            <p onClick={modalHandler}>Select screening</p>
            <Modal modalState={modal} modalHandler={modalHandler}>
              <h1 style={{ marginBottom: 0 }}>Screening</h1>
              <div className={styles["modal-screening"]}>
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
