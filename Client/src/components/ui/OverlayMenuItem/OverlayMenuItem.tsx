import type { ReactNode } from "react";
import styles from "./OverlayMenuItem.module.css";

type OverlayMenuItemProps = {
  icon?: ReactNode;
  label: string;
  forColor?: string;
  action: () => void;
};

const OverlayMenuItem = ({
  icon,
  label,
  forColor,
  action: onClick,
}: OverlayMenuItemProps) => {
  const style = {
    color: forColor,
  };

  return (
    <div className={styles.item} style={style} onClick={onClick}>
      <span className={styles.icon}>{icon}</span>
      <p className={styles.text}>{label}</p>
    </div>
  );
};

export default OverlayMenuItem;
