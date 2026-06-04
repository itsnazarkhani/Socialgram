import type { Ref, RefObject } from "react";

export const mergeRefs = <T>(...refs: (Ref<T> | undefined)[]) => {
  return (value: T | null) => {
    refs.forEach((ref) => {
      if (!ref) return;

      if (typeof ref === "function") ref(value);
      else (ref as RefObject<T | null>).current = value;
    });
  };
};
