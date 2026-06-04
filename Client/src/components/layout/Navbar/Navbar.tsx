import { useAuth } from "../../../context/AuthContext";
import styles from "./Navbar.module.css";
import { Link, useLocation } from "react-router-dom";
import useIsDesktop from "../../../hooks/useIsDesktop";
import { FiLogOut, FiSearch } from "react-icons/fi";
import { useHover } from "@uidotdev/usehooks";
import { GoHomeFill } from "react-icons/go";
import { MdExplore } from "react-icons/md";
import { IoPersonCircleOutline } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { useState } from "react";
import SearchPanel from "../../ui/SearchPanel/SearchPanel";

const Navbar: React.FC = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const isDesktop = useIsDesktop(769);
  const [ref, hovering] = useHover();

  const [toggleSearchPanel, setToggleSearchPanel] = useState<boolean>(false);

  const isActive = (path: string): string => {
    return location.pathname === path ? `${styles.active}` : "";
  };

  const handleLogoutClick = () => {
    logout();
  };

  return (
    <nav
      ref={ref}
      className={styles.navbar}
      style={{ width: isDesktop ? (hovering ? "200px" : "70px") : "100%" }}
    >
      <SearchPanel
        togglePanel={toggleSearchPanel}
        setTogglePanel={setToggleSearchPanel}
      />

      {isDesktop ? (
        <div className={styles.logoContainer}>
          <Link to="/" className={styles.logo}>
            <img
              src="./src/assets/logo.svg"
              alt="لوگو"
              className={styles.logoImage}
            />
          </Link>
        </div>
      ) : null}

      <div className={styles.linksContainer}>
        <div className={styles.linksWrapper}>
          <Link to="/" className={`${isActive("/")} ${styles.link}`}>
            <GoHomeFill size={25} />
            {isDesktop && hovering ? (
              <p className={styles.linkLabel}>خانه</p>
            ) : null}
          </Link>

          <button
            className={`${styles.link} ${styles.navBtn}`}
            onClick={() => setToggleSearchPanel(true)}
          >
            <FiSearch size={25} />
            {isDesktop && hovering ? (
              <p className={styles.linkLabel}>جستجو</p>
            ) : null}
          </button>

          <Link
            to="/post/new"
            className={`${isActive("/post/new")} ${styles.link} ${styles.navBtn}`}
          >
            <FaPlus size={25} />
            {isDesktop && hovering ? (
              <p className={styles.linkLabel}>ایجاد</p>
            ) : null}
          </Link>

          <Link
            to="/explore"
            className={`${isActive("/explore")} ${styles.link}`}
          >
            <MdExplore size={25} />
            {isDesktop && hovering ? (
              <p className={styles.linkLabel}>کاوش</p>
            ) : null}
          </Link>
          <Link
            to="/profile"
            className={`${isActive("/profile")} ${styles.link}`}
          >
            <IoPersonCircleOutline size={25} />
            {isDesktop && hovering ? (
              <p className={styles.linkLabel}>پروفایل</p>
            ) : null}
          </Link>
        </div>
      </div>

      <button onClick={handleLogoutClick} className={styles.logoutBtn}>
        <FiLogOut />
        {isDesktop && hovering ? (
          <p className={styles.linkLabel}>خروج</p>
        ) : null}
      </button>
    </nav>
  );
};

export default Navbar;
