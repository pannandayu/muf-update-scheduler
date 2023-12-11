import { useContext, useRef, useState } from "react";
import Input from "../Input";
import styles from "@/styles/Form.module.css";
import inputStyles from "@/styles/Input.module.css";
import { motion } from "framer-motion";
import InputDataPGSchema from "@/validations/InputDataPGSchema";
import InputDataInterface from "@/interfaces/InputDataInterface";
import { ZodIssue } from "zod";
import Card from "@/wrappers/Card";
import DataContext from "@/context/data-context";
import SearchStatus from "../SearchStatus";
import PersonalInfoPGInterface from "@/interfaces/pg/PersonalInfoPGInterface";
import GradingResultPGInterface from "@/interfaces/pg/GradingResultPGInterface";
import SLIKRequestAttemptPGnterface from "@/interfaces/pg/SLIKRequestAttemptPGInterface";
import MaritalStatusAndSpousePGInterface from "@/interfaces/pg/MaritalStatusAndSpousePGInterface";
import InputPGSearchByApplicationID from "./InputPGSearchByApplicationID";
import MongoDataClass from "@/classes/mongo/MongoDataClass";

const errorClassName = `${inputStyles.input} ${inputStyles["input-error"]}`;

const FormPG: React.FC<{ switchHandler: (state: boolean) => void }> = ({
  switchHandler,
}) => {
  const dataContext = useContext(DataContext);
  const [buttonDisabled, setButtonDisabled] = useState<boolean | undefined>(
    undefined
  );
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  const [buttonSearchByApplicationID, setButtonSearchByApplicationID] =
    useState<boolean>(false);
  const [errorObject, setErrorObject] = useState<{
    errorPath: string[];
    errorMessage: string[];
  } | null>(null);

  const orderIdRef = useRef<HTMLInputElement>(null);
  const appIdRef = useRef<HTMLInputElement>(null);
  const namaDebiturRef = useRef<HTMLInputElement>(null);
  const noKtpRef = useRef<HTMLInputElement>(null);

  const submitHandler: React.FormEventHandler = (event: React.FormEvent) => {
    event.preventDefault();

    setButtonDisabled(true);
    setErrorMessage(undefined);
    dataContext.searchParametersPGHandler([{}]);
    dataContext.searchStatusHandlerPG(null);
    dataContext.isSearchingHandlerPG(null);

    const inputData = getInputData();

    const validation = InputDataPGSchema.safeParse(inputData);

    if (validation.success) {
      const searchParameters = getSearchParameters(inputData);
      dataContext.searchParametersPGHandler(searchParameters);

      console.log("Data is valid ==>", validation.data);
      console.log("Sending your request!");

      postDataHandler(validation.data);

      orderIdRef.current!.value = "";
      appIdRef.current!.value = "";
      namaDebiturRef.current!.value = "";
      noKtpRef.current!.value = "";

      setErrorObject(null);
    } else {
      const zodErrors: ZodIssue[] = validation.error.issues;

      const errorPath = zodErrors.map((e) => e.path[0].toString());
      const errorMessage = zodErrors.map((e) => e.message.toString());

      setErrorObject({ errorPath, errorMessage });
      setButtonDisabled(undefined);
    }
  };

  const getSearchParameters = (
    inputData: InputDataInterface
  ): { [key: string]: string | undefined }[] => {
    let paramListBuffer = [];
    for (const key in inputData) {
      if (inputData[key as keyof InputDataInterface] !== "") {
        let param = {
          [key]: inputData[key as keyof InputDataInterface],
        };
        paramListBuffer.push(param);
      }
    }
    return paramListBuffer;
  };

  const getInputData = (): InputDataInterface => {
    const orderId = orderIdRef.current?.value.trim() || "";
    const appId = appIdRef.current?.value.trim() || "";
    const namaDebitur = namaDebiturRef.current?.value.trim() || "";
    const noKtp = noKtpRef.current?.value.trim() || "";

    return {
      application_no: orderId,
      app_id: appId,
      nama_nasabah: namaDebitur,
      no_ktp: noKtp,
    };
  };

  const postDataHandler = async (
    inputData: InputDataInterface
  ): Promise<void> => {
    try {
      dataContext.isSearchingHandlerPG(true);
      setErrorMessage(undefined);

      const requestPG: {
        ok: boolean;
        status: number;
        statusText: string;
        json: () => Promise<any>;
      } = await fetch("/api/search-data-pg", {
        body: JSON.stringify(inputData),
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const responsePG: {
        noParams: string;
        message: string;
        lastRequestLevel: {
          lastRequestLevelDebiturUtama: string;
          lastRequestLevelPasangan: string;
        };
        personalInfo: PersonalInfoPGInterface;
        spouseInfo: MaritalStatusAndSpousePGInterface;
        slikResponseLog: SLIKRequestAttemptPGnterface[];
        screeningResults: GradingResultPGInterface;
      } = await requestPG.json();

      if (responsePG.noParams) {
        dataContext.searchStatusHandlerPG(false);
        dataContext.searchParametersPGHandler([responsePG]);
      } else if (
        responsePG.message ||
        requestPG.status !== 200 ||
        requestPG.statusText !== "OK"
      ) {
        dataContext.searchStatusHandlerPG(false);
        setErrorMessage(responsePG.message);
      } else {
        const requestMongo: {
          ok: boolean;
          status: number;
          statusText: string;
          json: () => Promise<any>;
        } = await fetch("/api/search-data-mongo", {
          body: JSON.stringify({
            order_id: responsePG.personalInfo.application_no,
          }),
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        const responseMongo: {
          notFound?: string;
          errorMessage?: string;
          data?: MongoDataClass;
        } = await requestMongo.json();

        const mongoAdditionalData = {
          aggregateBrms:
            responseMongo.data?.aggregate_slik_perorangan_brms ||
            "Not yet available.",
          currentFormDesc:
            responseMongo.data?.current_form_desc || "Not yet available.",
        };

        dataContext.searchStatusHandlerPG(true);
        dataContext.resultDataPGHandler({
          form: "PG",
          ...responsePG,
          mongoAdditionalData,
        });
      }

      dataContext.isSearchingHandlerPG(false);
      setButtonDisabled(undefined);
    } catch (error: any) {
      console.error(error);
      setErrorMessage(
        error.message + " data. Make sure you are connected to the VPN."
      );
      dataContext.searchStatusHandlerPG(false);
      dataContext.isSearchingHandlerPG(false);
      setButtonDisabled(undefined);
    }
  };

  return (
    <Card>
      <form className={styles.form} onSubmit={submitHandler}>
        <Input
          labelName="Order ID :"
          idForName="application-no"
          type="text"
          className={
            errorObject?.errorPath.includes("application_no")
              ? errorClassName
              : inputStyles.input
          }
          ref={orderIdRef}
        />
        {
          <p>
            {errorObject?.errorMessage.filter((e) => e.includes("Order ID"))}
          </p>
        }

        <Input
          labelName="App ID :"
          idForName="app-id"
          type="text"
          className={
            errorObject?.errorPath.includes("app_id")
              ? errorClassName
              : inputStyles.input
          }
          ref={appIdRef}
        />
        {<p>{errorObject?.errorMessage.filter((e) => e.includes("App ID"))}</p>}

        <Input
          labelName="Nama Nasabah :"
          idForName="nama-nasabah"
          type="text"
          className={
            errorObject?.errorPath.includes("nama_nasabah")
              ? errorClassName
              : inputStyles.input
          }
          ref={namaDebiturRef}
        />
        {<p>{errorObject?.errorMessage.filter((e) => e.includes("Kindly"))}</p>}

        <Input
          labelName="No. KTP :"
          idForName="no-ktp"
          type="text"
          className={
            errorObject?.errorPath.includes("no_ktp")
              ? errorClassName
              : inputStyles.input
          }
          ref={noKtpRef}
        />
        {
          <p>
            {errorObject?.errorMessage.filter((e) => e.includes("No. KTP"))}
          </p>
        }
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
          className={styles["switch-button-mongo"]}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          type="submit"
          onClick={(event: React.MouseEvent) => {
            event.preventDefault();
            switchHandler(false);
          }}
        >
          Switch
        </motion.button>
      </form>

      <div
        onClick={() =>
          setButtonSearchByApplicationID((prevState) => !prevState)
        }
        className={styles["title-application-id"]}
      >
        <hr style={{ marginTop: "20px" }} />
        <h5>
          Or give me the <span>Application ID.</span>
        </h5>
      </div>
      {buttonSearchByApplicationID && (
        <InputPGSearchByApplicationID
          onPostData={postDataHandler}
          onResetErrorSearchStatus={setErrorMessage}
        />
      )}

      {dataContext.isSearchingPG === false && (
        <SearchStatus
          searchParams={dataContext.searchParametersPG}
          form={"PG"}
        />
      )}
      {errorMessage && (
        <h4 style={{ color: "red", textAlign: "center" }}>{errorMessage}</h4>
      )}
    </Card>
  );
};

export default FormPG;
