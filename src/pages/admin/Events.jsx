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

  async function fetchAll() {
    const res = await api.get("/events");
    setEvents(res.data.data || res.data);
  }

  useEffect(() => {
    fetchAll();
  }, []);

  async function create(e) {
    e.preventDefault();
    await api.post("/events/create", form);
    setForm({ eventName: "", category: "Men", distance: 100 });
    fetchAll();
  }

  return (
    <div className="space-y-8">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Events</h1>
        <p className="text-sm text-muted-foreground">
          Create and manage athletics events
        </p>
      </div>

      {/* ADD EVENT */}
      <Card className="border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Add Event</CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={create}
            className="grid grid-cols-1 md:grid-cols-5 gap-4"
          >
            {/* Event Name */}
            <div className="md:col-span-2">
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
                onValueChange={(val) =>
                  setForm({ ...form, category: val })
                }
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
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                Create Event
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* EVENTS LIST */}
      <Card className="border border-slate-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Events List</CardTitle>
          <span className="text-sm text-muted-foreground">
            Total: {events.length}
          </span>
        </CardHeader>

        <CardContent className="space-y-2">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="
                flex items-center justify-between
                border rounded-lg px-4 py-3
                hover:bg-slate-50 transition
              "
            >
              {/* Event Info */}
              <div>
                <div className="font-medium">
                  {ev.eventName}
                </div>
                <div className="text-sm text-muted-foreground">
                  {ev.distance}m • {ev.category}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 text-sm">
                <Link
                  to={`/admin/results?eventId=${ev.id}`}
                  className="text-indigo-600 hover:underline"
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
        </CardContent>
      </Card>
    </div>
  );
}
