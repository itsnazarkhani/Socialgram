import { useEffect, useState } from "react";

const DESKTOP_BREAKPOINT = 769;

function useIsDesktop(breakpoint = DESKTOP_BREAKPOINT) {
    const [isDesktop, setIsDesktop] = useState(() =>
        typeof window !== "undefined" ? window.innerWidth >= breakpoint : false
    );

    useEffect(() => {
        const onResize = () => setIsDesktop(window.innerWidth >= breakpoint);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [breakpoint]);

    return isDesktop;
}

export default useIsDesktop;