import { FloatLabel } from "primereact/floatlabel";
import styles from "./RegisterInputs.module.css";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";

type RegisterInputsProps = {
  userNameTxt: string;
  passwordTxt: string;
  setUserName: (usr: string) => void;
  setPassword: (pss: string) => void;
  setError: (err: string) => void;
  setUsernameAvailable: (avl: boolean) => void;
  isUserNameAvailable: boolean;
  isCheckingUsername: boolean;
};

const RegisterInputs = ({
  userNameTxt,
  passwordTxt,
  setUserName,
  setPassword,
  setError,
  setUsernameAvailable,
  isUserNameAvailable,
  isCheckingUsername,
}: RegisterInputsProps) => {
  return (
    <>
      <div className={styles.userNameWrapper}>
        <FloatLabel className={styles.inputWrapper}>
          <InputText
            tabIndex={1}
            id="username"
            value={userNameTxt}
            autoComplete="username"
            onChange={(e) => {
              setUserName(e.target.value);
              setError("");
              setUsernameAvailable(false);
            }}
          />
          <label htmlFor="username">نام کاربری</label>
          {userNameTxt.trim() !== "" && (
            <div className={styles.fieldHint}>
              {isCheckingUsername ? (
                <Message severity="info" text="در حال بررسی نام کاربری..." />
              ) : isUserNameAvailable === true ? (
                <Message
                  className={styles.validMsg}
                  severity="success"
                  text="نام کاربری آزاد است."
                />
              ) : isUserNameAvailable === false ? (
                <Message
                  className={styles.invalidMsg}
                  severity="error"
                  text="این نام کاربری قبلاً انتخاب شده است."
                />
              ) : null}
            </div>
          )}
        </FloatLabel>
      </div>

      <FloatLabel className={styles.inputWrapper}>
        <InputText
          tabIndex={2}
          id="password"
          value={passwordTxt}
          type="password"
          autoComplete="new-password"
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
        />
        <label htmlFor="password">رمز عبور</label>
      </FloatLabel>
    </>
  );
};

export default RegisterInputs;
