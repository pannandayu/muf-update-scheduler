import React, { ReactNode } from "react";
import styles from '@/styles/Box.module.css'

const Box: React.FC<{ children?: ReactNode }> = ({ children }) => {
  return <div className={styles.box}>{children}</div>;
};

export default Box;
