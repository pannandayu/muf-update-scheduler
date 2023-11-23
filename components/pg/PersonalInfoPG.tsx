import PersonalInfoPGInterface from "@/interfaces/pg/PersonalInfoPGInterface";
import styles from "@/styles/DataBox.module.css";

const PersonalInfoPG: React.FC<{
  data: PersonalInfoPGInterface;
}> = ({ data }) => {
  const birthDate = new Date(data.tanggal_lahir);
  const age = (new Date().getFullYear() - birthDate.getFullYear()).toString();

  return (
    <div className={styles["client-data"]}>
      <h2>Personal Info</h2>
      <div className={styles["info-container"]}>
        <div className={styles["personal-info"]}>
          <h3>Name: {data.nama_nasabah}</h3>
          <h3>ID Card No: {data.no_ktp}</h3>
          <h3>Gender: {data.jenis_kelamin}</h3>
          <h3>Age: {age}</h3>
        </div>
        <div className={styles["screening-info"]}>
          <h3
            style={{
              textAlign: "center",
              fontSize: "1rem",
            }}
          >
            Last Successful Request At
          </h3>
          <h3
            style={{
              textAlign: "center",
              fontSize: "1.75rem",
              margin: "auto",
            }}
          >
            Screening {data.lastRequestLevelDebiturUtama}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoPG;
