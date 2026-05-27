import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../store";
import { StatCard } from "../../components/ui/StatCard";
import axiosClient from "../../api/axiosClient";
import { ENDPOINTS } from "../../api/endpoints";
import { UserRole } from "../../types";
import toast from "react-hot-toast";
import { Button } from "../../components/ui/Button";

export const Dashboard: React.FC = () => {
  const { role } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [stats, setStats] = useState({ movies: 0, theatres: 0, users: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Fetch public/shared admin data
        const [moviesRes, theatresRes] = await Promise.all([
          axiosClient.get(ENDPOINTS.MOVIES.GET_ALL),
          axiosClient.get(ENDPOINTS.THEATRE.GET_ALL_THEATRES),
        ]);

        let userCount = 0;

        // 2. Fetch Super Admin specific data safely
        if (role === UserRole.SUPER_ADMIN) {
          try {
            const usersRes = await axiosClient.get(
              ENDPOINTS.USER.GET_ALL_USERS,
            );
            userCount = usersRes.data?.data?.length || 0;
          } catch (userError) {
            console.error("Backend blocked User fetch:", userError);
            // Non-fatal: We leave userCount at 0 instead of crashing the dashboard
          }
        }

        setStats({
          movies:
            moviesRes.data?.data?.filter((m: any) => !m.deleted).length || 0,
          theatres: theatresRes.data?.data?.length || 0,
          users: userCount,
        });
      } catch (error) {
        toast.error("Failed to load primary dashboard metrics");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [role]);

  if (isLoading)
    return <div className="animate-pulse h-64 bg-brand-dark rounded-lg"></div>;

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-end mb-8 border-b border-neutral-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-neutral-400 mt-1">Platform Overview & Metrics</p>
        </div>
        <span className="bg-brand-gold/20 text-brand-gold px-3 py-1 rounded text-sm font-semibold">
          {role === UserRole.SUPER_ADMIN ? "Super Admin" : "Theatre Admin"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Active Movies" value={stats.movies} />
        <StatCard title="Total Theatres" value={stats.theatres} />
        {role === UserRole.SUPER_ADMIN && (
          <StatCard title="Registered Users" value={stats.users} />
        )}
      </div>

      <div className="mt-12 bg-brand-dark p-8 rounded-lg border border-neutral-800">
        <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={() => navigate("/dashboard/add-movie")}
            className="px-6 py-3"
          >
            + Add New Movie
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate("/dashboard/add-show")}
            className="px-6 py-3"
          >
            + Schedule Show
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/dashboard/add-theatre")}
            className="px-6 py-3"
          >
            + Create Theatre
          </Button>

          {role === UserRole.SUPER_ADMIN && (
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard/add-location")}
              className="px-6 py-3 border-brand-gold text-brand-gold hover:bg-brand-gold/10"
            >
              + Add Location
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard/manage")}
            className="px-6 py-3 border-red-900 text-red-500 hover:bg-red-900/20 hover:border-red-500"
          >
            Manage Data (Delete)
          </Button>
        </div>
      </div>
    </div>
  );
};
