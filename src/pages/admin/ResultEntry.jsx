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
  const [athletes, setAthletes] = useState([]);

  const [form, setForm] = useState({
    eventId: "",
    heatId: "",
    athleteId: "",
    lane: 1,
    reactionTime: "",
    finishTime: "",
    status: "OK",
  });
  const [popup, setPopup] = useState({
  open: false,
  message: "",
  type: "success", // success | error
});


  // Load events + athletes
  useEffect(() => {
    async function loadInitial() {
      const [evRes, atRes] = await Promise.all([
        api.get("/events"),
        api.get("/athletes"),
      ]);
      setEvents(evRes.data.data || evRes.data);
      setAthletes(atRes.data.data || atRes.data);
    }
    loadInitial();
  }, []);

  async function loadHeatsForEvent(eventId) {
    setForm({ ...form, eventId, heatId: "" });
    if (!eventId) return;

    const res = await api.get(`/heats/event/${eventId}`);
    setHeats(res.data.data || res.data);
  }

async function submit(e) {
  e.preventDefault();

  try {
    await api.post("/results", {
      heatId: form.heatId,
      athleteId: form.athleteId,
      lane: Number(form.lane),
      reactionTime: parseFloat(form.reactionTime || 0),
      finishTime: form.finishTime
        ? parseFloat(form.finishTime)
        : null,
      status: form.status,
    });

    setPopup({
      open: true,
      message: "Result saved successfully",
      type: "success",
    });

    // optional: reset some fields
    setForm({
      ...form,
      athleteId: "",
      lane: 1,
      reactionTime: "",
      finishTime: "",
      status: "OK",
    });

    // auto close
    setTimeout(() => {
      setPopup({ open: false, message: "", type: "success" });
    }, 2000);
  } catch (err) {
    setPopup({
      open: true,
      message: "Failed to save result",
      type: "error",
    });
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
          <Select
            value={form.eventId}
            onValueChange={(val) => loadHeatsForEvent(val)}
          >
            <SelectTrigger>
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

          <Select
            value={form.heatId}
            onValueChange={(val) =>
              setForm({ ...form, heatId: val })
            }
            disabled={!form.eventId}
          >
            <SelectTrigger>
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
        </CardContent>
      </Card>

      {/* RESULT FORM */}
      {form.heatId && (
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Enter Result</CardTitle>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={submit}
              className="grid grid-cols-1 md:grid-cols-6 gap-4"
            >
              {/* Athlete */}
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Athlete</label>
                <Select
                  value={form.athleteId}
                  onValueChange={(val) =>
                    setForm({ ...form, athleteId: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Athlete" />
                  </SelectTrigger>
                  <SelectContent>
                    {athletes.map((a) => (
                      <SelectItem key={a.id} value={String(a.id)}>
                        {a.name} ({a.country})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Lane */}
              <div>
                <label className="text-sm font-medium">Lane</label>
                <Input
                  type="number"
                  value={form.lane}
                  onChange={(e) =>
                    setForm({ ...form, lane: e.target.value })
                  }
                />
              </div>

              {/* Reaction */}
              <div>
                <label className="text-sm font-medium">Reaction (s)</label>
                <Input
                  placeholder="0.135"
                  value={form.reactionTime}
                  onChange={(e) =>
                    setForm({ ...form, reactionTime: e.target.value })
                  }
                />
              </div>

              {/* Finish */}
              <div>
                <label className="text-sm font-medium">Finish (s)</label>
                <Input
                  placeholder="9.58"
                  value={form.finishTime}
                  onChange={(e) =>
                    setForm({ ...form, finishTime: e.target.value })
                  }
                />
              </div>

              {/* Status */}
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={form.status}
                  onValueChange={(val) =>
                    setForm({ ...form, status: val })
                  }
                >
                  <SelectTrigger>
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
              </div>

              {/* Submit */}
              <div className="flex items-end">
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
