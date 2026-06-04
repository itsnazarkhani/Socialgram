import { Outlet } from "react-router-dom";
import styles from "./ErrorLayout.module.css";

const ErrorLayout = () => {
  return (
    <main className={styles.contnet}>
      <Outlet />
    </main>
  );
};

export default ErrorLayout;
