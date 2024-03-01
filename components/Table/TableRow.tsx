import { UpdateDataProps } from "@/interfaces/IMonitor";
import { Fragment } from "react";

const TableRow: React.FC<{
  props: UpdateDataProps;
}> = ({ props }) => {
  const { request_id, app_id, application_no } = props;

  return (
    <Fragment>
      <td>{request_id}</td>
      <td>{app_id}</td>
      <td>{application_no}</td>
    </Fragment>
  );
};

export default TableRow;
