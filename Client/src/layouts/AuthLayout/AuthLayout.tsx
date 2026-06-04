import { Outlet } from "react-router-dom";
import styles from "./AuthLayout.module.css";

const AuthLayout = () => {
  return (
    <main className={styles.contnet}>
      <Outlet />
    </main>
  );
};

export default AuthLayout;
