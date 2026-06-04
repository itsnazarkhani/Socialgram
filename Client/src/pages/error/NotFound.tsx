import { useNavigate } from "react-router-dom";
import "./NotFound.css";
import { useEffect } from "react";

function NotFound() {
  const navigate = useNavigate();

  const goBackToHome = () => {
    navigate("/");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      goBackToHome();
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="error-code">404</h1>
        <h2 className="error-message">صفحه مورد نظر پیدا نشد!</h2>
        <p className="sub-text">
          متأسفانه، صفحه‌ای که به دنبال آن بودید در این وب‌سایت وجود ندارد.
          <br />
          ممکن است آدرس را اشتباه وارد کرده باشید یا صفحه جابجا شده باشد.
        </p>
        <button className="home-button" onClick={goBackToHome}>
          بازگشت به صفحه اصلی
        </button>
      </div>
      <div className="not-found-graphic">
        <span className="icon-ghost">👻</span>
      </div>
    </div>
  );
}

export default NotFound;
