import Card from "@/wrappers/Card";
import { motion } from "framer-motion";
import styles from "@/styles/Form.module.css";
import inputStyles from "@/styles/Input.module.css";
import Input from "../Input";
import React, { useContext, useRef, useState } from "react";
import ApplicationIDSchema from "@/validations/ApplicationIDSchema";
import { ZodIssue } from "zod";
import DataContext from "@/context/data-context";
import SearchStatus from "../SearchStatus";
import MongoDataClass from "@/classes/mongo/MongoDataClass";

const errorClassName = `${inputStyles.input} ${inputStyles["input-error"]}`;

const FormMongo: React.FC<{ switchHandler: (state: boolean) => void }> = ({
  switchHandler,
}) => {
  const dataContext = useContext(DataContext);
  const [buttonDisabled, setButtonDisabled] = useState<boolean | undefined>(
    undefined
  );
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  const [errorObject, setErrorObject] = useState<{
    errorPath: string[];
    errorMessage: string[];
  } | null>(null);

  const applicationIdRef = useRef<HTMLInputElement>(null);

  const submitHandler: React.FormEventHandler = (event: React.FormEvent) => {
    event.preventDefault();

    setErrorMessage(undefined);
    dataContext.searchParametersMongoHandler([{}]);
    dataContext.searchStatusHandlerMongo(null);
    dataContext.isSearchingHandlerMongo(null);

    const inputData = {
      application_id: applicationIdRef.current?.value.trim() || "",
    };

    const validation = ApplicationIDSchema.safeParse(inputData);

    if (validation.success) {
      console.log("Data is valid ==>", validation.data);
      console.log("Sending your request!");

      dataContext.searchParametersMongoHandler([validation.data]);

      postDataHandler(validation.data);

      applicationIdRef.current!.value = "";

      setErrorObject(null);
    } else {
      const zodErrors: ZodIssue[] = validation.error.issues;

      const errorPath = zodErrors.map((e) => e.path[0].toString());
      const errorMessage = zodErrors.map((e) => e.message.toString());

      setErrorObject({ errorPath, errorMessage });
      setButtonDisabled(undefined);
    }
  };

  const postDataHandler = async (inputData: { application_id: string }) => {
    try {
      dataContext.isSearchingHandlerMongo(true);

      const requestMongo: {
        ok: boolean;
        status: number;
        statusText: string;
        json: () => Promise<any>;
      } = await fetch("/api/search-data-mongo", {
        body: JSON.stringify(inputData),
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const resultMongo: {
        notFound?: string;
        errorMessage?: string;
        data?: MongoDataClass;
      } = await requestMongo.json();

      if (requestMongo.status === 500) {
        dataContext.searchStatusHandlerMongo(false);
        setErrorMessage(resultMongo.errorMessage);
      } else if (requestMongo.status === 400) {
        dataContext.searchStatusHandlerMongo(false);
        setErrorMessage(resultMongo.notFound);
      } else {
        dataContext.searchStatusHandlerMongo(true);
        dataContext.resultDataMongoHandler({
          ...(resultMongo.data as MongoDataClass),
          form: "Mongo",
        });
      }

      dataContext.isSearchingHandlerMongo(false);
      setButtonDisabled(undefined);
    } catch (error: any) {
      console.error(error);
      setErrorMessage(
        error.message + " data. Make sure you are connected to the VPN."
      );
      dataContext.searchStatusHandlerMongo(null);
      dataContext.isSearchingHandlerMongo(null);
      setButtonDisabled(undefined);
    }
  };

  return (
    <Card>
      <form className={styles.form} onSubmit={submitHandler}>
        <Input
          labelName="Application ID :"
          idForName="application-id"
          type="text"
          className={
            errorObject?.errorPath.includes("application_id")
              ? errorClassName
              : inputStyles.input
          }
          ref={applicationIdRef}
        />
        {<p>{errorObject?.errorMessage.filter((e) => e.includes("14"))}</p>}
        <motion.button
          className={styles["submit-button"]}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          type="submit"
          disabled={buttonDisabled}
        >
          Search
        </motion.button>
        <motion.button
          className={styles["switch-button-pg"]}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          type="submit"
          disabled={buttonDisabled}
          onClick={(event: React.MouseEvent) => {
            event.preventDefault();
            switchHandler(true);
          }}
        >
          Switch
        </motion.button>
      </form>
      {dataContext.isSearchingMongo === false && (
        <SearchStatus
          searchParams={dataContext.searchParametersMongo}
          form={"Mongo"}
        />
      )}
      {errorMessage && (
        <h5 style={{ color: "red", textAlign: "center" }}>{errorMessage}</h5>
      )}
    </Card>
  );
};

export default FormMongo;
