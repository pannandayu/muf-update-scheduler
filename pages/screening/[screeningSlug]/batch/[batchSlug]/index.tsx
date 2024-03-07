import Table from "@/components/Table/Table";
import TableRow from "@/components/Table/TableRow";
import { UpdateDataCurrent } from "@/interfaces/IMonitor";
import { ThunkData } from "@/interfaces/IThunk";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getBatchDataThunk } from "@/redux/thunks";
import styles from "@/styles/Batch.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Batch: React.FC = () => {
  const router = useRouter();
  const loginSelector = useAppSelector((state) => state.auth.login);
  const dataSelector = useAppSelector((state) => state.data.current.data);
  const dispatch = useAppDispatch();

  type GetBatchDataArgs = {
    dateTime: string | undefined;
    token: string | undefined;
  };

  const getBatchData = async () => {
    try {
      const response = (await dispatch(
        getBatchDataThunk({
          dateTime: router.query.batchSlug as string,
          token: loginSelector.token,
        })
      )) as ThunkData<{ data: UpdateDataCurrent }, GetBatchDataArgs>;

      if (response.error) {
        if (
          response.meta.arg?.token === "" ||
          response.meta.arg?.dateTime === "" ||
          response.error.message
        ) {
          return router.push("/");
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getBatchData();
  }, []);

  return (
    <div className={styles.display}>
      <Table data={[dataSelector]} dataKeyFn={(data) => data.app_id} full>
        {(data) => <TableRow props={data} />}
      </Table>
      <Link href={`/screening/${router.query.screeningSlug}`}>
        <button className={styles.button} type="button">
          Back to Screening Page
        </button>
      </Link>
    </div>
  );
};

export default Batch;
