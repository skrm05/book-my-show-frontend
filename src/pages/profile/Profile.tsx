import React, { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import axiosClient from "../../api/axiosClient";
import { ENDPOINTS } from "../../api/endpoints";
import toast from "react-hot-toast";

export const Profile: React.FC = () => {
  const { username, role } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    name: username || "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return toast.error("Session invalid");
    if (!formData.name || !formData.email || !formData.password) {
      return toast.error("All fields are required to update profile");
    }

    setIsLoading(true);
    try {
      await axiosClient.put(ENDPOINTS.USER.UPDATE_BY_ID(username), formData);
      toast.success("Profile updated successfully");
      setFormData((prev) => ({ ...prev, password: "" }));
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-6">
        Profile Settings of {username}
        <samp className="ml-2 px-2 py-1 text-sm font-medium text-white bg-brand-crimson rounded">
          {role}
        </samp>
      </h2>
      <div className="bg-brand-dark p-8 rounded-lg border border-neutral-800">
        <form onSubmit={handleSubmit}>
          <Input
            label="Name (Username)"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <Input
            label="New / Current Password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <Button type="submit" isLoading={isLoading} className="w-full mt-6">
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
};
