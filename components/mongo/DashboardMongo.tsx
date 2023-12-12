import MongoDataClass from "@/classes/mongo/MongoDataClass";
import styles from "@/styles/DataBox.module.css";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HeaderMongo from "./HeaderMongo";
import SubmitterMongo from "./SubmitterMongo";
import AboutClientMongo from "./AboutClientMongo";
import ScoringMongo from "./ScoringMongo";
import ApplicationStatus from "./ApplicationStatus";

const DashboardMongo: React.FC<{ data: MongoDataClass }> = ({ data }) => {
  const [mongoData, setMongoData] = useState<MongoDataClass>(
    new MongoDataClass()
  );

  const [mongoPersonal, setMongoPersonal] =
    useState<MongoDataClass["detail"]["debitur"]["personal"]>();

  const [mongoSpouse, setMongoSpouse] =
    useState<MongoDataClass["detail"]["debitur"]["personal"]["spouse"]>();

  const [personalAge, setPersonalAge] = useState<string>();
  const [spouseAge, setSpouseAge] = useState<string>();

  useEffect(() => {
    setMongoData(data);
    setMongoPersonal(data.detail.debitur.personal);
    setPersonalAge(
      (
        new Date().getFullYear() -
        new Date(
          data.detail.debitur.personal.debitur_tanggal_lahir
        ).getFullYear()
      ).toString()
    );
    if (
      data.detail.debitur.personal.debitur_status_perkawinan === "01" &&
      data.detail.debitur.personal.spouse.spouse_ktp_name !== ""
    ) {
      setMongoSpouse(data.detail.debitur.personal.spouse);
      setSpouseAge(
        (
          new Date().getFullYear() -
          new Date(
            data.detail.debitur.personal.spouse.spouse_date_of_birth
          ).getFullYear()
        ).toString()
      );
    }
  }, [data]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={data.application_id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.2 }}
        className={styles["data-box"]}
      >
        <div className={styles["client-data"]}>
          <div className={styles.dashboard}>
            <h1>Client's Data</h1>
            <h1>{mongoData.current_form_desc}</h1>
            <h1>Created @ {mongoData.order_created_date}</h1>
          </div>
          <hr />
          <HeaderMongo headerData={mongoData} />
          <SubmitterMongo submitterData={mongoData} />
          <AboutClientMongo
            gradingData={mongoData}
            personalData={mongoPersonal}
            spouseData={mongoSpouse}
            personalAge={personalAge}
            spouseAge={spouseAge}
          />
          <ScoringMongo scoringData={mongoData} mongoPersonal={mongoPersonal} />
          <ApplicationStatus statusData={mongoData} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DashboardMongo;
