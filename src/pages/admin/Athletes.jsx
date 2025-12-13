import React, { useEffect, useState } from "react";
import api from "../../services/api";
import CountrySelect from "../../components/CountrySelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
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
   const { toast } = useToast();
  const [athletes, setAthletes] = useState([]);
  const [form, setForm] = useState({
    name: "",
    country: "",
    age: "",
    gender: "M",
    personalBest: "",
    seasonBest: "",
  });
  

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    const res = await api.get("/athletes");
    setAthletes(res.data.data || res.data);
  }

  async function create(e) {
    e.preventDefault();

    const payload = { ...form, age: Number(form.age) };
    if (!payload.personalBest) delete payload.personalBest;
    if (!payload.seasonBest) delete payload.seasonBest;

    await api.post("/athletes/create", payload);
    toast({
    title: "Athlete added successfully 🏃",
    description: `${form.name} has been registered.`,
  });

    setForm({ name:"", country:"", age:"", gender:"M", personalBest:"", seasonBest:"" });
    fetchAll();
  }

  return (
    <div className="space-y-8">

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
                onChange={(e)=>setForm({ ...form, name:e.target.value })}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Country</label>
              <CountrySelect
                value={form.country}
                onChange={(val)=>setForm({ ...form, country:val })}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Age</label>
              <Input
                type="number"
                placeholder="Age"
                value={form.age}
                onChange={(e)=>setForm({ ...form, age:e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Gender</label>
              <Select
                value={form.gender}
                onValueChange={(val)=>setForm({ ...form, gender:val })}
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
                    {a.gender === "M" ? "Male" : a.gender === "F" ? "Female" : "Other"}
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

