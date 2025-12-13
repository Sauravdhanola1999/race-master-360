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
  const [form, setForm] = useState({
    name: "",
    country: "",
    age: "",
    gender: "M",
    personalBest: "",
    seasonBest: "",
  });

  const [popup, setPopup] = useState({
    open: false,
    message: "",
    type: "success", // success | error
  });

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    const res = await api.get("/athletes");
    setAthletes(res.data.data || res.data);
  }

  async function create(e) {
    e.preventDefault();

    const payload = {
      ...form,
      age: Number(form.age),
      country: form.country.toUpperCase().slice(0, 3),
    };
    if (!payload.personalBest) delete payload.personalBest;
    if (!payload.seasonBest) delete payload.seasonBest;

    try {
      await api.post("/athletes/create", payload);

      setPopup({
        open: true,
        message: "Athlete added successfully",
        type: "success",
      });

      setForm({
        name: "",
        country: "",
        age: "",
        gender: "M",
        personalBest: "",
        seasonBest: "",
      });

      fetchAll();

      // auto-close popup
      setTimeout(() => {
        setPopup({ open: false, message: "", type: "success" });
      }, 2000);
    } catch (err) {
      setPopup({
        open: true,
        message: "Failed to add athlete",
        type: "error",
      });
    }
  }

  {
    /* POPUP */
  }

  return (
    <div className="space-y-8">
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
            {/* HEADER */}
            <h3
              className={`text-lg font-semibold mb-2 text-center
          ${popup.type === "success" ? "text-green-700" : "text-red-700"}
        `}
            >
              {popup.type === "success" ? "Success" : "Error"}
            </h3>

            {/* MESSAGE */}
            <p className="text-sm text-slate-700 text-center">
              {popup.message}
            </p>

            {/* ACTION */}
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

      {/* PAGE TITLE */}
      <div>
        <h1 className="text-2xl font-bold">Athletes</h1>
        <p className="text-sm text-muted-foreground">
          Manage registered athletes for events
        </p>
      </div>

      {/* ADD ATHLETE */}
      <Card className="border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Add Athlete</CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={create}
            className="grid grid-cols-1 md:grid-cols-6 gap-4"
          >
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Athlete Name</label>
              <Input
                placeholder="Enter name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Country</label>
              <CountrySelect
                value={form.country}
                onChange={(val) => setForm({ ...form, country: val })}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Age</label>
              <Input
                type="number"
                placeholder="Age"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Gender</label>
              <Select
                value={form.gender}
                onValueChange={(val) => setForm({ ...form, gender: val })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Male</SelectItem>
                  <SelectItem value="F">Female</SelectItem>
                  <SelectItem value="O">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                Add Athlete
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ATHLETES LIST */}
      <Card className="border border-slate-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Athletes List</CardTitle>
          <span className="text-sm text-muted-foreground">
            Total: {athletes.length}
          </span>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>PB</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {athletes.map((a, i) => (
                <TableRow
                  key={a.id}
                  className={i % 2 === 0 ? "bg-slate-50" : ""}
                >
                  <TableCell className="font-medium">{a.name}</TableCell>
                  <TableCell>{a.country}</TableCell>
                  <TableCell>{a.age}</TableCell>
                  <TableCell>
                    {a.gender === "M"
                      ? "Male"
                      : a.gender === "F"
                        ? "Female"
                        : "Other"}
                  </TableCell>
                  <TableCell>{a.personalBest ?? "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
