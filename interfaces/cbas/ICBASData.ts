interface ICBASData {
  data_debitur_utama?: {
    createdate: string;
    cust_name: string;
    dob: string | null;
    exportsif_date: string | null;
    reffnumber: string;
    searching_result: string | null;
    vip_code: string | null;
  };
  data_pasangan?: {
    createdate: string;
    cust_name: string;
    dob: string | null;
    exportsif_date: string | null;
    reffnumber: string;
    searching_result: string | null;
    vip_code: string | null;
  };
}

export default ICBASData;
