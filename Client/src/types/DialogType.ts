import type { ReactNode } from "react";
import type { ButtonType } from "./ButtonType";

export type DialogType = {
  title?: string;
  children?: ReactNode;
  buttons?: ButtonType[];
};
