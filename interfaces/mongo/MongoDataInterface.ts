interface MongoDataInterface {
  form: string;
  order_id: string;
  application_id: string;
  order_created_date: string;
  customer_name: string;
  grading_slik: string;
  grading_slik_pasangan: string;
  current_form_desc: string;
  approval_level: number;
  approval_flag: string;
  approval_last_status: string;
  approval_surveyor: string;
  detail: {
    debitur: {
      personal: {
        debitur_no_ktp: string;
        debitur_nama_sesuai_ktp: string;
        debitur_tanggal_lahir: string;
        debitur_jenis_kelamin: string;
        debitur_status_perkawinan: string;
        spouse: {
          spouse_ktp_no: string;
          spouse_ktp_name: string;
          spouse_date_of_birth: string;
        };
      };
    };
  };
  scoring: {
    credit_scoring: string;
    total_scoring: number;
  };
  scoring_dukcapil: string;
  scoring_dukcapil_pasangan: string;
  aggregate_slik_perorangan_brms?: string;
  last_approval_date?: string;
  slik?: {
    idRequestcbas: string;
    idPencariancbas: string;
    idPermintaanSlik: string;
    kodeRefPenggunaan: string;
    kodeljkPermintaan: string;
    nikDebitur: string;
    namaDebitur: string;
    tanggalPermintaan: string;
    kategoriDebitur: string;
    color: string;
  };
}

export default MongoDataInterface;
