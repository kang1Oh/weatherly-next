'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Trash2 } from "lucide-react";

export default function ActivityAdminSection() {
    const router = useRouter();
    const [token, setToken] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [activeTab, setActiveTab] = useState("pending");
    const [form, setForm] = useState({
        name: "",
        activity: "",
        reason: "",
        durationFrom: "",
        durationTo: "",
        durationUnit: "hours",
        energyLevel: "",
        timeOfDay: "",
        category: "",
        indoor: "",
        condition: "",
    });
    const [page, setPage] = useState(1);
    const perPage = 5;

    useEffect(() => {
        const storedToken = localStorage.getItem("weatherly-admin-token");
        setToken(storedToken);

        if (!storedToken) {
            router.replace("/login");
        }
    }, [router]);

    useEffect(() => {
        if (token) {
            fetchSuggestions();
        }
    }, [token]);

    const fetchSuggestions = async () => {
        try {
            const res = await fetch("/api/activity_suggestions", {
                headers: { "x-admin-token": token },
            });
            const data = await res.json();
            // Ensure data is an array
            setSuggestions(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error fetching suggestions:", err);
            setSuggestions([]); // Set to empty array on error
        }
    };

    const handleApprove = async (id) => {
        await fetch(`/api/activity_suggestions/${id}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "x-admin-token": token,
            },
            body: JSON.stringify({ status: "active" }),
        });
        fetchSuggestions();
    };

    const handleReject = async (id) => {
        if (!confirm("Reject this suggestion? This action will delete this submission.")) return;
        try {
            await fetch(`/api/activity_suggestions/${id}`, {
                method: "DELETE",
                headers: { "x-admin-token": token },
            });
            fetchSuggestions();
        } catch (err) {
            console.error("Error rejecting suggestion:", err);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this suggestion?")) return;
        try {
            await fetch(`/api/activity_suggestions/${id}`, {
                method: "DELETE",
                headers: { "x-admin-token": token },
            });
            fetchSuggestions();
        } catch (err) {
            console.error("Error deleting suggestion:", err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const duration =
            form.durationFrom && form.durationTo
                ? `${form.durationFrom}-${form.durationTo} ${form.durationUnit}`
                : null;

        const suggestion = {
            name: form.name,
            activity: form.activity,
            reason: form.reason,
            duration,
            energyLevel: form.energyLevel,
            timeOfDay: form.timeOfDay,
            category: form.category,
            indoor: form.indoor === "true",
            condition: form.condition,
            status: "active",
        };

        try {
            await fetch("/api/activity_suggestions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-admin-token": token,
                },
                body: JSON.stringify(suggestion),
            });
            setForm({
                name: "",
                activity: "",
                reason: "",
                durationFrom: "",
                durationTo: "",
                durationUnit: "hours",
                energyLevel: "",
                timeOfDay: "",
                category: "",
                indoor: "",
                condition: "",
            });
            fetchSuggestions();
            alert("Activity suggestion added successfully!");
        } catch (err) {
            console.error("Error adding activity:", err);
        }
    };

    const filtered = suggestions.filter((s) =>
        activeTab === "pending" ? s.status === "inactive" : s.status === "active"
    );

    const totalPages = Math.ceil(filtered.length / perPage);
    const paginated = filtered.slice((page - 1) * perPage, page * perPage);

    return (
        <div className="relative z-10 mt-10 bg-white/90 text-gray-800 rounded-lg p-6 shadow-xl border border-gray-300">
            <h2 className="text-2xl font-bold mb-4">Activity Suggestions</h2>

            {/* Tabs */}
            <div className="flex gap-4 mb-4">
                {["pending", "approved", "add"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg font-medium transition hover:scale-105 duration-200 ease-in-out cursor-pointer ${activeTab === tab
                            ? "text-blue-400"
                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                            }`}
                    >
                        {tab === "pending"
                            ? "Pending Suggestions"
                            : tab === "approved"
                                ? "Approved Suggestions"
                                : "Add New"}
                    </button>
                ))}
            </div>

            {/* Conditional Tab Content */}
            {activeTab === "add" ? (
                // Add New Suggestion Form
                <form
                    onSubmit={handleSubmit}
                    className="mt-8 bg-gray-100 p-4 rounded-lg shadow-inner space-y-3"
                >
                    <h3 className="text-lg font-semibold mb-2">➕ Add New Activity Suggestion</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="From Weatherly Admin"
                            className="border p-2 rounded-2xl bg-white"
                            required
                        />
                        <input
                            name="activity"
                            value={form.activity}
                            onChange={handleChange}
                            placeholder="Activity name"
                            className="border p-2 rounded-2xl bg-white"
                            required
                        />
                        <input
                            name="reason"
                            value={form.reason}
                            onChange={handleChange}
                            placeholder="Why it's great"
                            className="border p-2 rounded-2xl bg-white col-span-full"
                            required
                        />

                        {/* Duration */}
                        <div className="flex items-center gap-3 col-span-full sm:col-span-2">
                            <label className="text-sm text-gray-700 whitespace-nowrap">
                                Duration:
                            </label>
                            <select
                                name="durationFrom"
                                value={form.durationFrom}
                                onChange={handleChange}
                                className="p-2 rounded-lg border border-gray-300 text-sm text-gray-900 bg-white/80"
                            >
                                {[...Array(11)].map((_, i) => (
                                    <option key={i}>{i}</option>
                                ))}
                            </select>
                            <span className="text-sm text-gray-700">to</span>
                            <select
                                name="durationTo"
                                value={form.durationTo}
                                onChange={handleChange}
                                className="p-2 rounded-lg border border-gray-300 text-sm text-gray-900 bg-white/80"
                            >
                                {[...Array(11)].map((_, i) => (
                                    <option key={i}>{i}</option>
                                ))}
                            </select>
                            <select
                                name="durationUnit"
                                value={form.durationUnit}
                                onChange={handleChange}
                                className="p-2 rounded-lg border border-gray-300 text-sm text-gray-900 bg-white/80"
                            >
                                <option value="hours">hours</option>
                                <option value="minutes">minutes</option>
                            </select>
                        </div>

                        {/* Other selects with proper placeholders */}
                        <select
                            name="energyLevel"
                            value={form.energyLevel}
                            onChange={handleChange}
                            className="border p-2 rounded-2xl bg-white cursor-pointer"
                        >
                            <option value="" disabled>
                                Energy Level
                            </option>
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                        </select>

                        <select
                            name="timeOfDay"
                            value={form.timeOfDay}
                            onChange={handleChange}
                            className="border p-2 rounded-2xl bg-white cursor-pointer"
                        >
                            <option value="" disabled>
                                Time of Day
                            </option>
                            <option>Any</option>
                            <option>Morning</option>
                            <option>Afternoon</option>
                            <option>Evening</option>
                        </select>

                        <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className="border p-2 rounded-2xl bg-white cursor-pointer"
                        >
                            <option value="" disabled>
                                Category
                            </option>
                            {[
                                "Relaxation",
                                "Creative",
                                "Culinary",
                                "Entertainment",
                                "Social",
                                "Fitness",
                                "Cultural",
                                "Sport",
                                "Adventure",
                                "Shopping",
                                "Productivity",
                                "Recreation",
                                "Wellness",
                            ].map((cat) => (
                                <option key={cat}>{cat}</option>
                            ))}
                        </select>

                        <select
                            name="indoor"
                            value={form.indoor}
                            onChange={handleChange}
                            className="border p-2 rounded-2xl bg-white cursor-pointer"
                        >
                            <option value="" disabled>
                                Type of Activity
                            </option>
                            <option value="true">Indoor</option>
                            <option value="false">Outdoor</option>
                        </select>

                        <select
                            name="condition"
                            value={form.condition}
                            onChange={handleChange}
                            className="border p-2 rounded-2xl bg-white cursor-pointer"
                        >
                            <option value="" disabled>
                                Weather Condition
                            </option>
                            {[
                                "Clear",
                                "Mainly Clear",
                                "Partly Cloudy",
                                "Overcast",
                                "Fog",
                                "Rime Fog",
                                "Light Drizzle",
                                "Light Rain",
                                "Moderate Rain",
                                "Heavy Rain",
                                "Snow",
                                "Rain Showers",
                                "Thunderstorm",
                            ].map((cond) => (
                                <option key={cond}>{cond}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ alignItems: 'end', display: 'flex', justifyContent: 'end' }}>
                        <button
                            type="submit"
                            className="mt-3 bg-blue-500 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-2xl transform hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer active:scale-95"
                        >
                            Add Activity Suggestion
                        </button>
                    </div>
                </form>
            ) : (
                <>
                    {/* Table */}
                    <div className="overflow-x-auto shadow-md rounded-lg">
                        <table className="w-full border-collapse bg-white text-sm rounded-lg shadow-md">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-4 text-left">Activity</th>
                                    <th className="p-4 text-left">Name</th>
                                    <th className="p-4 text-left">Reason</th>
                                    <th className="p-4 text-left">Duration</th>
                                    <th className="p-4 text-left">Energy</th>
                                    <th className="p-4 text-left">Time</th>
                                    <th className="p-4 text-left">Category</th>
                                    <th className="p-4 text-left">Indoor</th>
                                    <th className="p-4 text-left">Condition</th>
                                    <th className="p-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.length > 0 ? (
                                    paginated.map((s) => (
                                        <tr key={s.suggestion_id} className="border-t hover:bg-gray-50">
                                            <td className="p-4">{s.activity}</td>
                                            <td className="p-4">{s.name}</td>
                                            <td className="p-4">{s.reason}</td>
                                            <td className="p-4">{s.duration}</td>
                                            <td className="p-4">{s.energyLevel}</td>
                                            <td className="p-4">{s.timeOfDay}</td>
                                            <td className="p-4">{s.category}</td>
                                            <td className="p-4">{s.indoor ? "Indoor" : "Outdoor"}</td>
                                            <td className="p-4">{s.condition}</td>
                                            <td className="p-4 flex justify-center gap-2">
                                                {activeTab === "pending" ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(s.suggestion_id)}
                                                            className="text-green-800 transform hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer active:scale-95"
                                                        >
                                                            <Check size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(s.suggestion_id)}
                                                            className="text-red-800 transform hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer active:scale-95"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={() => handleDelete(s.suggestion_id)}
                                                        className="text-red-800 transform hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer active:scale-95"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="10" className="text-center p-4 text-gray-500">
                                            No {activeTab} suggestions.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center mt-2 space-x-2">
                        <button
                            onClick={() => setPage((p) => Math.max(p - 1, 1))}
                            className="px-3 py-2 rounded-2xl transform hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer active:scale-95"
                        >
                            Prev
                        </button>
                        {[...Array(totalPages).keys()]
                            .slice(
                                Math.max(0, page - 3),
                                Math.min(totalPages, page + 2)
                            )
                            .map((i) => (
                                <button
                                    key={i}
                                    onClick={() => setPage(i + 1)}
                                    className={`px-3 py-1 rounded-2xl cursor-pointer ${page === i + 1
                                        ? "bg-blue-500/20 rounded-2xl transform hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer active:scale-95"
                                        : "text-gray-400 transform hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer active:scale-95"
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        <button
                            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                            className="px-3 py-2 rounded-2xl transform hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer active:scale-95"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}

        </div>
    );
}
