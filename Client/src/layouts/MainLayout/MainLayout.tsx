import { Outlet } from "react-router-dom";
import styles from "./MainLayout.module.css";
import Navbar from "../../components/layout/Navbar/Navbar";

function Layout() {
  return (
    <div className={styles.container}>
      <div className={styles.mainContainer}>
        <main className={styles.content}>
          <Outlet />
        </main>
        <nav className={styles.navbar}>
          <Navbar />
        </nav>
      </div>
    </div>
  );
}

export default Layout;
