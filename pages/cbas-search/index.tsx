import CBASData from "@/classes/cbas/CBASData";
import CBASDataComp from "@/components/CBASData";
import Input from "@/components/Input";
import AuthContext from "@/context/auth-context";
import CBASContext from "@/context/cbas-context";
import dataBoxStyles from "@/styles/DataBox.module.css";
import formStyles from "@/styles/Form.module.css";
import inputStyles from "@/styles/Input.module.css";
import CBASDataSearchSchema from "@/validations/CBASDataSearchSchema";
import Card from "@/wrappers/Card";
import CardDataBox from "@/wrappers/CardDataBox";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ZodIssue } from "zod";

type CBASDataResponseType = { data?: CBASData; errorMessage?: string };

const CBASSearchIndex: React.FC = () => {
  const authContext = useContext(AuthContext);
  const cbasContext = useContext(CBASContext);

  const safetyCheckRef = useRef<boolean>(false);
  const router = useRouter();

  const reffNumberRef = useRef<HTMLInputElement>(null);

  const [errorObject, setErrorObject] = useState<ZodIssue[]>();
  const [toastMessage, setToastMessage] = useState<string>();

  const notify = () => {
    toast.info(toastMessage, {
      position: "top-right",
      autoClose: 2000,
      closeOnClick: true,
      hideProgressBar: true,
    });
  };

  useEffect(() => {
    if (!authContext.isAuth) {
      cbasContext.errorHandler(true, "Please verify yourself.");
      router.push("/");
      return;
    }
    safetyCheckRef.current = true;
  }, []);

  const submitHandler: React.FormEventHandler = async (event) => {
    event.preventDefault();

    const validation = CBASDataSearchSchema.safeParse({
      reffnumber: reffNumberRef.current?.value || "",
    });

    if (validation.success) {
      setErrorObject(undefined);
      reffNumberRef.current!.value = "";

      try {
        const request = await fetch("/api/search-data-cbas", {
          method: "POST",
          body: JSON.stringify(validation.data),
          headers: { "Content-Type": "application/json" },
        });

        const response: CBASDataResponseType = await request.json();

        if (response.data) {
          cbasContext.cbasDataHandler(response.data);
          setToastMessage("Data Found! ✅");
        } else {
          setToastMessage("Data Not Found! ❌");
        }
      } catch (err: any) {
        console.error(err);
      }
    } else {
      setErrorObject(validation.error.issues);
    }
  };

  useEffect(() => {
    if (toastMessage) notify();
    return () => setToastMessage(undefined);
  }, [toastMessage]);

  useEffect(() => {
    if (!safetyCheckRef.current) return;
  }, [safetyCheckRef.current]);

  return (
    <div>
      <ToastContainer />
      <h1 style={{ marginBottom: 0 }}>Find your client here too.</h1>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <h3>Searching in CBAS</h3>
        <Image src="/seabass.png" alt="CBAS Logo" width={50} height={50} />
      </div>
      <div
        style={{ display: "flex", justifyContent: "flex-start", gap: "1.5rem" }}
      >
        <div>
          <Card>
            <form className={formStyles.form}>
              <Input
                labelName="Reffnumber :"
                idForName="reffnumber"
                type="text"
                className={
                  errorObject?.map((i) => i.path[0] === "reffnumber")
                    ? `${inputStyles.input} ${inputStyles["input-error"]}`
                    : inputStyles.input
                }
                ref={reffNumberRef}
              />
              {errorObject?.map(
                (i) =>
                  i.path[0] === "reffnumber" && (
                    <p key={i.path[0]}>{i.message}</p>
                  )
              )}
              <button
                className={formStyles["submit-button"]}
                type="submit"
                onClick={submitHandler}
              >
                Search
              </button>
            </form>
          </Card>
        </div>

        {cbasContext.cbasData?.data_debitur_utama && (
          <AnimatePresence mode="wait">
            <motion.div
              key={cbasContext.cbasData.data_debitur_utama.reffnumber || "X"}
              style={{ width: "100%", marginRight: "1rem" }}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
            >
              <CardDataBox>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Card>
                    <div style={{ textAlign: "center" }}>
                      <h2>Reffnumber</h2>
                      <h3>
                        <span style={{ fontFamily: "Arial" }}>
                          {cbasContext.cbasData.data_debitur_utama.reffnumber}
                        </span>
                      </h3>
                    </div>
                  </Card>
                </div>

                <div className={dataBoxStyles["cbas-data"]}>
                  <CBASDataComp
                    status="Debitur Utama"
                    cbasData={cbasContext.cbasData.data_debitur_utama}
                  />

                  {cbasContext.cbasData.data_pasangan && (
                    <CBASDataComp
                      status="Pasangan Debitur"
                      cbasData={cbasContext.cbasData.data_pasangan}
                    />
                  )}
                </div>
              </CardDataBox>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default CBASSearchIndex;
