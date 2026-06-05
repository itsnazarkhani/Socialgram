import { FloatLabel } from "primereact/floatlabel";
import styles from "./RegisterInputs.module.css";
import { InputText } from "primereact/inputtext";

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
            placeholder=" "
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
                <p>در حال بررسی نام کاربری...</p>
              ) : isUserNameAvailable === true ? (
                <p className={styles.validMsg}>نام کاربری آزاد است.</p>
              ) : isUserNameAvailable === false ? (
                <p className={styles.invalidMsg}>
                  این نام کاربری قبلاً انتخاب شده است.
                </p>
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
          placeholder=" "
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
