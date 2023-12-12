import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "@/styles/DataBox.module.css";
import SLIKRequestAttemptPG from "./SLIKRequestAttempt";
import GradingResultHistoryPG from "./GradingResultHistoryPG";
import HitCBAS from "../HitCBAS";
import AllPGDataInterface from "@/interfaces/pg/AllPGDataInterface";
import PersonalInfoPGClass from "@/classes/pg/PersonalInfoPGClass";
import SpouseInfoPGClass from "@/classes/pg/SpouseInfoPGClass";
import PersonalInfoPG from "./PersonalInfoPG";
import SpouseInfoPG from "./SpouseInfoPG";
import SLIKRequestAttemptPGClass from "@/classes/pg/SLIKRequestAttemptPGClass";
import GradingResultPGClass from "@/classes/pg/GradingResultPGClass";

const DashboardPG: React.FC<{
  data: AllPGDataInterface;
}> = ({ data }) => {
  const {
    lastRequestLevel,
    personalInfo,
    spouseInfo,
    slikResponseLog,
    screeningResults,
    mongoAdditionalData,
  } = data;

  const [personalInfoPG, setPersonalInfoPG] = useState<PersonalInfoPGClass>(
    new PersonalInfoPGClass()
  );

  const [spouseInfoPG, setSpouseInfoPG] = useState<SpouseInfoPGClass>(
    new SpouseInfoPGClass()
  );

  const [slikRequestInfoPG, setSlikRequestInfoPG] = useState<
    SLIKRequestAttemptPGClass[]
  >([new SLIKRequestAttemptPGClass()]);

  const [gradingResultHistoryPG, setGradingResultHistoryPG] =
    useState<GradingResultPGClass>(new GradingResultPGClass());

  const [mongoAddsData, setMongoAddsData] = useState<
    AllPGDataInterface["mongoAdditionalData"]
  >({ aggregateBrms: "", currentFormDesc: "" });

  useEffect(() => {
    setPersonalInfoPG({
      ...personalInfo,
      lastRequestLevelDebiturUtama:
        lastRequestLevel.lastRequestLevelDebiturUtama,
    });
    setSpouseInfoPG({
      ...spouseInfo,
      lastRequestLevelPasangan: lastRequestLevel.lastRequestLevelPasangan,
    });
    setSlikRequestInfoPG(slikResponseLog);
    setGradingResultHistoryPG(screeningResults);
    setMongoAddsData(mongoAdditionalData);
  }, [data]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={data.personalInfo.no_ktp}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.2 }}
        className={styles["data-box"]}
      >
        <div className={styles.dashboard}>
          <h1>Client's Data </h1>
          <h1>Request ID: {personalInfoPG.app_id.split("I")[0] + "I"}</h1>
          <h1>Current Form: {mongoAddsData.currentFormDesc} </h1>
        </div>
        <hr />
        <div className={styles.frame}>
          <PersonalInfoPG data={personalInfoPG} />
          <SpouseInfoPG data={spouseInfoPG} />
        </div>
        <div className={styles.frame}>
          <SLIKRequestAttemptPG data={slikRequestInfoPG} />
        </div>
        <div className={styles.frame}>
          <GradingResultHistoryPG data={gradingResultHistoryPG} />
        </div>
        <div className={styles.frame}>
          <h2 style={{ marginTop: "0.75rem", marginBottom: "0.75rem" }}>
            BRMS Personal SLIK Aggregate Result =
            <span style={{ fontWeight: "lighter", color: "#843636" }}>
              {" "}
              {mongoAddsData.aggregateBrms}
            </span>
          </h2>
        </div>
        <div className={styles.frame}>
          <HitCBAS
            maritalStatus={spouseInfoPG.maritalStatus}
            requestId={personalInfoPG.request_id}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DashboardPG;
