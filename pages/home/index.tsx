import { useAppSelector } from "@/redux/hooks";
import styles from "@/styles/Home.module.css";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Home: React.FC = () => {
  const loginSelector = useAppSelector((state) => state.auth.login);
  const router = useRouter();

  const date = moment(Date.now()).format("DD-MM-YYYY");
  const day = date.split("-")[0];
  const month = date.split("-")[1];

  const [fyi, setFyi] = useState<string>();

  const fetchFyi = async () =>
    fetch(`http://numbersapi.com/${month}/${day}/date`)
      .then((data) => {
        return data.text();
      })
      .then((text) => setFyi(text))
      .catch((err) => console.error(err));

  useEffect(() => {
    if (loginSelector.token === "") {
      router.push("/");
    }
  }, []);

  useEffect(() => {
    fetchFyi();
  }, []);

  return (
    <div className={styles.home}>
      <div style={{ display: "flex", gap: "auto" }}>
        <div style={{ maxWidth: "40%" }}>
          <div className={styles["home-title"]}>
            <h1>Welcome {loginSelector.username}.</h1>
            <p>This is a monitoring/dashboard app for SLIK update scheduler.</p>
            <p>Made with React - Next.js, TypeScript, and Love.</p>
            <p>
              Feel free to modify things in here{" "}
              {"(as long as it doesn't disrupt the functionality)."}
            </p>
          </div>
          <div>
            <h1 style={{ fontFamily: "Montserrat" }}>
              Today's Interesting Fact
            </h1>
            <p>{fyi}</p>
            <button type="button" onClick={async () => fetchFyi()}>
              Tell me more!
            </button>
          </div>
        </div>
        <div className={styles["screening-picker"]}>
          <h1>Pick a screening stage</h1>
          <Link href={"/screening/1"}>
            <h3>Screening 1</h3>
          </Link>
          <Link href={"/screening/2"}>
            <h3>Screening 2</h3>
          </Link>
          <Link href={"/screening/3"}>
            <h3>Screening 3</h3>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
