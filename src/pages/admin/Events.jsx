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
  const [form, setForm] = useState({
    eventName: "",
    category: "Men",
    distance: 100,
  });
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

  async function create(e) {
    e.preventDefault();

    try {
      await api.post("/events/create", form);

      setPopup({
        open: true,
        message: "Event created successfully",
        type: "success",
      });

      setForm({ eventName: "", category: "Men", distance: 100 });
      fetchAll();

      // auto close popup
      setTimeout(() => {
        setPopup({ open: false, message: "", type: "success" });
      }, 2000);
    } catch (err) {
      setPopup({
        open: true,
        message: "Failed to create event",
        type: "error",
      });
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* POPUP */}
    {popup.open && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
    <div
      className={`
        w-full max-w-sm rounded-2xl p-6 shadow-xl
        animate-in zoom-in-95 fade-in duration-200
        ${
          popup.type === "success"
            ? "bg-white border border-green-200"
            : "bg-white border border-red-200"
        }
      `}
    >
      {/* ICON */}
      <div className="flex items-center justify-center mb-4">
        <div
          className={`
            flex h-12 w-12 items-center justify-center rounded-full
            ${
              popup.type === "success"
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }
          `}
        >
          {popup.type === "success" ? "✓" : "✕"}
        </div>
      </div>

      {/* TITLE */}
      <h3
        className={`text-center text-lg font-semibold
          ${
            popup.type === "success"
              ? "text-green-700"
              : "text-red-700"
          }
        `}
      >
        {popup.type === "success" ? "Success" : "Error"}
      </h3>

      {/* MESSAGE */}
      <p className="mt-2 text-center text-sm text-slate-600">
        {popup.message}
      </p>

      {/* ACTION */}
      <div className="mt-6 flex justify-center">
        <Button
          size="sm"
          className="px-6"
          variant={popup.type === "success" ? "default" : "destructive"}
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


      {/* ================= BACKGROUND BLOBS ================= */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-purple-200/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" />

      {/* ================= MOVING RUNNER ================= */}
      <div className="pointer-events-none absolute inset-0">
        <div className="runner-bg" />
      </div>

      {/* ================= PAGE CONTENT ================= */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10 space-y-10">
        {/* ================= PAGE HEADER ================= */}
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <h1 className="text-2xl font-bold tracking-tight">Events</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage athletics events
          </p>
        </div>

        {/* ================= ADD EVENT ================= */}
        <Card className="bg-white/80 backdrop-blur border border-slate-200 rounded-2xl shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
          <CardHeader>
            <CardTitle className="text-lg">Add Event</CardTitle>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={create}
              className="grid grid-cols-1 md:grid-cols-6 gap-4"
            >
              {/* Event Name */}
              <div className="md:col-span-3">
                <label className="text-sm font-medium">Event Name</label>
                <Input
                  placeholder="100m Sprint"
                  value={form.eventName}
                  onChange={(e) =>
                    setForm({ ...form, eventName: e.target.value })
                  }
                  required
                />
              </div>

              {/* Distance */}
              <div>
                <label className="text-sm font-medium">Distance (m)</label>
                <Input
                  type="number"
                  placeholder="100"
                  value={form.distance}
                  onChange={(e) =>
                    setForm({ ...form, distance: e.target.value })
                  }
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={form.category}
                  onValueChange={(val) => setForm({ ...form, category: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Men">Men</SelectItem>
                    <SelectItem value="Women">Women</SelectItem>
                    <SelectItem value="U18">U18</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Submit */}
              <div className="flex items-end">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 transition active:scale-95">
                  Create Event
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* ================= EVENTS LIST ================= */}
        <Card className="bg-white/80 backdrop-blur border border-slate-200 rounded-2xl shadow-sm animate-in fade-in slide-in-from-bottom-3 duration-300">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Events List</CardTitle>
            <span className="text-sm text-muted-foreground">
              Total: {events.length}
            </span>
          </CardHeader>

          <CardContent className="space-y-3">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="
                  flex items-center justify-between
                  rounded-xl
                  border border-slate-200
                  px-4 py-3
                  transition
                  hover:bg-indigo-50
                "
              >
                {/* Event Info */}
                <div className="space-y-0.5">
                  <div className="font-medium">{ev.eventName}</div>
                  <div className="text-sm text-muted-foreground">
                    {ev.distance}m • {ev.category}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 text-sm">
                  <Link
                    to={`/admin/results?eventId=${ev.id}`}
                    className="text-indigo-600 font-medium hover:underline"
                  >
                    Enter Results
                  </Link>

                  <Link
                    to={`/event/${ev.id}`}
                    className="text-slate-600 hover:underline"
                  >
                    View Public
                  </Link>
                </div>
              </div>
            ))}

            {events.length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-6">
                No events created yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
