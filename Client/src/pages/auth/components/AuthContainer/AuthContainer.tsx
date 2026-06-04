import { type ReactNode } from "react";
import styles from "./AuthContainer.module.css";

type AuthContainerProps = {
  children?: ReactNode;
};

const AuthContainer = ({ children }: AuthContainerProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.formCotainer}>{children}</div>
    </div>
  );
};

export default AuthContainer;
