import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useContext,
  useRef,
  useState,
} from "react";
import Input from "../Input";
import inputStyles from "@/styles/Input.module.css";
import styles from "@/styles/Form.module.css";
import { AnimatePresence, motion } from "framer-motion";
import DataContext from "@/context/data-context";
import ApplicationIDSchema from "@/validations/ApplicationIDSchema";
import { ZodIssue } from "zod";
import InputDataInterface from "@/interfaces/InputDataInterface";

const InputPGSearchByApplicationID: React.FC<{
  onPostData: (data: InputDataInterface) => void;
  onResetErrorSearchStatus: Dispatch<SetStateAction<string | undefined>>;
}> = ({ onPostData, onResetErrorSearchStatus }) => {
  const dataContext = useContext(DataContext);
  const [buttonDisabled, setButtonDisabled] = useState<boolean | undefined>(
    undefined
  );
  const [errorObject, setErrorObject] = useState<{
    errorPath: string[];
    errorMessage: string[];
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );

  const applicationIDRef = useRef<HTMLInputElement>(null);

  const applicationIDSubmitHandler: React.FormEventHandler = async (
    event: FormEvent
  ) => {
    event.preventDefault();
    onResetErrorSearchStatus(undefined);

    setButtonDisabled(true);
    dataContext.searchParametersPGHandler([{}]);
    dataContext.searchStatusHandlerPG(null);
    dataContext.isSearchingHandlerPG(null);

    const validation = ApplicationIDSchema.safeParse({
      application_id: applicationIDRef.current?.value.trim() || "",
    });

    if (validation.success) {
      setErrorMessage(undefined);
      setErrorObject(null);
      applicationIDRef.current!.value = "";
      dataContext.searchParametersPGHandler([validation.data]);
      searchRefData(validation.data);
    } else {
      const zodErrors: ZodIssue[] = validation.error.issues;

      const errorPath = zodErrors.map((e) => e.path[0].toString());
      const errorMessage = zodErrors.map((e) => e.message.toString());

      setErrorObject({ errorPath, errorMessage });
      setButtonDisabled(undefined);
    }
  };

  const searchRefData = async (data: {
    application_id: string;
  }): Promise<void> => {
    try {
      dataContext.isSearchingHandlerPG(true);

      const requestRef: {
        ok: boolean;
        status: number;
        statusText: string;
        json: () => Promise<any>;
      } = await fetch("/api/search-data-pg-application-id", {
        body: JSON.stringify(data),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseRef: {
        message?: string;
        application_no: string;
      } = await requestRef.json();

      if (
        !requestRef.ok ||
        requestRef.status !== 200 ||
        requestRef.statusText !== "OK"
      ) {
        throw new Error(responseRef.message);
      } else {
        onPostData({
          application_no: responseRef.application_no,
          app_id: "",
          nama_nasabah: "",
          no_ktp: "",
        });
      }
      setButtonDisabled(undefined);
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message);
      dataContext.searchStatusHandlerPG(false);
      dataContext.isSearchingHandlerPG(false);
      setButtonDisabled(undefined);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.form
        key={"searchByApplicationID"}
        onSubmit={applicationIDSubmitHandler}
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.2 }}
        className={styles.form}
        style={{
          alignItems: "center",
          alignContent: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Input
          labelName="Application ID"
          idForName="application-id"
          type="text"
          className={
            errorObject?.errorPath.includes("application_id")
              ? `${inputStyles.input} ${inputStyles["input-error"]}`
              : inputStyles.input
          }
          ref={applicationIDRef}
        />
        {
          <p style={{ textAlign: "center" }}>
            {errorObject?.errorMessage.filter((e) => e.includes("14"))}
          </p>
        }
        {errorMessage ? (
          <p style={{ textAlign: "center" }}>{errorMessage}</p>
        ) : (
          ""
        )}
        <motion.button
          className={styles["submit-button"]}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          type="submit"
          style={{ fontSize: "0.8rem", marginTop: "0" }}
          disabled={buttonDisabled}
        >
          Search by Application ID
        </motion.button>
      </motion.form>
    </AnimatePresence>
  );
};

export default InputPGSearchByApplicationID;
