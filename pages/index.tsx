import React, { FormEvent, useContext, useRef, useState } from "react";
import Title from "@/components/Title";
import FormSwitch from "@/wrappers/FormSwitch";
import DashboardSwitch from "@/wrappers/DashboardSwitch";
import { AnimatePresence, motion } from "framer-motion";
import Input from "@/components/Input";
import styles from "@/styles/Input.module.css";
import authStyles from "@/styles/Auth.module.css";
import AuthContext from "@/context/auth-context";
import CBASContext from "@/context/cbas-context";
import ModalCard from "@/wrappers/Modal";

export default function Home(props: { password: string }) {
  const authContext = useContext(AuthContext);
  const cbasContext = useContext(CBASContext);
  const [formIsPG, setFormIsPG] = useState<boolean>(true);
  const [passwordKey, setPasswordKey] = useState<string>();
  const authRef = useRef<HTMLInputElement>(null);

  const setFormIsPGHandler = (state: boolean) => {
    setFormIsPG(state);
  };

  const authHandler: React.FormEventHandler = (event: FormEvent) => {
    event.preventDefault();
    if (authRef.current?.value === props.password) {
      authContext.authHandler(true);
    } else {
      authContext.authHandler(false);
    }

    setPasswordKey(authRef.current?.value || "null");
  };

  return !authContext.isAuth ? (
    <div className={authStyles.auth}>
      <div style={{ display: "block" }}>
        <div>
          {cbasContext.isError && (
            <ModalCard
              isOpen={cbasContext.isError}
              onClose={() => cbasContext.errorHandler(false, null)}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5 }}
              >
                <h1>{cbasContext.errorMessage}</h1>
              </motion.div>
            </ModalCard>
          )}
          <form onSubmit={authHandler}>
            <Input
              labelName="Password please."
              idForName="auth"
              type="password"
              className={styles.input}
              ref={authRef}
            />
            <motion.button
              className={authStyles["auth-button"]}
              whileHover={{ backgroundColor: "#91c493", scale: 1.1 }}
              whileTap={{ backgroundColor: "#91c493", scale: 0.9 }}
            >
              Submit
            </motion.button>
          </form>
        </div>
        <div>
          {authContext.isAuth === false && (
            <AnimatePresence mode="wait">
              <motion.h4
                key={passwordKey}
                initial={{ opacity: 0 }}
                animate={{
                  x: [0, -5, 5, -5, 5, -5, 0],
                  opacity: [1, 0.8, 1, 0.8, 1],
                }}
                transition={{ duration: 0.5 }}
                style={{ color: "red", margin: 0 }}
              >
                Wrong password.
              </motion.h4>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div>
      {cbasContext.isError && (
        <ModalCard
          isOpen={cbasContext.isError}
          onClose={() => cbasContext.errorHandler(false, null)}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.5 }}
          >
            <h2>{cbasContext.errorMessage}</h2>
          </motion.div>
        </ModalCard>
      )}
      <h1 style={{ marginBottom: "0.5rem" }}>Find your client here.</h1>
      <h2 style={{ marginTop: 0, marginBottom: "1rem" }}>
        You can search by...
      </h2>
      <Title form={formIsPG ? "PG" : "Mongo"} />
      <div style={{ display: "flex" }}>
        <FormSwitch
          formIsPG={formIsPG}
          onClickSwitchForm={setFormIsPGHandler}
        />
        <DashboardSwitch formIsPG={formIsPG} />
      </div>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {
      password: process.env.PASSWORD,
    },
  };
}
