import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
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
      <FloatLabel className={styles.inputWrapper}>
        <InputText
          tabIndex={1}
          id="username"
          value={userNameTxt}
          onChange={(e) => setUserName(e.target.value)}
        />
        <label htmlFor="username">نام کاربری</label>
      </FloatLabel>

      <FloatLabel className={styles.inputWrapper}>
        <InputText
          tabIndex={2}
          id="password"
          value={passwordTxt}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="password">رمز عبور</label>
      </FloatLabel>
    </>
  );
};

export default LoginInputs;
