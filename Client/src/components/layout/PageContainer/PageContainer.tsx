import type { ReactNode } from "react";
import styles from "./PageContainer.module.css";

type PageContainerProps = {
  children?: ReactNode;
  extraClassNames?: string;
};

const PageContainer = ({ children, extraClassNames }: PageContainerProps) => {
  return (
    <div className={`${styles.pageContainer} ${extraClassNames}`}>
      {children}
    </div>
  );
};

export default PageContainer;
