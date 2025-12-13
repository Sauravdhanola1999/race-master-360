import React, { useEffect, useState } from "react";
import api from "../../services/api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Heats() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [heats, setHeats] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    heatNumber: "",
    round: "HEAT",
  });
  const [errors, setErrors] = useState({});
  const [popup, setPopup] = useState({
    open: false,
    message: "",
    type: "success", // success | error
  });

  // Load events
  useEffect(() => {
    api.get("/events").then((res) => {
      setEvents(res.data.data || res.data);
    });
  }, []);

  async function loadHeats(eventId) {
    if (!eventId) return;
    const res = await api.get(`/heats/event/${eventId}`);
    setHeats(res.data.data || res.data);
  }

  function validateForm(isUpdate = false) {
    const newErrors = {};

    // EventId validation (only for create)
    if (!isUpdate) {
      if (!selectedEvent || selectedEvent === "") {
        newErrors.eventId = "Event is required";
      } else if (!Number.isInteger(Number(selectedEvent))) {
        newErrors.eventId = "Invalid event selection";
      }
    } else {
      // For update, eventId is optional but must be valid integer if provided
      if (selectedEvent && selectedEvent !== "" && !Number.isInteger(Number(selectedEvent))) {
        newErrors.eventId = "eventId must be a valid integer";
      }
    }

    // Heat Number validation
    if (!form.heatNumber || form.heatNumber === "") {
      if (!isUpdate) {
        newErrors.heatNumber = "Heat number is required";
      }
      // For update, heatNumber is optional, so we only validate if provided
    } else {
      const heatNum = Number(form.heatNumber);
      if (!Number.isInteger(heatNum)) {
        newErrors.heatNumber = "Heat number must be a whole number";
      } else if (heatNum < 1) {
        newErrors.heatNumber = "Heat number must be >= 1";
      }
    }

    // Round validation
    if (!form.round || form.round === "") {
      if (!isUpdate) {
        newErrors.round = "Round is required";
      }
      // For update, round is optional
    } else {
      const validRounds = ["HEAT", "SEMI", "FINAL"];
      if (!validRounds.includes(form.round)) {
        newErrors.round = "Invalid round type";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function resetForm() {
    setForm({ heatNumber: "", round: "HEAT" });
    setErrors({});
    setEditingId(null);
  }

  function handleEdit(heat) {
    setForm({
      heatNumber: heat.heatNumber.toString(),
      round: heat.round,
    });
    setEditingId(heat.id);
    setErrors({});
  }

  function handleCancel() {
    resetForm();
  }

  async function createHeat(e) {
    e.preventDefault();

    if (!validateForm(false)) {
      return;
    }

    try {
      await api.post("/heats", {
        eventId: Number(selectedEvent),
        heatNumber: Number(form.heatNumber),
        round: form.round,
      });

      setPopup({
        open: true,
        message: "Heat created successfully",
        type: "success",
      });

      resetForm();
      loadHeats(selectedEvent);

      setTimeout(() => {
        setPopup({ open: false, message: "", type: "success" });
      }, 2000);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || "Failed to create heat";
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

  async function updateHeat(e) {
    e.preventDefault();

    if (!validateForm(true)) {
      return;
    }

    const payload = {};

    // Only include fields that are provided
    if (selectedEvent && selectedEvent !== "") {
      payload.eventId = Number(selectedEvent);
    }
    if (form.heatNumber && form.heatNumber !== "") {
      payload.heatNumber = Number(form.heatNumber);
    }
    if (form.round && form.round !== "") {
      payload.round = form.round;
    }

    try {
      await api.put(`/heats/${editingId}`, payload);

      setPopup({
        open: true,
        message: "Heat updated successfully",
        type: "success",
      });

      resetForm();
      loadHeats(selectedEvent);

      setTimeout(() => {
        setPopup({ open: false, message: "", type: "success" });
      }, 2000);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || "Failed to update heat";
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
    <div className="space-y-8">
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

      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <span className="text-3xl">🔥</span>
          Heats
        </h1>
        <p className="text-slate-400 mt-1">
          Create and manage race heats
        </p>
      </div>

      {/* EVENT SELECT */}
      <Card className="sports-card">
        <CardHeader className="bg-slate-700/50 border-b border-slate-600 rounded-t-lg py-4">
          <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg border border-green-500/30">
              <span className="text-2xl">📅</span>
            </div>
            Select Event
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">
              Event <span className="text-red-400">*</span>
            </label>
            <Select
              value={selectedEvent}
              onValueChange={(val) => {
                setSelectedEvent(val);
                if (errors.eventId) setErrors({ ...errors, eventId: "" });
                loadHeats(val);
              }}
            >
              <SelectTrigger className={`w-full md:w-96 bg-slate-700 border-slate-600 text-white focus:border-green-500 focus:ring-green-500 ${
                errors.eventId ? "border-red-500" : ""
              }`}>
                <SelectValue placeholder="Choose an event" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {events.map((ev) => (
                  <SelectItem key={ev.id} value={String(ev.id)} className="text-white hover:bg-slate-700">
                    {ev.eventName} ({ev.distance}m)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.eventId && (
              <p className="text-xs text-red-400 mt-1">{errors.eventId}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* CREATE/EDIT HEAT */}
      {selectedEvent && (
        <Card className="sports-card">
          <CardHeader className="bg-slate-700/50 border-b border-slate-600 rounded-t-lg py-4">
            <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
              {editingId ? (
                <>
                  <div className="p-2 bg-green-500/20 rounded-lg border border-green-500/30">
                    <span className="text-2xl">✏️</span>
                  </div>
                  Edit Heat
                </>
              ) : (
                <>
                  <div className="p-2 bg-green-500/20 rounded-lg border border-green-500/30">
                    <span className="text-2xl">➕</span>
                  </div>
                  Create Heat
                </>
              )}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={editingId ? updateHeat : createHeat}
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
              <div>
                <label className="text-sm font-medium text-slate-300">
                  Heat Number {!editingId && <span className="text-red-400">*</span>}
                </label>
                <Input
                  type="number"
                  placeholder={editingId ? "Heat number" : "1"}
                  min="1"
                  value={form.heatNumber}
                  onChange={(e) => {
                    setForm({ ...form, heatNumber: e.target.value });
                    if (errors.heatNumber) setErrors({ ...errors, heatNumber: "" });
                  }}
                  className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-green-500 focus:ring-green-500 ${
                    errors.heatNumber ? "border-red-500" : ""
                  }`}
                />
                {errors.heatNumber && (
                  <p className="text-xs text-red-400 mt-1">{errors.heatNumber}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300">
                  Round {!editingId && <span className="text-red-400">*</span>}
                </label>
                <Select
                  value={form.round}
                  onValueChange={(val) => {
                    setForm({ ...form, round: val });
                    if (errors.round) setErrors({ ...errors, round: "" });
                  }}
                >
                  <SelectTrigger className={`bg-slate-700 border-slate-600 text-white focus:border-green-500 focus:ring-green-500 ${
                    errors.round ? "border-red-500" : ""
                  }`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="HEAT" className="text-white hover:bg-slate-700">Heat</SelectItem>
                    <SelectItem value="SEMI" className="text-white hover:bg-slate-700">Semi Final</SelectItem>
                    <SelectItem value="FINAL" className="text-white hover:bg-slate-700">Final</SelectItem>
                  </SelectContent>
                </Select>
                {errors.round && (
                  <p className="text-xs text-red-400 mt-1">{errors.round}</p>
                )}
              </div>

              <div className="flex items-end gap-2">
                <Button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md flex items-center justify-center gap-2"
                >
                  {editingId ? (
                    <>
                      <span>💾</span>
                      Update Heat
                    </>
                  ) : (
                    <>
                      <span>➕</span>
                      Create Heat
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
      )}

      {/* HEATS LIST */}
      {selectedEvent && (
        <Card className="sports-card">
          <CardHeader className="bg-slate-700/50 border-b border-slate-600 rounded-t-lg py-4">
            <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg border border-green-500/30">
                <span className="text-2xl">📋</span>
              </div>
              Existing Heats
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-700/50 hover:bg-slate-700/50 border-b border-slate-600">
                    <TableHead className="font-semibold text-slate-300">🔥 Heat #</TableHead>
                    <TableHead className="font-semibold text-slate-300">🏁 Round</TableHead>
                    <TableHead className="text-right font-semibold text-slate-300">⚙️ Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {heats.map((h, i) => (
                    <TableRow
                      key={h.id}
                      className={`border-b border-slate-700 ${
                        i % 2 === 0 ? "bg-slate-800/50" : "bg-slate-800/30"
                      } hover:bg-slate-700/50`}
                    >
                      <TableCell className="text-white font-medium">{h.heatNumber}</TableCell>
                      <TableCell className="text-slate-300">{h.round}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(h)}
                          className="flex items-center gap-1 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-green-500/50 font-medium"
                          disabled={editingId === h.id}
                        >
                          <span>✏️</span>
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}

                  {heats.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center py-12 text-slate-400"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-4xl">🔥</span>
                          <p className="font-medium text-slate-300">No heats found</p>
                          <p className="text-sm text-slate-500">Start by creating your first heat</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
