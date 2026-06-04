import type { ReactNode } from "react";
import styles from "./ContextMenuItem.module.css";

type ContextMenuItemProps = {
  icon?: ReactNode;
  text: string;
  forColor?: string;
  onClick: () => void;
};

const ContextMenuItem = ({
  icon,
  text,
  forColor,
  onClick,
}: ContextMenuItemProps) => {
  const style = {
    color: forColor,
  };

  return (
    <div className={styles.item} style={style} onClick={onClick}>
      <span className={styles.icon}>{icon}</span>
      <p className={styles.text}>{text}</p>
    </div>
  );
};

export default ContextMenuItem;
