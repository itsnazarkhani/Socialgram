import type { ReactNode } from "react";

export interface ContextMenuItemData {
    icon?: ReactNode;
    text: string;
    forColor?: string;
    onClick: () => void;
}