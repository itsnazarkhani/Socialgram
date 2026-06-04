import styles from "./LoginInputs.module.css";

type LoginInputsProps = {
  userNameTxt: string;
  passwordTxt: string;
  setUserName: (usr: string) => void;
  setPassword: (pss: string) => void;
};

const LoginInputs = ({
  userNameTxt,
  passwordTxt,
  setUserName,
  setPassword,
}: LoginInputsProps) => {
  return (
    <>
      <div className={styles.inputWrapper}>
        <input
          tabIndex={1}
          value={userNameTxt}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="نام کاربری"
        />
      </div>

      <div className={styles.inputWrapper}>
        <input
          tabIndex={2}
          type="password"
          value={passwordTxt}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="رمز عبور"
        />
      </div>
    </>
  );
};

export default LoginInputs;
