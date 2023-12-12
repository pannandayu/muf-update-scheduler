import MongoDataInterface from "@/interfaces/mongo/MongoDataInterface";

class MongoDataClass implements MongoDataInterface {
  form: string = "";
  order_id: string = "";
  application_id: string = "";
  order_created_date: string = "";
  customer_name: string = "";
  grading_slik: string = "";
  grading_slik_pasangan: string = "";
  aggregate_slik_perorangan: string = "";
  current_form_desc: string = "";
  approval_level: number = 0;
  approval_flag: string = "";
  approval_last_status: string = "";
  approval_surveyor: string = "";
  detail = {
    debitur: {
      personal: {
        debitur_no_ktp: "",
        debitur_nama_sesuai_ktp: "",
        debitur_tanggal_lahir: "",
        debitur_jenis_kelamin: "",
        debitur_status_perkawinan: "",
        spouse: {
          spouse_ktp_no: "",
          spouse_ktp_name: "",
          spouse_date_of_birth: "",
        },
      },
    },
  };
  scoring = {
    credit_scoring: "",
    total_scoring: 0,
  };
  scoring_dukcapil: string = "";
  scoring_dukcapil_pasangan: string = "";
  aggregate_slik_perorangan_brms?: string = "";
  last_approval_date?: string = "";
  slik? = {
    idRequestcbas: "",
    idPencariancbas: "",
    idPermintaanSlik: "",
    kodeRefPenggunaan: "",
    kodeljkPermintaan: "",
    nikDebitur: "",
    namaDebitur: "",
    tanggalPermintaan: "",
    kategoriDebitur: "",
    color: "",
  };
}

export default MongoDataClass;
