import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CountrySelect({ value, onChange, className, hasError }) {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name")
      .then((res) => res.json())
      .then((data) => {
        const sorted = data
          .map((c) => c.name.common)
          .sort((a, b) => a.localeCompare(b));
        setCountries(sorted);
      })
      .catch((err) => {
        console.error("Failed to load countries:", err);
      });
  }, []);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={cn(
        "bg-slate-700 border-slate-600 text-white focus:border-green-500 focus:ring-green-500",
        hasError && "border-red-500",
        className
      )}>
        <SelectValue placeholder="Select Country" />
      </SelectTrigger>
      <SelectContent className="bg-slate-800 border-slate-700">
        {countries.map((country) => (
          <SelectItem key={country} value={country} className="text-white hover:bg-slate-700">
            {country}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
