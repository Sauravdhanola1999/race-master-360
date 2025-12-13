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

  const [form, setForm] = useState({
    heatNumber: "",
    round: "HEAT",
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

  async function createHeat(e) {
    e.preventDefault();

    if (!selectedEvent) return;

    await api.post("/heats", {
      eventId: selectedEvent,
      heatNumber: form.heatNumber,
      round: form.round,
    });

    setForm({ heatNumber: "", round: "HEAT" });
    loadHeats(selectedEvent);
  }

  return (
    <div className="space-y-8">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Heats</h1>
        <p className="text-sm text-muted-foreground">
          Create and manage race heats
        </p>
      </div>

      {/* EVENT SELECT */}
      <Card className="border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Select Event</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedEvent}
            onValueChange={(val) => {
              setSelectedEvent(val);
              loadHeats(val);
            }}
          >
            <SelectTrigger className="w-full md:w-96">
              <SelectValue placeholder="Choose an event" />
            </SelectTrigger>
            <SelectContent>
              {events.map((ev) => (
                <SelectItem key={ev.id} value={String(ev.id)}>
                  {ev.eventName} ({ev.distance}m)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* CREATE HEAT */}
      {selectedEvent && (
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Create Heat</CardTitle>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={createHeat}
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
              <div>
                <label className="text-sm font-medium">Heat Number</label>
                <Input
                  placeholder="1"
                  value={form.heatNumber}
                  onChange={(e) =>
                    setForm({ ...form, heatNumber: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium">Round</label>
                <Select
                  value={form.round}
                  onValueChange={(val) =>
                    setForm({ ...form, round: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HEAT">Heat</SelectItem>
                    <SelectItem value="SEMI">Semi Final</SelectItem>
                    <SelectItem value="FINAL">Final</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  Create Heat
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* HEATS LIST */}
      {selectedEvent && (
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Existing Heats</CardTitle>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Heat #</TableHead>
                  <TableHead>Round</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {heats.map((h) => (
                  <TableRow key={h.id}>
                    <TableCell>{h.heatNumber}</TableCell>
                    <TableCell>{h.round}</TableCell>
                  </TableRow>
                ))}

                {heats.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      className="text-center text-muted-foreground"
                    >
                      No heats found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
