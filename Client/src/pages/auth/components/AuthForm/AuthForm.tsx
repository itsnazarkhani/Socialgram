import { type ReactNode } from "react";
import styles from "./AuthForm.module.css";
import OrSeperator from "../../../../components/ui/OrSeperator/OrSeperator";
import AuthSwitch from "../AuthSwitch/AuthSwitch";

type AuthFormProps = {
  title?: string;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children?: ReactNode;
  submitBtnTxt?: string;
  loading?: boolean;
  isFormValid?: boolean;
  error: string | null;
  reasonToSwitch: string;
  swtichLinkLabel: string;
  switchUrl: string;
};
const AuthForm = ({
  title,
  handleSubmit,
  children,
  submitBtnTxt,
  loading,
  isFormValid,
  error,
  reasonToSwitch,
  swtichLinkLabel,
  switchUrl,
}: AuthFormProps) => {
  return (
    <form tabIndex={0} className={styles.authForm} onSubmit={handleSubmit}>
      <h2>{title ? title : "احراز هویت"}</h2>

      {children}

      <button tabIndex={3} disabled={!isFormValid || loading} type="submit">
        {loading
          ? `در حال ${submitBtnTxt}...`
          : submitBtnTxt
            ? submitBtnTxt
            : "احراز هویت"}
      </button>

      {error && <div className={styles.error}>{error}</div>}

      <OrSeperator />

      <AuthSwitch
        extraClassNames={styles.authSwitchComponent}
        reasonToSwitch={reasonToSwitch}
        swtichLinkLabel={swtichLinkLabel}
        switchUrl={switchUrl}
        linkTabIndex={4}
      />
    </form>
  );
};

export default AuthForm;
