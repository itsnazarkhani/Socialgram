import styles from "./RegisterInputs.module.css";

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
      <div className={styles.inputWrapper}>
        <input
          tabIndex={1}
          value={userNameTxt}
          onChange={(e) => {
            setUserName(e.target.value);
            setError("");
            setUsernameAvailable(false);
          }}
          placeholder="نام کاربری"
          autoComplete="username"
        />

        {userNameTxt.trim() !== "" && (
          <div className={styles.fieldHint}>
            {isCheckingUsername ? (
              <span>در حال بررسی نام کاربری...</span>
            ) : isUserNameAvailable === true ? (
              <span className={styles.validMsg}>نام کاربری آزاد است</span>
            ) : isUserNameAvailable === false ? (
              <span className={styles.invalidMsg}>
                این نام کاربری قبلاً انتخاب شده است
              </span>
            ) : null}
          </div>
        )}
      </div>

      <div className={styles.inputWrapper}>
        <input
          tabIndex={2}
          value={passwordTxt}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          placeholder="رمز عبور"
          type="password"
          autoComplete="new-password"
        />
      </div>
    </>
  );
};

export default RegisterInputs;
