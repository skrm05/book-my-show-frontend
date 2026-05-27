import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import axiosClient from "../../api/axiosClient";
import { ENDPOINTS } from "../../api/endpoints";
import toast from "react-hot-toast";

export const AddLocation: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ city: "", state: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.city || !formData.state) {
      return toast.error("Please fill all required fields.");
    }

    setIsLoading(true);
    try {
      await axiosClient.post(ENDPOINTS.LOCATION.CREATE_LOCATION, formData);
      toast.success("Location added successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add location.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-6 animate-fadeIn">
      <h2 className="text-3xl font-bold mb-6 text-brand-gold">
        Add New Location
      </h2>
      <div className="bg-brand-dark p-8 rounded-lg border border-neutral-800">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="City *"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="e.g. Bengaluru"
          />
          <Input
            label="State *"
            value={formData.state}
            onChange={(e) =>
              setFormData({ ...formData, state: e.target.value })
            }
            placeholder="e.g. Karnataka"
          />
          <div className="flex justify-end gap-4 mt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Save Location
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
