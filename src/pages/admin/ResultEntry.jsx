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
import { Badge } from "@/components/ui/badge";

export default function ResultEntry() {
  const [events, setEvents] = useState([]);
  const [heats, setHeats] = useState([]);
  const [allAthletes, setAllAthletes] = useState([]); // Store all athletes
  const [filteredAthletes, setFilteredAthletes] = useState([]); // Filtered by heat Results

  const [form, setForm] = useState({
    eventId: "",
    heatId: "",
    athleteId: "",
    lane: 1,
    reactionTime: "",
    finishTime: "",
    status: "OK",
    position: "",
  });
  const [errors, setErrors] = useState({});
  const [popup, setPopup] = useState({
  open: false,
  message: "",
  type: "success", // success | error
});


  // Load events + all athletes
  useEffect(() => {
    async function loadInitial() {
      const [evRes, atRes] = await Promise.all([
        api.get("/events"),
        api.get("/athletes"),
      ]);
      setEvents(evRes.data.data || evRes.data);
      setAllAthletes(atRes.data.data || atRes.data);
    }
    loadInitial();
  }, []);

  async function loadHeatsForEvent(eventId) {
    setForm({ ...form, eventId, heatId: "", athleteId: "" }); // Clear heat and athlete when event changes
    setFilteredAthletes([]); // Clear filtered athletes
    if (!eventId) return;

    const res = await api.get(`/heats/event/${eventId}`);
    setHeats(res.data.data || res.data);
  }

  // Filter athletes based on selected event and heat
  useEffect(() => {
    if (form.eventId && form.heatId && heats.length > 0) {
      // Find the selected heat to get its Results array
      const selectedHeat = heats.find(h => String(h.id) === form.heatId);
      
      let filtered = [];
      
      if (selectedHeat && selectedHeat.Results && selectedHeat.Results.length > 0) {
        // Method 1: Use athleteIds from the heat's Results array
        const athleteIds = selectedHeat.Results.map(result => result.athleteId);
        filtered = allAthletes.filter(athlete => athleteIds.includes(athlete.id));
      } else {
        // Method 2: Fallback - filter by athlete's eventId and heatId properties
        filtered = allAthletes.filter(
          (athlete) =>
            athlete.eventId === Number(form.eventId) &&
            athlete.heatId === Number(form.heatId)
        );
      }
      
      setFilteredAthletes(filtered);
      
      // Clear athlete selection if current selection is not in filtered list
      if (form.athleteId && !filtered.find(a => String(a.id) === form.athleteId)) {
        setForm({ ...form, athleteId: "" });
      }
    } else {
      setFilteredAthletes([]);
    }
  }, [form.eventId, form.heatId, heats, allAthletes]);

  // Clear athlete when heat changes
  useEffect(() => {
    if (form.heatId) {
      setForm((prev) => ({ ...prev, athleteId: "" }));
    }
  }, [form.heatId]);

  function validateForm() {
    const newErrors = {};

    // EventId validation (required)
    if (!form.eventId || form.eventId === "") {
      newErrors.eventId = "Event is required";
    } else {
      const eventIdNum = Number(form.eventId);
      if (!Number.isInteger(eventIdNum) || eventIdNum < 1) {
        newErrors.eventId = "Event ID must be a positive integer";
      }
    }

    // HeatId validation (required)
    if (!form.heatId || form.heatId === "") {
      newErrors.heatId = "Heat is required";
    } else {
      const heatIdNum = Number(form.heatId);
      if (!Number.isInteger(heatIdNum) || heatIdNum < 1) {
        newErrors.heatId = "Heat ID must be a positive integer";
      }
    }

    // AthleteId validation (required)
    if (!form.athleteId || form.athleteId === "") {
      newErrors.athleteId = "Athlete is required";
    } else {
      const athleteIdNum = Number(form.athleteId);
      if (!Number.isInteger(athleteIdNum) || athleteIdNum < 1) {
        newErrors.athleteId = "Athlete ID must be a positive integer";
      }
    }

    // Lane validation (optional, 1-10)
    if (form.lane && form.lane !== "") {
      const laneNum = Number(form.lane);
      if (!Number.isInteger(laneNum) || laneNum < 1 || laneNum > 10) {
        newErrors.lane = "Lane must be between 1 and 10";
      }
    }

    // ReactionTime validation (optional, >= 0)
    if (form.reactionTime && form.reactionTime !== "") {
      const reactionNum = parseFloat(form.reactionTime);
      if (isNaN(reactionNum) || reactionNum < 0) {
        newErrors.reactionTime = "Reaction time must be >= 0";
      }
    }

    // FinishTime validation (optional, >= 0, but required when status is OK)
    if (form.finishTime && form.finishTime !== "") {
      const finishNum = parseFloat(form.finishTime);
      if (isNaN(finishNum) || finishNum < 0) {
        newErrors.finishTime = "Finish time must be >= 0";
      }
    }

    // Status validation (optional, must be one of valid values)
    if (form.status && form.status !== "") {
      const validStatuses = ["OK", "DNS", "DNF", "DSQ"];
      if (!validStatuses.includes(form.status)) {
        newErrors.status = "Invalid status";
      }
    }
    
    // If status is OK, finishTime is required (matching backend validation)
    if (form.status === "OK" && (!form.finishTime || form.finishTime === "")) {
      newErrors.finishTime = "Finish time is required when status is OK";
    }

    // Position validation (optional, >= 1)
    if (form.position && form.position !== "") {
      const positionNum = Number(form.position);
      if (!Number.isInteger(positionNum) || positionNum < 1) {
        newErrors.position = "Position must be a positive integer";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

async function submit(e) {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  // Build payload with only optional fields (matching backend validation)
  const payload = {};

  // Add optional fields only if provided
  if (form.lane && form.lane !== "") {
    payload.lane = Number(form.lane);
  }
  if (form.reactionTime && form.reactionTime !== "") {
    payload.reactionTime = parseFloat(form.reactionTime);
  }
  if (form.finishTime && form.finishTime !== "") {
    payload.finishTime = parseFloat(form.finishTime);
  }
  if (form.status && form.status !== "") {
    payload.status = form.status;
  }
  if (form.position && form.position !== "") {
    payload.position = Number(form.position);
  }

  try {
    // Use the new endpoint: PUT /results/event/:eventId/heat/:heatId/athlete/:athleteId
    await api.put(
      `/results/event/${form.eventId}/heat/${form.heatId}/athlete/${form.athleteId}`,
      payload
    );

    setPopup({
      open: true,
      message: "Result saved successfully",
      type: "success",
    });

    // optional: reset some fields (keep event, heat, and athlete selection)
    setForm({
      ...form,
      lane: 1,
      reactionTime: "",
      finishTime: "",
      status: "OK",
      position: "",
    });
    setErrors({});

    // auto close
    setTimeout(() => {
      setPopup({ open: false, message: "", type: "success" });
    }, 2000);
  } catch (err) {
    const errorMsg =
      err.response?.data?.message || "Failed to save result";
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
      {/* PAGE HEADER */}
      {popup.open && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
    <div
      className={`
        w-full max-w-sm rounded-2xl p-6 shadow-xl
        animate-in zoom-in-95 fade-in duration-200
        ${
          popup.type === "success"
            ? "bg-green-50 border border-green-300"
            : "bg-red-50 border border-red-300"
        }
      `}
    >
      <h3
        className={`text-lg font-semibold mb-2 text-center
          ${
            popup.type === "success"
              ? "text-green-700"
              : "text-red-700"
          }
        `}
      >
        {popup.type === "success" ? "Success" : "Error"}
      </h3>

      <p className="text-sm text-slate-700 text-center">
        {popup.message}
      </p>

      <div className="mt-6 flex justify-center">
        <Button
          size="sm"
          variant="outline"
          className="px-6"
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

      <div>
        <h1 className="text-2xl font-bold">Result Entry</h1>
        <p className="text-sm text-muted-foreground">
          Enter athlete race results
        </p>
      </div>

      {/* EVENT + HEAT */}
      <Card className="border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Select Event & Heat</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">
              Event <span className="text-red-400">*</span>
            </label>
            <Select
              value={form.eventId}
              onValueChange={(val) => {
                loadHeatsForEvent(val);
                if (errors.eventId) setErrors({ ...errors, eventId: "" });
              }}
            >
              <SelectTrigger className={errors.eventId ? "border-red-500" : ""}>
                <SelectValue placeholder="Select Event" />
              </SelectTrigger>
              <SelectContent>
                {events.map((ev) => (
                  <SelectItem key={ev.id} value={String(ev.id)}>
                    {ev.eventName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.eventId && (
              <p className="text-xs text-red-400 mt-1">{errors.eventId}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">
              Heat <span className="text-red-400">*</span>
            </label>
            <Select
              value={form.heatId}
              onValueChange={(val) => {
                setForm({ ...form, heatId: val, athleteId: "" }); // Clear athlete when heat changes
                if (errors.heatId) setErrors({ ...errors, heatId: "" });
              }}
              disabled={!form.eventId}
            >
              <SelectTrigger className={errors.heatId ? "border-red-500" : ""}>
                <SelectValue placeholder="Select Heat" />
              </SelectTrigger>
              <SelectContent>
                {heats.map((h) => (
                  <SelectItem key={h.id} value={String(h.id)}>
                    Heat {h.heatNumber} ({h.round})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.heatId && (
              <p className="text-xs text-red-400 mt-1">{errors.heatId}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* RESULT FORM */}
      {form.eventId && form.heatId && (
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Enter Result</CardTitle>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={submit}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {/* Athlete */}
              <div>
                <label className="text-sm font-medium">
                  Athlete <span className="text-red-400">*</span>
                </label>
                <Select
                  value={form.athleteId}
                  onValueChange={(val) => {
                    setForm({ ...form, athleteId: val });
                    if (errors.athleteId) setErrors({ ...errors, athleteId: "" });
                  }}
                  disabled={!form.eventId || !form.heatId || filteredAthletes.length === 0}
                >
                  <SelectTrigger className={errors.athleteId ? "border-red-500" : ""}>
                    <SelectValue 
                      placeholder={
                        !form.eventId || !form.heatId
                          ? "Select Event & Heat first"
                          : filteredAthletes.length === 0
                          ? "No athletes in this heat"
                          : "Select Athlete"
                      } 
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredAthletes.length > 0 && filteredAthletes.map((a) => (
                      <SelectItem key={a.id} value={String(a.id)}>
                        {a.name} ({a.country})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.athleteId && (
                  <p className="text-xs text-red-400 mt-1">{errors.athleteId}</p>
                )}
                {form.eventId && form.heatId && filteredAthletes.length === 0 && (
                  <p className="text-xs text-slate-400 mt-1">
                    No athletes assigned to this event/heat. Add athletes in the Athletes page.
                  </p>
                )}
              </div>

              {/* Lane */}
              <div>
                <label className="text-sm font-medium">Lane (Optional)</label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={form.lane}
                  onChange={(e) => {
                    setForm({ ...form, lane: e.target.value });
                    if (errors.lane) setErrors({ ...errors, lane: "" });
                  }}
                  className={errors.lane ? "border-red-500" : ""}
                />
                {errors.lane && (
                  <p className="text-xs text-red-400 mt-1">{errors.lane}</p>
                )}
              </div>

              {/* Reaction */}
              <div>
                <label className="text-sm font-medium">Reaction (s) (Optional)</label>
                <Input
                  type="number"
                  step="0.001"
                  min="0"
                  placeholder="0.135"
                  value={form.reactionTime}
                  onChange={(e) => {
                    setForm({ ...form, reactionTime: e.target.value });
                    if (errors.reactionTime) setErrors({ ...errors, reactionTime: "" });
                  }}
                  className={errors.reactionTime ? "border-red-500" : ""}
                />
                {errors.reactionTime && (
                  <p className="text-xs text-red-400 mt-1">{errors.reactionTime}</p>
                )}
              </div>

              {/* Finish */}
              <div>
                <label className="text-sm font-medium">
                  Finish (s) {form.status === "OK" ? <span className="text-red-400">*</span> : <span className="text-slate-400">(Optional)</span>}
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="9.58"
                  value={form.finishTime}
                  onChange={(e) => {
                    setForm({ ...form, finishTime: e.target.value });
                    if (errors.finishTime) setErrors({ ...errors, finishTime: "" });
                    if (errors.status) setErrors({ ...errors, status: "" });
                  }}
                  className={errors.finishTime ? "border-red-500" : ""}
                />
                {errors.finishTime && (
                  <p className="text-xs text-red-400 mt-1">{errors.finishTime}</p>
                )}
                {form.status === "OK" && (
                  <p className="text-xs text-slate-400 mt-1">
                    Required when status is OK
                  </p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="text-sm font-medium">Status (Optional)</label>
                <Select
                  value={form.status}
                  onValueChange={(val) => {
                    setForm({ ...form, status: val });
                    if (errors.status) setErrors({ ...errors, status: "" });
                    // Clear finishTime error if status changes from OK
                    if (val !== "OK" && errors.finishTime && errors.finishTime.includes("required when status is OK")) {
                      setErrors({ ...errors, finishTime: "" });
                    }
                    // Validate finishTime if status is set to OK
                    if (val === "OK" && (!form.finishTime || form.finishTime === "")) {
                      setErrors({ ...errors, finishTime: "Finish time is required when status is OK" });
                    }
                  }}
                >
                  <SelectTrigger className={errors.status ? "border-red-500" : ""}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OK">
                      <Badge variant="secondary">OK</Badge>
                    </SelectItem>
                    <SelectItem value="DNS">DNS</SelectItem>
                    <SelectItem value="DNF">DNF</SelectItem>
                    <SelectItem value="DSQ">DSQ</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-xs text-red-400 mt-1">{errors.status}</p>
                )}
              </div>

              {/* Position */}
              <div>
                <label className="text-sm font-medium">Position (Optional)</label>
                <Input
                  type="number"
                  min="1"
                  placeholder="1"
                  value={form.position}
                  onChange={(e) => {
                    setForm({ ...form, position: e.target.value });
                    if (errors.position) setErrors({ ...errors, position: "" });
                  }}
                  className={errors.position ? "border-red-500" : ""}
                />
                {errors.position && (
                  <p className="text-xs text-red-400 mt-1">{errors.position}</p>
                )}
              </div>

              {/* Submit */}
              <div className="flex items-end md:col-span-3">
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  Save Result
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
