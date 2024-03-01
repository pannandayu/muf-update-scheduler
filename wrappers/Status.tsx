import { Fragment, ReactNode } from "react";

const Status: React.FC<{ children?: ReactNode }> = ({ children }) => {
  return (
    <Fragment>
      <br />
      <div
        style={{
          textAlign: "center",
          border: "1px solid gray",
          borderRadius: "10px",
        }}
      >
        {children}
      </div>
    </Fragment>
  );
};

export default Status;
