import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import axiosClient from "../../api/axiosClient";
import { ENDPOINTS } from "../../api/endpoints";
import toast from "react-hot-toast";

interface LocationDTO {
  id: string;
  city: string;
  state: string;
}

export const AddTheatre: React.FC = () => {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<LocationDTO[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    locationId: "",
    totalSeats: "",
  });

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axiosClient.get(ENDPOINTS.LOCATION.GET_ALL_LOCATIONS);
        console.log(res);
        setLocations(res.data?.data || []);
      } catch (error) {
        toast.error("Failed to load locations.");
      } finally {
        setIsFetching(false);
      }
    };
    fetchLocations();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.locationId || !formData.totalSeats) {
      return toast.error("Please fill all required fields.");
    }

    setIsLoading(true);
    try {
      let res = await axiosClient.post(ENDPOINTS.THEATRE.CREATE_THEATRE, {
        name: formData.name,
        locationId: formData.locationId,
        totalSeats: parseInt(formData.totalSeats, 10),
      });
      console.log("Response=> ", res);
      toast.success("Theatre created successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create theatre.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching)
    return (
      <div className="animate-pulse h-64 bg-brand-dark rounded-lg mt-6"></div>
    );

  return (
    <div className="max-w-xl mx-auto mt-6 animate-fadeIn">
      <h2 className="text-3xl font-bold mb-6">Create Theatre</h2>
      <div className="bg-brand-dark p-8 rounded-lg border border-neutral-800">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Theatre Name *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. PVR Nexus"
          />

          <div className="flex flex-col mb-2">
            <label className="mb-1 text-sm text-neutral-300 font-medium">
              Location *
            </label>
            <select
              className="px-4 py-3 rounded bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-brand-crimson"
              value={formData.locationId}
              onChange={(e) =>
                setFormData({ ...formData, locationId: e.target.value })
              }
            >
              <option value="">-- Select Area / City --</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.city}, {loc.state}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Total Seat Capacity *"
            type="number"
            min="1"
            value={formData.totalSeats}
            onChange={(e) =>
              setFormData({ ...formData, totalSeats: e.target.value })
            }
          />

          <div className="flex justify-end gap-4 mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Create Theatre
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
