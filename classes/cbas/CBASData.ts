import ICBASData from "@/interfaces/cbas/ICBASData";

class CBASData implements ICBASData {
  data_debitur_utama?:
    | {
        createdate: "";
        cust_name: "";
        dob: null;
        exportsif_date: null;
        reffnumber: "";
        searching_result: null;
        vip_code: null;
      }
    | undefined;
  data_pasangan?:
    | {
        createdate: "";
        cust_name: "";
        dob: null;
        exportsif_date: null;
        reffnumber: "";
        searching_result: null;
        vip_code: null;
      }
    | undefined;
}

export default CBASData;
