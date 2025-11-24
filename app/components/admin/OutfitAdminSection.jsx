'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OutfitAdminSection() {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [images, setImages] = useState([]);
  const [newItem, setNewItem] = useState({
    file: null,
    category: "",
    item_name: "",
    type: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const storedToken = localStorage.getItem("weatherly-admin-token");
    setToken(storedToken);

    if (!storedToken) {
      router.replace("/login");
    }
  }, [router]);

  // Fetch existing outfit images
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await fetch("/api/outfit_images");
      if (!res.ok) throw new Error("Failed to fetch outfit images");
      const data = await res.json();
      const arrangedData = data.sort((a, b) => b.image_id - a.image_id);
      setImages(arrangedData);
    } catch (err) {
      console.error(err);
    }
  };

  const properCategory = (cat) => {
    switch (cat) {
      case "cold": return "Cold";
      case "rainy": return "Rainy";
      case "warm": return "Warm";
      case "hot": return "Hot";
      default: return cat;
    }
  }

  // Inline edit handler (only item_name & type)
  const handleEdit = async (id, field, value) => {
    try {
      if (field === null || field === undefined || field === "") {
        alert("Field cannot be empty");
        return
      };
      const updated = images.map((img) =>
        img.image_id === id ? { ...img, [field]: value } : img
      );
      setImages(updated);

      const image = updated.find((i) => i.image_id === id);
      const res = await fetch(`/api/outfit_images/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify({
          filename: image.filename,
          url: image.url,
          category: image.category,
          item_name: image.item_name,
          type: image.type,
        }),
      });

      if (!res.ok) throw new Error("Failed to update image");
    } catch (err) {
      console.error("Failed to update image:", err);
    }
  };

  // Delete handler
  const handleDelete = async (id) => {
    if (!confirm("Delete this item?")) return;
    try {
      await fetch(`/api/outfit_images/${id}`, {
        method: "DELETE",
        headers: { "x-admin-token": token },
      });
      setImages(images.filter((img) => img.image_id !== id));
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  // Create new image
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      if (!newItem.file) {
        alert("Please select an image file.");
        return;
      }

      const formData = new FormData();
      formData.append("file", newItem.file);
      formData.append("category", newItem.category);
      formData.append("item_name", newItem.item_name);
      formData.append("type", newItem.type);

      const res = await fetch("/api/outfit_images", {
        method: "POST",
        headers: {
          "x-admin-token": token,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to create image");

      const data = await res.json();
      setImages([data, ...images]);
      setNewItem({ file: null, category: "", item_name: "", type: "" });
    } catch (err) {
      console.error(err);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(images.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated = images.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="relative z-10 mt-10 bg-white/90 text-gray-800 rounded-lg p-6 shadow-xl border border-gray-300">
      <h2 className="text-2xl font-bold mb-4">Outfit Suggestions</h2>

      {/* Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full border-collapse bg-white text-sm rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">Image</th>
              <th className="border p-2 text-left">Item Name</th>
              <th className="border p-2 text-left">Type</th>
              <th className="border p-2 text-left">Category</th>
              <th className="border p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((img) => (
              <tr key={img.image_id} className="hover:bg-gray-50">
                <td className="border p-2">
                  <img
                    src={img.url}
                    alt={img.item_name}
                    className="w-32 object-cover rounded-md border"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="text"
                    value={img.item_name || ""}
                    onChange={(e) =>
                      handleEdit(img.image_id, "item_name", e.target.value)
                    }
                    className="w-full p-1 border rounded"
                  />
                </td>
                <td className="border p-2">
                  <select
                    value={img.type || ""}
                    onChange={(e) =>
                      handleEdit(img.image_id, "type", e.target.value)
                    }
                    className="w-full p-1 border rounded cursor-pointer"
                  >
                    <option value="clothing">Clothing</option>
                    <option value="accessory">Accessory</option>
                    <option value="any">Any</option>
                  </select>
                </td>
                <td className="border p-2">{properCategory(img.category)}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => handleDelete(img.image_id)}
                    className="text-red-800 px-3 py-1 px-3 transform hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer active:scale-95"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-center mt-2 space-x-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          className="px-3 py-2 rounded-2xl transform hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer active:scale-95"
        >
          Prev
        </button>
        {[...Array(totalPages).keys()]
          .slice(
            Math.max(0, currentPage - 3),
            Math.min(totalPages, currentPage + 2)
          )
          .map((i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded-2xl cursor-pointer ${currentPage === i + 1
                ? "bg-blue-500/20 rounded-2xl transform hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer active:scale-95"
                : "text-gray-400 transform hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer active:scale-95"
                }`}
            >
              {i + 1}
            </button>
          ))}
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          className="px-3 py-2 rounded-2xl transform hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer active:scale-95"
        >
          Next
        </button>
      </div>

      {/* Add new item form */}
      <form
        onSubmit={handleCreate}
        className="mt-8 bg-gray-100 p-4 rounded-lg shadow-inner space-y-3"
      >
        <h3 className="text-lg font-semibold mb-2">➕ Add New Outfit Image</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          <input
            type="file"
            accept=".png,.jpg,.jpeg"
            onChange={(e) => setNewItem({ ...newItem, file: e.target.files[0] })}
            className="border p-2 rounded-2xl bg-white cursor-pointer"
          />
          <select
            value={newItem.category}
            onChange={(e) =>
              setNewItem({ ...newItem, category: e.target.value })
            }
            className="border p-2 rounded-2xl bg-white cursor-pointer"
          >
            <option value="" disabled>Select Category</option>
            <option value="cold">Cold</option>
            <option value="rainy">Rainy</option>
            <option value="warm">Warm</option>
            <option value="hot">Hot</option>
          </select>
          <input
            type="text"
            placeholder="Item Name"
            value={newItem.item_name}
            onChange={(e) =>
              setNewItem({ ...newItem, item_name: e.target.value })
            }
            className="border p-2 rounded-2xl"
          />
          <select
            value={newItem.type}
            onChange={(e) =>
              setNewItem({ ...newItem, type: e.target.value })
            }
            className="border p-2 rounded-2xl bg-white cursor-pointer"
          >
            <option value="" disabled>Select Type</option>
            <option value="clothing">Clothing</option>
            <option value="accessory">Accessory</option>
            <option value="any">Any</option>
          </select>
        </div>

        <div style={{ alignItems: 'end', display: 'flex', justifyContent: 'end' }}>
          <button
            type="submit"
            className="mt-3 bg-blue-500 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-2xl transform hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer active:scale-95"
          >
            Add Item
          </button>
        </div>

      </form>
    </div>
  );
}
