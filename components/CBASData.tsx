const CBASData: React.FC<{
  status: string;
  cbasData: {
    createdate: string;
    cust_name: string;
    dob: string | null;
    exportsif_date: string | null;
    reffnumber: string;
    searching_result: string | null;
    vip_code: string | null;
  };
}> = ({ status, cbasData }) => {

  

  const underline = (
    <div
      style={{
        backgroundColor: "black",
        height: "1px",
      }}
    ></div>
  );

  return (
    <div
      style={{
        textAlign: "center",
        border: "1px solid grey",
        marginTop: "1rem",
        borderRadius: "10px",
        padding: "0 1rem 0 1rem",
      }}
    >
      <h2>{status}</h2>
      {underline}
      <h3>
        Cust. Name {" -> "} <span>{cbasData.cust_name}</span>
      </h3>
      <h3>
        Created Date {" -> "}
        <span>
          {new Date(cbasData.createdate).toDateString() +
            " - " +
            new Date(cbasData.createdate).toLocaleTimeString()}
        </span>
      </h3>
      <h3>
        DoB {" -> "}
        <span>
          {cbasData.dob
            ? new Date(cbasData.dob).toDateString()
            : "Not available."}
        </span>
      </h3>
      <h3>
        Exportsif Date {" -> "} <span>{cbasData.exportsif_date || "NULL"}</span>
      </h3>
      <h3>
        Searching Result {" -> "} <span>{cbasData.searching_result}</span>
      </h3>
      <h3>
        VIP Code {" -> "} <span>{cbasData.vip_code || "NULL"}</span>
      </h3>
    </div>
  );
};

export default CBASData;
