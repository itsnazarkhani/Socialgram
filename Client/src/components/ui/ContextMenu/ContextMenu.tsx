import type { ContextMenuItemData } from "../../../interfaces/menuInterfaces";
import type { Position2D } from "../../../types/Position2D";
import ContextMenuItem from "../ContextMenuItem/ContextMenuItem";
import styles from "./ContextMenu.module.css";

type ContextMenuProps = {
  items: ContextMenuItemData[];
  position: Position2D;
  onState: boolean;
};

const ContextMenu = ({ items, position, onState }: ContextMenuProps) => {
  return (
    <div
      className={`${styles.menu} ${onState ? styles.show : styles.hide}`}
      style={{
        ...position,
      }}
    >
      {items.map((item: ContextMenuItemData) => (
        <ContextMenuItem
          key={Math.random()}
          icon={item?.icon}
          text={item.text}
          forColor={item?.forColor}
          onClick={item.onClick}
        />
      ))}
    </div>
  );
};

export default ContextMenu;
