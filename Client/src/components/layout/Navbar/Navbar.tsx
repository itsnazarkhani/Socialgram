import { FaWpexplorer } from "react-icons/fa6";
import { useAuth } from "../../../context/AuthContext";
import styles from "./Navbar.module.css";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaUserCircle } from "react-icons/fa";
import useIsDesktop from "../../../hooks/useIsDesktop";
import { FiLogOut } from "react-icons/fi";

const Navbar: React.FC = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const isDesktop = useIsDesktop(769);

  const isActive = (path: string): string => {
    return location.pathname === path ? `${styles.active}` : "";
  };

  const handleLogoutClick = () => {
    logout();
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.linksContainer}>
        <div className={styles.linksWrapper}>
          <Link to="/" className={`${isActive("/")} ${styles.link}`}>
            <FaHome size={25} />
            {isDesktop ? <p className={styles.linkLabel}>خانه</p> : null}
          </Link>
          <Link
            to="/explore"
            className={`${isActive("/explore")} ${styles.link}`}
          >
            <FaWpexplorer size={25} />
            {isDesktop ? <p className={styles.linkLabel}>کاوش</p> : null}
          </Link>
          <Link
            to="/profile"
            className={`${isActive("/profile")} ${styles.link}`}
          >
            <FaUserCircle size={25} />
            {isDesktop ? <p className={styles.linkLabel}>پروفایل</p> : null}
          </Link>
        </div>
      </div>
      <button onClick={handleLogoutClick} className={styles.logoutBtn}>
        <FiLogOut />
        <span>خروج</span>
      </button>
    </nav>
  );
};

export default Navbar;
