import React, { Fragment, useState } from "react";
import styles from "@/styles/NavBar.module.css";
import { AnimatePresence, motion } from "framer-motion";
import NavItems from "@/components/NavItems";
import Link from "next/link";
import Image from "next/image";

const NavBar: React.FC = () => {
  const [mufLogoHovered, setMufLogoHovered] = useState<boolean>(false);

  return (
    <Fragment>
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ x: "-50" }}
          animate={{ x: 0 }}
          exit={{ x: "-50" }}
          transition={{ duration: 0.5 }}
          className={styles.sidebar}
        >
          <div className={styles["sidebar-title"]}>
            <h1 style={{ fontSize: "1.5rem" }}>SLIK Monitoring Dashboard</h1>
          </div>
          <NavItems href="/" title="MUF Search" />
          <NavItems href="/cbas-search" title="CBAS Search" />
          <NavItems href="/cbas-stats" title="CBAS Statistics" />
          <Link href="https://phabricator.muf.co.id" target="_blank">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              style={{
                width: mufLogoHovered ? "85%" : "70%",
                padding: "1rem",
                height: "auto",
                transition: "0.15s ease-in-out",
              }}
              src={"/muf.png"}
              alt="MUF Logo"
              priority={true}
              quality={75}
              onMouseEnter={() => setMufLogoHovered(true)}
              onMouseLeave={() => setMufLogoHovered(false)}
            />
          </Link>
        </motion.div>
      </AnimatePresence>
    </Fragment>
  );
};

export default NavBar;
