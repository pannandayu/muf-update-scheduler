import DataContext from "@/context/data-context";
import styles from "@/styles/SearchParameters.module.css";
import { AnimatePresence, motion } from "framer-motion";
import { Fragment, useContext } from "react";

const SearchParameters: React.FC<{ form: string }> = ({ form }) => {
  const dataContext = useContext(DataContext);
  const searchParameters =
    form === "PG"
      ? dataContext.searchParametersPG
      : dataContext.searchParametersMongo;

  return (
    <Fragment>
      <AnimatePresence>
        <motion.div
          className={styles["search-parameters-list"]}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{
            type: "spring",
            stiffness: 250,
            damping: 20,
            delay: 0.5,
          }}
        >
          <motion.h2
            animate={{
              opacity: [0, 1, 0],
              transition: { duration: 1, repeat: Infinity },
            }}
          >
            Please wait. Now searching...
          </motion.h2>
          <h4>
            <b>Parameter(s):</b>
          </h4>
          {searchParameters &&
            searchParameters.map((item, index) => {
              return (
                <h4 key={Object.keys(item)[0]}>{`• ${joinParam(
                  Object.keys(item)[0]
                )} = ${Object.values(item)[0]}`}</h4>
              );
            })}
        </motion.div>
      </AnimatePresence>
    </Fragment>
  );
};

const joinParam = (word: string): string => {
  if (!word.includes("_")) {
    return "not available";
  }

  const splittedWord = word.split("_");
  const capitalWordFront = splittedWord[0][0].toUpperCase();
  const capitalWordBack = splittedWord[1][0].toUpperCase();

  return capitalWordFront
    .concat(splittedWord[0].slice(1, splittedWord[0].length))
    .concat(" ")
    .concat(capitalWordBack)
    .concat(splittedWord[1].slice(1, splittedWord[1].length));
};

export default SearchParameters;
