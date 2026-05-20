import React from "react";
import { motion } from "framer-motion";

interface StaggerContainerProps {
  children: React.ReactNode;
  staggerChildren?: number;
  delayChildren?: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: (props: { staggerChildren?: number; delayChildren?: number }) => ({
    opacity: 1,
    transition: {
      staggerChildren: props.staggerChildren || 0.1,
      delayChildren: props.delayChildren || 0,
    },
  }),
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  staggerChildren,
  delayChildren,
}) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={containerVariants}
    custom={{ staggerChildren, delayChildren }}
  >
    {children}
  </motion.div>
);

export const StaggerItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div variants={itemVariants}>{children}</motion.div>
);
