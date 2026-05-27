import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import axiosClient from "../../api/axiosClient";
import { ENDPOINTS } from "../../api/endpoints";
import { loginSuccess } from "../../store/slices/authSlice";

export const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Please enter username and password");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosClient.post(ENDPOINTS.AUTH.LOGIN, {
        name: username,
        password,
      });

      const { token } = response.data;
      if (token) {
        dispatch(loginSuccess(token));
        toast.success("Welcome back!");
        const origin = (location.state as any)?.from?.pathname || "/";
        navigate(origin);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-brand-dark border border-neutral-800 rounded-lg shadow-2xl">
      <h2 className="text-3xl font-bold text-center mb-8">Sign In</h2>
      <form onSubmit={handleLogin}>
        <Input
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
        <Button type="submit" className="w-full mt-4" isLoading={isLoading}>
          Continue
        </Button>
      </form>
    </div>
  );
};
