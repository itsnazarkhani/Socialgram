import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import { userService } from "../../services/userService";
import AuthForm from "./components/AuthForm/AuthForm";
import RegisterInputs from "./components/RegisterInputs/RegisterInputs";
import AuthContainer from "./components/AuthContainer/AuthContainer";

export default function RegisterPage() {
  const { login, isLoggedIn, isLoading } = useAuth();
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState<boolean>(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean>(false);

  const [error, setError] = useState("");

  const isFormValid =
    userName.trim() !== "" &&
    password.trim() !== "" &&
    usernameAvailable === true &&
    !checkingUsername;

  useEffect(() => {
    if (isLoading) return;
    if (isLoggedIn) navigate("/", { replace: true });
  }, [isLoggedIn, isLoading, navigate]);

  useEffect(() => {
    const u = userName.trim();
    if (!u) {
      setUsernameAvailable(false);
      return;
    }

    const t = window.setTimeout(async () => {
      try {
        setCheckingUsername(true);
        const available = await userService.checkUsernameAvailable(u);
        setUsernameAvailable(available);
      } catch (e) {
        console.error(e);
        setUsernameAvailable(false);
      } finally {
        setCheckingUsername(false);
      }
    }, 500);

    return () => clearTimeout(t);
  }, [userName]);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("Register submit fired");
    e.preventDefault();
    e.stopPropagation();

    if (!isFormValid || loading) return;

    setLoading(true);
    setError("");

    try {
      await authService.register({
        UserName: userName.trim(),
        Password: password,
      });

      const loginRes = await authService.login({
        UserName: userName.trim(),
        Password: password,
      });

      login(loginRes ?? loginRes);

      navigate("/", { replace: true });
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "ثبت‌نام ناموفق بود.";
      setError(typeof message === "string" ? message : JSON.stringify(message));
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <div>در حال بررسی وضعیت ورود...</div>;
  }

  if (isLoggedIn) return null;

  return (
    <AuthContainer>
      <AuthForm
        title="ثبت‌نام"
        handleSubmit={handleRegister}
        submitBtnTxt="ثبت‌نام"
        reasonToSwitch="حساب کاربری دارید؟"
        swtichLinkLabel="وارد شوید"
        switchUrl="/auth/login"
        error={error}
        isFormValid={isFormValid}
        loading={loading}
      >
        <RegisterInputs
          userNameTxt={userName}
          passwordTxt={password}
          setUserName={setUserName}
          setPassword={setPassword}
          isCheckingUsername={checkingUsername}
          isUserNameAvailable={usernameAvailable}
          setError={setError}
          setUsernameAvailable={setUsernameAvailable}
        />
      </AuthForm>
    </AuthContainer>
  );
}
