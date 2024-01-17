import styles from "@/styles/NavItems.module.css";
import ModalCard from "@/wrappers/Modal";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";

const NavItems: React.FC<{ title: string; href: string }> = ({
  title,
  href,
}) => {
  const router = useRouter();

  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [clickCount, setClickCount] = useState(0);
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    if (router.asPath === href) {
      setIsNavigating(false);
      setClickCount(0);
    }
  }, [router.asPath]);

  return (
    <Fragment>
      <Link
        href={href}
        className={`${styles["nav-item"]} ${
          router.asPath === href ? styles.active : ""
        }`}
        onClick={() => {
          const timer = setTimeout(() => setIsNavigating(true), 500);
          setClickCount((prev) => prev + 1);
          return () => clearTimeout(timer);
        }}
      >
        {title}
      </Link>
      {router.asPath !== href && isNavigating && clickCount === 1 && (
        <ModalCard isOpen={showModal} onClose={() => setShowModal(false)}>
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: [1, 1.1, 1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <h1>Now Loading...</h1>
          </motion.div>
        </ModalCard>
      )}
    </Fragment>
  );
};

export default NavItems;
