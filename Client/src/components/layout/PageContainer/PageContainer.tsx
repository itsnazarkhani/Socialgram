import type { ReactNode } from "react";
import styles from "./PageContainer.module.css";

type PageContainerProps = {
  children?: ReactNode;
  extraClassNames?: string;
  withPadding?: boolean;
};

const PageContainer = ({
  children,
  extraClassNames,
  withPadding= true,
}: PageContainerProps) => {
  return (
    <div
      className={`${styles.pageContainer} ${extraClassNames} ${withPadding ? styles.withPadding : ""}`}
    >
      {children}
    </div>
  );
};

export default PageContainer;
