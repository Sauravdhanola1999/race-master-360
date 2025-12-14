import React, { useEffect, useState } from "react";
import api from "../../services/api";
import CountrySelect from "../../components/CountrySelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Athletes() {
  const [athletes, setAthletes] = useState([]);
  const [events, setEvents] = useState([]);
  const [heats, setHeats] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    country: "",
    age: "",
    gender: "M",
    personalBest: "",
    seasonBest: "",
    eventId: "",
    heatId: "",
    lane: "",
  });

  const [errors, setErrors] = useState({});
  const [popup, setPopup] = useState({
    open: false,
    message: "",
    type: "success", // success | error
  });

  useEffect(() => {
    fetchAll();
    loadEvents();
  }, []);

  async function loadEvents() {
    try {
      const res = await api.get("/events");
      setEvents(res.data.data || res.data);
    } catch (err) {
      console.error("Failed to load events:", err);
    }
  }

  async function loadHeatsForEvent(eventId) {
    setForm({ ...form, eventId, heatId: "" });
    setHeats([]);
    if (!eventId) return;

    try {
      const res = await api.get(`/heats/event/${eventId}`);
      setHeats(res.data.data || res.data);
    } catch (err) {
      console.error("Failed to load heats:", err);
    }
  }

  async function fetchAll() {
    try {
      const res = await api.get("/athletes");
      setAthletes(res.data.data || res.data);
    } catch (err) {
      setPopup({
        open: true,
        message: "Failed to load athletes",
        type: "error",
      });
      setTimeout(() => {
        setPopup({ open: false, message: "", type: "success" });
      }, 3000);
    }
  }

  // Validation function matching backend rules
  function validateForm(isEdit = false) {
    const newErrors = {};

    // Name validation
    if (!form.name || form.name.trim() === "") {
      newErrors.name = "Name is required";
    }

    // Country validation
    if (!form.country || form.country.trim() === "") {
      newErrors.country = "Country is required";
    }

    // Age validation
    if (isEdit) {
      // For update: age is optional but if provided must be between 10 and 60
      if (form.age && form.age !== "") {
        const ageNum = Number(form.age);
        if (!Number.isInteger(ageNum)) {
          newErrors.age = "Age must be a number";
        } else if (ageNum < 10 || ageNum > 60) {
          newErrors.age = "Age must be between 10 and 60";
        }
      }
    } else {
      // For create: age is required and must be between 10 and 60
      const ageNum = Number(form.age);
      if (!form.age || form.age === "") {
        newErrors.age = "Age is required";
      } else if (!Number.isInteger(ageNum)) {
        newErrors.age = "Age must be a number";
      } else if (ageNum < 10 || ageNum > 60) {
        newErrors.age = "Age must be between 10 and 60";
      }
    }

    // Gender validation
    if (!["M", "F", "O"].includes(form.gender)) {
      newErrors.gender = "Invalid gender";
    }

    // Personal Best validation (optional)
    if (form.personalBest && form.personalBest !== "") {
      const pbNum = parseFloat(form.personalBest);
      if (isNaN(pbNum) || pbNum < 0) {
        newErrors.personalBest = "Personal best must be a positive number";
      }
    }

    // Season Best validation (optional)
    if (form.seasonBest && form.seasonBest !== "") {
      const sbNum = parseFloat(form.seasonBest);
      if (isNaN(sbNum) || sbNum < 0) {
        newErrors.seasonBest = "Season best must be a positive number";
      }
    }

    // Event and Heat validation (required for creation only)
    if (!isEdit) {
      // EventId validation
      if (!form.eventId || form.eventId === "") {
        newErrors.eventId = "Event ID is required";
      } else {
        const eventIdNum = Number(form.eventId);
        if (!Number.isInteger(eventIdNum) || eventIdNum < 1) {
          newErrors.eventId = "Event ID must be a positive integer";
        }
      }
      
      // HeatId validation
      if (!form.heatId || form.heatId === "") {
        newErrors.heatId = "Heat ID is required";
      } else {
        const heatIdNum = Number(form.heatId);
        if (!Number.isInteger(heatIdNum) || heatIdNum < 1) {
          newErrors.heatId = "Heat ID must be a positive integer";
        }
      }
      
      // Lane validation (optional)
      if (form.lane && form.lane !== "") {
        const laneNum = Number(form.lane);
        if (!Number.isInteger(laneNum) || laneNum < 1 || laneNum > 10) {
          newErrors.lane = "Lane must be between 1 and 10";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function resetForm() {
    setForm({
      name: "",
      country: "",
      age: "",
      gender: "M",
      personalBest: "",
      seasonBest: "",
      eventId: "",
      heatId: "",
      lane: "",
    });
    setErrors({});
    setEditingId(null);
    setHeats([]);
  }

  function handleEdit(athlete) {
    setEditingId(athlete.id);
    setForm({
      name: athlete.name || "",
      country: athlete.country || "",
      age: athlete.age?.toString() || "",
      gender: athlete.gender || "M",
      personalBest: athlete.personalBest?.toString() || "",
      seasonBest: athlete.seasonBest?.toString() || "",
      eventId: "",
      heatId: "",
      lane: "",
    });
    setErrors({});
    setHeats([]);
  }

  function handleCancel() {
    resetForm();
  }

  async function create(e) {
    e.preventDefault();

    if (!validateForm(false)) {
      return;
    }

    const payload = {
      name: form.name.trim(),
      country: form.country.toUpperCase().slice(0, 3),
      age: Number(form.age),
      gender: form.gender,
      eventId: Number(form.eventId),
      heatId: Number(form.heatId),
    };

    if (form.personalBest && form.personalBest !== "") {
      payload.personalBest = parseFloat(form.personalBest);
    }
    if (form.seasonBest && form.seasonBest !== "") {
      payload.seasonBest = parseFloat(form.seasonBest);
    }
    if (form.lane && form.lane !== "") {
      payload.lane = Number(form.lane);
    }

    try {
      await api.post("/athletes/create", payload);
      setPopup({
        open: true,
        message: "Athlete added successfully and assigned to event/heat",
        type: "success",
      });
      resetForm();
      fetchAll();
      setTimeout(() => {
        setPopup({ open: false, message: "", type: "success" });
      }, 2000);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to add athlete";
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

    if (form.name.trim() !== "") {
      payload.name = form.name.trim();
    }
    if (form.country.trim() !== "") {
      payload.country = form.country.toUpperCase().slice(0, 3);
    }
    if (form.age !== "") {
      payload.age = Number(form.age);
    }
    if (form.gender) {
      payload.gender = form.gender;
    }
    if (form.personalBest !== "") {
      payload.personalBest = parseFloat(form.personalBest);
    }
    if (form.seasonBest !== "") {
      payload.seasonBest = parseFloat(form.seasonBest);
    }

    try {
      await api.put(`/athletes/edit/${editingId}`, payload);
      setPopup({
        open: true,
        message: "Athlete updated successfully",
        type: "success",
      });
      resetForm();
      fetchAll();
      setTimeout(() => {
        setPopup({ open: false, message: "", type: "success" });
      }, 2000);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to update athlete";
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
      {/* POPUP MODAL */}
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
              {popup.type === "success" ? "Success" : "Error"}
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
          <span className="text-3xl">👥</span>
          Athletes
        </h1>
        <p className="text-slate-400 mt-1">
          ✏️ Manage registered athletes for events
        </p>
      </div>

      {/* ADD/EDIT ATHLETE */}
      <Card className="sports-card">
        <CardHeader className="bg-slate-700/50 border-b border-slate-600 rounded-t-lg py-4">
          <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
            {editingId ? (
              <>
                <div className="p-2 bg-green-500/20 rounded-lg border border-green-500/30">
                  <span className="text-2xl">✏️</span>
                </div>
                Edit Athlete
              </>
            ) : (
              <>
                <div className="p-2 bg-green-500/20 rounded-lg border border-green-500/30">
                  <span className="text-2xl">➕</span>
                </div>
                Add Athlete
              </>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={editingId ? update : create}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
          >
            <div className="md:col-span-2 lg:col-span-1">
              <label className="text-sm font-medium text-slate-300">
                Athlete Name <span className="text-red-400">*</span>
              </label>
              <Input
                placeholder="Enter name"
                value={form.name}
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: "" });
                }}
                className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-green-500 focus:ring-green-500 ${errors.name ? "border-red-500" : ""}`}
              />
              {errors.name && (
                <p className="text-xs text-red-400 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300">
                Country <span className="text-red-400">*</span>
              </label>
              <CountrySelect
                value={form.country}
                onChange={(val) => {
                  setForm({ ...form, country: val });
                  if (errors.country) setErrors({ ...errors, country: "" });
                }}
                hasError={!!errors.country}
              />
              {errors.country && (
                <p className="text-xs text-red-400 mt-1">{errors.country}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300">
                Age <span className="text-red-400">*</span>
              </label>
              <Input
                type="number"
                placeholder={editingId ? "Age" : "10-60"}
                min={editingId ? 1 : 10}
                max={editingId ? undefined : 60}
                value={form.age}
                onChange={(e) => {
                  setForm({ ...form, age: e.target.value });
                  if (errors.age) setErrors({ ...errors, age: "" });
                }}
                className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-green-500 focus:ring-green-500 ${errors.age ? "border-red-500" : ""}`}
              />
              {errors.age && (
                <p className="text-xs text-red-400 mt-1">{errors.age}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300">
                Gender <span className="text-red-400">*</span>
              </label>
              <Select
                value={form.gender}
                onValueChange={(val) => {
                  setForm({ ...form, gender: val });
                  if (errors.gender) setErrors({ ...errors, gender: "" });
                }}
              >
                <SelectTrigger className={`bg-slate-700 border-slate-600 text-white focus:border-green-500 focus:ring-green-500 ${errors.gender ? "border-red-500" : ""}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="M" className="text-white hover:bg-slate-700">Male</SelectItem>
                  <SelectItem value="F" className="text-white hover:bg-slate-700">Female</SelectItem>
                  <SelectItem value="O" className="text-white hover:bg-slate-700">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-xs text-red-400 mt-1">{errors.gender}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300">Personal Best (s)</label>
              <Input
                type="number"
                step="0.01"
                placeholder="9.58"
                min="0"
                value={form.personalBest}
                onChange={(e) => {
                  setForm({ ...form, personalBest: e.target.value });
                  if (errors.personalBest)
                    setErrors({ ...errors, personalBest: "" });
                }}
                className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-green-500 focus:ring-green-500 ${errors.personalBest ? "border-red-500" : ""}`}
              />
              {errors.personalBest && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.personalBest}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300">Season Best (s)</label>
              <Input
                type="number"
                step="0.01"
                placeholder="9.90"
                min="0"
                value={form.seasonBest}
                onChange={(e) => {
                  setForm({ ...form, seasonBest: e.target.value });
                  if (errors.seasonBest)
                    setErrors({ ...errors, seasonBest: "" });
                }}
                className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-green-500 focus:ring-green-500 ${errors.seasonBest ? "border-red-500" : ""}`}
              />
              {errors.seasonBest && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.seasonBest}
                </p>
              )}
            </div>

            {/* Event and Heat fields - only shown when creating (not editing) */}
            {!editingId && (
              <>
                <div>
                  <label className="text-sm font-medium text-slate-300">
                    Event <span className="text-red-400">*</span>
                  </label>
                  <Select
                    value={form.eventId}
                    onValueChange={(val) => {
                      loadHeatsForEvent(val);
                      if (errors.eventId) setErrors({ ...errors, eventId: "" });
                    }}
                  >
                    <SelectTrigger
                      className={`bg-slate-700 border-slate-600 text-white focus:border-green-500 focus:ring-green-500 ${
                        errors.eventId ? "border-red-500" : ""
                      }`}
                    >
                      <SelectValue placeholder="Select Event" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {events.map((ev) => (
                        <SelectItem
                          key={ev.id}
                          value={String(ev.id)}
                          className="text-white hover:bg-slate-700"
                        >
                          {ev.eventName} ({ev.category})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.eventId && (
                    <p className="text-xs text-red-400 mt-1">{errors.eventId}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300">
                    Heat <span className="text-red-400">*</span>
                  </label>
                  <Select
                    value={form.heatId}
                    onValueChange={(val) => {
                      setForm({ ...form, heatId: val });
                      if (errors.heatId) setErrors({ ...errors, heatId: "" });
                    }}
                    disabled={!form.eventId || heats.length === 0}
                  >
                    <SelectTrigger
                      className={`bg-slate-700 border-slate-600 text-white focus:border-green-500 focus:ring-green-500 ${
                        errors.heatId ? "border-red-500" : ""
                      }`}
                    >
                      <SelectValue placeholder={form.eventId ? "Select Heat" : "Select Event first"} />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {heats.map((h) => (
                        <SelectItem
                          key={h.id}
                          value={String(h.id)}
                          className="text-white hover:bg-slate-700"
                        >
                          Heat {h.heatNumber} ({h.round})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.heatId && (
                    <p className="text-xs text-red-400 mt-1">{errors.heatId}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300">Lane (Optional)</label>
                  <Input
                    type="number"
                    placeholder="1-8"
                    min="1"
                    max="8"
                    value={form.lane}
                    onChange={(e) => {
                      setForm({ ...form, lane: e.target.value });
                    }}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-green-500 focus:ring-green-500"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Optional: Lane assignment for the heat
                  </p>
                </div>
              </>
            )}

            <div className="flex items-end gap-3 md:col-span-2 lg:col-span-3 pt-2">
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                {editingId ? (
                  <>
                    <span>💾</span>
                    Update Athlete
                  </>
                ) : (
                  <>
                    <span>➕</span>
                    Add Athlete
                  </>
                )}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="flex items-center gap-2 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white font-medium"
                >
                  <span>❌</span>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ATHLETES LIST */}
      <Card className="sports-card">
        <CardHeader className="flex flex-row items-center justify-between bg-slate-700/50 border-b border-slate-600 rounded-t-lg py-4">
          <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg border border-green-500/30">
              <span className="text-2xl">👥</span>
            </div>
            Athletes List
          </CardTitle>
          <span className="text-sm font-semibold px-4 py-1.5 rounded-lg bg-green-600 text-white border-0 shadow-md flex items-center gap-2">
            <span>📊</span>
            Total: {athletes.length}
          </span>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-700/50 hover:bg-slate-700/50 border-b border-slate-600">
                      <TableHead className="font-semibold text-slate-300 text-xs sm:text-sm whitespace-nowrap">👤 Name</TableHead>
                      <TableHead className="font-semibold text-slate-300 text-xs sm:text-sm whitespace-nowrap">🌍 Country</TableHead>
                      <TableHead className="font-semibold text-slate-300 text-xs sm:text-sm whitespace-nowrap">🎂 Age</TableHead>
                      <TableHead className="font-semibold text-slate-300 text-xs sm:text-sm whitespace-nowrap">⚧️ Gender</TableHead>
                      <TableHead className="font-semibold text-slate-300 text-xs sm:text-sm whitespace-nowrap">⭐ PB</TableHead>
                      <TableHead className="font-semibold text-slate-300 text-xs sm:text-sm whitespace-nowrap">🔥 SB</TableHead>
                      <TableHead className="text-right font-semibold text-slate-300 text-xs sm:text-sm whitespace-nowrap">⚙️ Actions</TableHead>
                    </TableRow>
                  </TableHeader>

              <TableBody>
                {athletes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-slate-400">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-6xl">👤</span>
                        <p className="font-medium text-slate-300 text-lg">👤 No athletes found</p>
                        <p className="text-sm text-slate-500">➕ Start by adding your first athlete</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  athletes.map((a, i) => (
                    <TableRow
                      key={a.id}
                      className={`transition-colors border-b border-slate-700 ${
                        i % 2 === 0 ? "bg-slate-800/50" : "bg-slate-800/30"
                      } hover:bg-slate-700/50`}
                    >
                      <TableCell className="font-semibold text-white text-xs sm:text-sm whitespace-nowrap">{a.name}</TableCell>
                      <TableCell className="text-slate-300 text-xs sm:text-sm whitespace-nowrap">
                        <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-slate-700 rounded-md text-xs font-medium border border-slate-600">
                          {a.country}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-300 font-medium text-xs sm:text-sm whitespace-nowrap">{a.age}</TableCell>
                      <TableCell className="text-xs sm:text-sm whitespace-nowrap">
                        <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-xs font-medium ${
                          a.gender === "M" 
                            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" 
                            : a.gender === "F"
                            ? "bg-pink-500/20 text-pink-400 border border-pink-500/30"
                            : "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                        }`}>
                          {a.gender === "M" ? "Male" : a.gender === "F" ? "Female" : "Other"}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-300 font-mono font-semibold text-xs sm:text-sm whitespace-nowrap">
                        {a.personalBest ? `${a.personalBest}s` : "-"}
                      </TableCell>
                      <TableCell className="text-slate-300 font-mono font-semibold text-xs sm:text-sm whitespace-nowrap">
                        {a.seasonBest ? `${a.seasonBest}s` : "-"}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(a)}
                          className="flex items-center gap-1 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-green-500/50 font-medium text-xs sm:text-sm"
                          disabled={editingId === a.id}
                        >
                          <span className="text-xs sm:text-sm">✏️</span>
                          <span className="hidden sm:inline">Edit</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
