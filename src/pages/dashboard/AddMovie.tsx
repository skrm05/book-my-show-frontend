import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import axiosClient from "../../api/axiosClient";
import { ENDPOINTS } from "../../api/endpoints";
import toast from "react-hot-toast";

export const AddMovie: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadType, setUploadType] = useState<"url" | "file">("url");

  const [formData, setFormData] = useState({
    title: "",
    language: "",
    genre: "",
    durationMinutes: "",
    posterUrl: "",
  });
  const [posterFile, setPosterFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.title ||
      !formData.language ||
      !formData.genre ||
      !formData.durationMinutes
    ) {
      return toast.error("Please fill all required text fields.");
    }
    if (uploadType === "file" && !posterFile)
      return toast.error("Please select a file.");
    if (uploadType === "url" && !formData.posterUrl)
      return toast.error("Please provide an image URL.");

    setIsLoading(true);
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("language", formData.language);
      data.append("genre", formData.genre);
      data.append("durationMinutes", formData.durationMinutes);

      if (uploadType === "file" && posterFile) {
        data.append("poster", posterFile);
      } else {
        data.append("posterUrl", formData.posterUrl);
      }

      await axiosClient.post(ENDPOINTS.MOVIES.POST_MOVIE, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Movie created successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create movie.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-6 animate-fadeIn">
      <h2 className="text-3xl font-bold mb-6">Add New Movie</h2>
      <div className="bg-brand-dark p-8 rounded-lg border border-neutral-800">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <Input
            label="Movie Title *"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Language *"
              value={formData.language}
              onChange={(e) =>
                setFormData({ ...formData, language: e.target.value })
              }
              placeholder="e.g. English"
            />
            <Input
              label="Genre *"
              value={formData.genre}
              onChange={(e) =>
                setFormData({ ...formData, genre: e.target.value })
              }
              placeholder="e.g. Action, Sci-Fi"
            />
          </div>
          <Input
            label="Duration (Minutes) *"
            type="number"
            min="1"
            value={formData.durationMinutes}
            onChange={(e) =>
              setFormData({ ...formData, durationMinutes: e.target.value })
            }
          />

          <div className="my-4 border border-neutral-700 p-4 rounded-lg bg-neutral-900/50">
            <p className="text-sm font-medium text-neutral-300 mb-3">
              Poster Image *
            </p>
            <div className="flex gap-4 mb-4">
              <label className="flex items-center gap-2 text-sm text-neutral-400 cursor-pointer">
                <input
                  type="radio"
                  checked={uploadType === "url"}
                  onChange={() => setUploadType("url")}
                  className="accent-brand-crimson"
                />{" "}
                Image URL
              </label>
              <label className="flex items-center gap-2 text-sm text-neutral-400 cursor-pointer">
                <input
                  type="radio"
                  checked={uploadType === "file"}
                  onChange={() => setUploadType("file")}
                  className="accent-brand-crimson"
                />{" "}
                File Upload
              </label>
            </div>
            {uploadType === "url" ? (
              <Input
                label=""
                value={formData.posterUrl}
                onChange={(e) =>
                  setFormData({ ...formData, posterUrl: e.target.value })
                }
                placeholder="https://..."
              />
            ) : (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPosterFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-brand-crimson file:text-white"
              />
            )}
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Publish Movie
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
