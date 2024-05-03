import { LogData } from "@/interfaces/IData";
import styles from "@/styles/Table.module.css";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

const Table: React.FC<{
  data: { logs: LogData[] };
}> = ({ data }) => {
  const router = useRouter();

  const handleGetSingleBatch = (
    batch: number,
    date: string,
    category?: string
  ) => {
    router.push(
      `${router.asPath}/update-info?batch=${batch}&date=${date}${
        category ? `&category=${category}` : ""
      }`
    );
  };

  return (
    <div className={styles.table}>
      {data.logs.map((el, _) => {
        return (
          <div
            className={styles["table-content"]}
            key={el.batch + `${el.category && `_${el.category}`}`}
          >
            <motion.h3
              whileHover={{ cursor: "pointer", scale: 1.1 }}
              onClick={() =>
                handleGetSingleBatch(el.batch!, el.date!, el.category)
              }
            >
              Batch {el.batch}
            </motion.h3>
            <h3>
              {el.category &&
                el.category.charAt(0).toUpperCase() + el.category?.slice(1)}
            </h3>
          </div>
        );
      })}
    </div>
  );
};

export default Table;
