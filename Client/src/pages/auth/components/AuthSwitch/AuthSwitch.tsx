import { Link } from "react-router-dom";
import styles from "./AuthSwitch.module.css";

type AuthSwitchProps = {
  extraClassNames?: string;
  reasonToSwitch: string;
  swtichLinkLabel: string;
  switchUrl: string;
  linkTabIndex: number;
};

const AuthSwitch = ({
  extraClassNames,
  reasonToSwitch,
  swtichLinkLabel,
  switchUrl,
  linkTabIndex,
}: AuthSwitchProps) => {
  return (
    <div className={`${styles.authSwitch} ${extraClassNames}`}>
      {reasonToSwitch}{" "}
      <Link tabIndex={linkTabIndex ?? 4} to={switchUrl}>
        {swtichLinkLabel}
      </Link>
    </div>
  );
};

export default AuthSwitch;
