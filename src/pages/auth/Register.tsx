import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import axiosClient from "../../api/axiosClient";
import { ENDPOINTS } from "../../api/endpoints";

type RegistrationRole = "USER" | "THEATRE" | "ADMIN";

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<RegistrationRole>("USER");
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleRoleChange = (selectedRole: RegistrationRole) => {
    setRole(selectedRole);
    // Optional: Clear form when switching roles
    setFormData({ name: "", email: "", password: "", confirmPassword: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      return toast.error("Please fill all required fields.");
    }

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    setIsLoading(true);
    try {
      // Determine correct endpoint based on selected role tab
      let endpoint = ENDPOINTS.AUTH.USER_REGISTER;
      if (role === "THEATRE") endpoint = ENDPOINTS.AUTH.THEATRE_REGISTER;
      if (role === "ADMIN") endpoint = ENDPOINTS.AUTH.ADMIN_REGISTER;

      // Schema strictly matches your DTO: { name, email, password }
      await axiosClient.post(endpoint, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      toast.success(`${role} Registration successful! Please log in.`);
      navigate("/login");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Registration failed. Try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-brand-dark border border-neutral-800 rounded-xl shadow-2xl animate-fadeIn">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
        <p className="text-neutral-400 text-sm">Join CinePremium today</p>
      </div>

      {/* Role Selection Tabs */}
      <div className="flex bg-neutral-900 rounded-lg p-1 mb-8 border border-neutral-800">
        <button
          type="button"
          onClick={() => handleRoleChange("USER")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
            role === "USER"
              ? "bg-brand-crimson text-white shadow-lg"
              : "text-neutral-500 hover:text-white"
          }`}
        >
          Patron
        </button>
        <button
          type="button"
          onClick={() => handleRoleChange("THEATRE")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
            role === "THEATRE"
              ? "bg-brand-crimson text-white shadow-lg"
              : "text-neutral-500 hover:text-white"
          }`}
        >
          Theatre
        </button>
        <button
          type="button"
          onClick={() => handleRoleChange("ADMIN")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
            role === "ADMIN"
              ? "bg-brand-crimson text-white shadow-lg"
              : "text-neutral-500 hover:text-white"
          }`}
        >
          Admin
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <Input
          label="Username / Full Name *"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g. johndoe"
        />
        <Input
          label="Email Address *"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="john@example.com"
        />
        <Input
          label="Password *"
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          placeholder="Enter a secure password"
        />
        <Input
          label="Confirm Password *"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
          placeholder="Re-enter password"
        />

        <Button
          type="submit"
          className="w-full mt-6 py-3 text-lg font-bold"
          isLoading={isLoading}
        >
          Register as{" "}
          {role === "USER"
            ? "Patron"
            : role === "THEATRE"
              ? "Theatre Partner"
              : "System Admin"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-neutral-400 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-brand-crimson hover:text-brand-crimsonHover font-semibold transition-colors"
          >
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
};
