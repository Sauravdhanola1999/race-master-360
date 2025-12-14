import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    eventName: "",
    category: "Men",
    distance: 100,
  });
  const [errors, setErrors] = useState({});
  const [popup, setPopup] = useState({
    open: false,
    message: "",
    type: "success", // success | error
  });

  async function fetchAll() {
    const res = await api.get("/events");
    setEvents(res.data.data || res.data);
  }

  useEffect(() => {
    fetchAll();
  }, []);

  function validateForm(isUpdate = false) {
    const newErrors = {};

    if (isUpdate) {
      // For update: all fields are optional, but if provided must meet validation
      
      // Event Name validation (optional for update)
      if (form.eventName !== undefined && form.eventName !== null) {
        if (form.eventName.trim() === "") {
          newErrors.eventName = "Event name cannot be empty";
        }
      }

      // Category validation (optional for update)
      if (form.category !== undefined && form.category !== null) {
        if (form.category.trim() === "") {
          newErrors.category = "Category cannot be empty";
        }
      }

      // Distance validation (optional for update)
      if (form.distance !== undefined && form.distance !== null && form.distance !== "") {
        const distanceNum = Number(form.distance);
        if (!Number.isInteger(distanceNum)) {
          newErrors.distance = "Distance must be a whole number";
        } else if (distanceNum < 50) {
          newErrors.distance = "Distance must be >= 50m";
        }
      }
    } else {
      // For create: all fields are required
      
      // Event Name validation
      if (!form.eventName || form.eventName.trim() === "") {
        newErrors.eventName = "Event name is required";
      }

      // Category validation
      if (!form.category || form.category.trim() === "") {
        newErrors.category = "Category is required";
      }

      // Distance validation
      const distanceNum = Number(form.distance);
      if (!form.distance || form.distance === "") {
        newErrors.distance = "Distance is required";
      } else if (!Number.isInteger(distanceNum)) {
        newErrors.distance = "Distance must be a whole number";
      } else if (distanceNum < 50) {
        newErrors.distance = "Distance must be >= 50m";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function resetForm() {
    setForm({ eventName: "", category: "Men", distance: 100 });
    setErrors({});
    setEditingId(null);
  }

  function handleEdit(event) {
    setForm({
      eventName: event.eventName,
      category: event.category,
      distance: event.distance,
    });
    setEditingId(event.id);
    setErrors({});
  }

  function handleCancel() {
    resetForm();
  }

  async function create(e) {
    e.preventDefault();

    if (!validateForm(false)) {
      return;
    }

    try {
      await api.post("/events/create", {
        eventName: form.eventName.trim(),
        category: form.category,
        distance: Number(form.distance),
      });

      setPopup({
        open: true,
        message: "Event created successfully",
        type: "success",
      });

      resetForm();
      fetchAll();

      // auto close popup
      setTimeout(() => {
        setPopup({ open: false, message: "", type: "success" });
      }, 2000);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to create event";
      setPopup({
        open: true,
        message: errorMsg,
        type: "error",
      });
      setTimeout(() => {
        setPopup({ open: false, message: "", type: "success" });
      }, 3000);
    }
  }

  async function update(e) {
    e.preventDefault();

    if (!validateForm(true)) {
      return;
    }

    const payload = {};
    
    // Only include fields that are provided
    if (form.eventName !== undefined && form.eventName !== null && form.eventName.trim() !== "") {
      payload.eventName = form.eventName.trim();
    }
    if (form.category !== undefined && form.category !== null && form.category.trim() !== "") {
      payload.category = form.category;
    }
    if (form.distance !== undefined && form.distance !== null && form.distance !== "") {
      payload.distance = Number(form.distance);
    }

    try {
      await api.put(`/events/${editingId}`, payload);

      setPopup({
        open: true,
        message: "Event updated successfully",
        type: "success",
      });

      resetForm();
      fetchAll();

      setTimeout(() => {
        setPopup({ open: false, message: "", type: "success" });
      }, 2000);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to update event";
      setPopup({
        open: true,
        message: errorMsg,
        type: "error",
      });
      setTimeout(() => {
        setPopup({ open: false, message: "", type: "success" });
      }, 3000);
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* POPUP */}
      {popup.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div
            className={`
        w-full max-w-sm rounded-lg p-6 shadow-xl
        animate-in zoom-in-95 fade-in duration-200
        border
        bg-slate-800
        ${
          popup.type === "success"
            ? "border-green-500/50"
            : "border-red-500/50"
        }
      `}
          >
            {/* HEADER */}
            <h3
              className={`text-lg font-semibold mb-3 text-center
          ${popup.type === "success" ? "text-green-400" : "text-red-400"}
        `}
            >
              {popup.type === "success" ? "✅ Success" : "❌ Error"}
            </h3>

            {/* MESSAGE */}
            <p className="text-sm text-slate-300 text-center">
              {popup.message}
            </p>

            {/* ACTION */}
            <div className="mt-6 flex justify-center">
              <Button
                size="sm"
                variant="outline"
                className={`px-6 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white ${
                  popup.type === "success"
                    ? "hover:border-green-500"
                    : "hover:border-red-500"
                }`}
                onClick={() =>
                  setPopup({ open: false, message: "", type: "success" })
                }
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}


      {/* PAGE TITLE */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <span className="text-3xl">📅</span>
          Events
        </h1>
        <p className="text-slate-400 mt-1">
          Create and manage athletics events
        </p>
      </div>

      {/* ADD/EDIT EVENT */}
      <Card className="sports-card">
        <CardHeader className="bg-slate-700/50 border-b border-slate-600 rounded-t-lg py-4">
          <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
            {editingId ? (
              <>
                <div className="p-2 bg-green-500/20 rounded-lg border border-green-500/30">
                  <span className="text-2xl">✏️</span>
                </div>
                Edit Event
              </>
            ) : (
              <>
                <div className="p-2 bg-green-500/20 rounded-lg border border-green-500/30">
                  <span className="text-2xl">➕</span>
                </div>
                Add Event
              </>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={editingId ? update : create}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3 sm:gap-4"
          >
            {/* Event Name */}
            <div className="md:col-span-3">
              <label className="text-sm font-medium text-slate-300">
                Event Name <span className="text-red-400">*</span>
              </label>
              <Input
                placeholder="100m Sprint"
                value={form.eventName}
                onChange={(e) => {
                  setForm({ ...form, eventName: e.target.value });
                  if (errors.eventName) setErrors({ ...errors, eventName: "" });
                }}
                className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-green-500 focus:ring-green-500 ${
                  errors.eventName ? "border-red-500" : ""
                }`}
              />
              {errors.eventName && (
                <p className="text-xs text-red-400 mt-1">{errors.eventName}</p>
              )}
            </div>

            {/* Distance */}
            <div>
              <label className="text-sm font-medium text-slate-300">
                Distance (m) <span className="text-red-400">*</span>
              </label>
              <Input
                type="number"
                placeholder="100"
                min="50"
                value={form.distance}
                onChange={(e) => {
                  setForm({ ...form, distance: e.target.value });
                  if (errors.distance) setErrors({ ...errors, distance: "" });
                }}
                className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-green-500 focus:ring-green-500 ${
                  errors.distance ? "border-red-500" : ""
                }`}
              />
              {errors.distance && (
                <p className="text-xs text-red-400 mt-1">{errors.distance}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="text-sm font-medium text-slate-300">
                Category <span className="text-red-400">*</span>
              </label>
              <Select
                value={form.category}
                onValueChange={(val) => {
                  setForm({ ...form, category: val });
                  if (errors.category) setErrors({ ...errors, category: "" });
                }}
              >
                <SelectTrigger
                  className={`bg-slate-700 border-slate-600 text-white focus:border-green-500 focus:ring-green-500 ${
                    errors.category ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="Men" className="text-white hover:bg-slate-700">Men</SelectItem>
                  <SelectItem value="Women" className="text-white hover:bg-slate-700">Women</SelectItem>
                  <SelectItem value="Mixed" className="text-white hover:bg-slate-700">Mixed</SelectItem>
                  <SelectItem value="U18" className="text-white hover:bg-slate-700">U18</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-xs text-red-400 mt-1">{errors.category}</p>
              )}
            </div>

            {/* Submit */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2 sm:col-span-2 md:col-span-1">
              <Button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md transition active:scale-95 flex items-center justify-center gap-2"
              >
                {editingId ? (
                  <>
                    <span>💾</span>
                    Update Event
                  </>
                ) : (
                  <>
                    <span>➕</span>
                    Create Event
                  </>
                )}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white font-medium"
                >
                  <span>❌</span>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* EVENTS LIST */}
      <Card className="sports-card">
        <CardHeader className="flex flex-row items-center justify-between bg-slate-700/50 border-b border-slate-600 rounded-t-lg py-4">
          <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg border border-green-500/30">
              <span className="text-2xl">📋</span>
            </div>
            Events List
          </CardTitle>
          <span className="text-sm font-semibold px-4 py-1.5 rounded-lg bg-green-600 text-white border-0 shadow-md flex items-center gap-2">
            <span>📊</span>
            Total: {events.length}
          </span>
        </CardHeader>

        <CardContent className="space-y-3">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="
                  flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3
                  rounded-lg
                  border border-slate-700
                  bg-slate-800/50
                  px-3 sm:px-4 py-3
                  transition
                  hover:bg-slate-700/50
                "
            >
              {/* Event Info */}
              <div className="space-y-0.5 flex-1">
                <div className="font-medium text-white text-sm sm:text-base">{ev.eventName}</div>
                <div className="text-xs sm:text-sm text-slate-400">
                  {ev.distance}m • {ev.category}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                <button
                  onClick={() => handleEdit(ev)}
                  className="text-green-400 font-medium hover:text-green-300 hover:underline flex items-center gap-1 whitespace-nowrap"
                  disabled={editingId === ev.id}
                >
                  <span>✏️</span>
                  Edit
                </button>

                <Link
                  to={`/admin/results?eventId=${ev.id}`}
                  className="text-green-400 font-medium hover:text-green-300 hover:underline whitespace-nowrap"
                >
                  Results
                </Link>

                <Link
                  to={`/event/${ev.id}`}
                  className="text-blue-400 hover:text-blue-300 hover:underline whitespace-nowrap"
                >
                  View
                </Link>
              </div>
            </div>
          ))}

          {events.length === 0 && (
            <div className="text-sm text-slate-400 text-center py-12">
              <div className="flex flex-col items-center gap-2">
                <span className="text-4xl">📅</span>
                <p className="font-medium text-slate-300">No events created yet</p>
                <p className="text-xs text-slate-500">Start by creating your first event</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
