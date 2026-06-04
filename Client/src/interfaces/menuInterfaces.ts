import type { ReactNode } from "react";

export interface ContextMenuItemData {
    icon?: ReactNode;
    label: string;
    forColor?: string;
    action: () => void;
}