import { Outlet } from "react-router-dom";
import styles from "./MainLayout.module.css";
import Navbar from "../../components/layout/Navbar/Navbar";

function Layout() {
  return (
    <div className={styles.container}>
        <main className={styles.content}>
          <Outlet />
        </main>
        <nav className={styles.navbar}>
          <Navbar />
        </nav>
    </div>
  );
}

export default Layout;
