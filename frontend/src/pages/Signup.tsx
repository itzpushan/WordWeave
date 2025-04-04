import { Auth } from "../components/Auth";
import { Quote } from "../components/Quote";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

export const Signup = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .get(`${BACKEND_URL}/api/v1/user/verifyToken`, {
          headers: { Authorization: `${token}` },
        })
        .then((response) => {
          if (response.data.success) {
            navigate("/blogs"); // Redirect if token is valid
          }
        })
        .catch(() => {
          localStorage.removeItem("token"); // Remove invalid token
        });
    }
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div>
          <Auth type="signup" />
        </div>
        <div className="hidden lg:block">
          <Quote />
        </div>
      </div>
    </div>
  );
};
