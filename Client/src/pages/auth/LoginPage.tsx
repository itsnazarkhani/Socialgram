import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import type { LoginDto, ResponseTokenDto } from "../../dtos/authDtos";
import { useNavigate } from "react-router-dom";
import AuthForm from "./components/AuthForm/AuthForm";
import LoginInputs from "./components/LoginInputs/LoginInputs";
import AuthContainer from "./components/AuthContainer/AuthContainer";

export default function LoginPage() {
  const { login, isLoggedIn, isLoading } = useAuth();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token: ResponseTokenDto = await authService.login({
        UserName: userName,
        Password: password,
      } satisfies LoginDto);

      login(token);
      navigate("/", { replace: true });
    } catch (err: any) {
      setError(
        typeof err?.response?.data === "string"
          ? err.response.data
          : "ورود ناموفق بود",
      );
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = userName.trim() !== "" && password.trim() !== "";

  if (isLoading) {
    return (
      <div className="login-container">
        <div className="login-box">در حال بررسی وضعیت ورود...</div>
      </div>
    );
  }

  if (isLoggedIn) {
    navigate("/", { replace: true });
    return null;
  }

  return (
    <AuthContainer>
      <AuthForm
        title="ورود به حساب"
        handleSubmit={handleLogin}
        submitBtnTxt="ورود"
        reasonToSwitch="حساب کاربری ندارید؟"
        swtichLinkLabel="ثبت‌نام"
        switchUrl="/auth/register"
        isFormValid={isFormValid}
        loading={loading}
        error={error}
      >
        <LoginInputs
          userNameTxt={userName}
          passwordTxt={password}
          setUserName={setUserName}
          setPassword={setPassword}
        />
      </AuthForm>
    </AuthContainer>
  );
}
