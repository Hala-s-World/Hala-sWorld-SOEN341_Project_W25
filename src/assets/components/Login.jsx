import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import AuthenticationForm from "./AuthenticationForm";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleSubmit = async (event, email, password) => {
    event.preventDefault();
    const success = await login(email, password);

    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <AuthenticationForm title="LOGIN" handleSubmit={handleSubmit} />
  );
};

export default Login;
