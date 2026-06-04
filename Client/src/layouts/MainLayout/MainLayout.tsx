import { Outlet } from "react-router-dom";
import styles from "./MainLayout.module.css";
import Navbar from "../../components/layout/Navbar/Navbar";
import TopBar from "../../components/layout/TopBar/TopBar";

function Layout() {
  return (
    <div className={styles.container}>
      <header className={styles.topbar}>
        <TopBar />
      </header>
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
