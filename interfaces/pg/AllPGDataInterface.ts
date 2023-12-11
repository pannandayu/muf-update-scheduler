import SLIKRequestAttemptPGnterface from "@/interfaces/pg/SLIKRequestAttemptPGInterface";
import MaritalStatusAndSpousePGInterface from "@/interfaces/pg/MaritalStatusAndSpousePGInterface";
import PersonalInfoPGInterface from "@/interfaces/pg/PersonalInfoPGInterface";
import GradingResultPGInterface from "./GradingResultPGInterface";

interface AllPGDataInterface {
  form: string;
  lastRequestLevel: {
    lastRequestLevelDebiturUtama: string;
    lastRequestLevelPasangan: string;
  };
  personalInfo: PersonalInfoPGInterface;
  spouseInfo: MaritalStatusAndSpousePGInterface;
  slikResponseLog: SLIKRequestAttemptPGnterface[];
  screeningResults: GradingResultPGInterface;
  mongoAdditionalData: {
    aggregateBrms: string;
    currentFormDesc: string;
  };
}

export default AllPGDataInterface;
