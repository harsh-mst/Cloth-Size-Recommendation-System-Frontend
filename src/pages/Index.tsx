// import { useState } from "react";
// import { ChevronDown, ChevronUp, Ruler, Scale, Shirt } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible";
// import BodySilhouette from "@/components/BodySilhouette";

// type Unit = "metric" | "imperial";
// type SizeOption = "XS" | "S" | "M" | "L" | "XL" | "XXL";

// interface SizeRow {
//   size: SizeOption;
//   heightCm: string;
//   weightKg: string;
//   chestCm: string;
//   waistCm: string;
// }

// const SIZE_CHART: SizeRow[] = [
//   { size: "XS", heightCm: "150–160", weightKg: "45–55", chestCm: "76–84", waistCm: "60–68" },
//   { size: "S", heightCm: "158–168", weightKg: "54–64", chestCm: "84–92", waistCm: "68–76" },
//   { size: "M", heightCm: "166–176", weightKg: "63–75", chestCm: "92–100", waistCm: "76–84" },
//   { size: "L", heightCm: "174–184", weightKg: "74–88", chestCm: "100–108", waistCm: "84–92" },
//   { size: "XL", heightCm: "180–190", weightKg: "87–102", chestCm: "108–116", waistCm: "92–100" },
//   { size: "XXL", heightCm: "188–198", weightKg: "100–120", chestCm: "116–124", waistCm: "100–108" },
// ];

// const SIZES: SizeOption[] = ["XS", "S", "M", "L", "XL", "XXL"];

// // Convert imperial to metric for calculation
// function toMetric(value: number, type: "height" | "weight", unit: Unit) {
//   if (unit === "metric") return value;
//   if (type === "height") return value * 2.54; // inches → cm
//   return value * 0.453592; // lbs → kg
// }

// function getRecommendedSize(
//   heightRaw: number,
//   weightRaw: number,
//   unit: Unit
// ): { size: SizeOption; exact: boolean } {
//   const height = toMetric(heightRaw, "height", unit);
//   const weight = toMetric(weightRaw, "weight", unit);

//   const ranges = [
//     { size: "XS" as SizeOption, hMin: 150, hMax: 160, wMin: 45, wMax: 55 },
//     { size: "S" as SizeOption, hMin: 158, hMax: 168, wMin: 54, wMax: 64 },
//     { size: "M" as SizeOption, hMin: 166, hMax: 176, wMin: 63, wMax: 75 },
//     { size: "L" as SizeOption, hMin: 174, hMax: 184, wMin: 74, wMax: 88 },
//     { size: "XL" as SizeOption, hMin: 180, hMax: 190, wMin: 87, wMax: 102 },
//     { size: "XXL" as SizeOption, hMin: 188, hMax: 200, wMin: 100, wMax: 120 },
//   ];

//   // Exact match
//   for (const r of ranges) {
//     if (height >= r.hMin && height <= r.hMax && weight >= r.wMin && weight <= r.wMax) {
//       return { size: r.size, exact: true };
//     }
//   }

//   // Closest match by distance
//   let best = ranges[0];
//   let bestDist = Infinity;
//   for (const r of ranges) {
//     const hMid = (r.hMin + r.hMax) / 2;
//     const wMid = (r.wMin + r.wMax) / 2;
//     const dist = Math.hypot(height - hMid, weight - wMid);
//     if (dist < bestDist) { bestDist = dist; best = r; }
//   }
//   return { size: best.size, exact: false };
// }

// function cmToIn(val: string) {
//   return val.replace(/(\d+)/g, (n) => Math.round(+n / 2.54).toString());
// }
// function kgToLbs(val: string) {
//   return val.replace(/(\d+)/g, (n) => Math.round(+n * 2.205).toString());
// }

// function convertRow(row: SizeRow, unit: Unit): SizeRow {
//   if (unit === "metric") return row;
//   return {
//     ...row,
//     heightCm: cmToIn(row.heightCm),
//     weightKg: kgToLbs(row.weightKg),
//     chestCm: cmToIn(row.chestCm),
//     waistCm: cmToIn(row.waistCm),
//   };
// }

// const SIZE_COLOR: Record<SizeOption, string> = {
//   XS: "hsl(255,75%,55%)",
//   S: "hsl(275,80%,50%)",
//   M: "hsl(315,85%,52%)",
//   L: "hsl(330,85%,55%)",
//   XL: "hsl(15,90%,55%)",
//   XXL: "hsl(35,90%,52%)",
// };

// const Index = () => {
//   const [unit, setUnit] = useState<Unit>("metric");
//   const [height, setHeight] = useState("");
//   const [weight, setWeight] = useState("");
//   const [chest, setChest] = useState<SizeOption | "">("");
//   const [waist, setWaist] = useState<SizeOption | "">("");
//   const [result, setResult] = useState<{ size: SizeOption; exact: boolean } | null>(null);
//   const [chartOpen, setChartOpen] = useState(false);
//   const [errors, setErrors] = useState<{ height?: string; weight?: string }>({});

//   const heightPlaceholder = unit === "metric" ? "e.g. 172" : "e.g. 68";
//   const weightPlaceholder = unit === "metric" ? "e.g. 70" : "e.g. 154";
//   const heightUnit = unit === "metric" ? "cm" : "in";
//   const weightUnit = unit === "metric" ? "kg" : "lbs";

//   const handleSubmit = () => {
//     const errs: { height?: string; weight?: string } = {};
//     if (!height || isNaN(+height)) errs.height = "Please enter a valid height.";
//     if (!weight || isNaN(+weight)) errs.weight = "Please enter a valid weight.";
//     setErrors(errs);
//     if (Object.keys(errs).length) return;

//     const res = getRecommendedSize(+height, +weight, unit);
//     setResult(res);
//     setTimeout(() => {
//       document.getElementById("result-section")?.scrollIntoView({ behavior: "smooth", block: "center" });
//     }, 100);
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       {/* ===== HERO ===== */}
//       <header className="gradient-hero relative overflow-hidden">
//         <div
//           className="absolute inset-0 opacity-10"
//           style={{
//             backgroundImage:
//               "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
//             backgroundSize: "60px 60px",
//           }}
//         />
//         <div className="relative z-10 flex flex-col items-center justify-center py-16 px-4 text-center">
//           <div className="flex items-center gap-2 mb-4">
//             <Shirt className="w-8 h-8 text-white/90" />
//             <span className="text-white/70 text-sm font-semibold tracking-widest uppercase">TrytoFit</span>
//           </div>
//           <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-3 leading-tight tracking-tight">
//             Find Your <span className="text-yellow-300">Perfect</span> Fit
//           </h1>
//           <p className="text-white/80 text-lg md:text-xl max-w-md">
//             Enter your measurements and get your ideal clothing size instantly — no guesswork.
//           </p>
//         </div>
//       </header>

//       {/* ===== MAIN CONTENT ===== */}
//       <main className="max-w-5xl mx-auto px-4 py-10">

//         {/* === FORM CARD === */}
//         <section
//           aria-label="Size recommender form"
//           className="bg-card rounded-2xl shadow-card-brand border border-border overflow-hidden mb-8"
//         >
//           <div className="grid md:grid-cols-2 gap-0">
//             {/* Left — Form */}
//             <div className="p-8 border-b md:border-b-0 md:border-r border-border">
//               <h2 className="text-2xl font-bold text-foreground mb-6">Your Measurements</h2>

//               {/* Unit Toggle */}
//               <div className="mb-6">
//                 <div className="inline-flex rounded-full p-1 bg-muted">
//                   <button
//                     onClick={() => { setUnit("metric"); setResult(null); setHeight(""); setWeight(""); }}
//                     className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${unit === "metric"
//                         ? "gradient-cta text-primary-foreground shadow-cta"
//                         : "text-muted-foreground hover:text-foreground"
//                       }`}
//                   >
//                     cm / kg
//                   </button>
//                   <button
//                     onClick={() => { setUnit("imperial"); setResult(null); setHeight(""); setWeight(""); }}
//                     className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${unit === "imperial"
//                         ? "gradient-cta text-primary-foreground shadow-cta"
//                         : "text-muted-foreground hover:text-foreground"
//                       }`}
//                   >
//                     in / lbs
//                   </button>
//                 </div>
//               </div>

//               {/* Height */}
//               <div className="mb-5">
//                 <Label className="flex items-center gap-2 mb-2 text-sm font-semibold text-foreground">
//                   <Ruler className="w-4 h-4 text-primary" />
//                   Height ({heightUnit})
//                 </Label>
//                 <div className="relative">
//                   <Input
//                     type="number"
//                     placeholder={heightPlaceholder}
//                     value={height}
//                     onChange={(e) => { setHeight(e.target.value); setErrors((p) => ({ ...p, height: undefined })); }}
//                     className={`pr-12 border-2 focus-visible:ring-primary/30 ${errors.height ? "border-destructive" : "border-input focus:border-primary"}`}
//                   />
//                   <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
//                     {heightUnit}
//                   </span>
//                 </div>
//                 {errors.height && <p className="text-destructive text-xs mt-1">{errors.height}</p>}
//               </div>

//               {/* Weight */}
//               <div className="mb-5">
//                 <Label className="flex items-center gap-2 mb-2 text-sm font-semibold text-foreground">
//                   <Scale className="w-4 h-4 text-primary" />
//                   Weight ({weightUnit})
//                 </Label>
//                 <div className="relative">
//                   <Input
//                     type="number"
//                     placeholder={weightPlaceholder}
//                     value={weight}
//                     onChange={(e) => { setWeight(e.target.value); setErrors((p) => ({ ...p, weight: undefined })); }}
//                     className={`pr-14 border-2 focus-visible:ring-primary/30 ${errors.weight ? "border-destructive" : "border-input focus:border-primary"}`}
//                   />
//                   <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
//                     {weightUnit}
//                   </span>
//                 </div>
//                 {errors.weight && <p className="text-destructive text-xs mt-1">{errors.weight}</p>}
//               </div>

//               {/* Chest size buttons */}
//               <div className="mb-5">
//                 <Label className="block mb-2 text-sm font-semibold text-foreground">Chest Size (optional)</Label>
//                 <div className="flex flex-wrap gap-2">
//                   {SIZES.map((s) => (
//                     <button
//                       key={s}
//                       onClick={() => setChest(chest === s ? "" : s)}
//                       className={`w-12 h-10 rounded-lg text-sm font-bold border-2 transition-all duration-200 ${chest === s
//                           ? "border-primary text-primary-foreground shadow-sm"
//                           : "border-border text-muted-foreground hover:border-primary hover:text-primary"
//                         }`}
//                       style={chest === s ? { background: SIZE_COLOR[s], borderColor: SIZE_COLOR[s] } : {}}
//                     >
//                       {s}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Waist size buttons */}
//               <div className="mb-7">
//                 <Label className="block mb-2 text-sm font-semibold text-foreground">Waist Size (optional)</Label>
//                 <div className="flex flex-wrap gap-2">
//                   {SIZES.map((s) => (
//                     <button
//                       key={s}
//                       onClick={() => setWaist(waist === s ? "" : s)}
//                       className={`w-12 h-10 rounded-lg text-sm font-bold border-2 transition-all duration-200 ${waist === s
//                           ? "border-secondary text-secondary-foreground shadow-sm"
//                           : "border-border text-muted-foreground hover:border-secondary hover:text-secondary"
//                         }`}
//                       style={waist === s ? { background: SIZE_COLOR[s], borderColor: SIZE_COLOR[s] } : {}}
//                     >
//                       {s}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* CTA Button */}
//               <button
//                 onClick={handleSubmit}
//                 className="w-full py-4 rounded-xl text-lg font-extrabold text-white gradient-cta shadow-cta
//                   hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 tracking-wide"
//               >
//                 Get My Size →
//               </button>
//             </div>

//             {/* Right — Body Silhouette */}
//             <div className="flex items-center justify-center p-6 md:p-10 bg-gradient-to-br from-primary/5 to-secondary/5">
//               <BodySilhouette unit={unit} />
//             </div>
//           </div>
//         </section>

//         {/* === RESULT CARD === */}
//         {result && (
//           <section
//             id="result-section"
//             aria-label="Size recommendation result"
//             className="mb-8 animate-scale-in"
//           >
//             <div
//               className="rounded-2xl p-8 text-white text-center shadow-result overflow-hidden relative"
//               style={{
//                 background: `linear-gradient(135deg, ${SIZE_COLOR[result.size]}, hsl(275,80%,35%))`,
//               }}
//             >
//               {/* background pattern */}
//               <div
//                 className="absolute inset-0 opacity-10"
//                 style={{
//                   backgroundImage: "radial-gradient(circle at 70% 30%, white 1.5px, transparent 1.5px)",
//                   backgroundSize: "40px 40px",
//                 }}
//               />
//               <div className="relative z-10">
//                 <p className="text-white/70 text-sm font-semibold tracking-widest uppercase mb-2">
//                   Your Recommended Size
//                 </p>
//                 <div className="text-8xl font-black my-4 drop-shadow-lg tracking-tight">
//                   {result.size}
//                 </div>
//                 <Badge
//                   className={`mb-4 text-sm font-bold px-4 py-1 ${result.exact
//                       ? "bg-green-400/30 text-green-100 border border-green-300/40"
//                       : "bg-yellow-400/30 text-yellow-100 border border-yellow-300/40"
//                     }`}
//                 >
//                   {result.exact ? "✓ Exact match" : "~ Closest match"}
//                 </Badge>
//                 <p className="text-white/85 text-base max-w-sm mx-auto leading-relaxed">
//                   {result.exact
//                     ? `Based on your measurements, ${result.size} is your perfect fit.`
//                     : `Your measurements are closest to ${result.size}. We recommend trying ${result.size} as your starting point.`}
//                 </p>
//                 {(chest || waist) && (
//                   <p className="text-white/60 text-sm mt-3">
//                     Selected preferences — Chest: {chest || "—"} · Waist: {waist || "—"}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </section>
//         )}

//         {/* === SIZE CHART === */}
//         <section aria-label="Size chart">
//           <Collapsible open={chartOpen} onOpenChange={setChartOpen}>
//             <CollapsibleTrigger asChild>
//               <button className="w-full flex items-center justify-between px-6 py-4 bg-card border border-border rounded-2xl shadow-sm hover:shadow-card-brand transition-all duration-200 group mb-2">
//                 <div className="flex items-center gap-3">
//                   <div className="w-8 h-8 rounded-lg gradient-cta flex items-center justify-center">
//                     <Shirt className="w-4 h-4 text-white" />
//                   </div>
//                   <span className="font-bold text-foreground text-lg">Full Size Chart</span>
//                   {result && (
//                     <Badge className="bg-primary/10 text-primary border border-primary/20 text-xs font-bold">
//                       {result.size} highlighted
//                     </Badge>
//                   )}
//                 </div>
//                 {chartOpen
//                   ? <ChevronUp className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
//                   : <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
//                 }
//               </button>
//             </CollapsibleTrigger>

//             <CollapsibleContent className="animate-accordion-down">
//               <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
//                 <div className="overflow-x-auto">
//                   <table className="w-full text-sm">
//                     <thead>
//                       <tr className="gradient-cta text-white">
//                         <th className="px-5 py-3 text-left font-bold">Size</th>
//                         <th className="px-5 py-3 text-left font-bold">
//                           Height ({unit === "metric" ? "cm" : "in"})
//                         </th>
//                         <th className="px-5 py-3 text-left font-bold">
//                           Weight ({unit === "metric" ? "kg" : "lbs"})
//                         </th>
//                         <th className="px-5 py-3 text-left font-bold">
//                           Chest ({unit === "metric" ? "cm" : "in"})
//                         </th>
//                         <th className="px-5 py-3 text-left font-bold">
//                           Waist ({unit === "metric" ? "cm" : "in"})
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {SIZE_CHART.map((row, i) => {
//                         const converted = convertRow(row, unit);
//                         const isHighlighted = result?.size === row.size;
//                         return (
//                           <tr
//                             key={row.size}
//                             className={`border-b border-border transition-colors ${isHighlighted
//                                 ? "text-white font-bold"
//                                 : i % 2 === 0 ? "bg-muted/30" : "bg-background"
//                               }`}
//                             style={isHighlighted ? { background: SIZE_COLOR[row.size] } : {}}
//                           >
//                             <td className="px-5 py-3">
//                               <span
//                                 className={`inline-flex items-center justify-center w-10 h-8 rounded-lg text-xs font-extrabold ${isHighlighted ? "bg-white/20 text-white" : "bg-muted text-foreground"
//                                   }`}
//                               >
//                                 {row.size}
//                               </span>
//                             </td>
//                             <td className="px-5 py-3">{converted.heightCm}</td>
//                             <td className="px-5 py-3">{converted.weightKg}</td>
//                             <td className="px-5 py-3">{converted.chestCm}</td>
//                             <td className="px-5 py-3">{converted.waistCm}</td>
//                           </tr>
//                         );
//                       })}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </CollapsibleContent>
//           </Collapsible>
//         </section>
//       </main>

//       {/* ===== FOOTER ===== */}
//       <footer className="mt-10 border-t border-border">
//         <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-3">
//           <div className="flex items-center gap-2">
//             <Shirt className="w-5 h-5 text-primary" />
//             <span className="font-bold text-foreground">TrytoFit</span>
//           </div>
//           <p className="text-sm text-muted-foreground text-center">
//             Your perfect fit, every time. Size charts are general guidelines — always try before you buy.
//           </p>
//           <p className="text-xs text-muted-foreground">© 2026 TrytoFit</p>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Index;










// ==============================================================================================







// import { useState } from "react";
// import { ChevronDown, ChevronUp, Ruler, Scale, Shirt } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible";
// import BodySilhouette from "@/components/BodySilhouette";

// type Unit = "metric" | "imperial";
// type SizeOption = "XS" | "S" | "M" | "L" | "XL" | "XXL";

// interface SizeRow {
//   size: SizeOption;
//   heightCm: string;
//   weightKg: string;
//   chestCm: string;
//   waistCm: string;
// }

// const SIZE_CHART: SizeRow[] = [
//   {
//     size: "XS",
//     heightCm: "150–160",
//     weightKg: "45–55",
//     chestCm: "76–84",
//     waistCm: "60–68",
//   },
//   {
//     size: "S",
//     heightCm: "158–168",
//     weightKg: "54–64",
//     chestCm: "84–92",
//     waistCm: "68–76",
//   },
//   {
//     size: "M",
//     heightCm: "166–176",
//     weightKg: "63–75",
//     chestCm: "92–100",
//     waistCm: "76–84",
//   },
//   {
//     size: "L",
//     heightCm: "174–184",
//     weightKg: "74–88",
//     chestCm: "100–108",
//     waistCm: "84–92",
//   },
//   {
//     size: "XL",
//     heightCm: "180–190",
//     weightKg: "87–102",
//     chestCm: "108–116",
//     waistCm: "92–100",
//   },
//   {
//     size: "XXL",
//     heightCm: "188–198",
//     weightKg: "100–120",
//     chestCm: "116–124",
//     waistCm: "100–108",
//   },
// ];

// const SIZES: SizeOption[] = ["S", "M", "L"];

// function cmToIn(val: string) {
//   return val.replace(/(\d+)/g, (n) => Math.round(+n / 2.54).toString());
// }
// function kgToLbs(val: string) {
//   return val.replace(/(\d+)/g, (n) => Math.round(+n * 2.205).toString());
// }

// function convertRow(row: SizeRow, unit: Unit): SizeRow {
//   if (unit === "metric") return row;
//   return {
//     ...row,
//     heightCm: cmToIn(row.heightCm),
//     weightKg: kgToLbs(row.weightKg),
//     chestCm: cmToIn(row.chestCm),
//     waistCm: cmToIn(row.waistCm),
//   };
// }

// const SIZE_COLOR: Record<SizeOption, string> = {
//   XS: "hsl(255,75%,55%)",
//   S: "hsl(275,80%,50%)",
//   M: "hsl(315,85%,52%)",
//   L: "hsl(330,85%,55%)",
//   XL: "hsl(15,90%,55%)",
//   XXL: "hsl(35,90%,52%)",
// };

// const Index = () => {
//   const [unit, setUnit] = useState<Unit>("metric");
//   const [height, setHeight] = useState("");
//   const [heightFeet, setHeightFeet] = useState("");
//   const [heightInches, setHeightInches] = useState("");
//   const [weight, setWeight] = useState("");
//   const [chest, setChest] = useState<SizeOption | "">("");
//   const [waist, setWaist] = useState<SizeOption | "">("");
//   const [result, setResult] = useState<{
//     size: SizeOption;
//     confidence: number;
//   } | null>(null);
//   const [chartOpen, setChartOpen] = useState(false);
//   const [errors, setErrors] = useState<{ height?: string; weight?: string }>(
//     {},
//   );
//   const [loading, setLoading] = useState(false);

//   const heightUnit = unit === "metric" ? "cm" : "in";
//   const weightUnit = unit === "metric" ? "kg" : "lbs";

//   const handleSubmit = async () => {
//     // const errs: { height?: string; weight?: string } = {};
//     // if (!height || isNaN(+height)) errs.height = "Please enter a valid height.";
//     // if (!weight || isNaN(+weight)) errs.weight = "Please enter a valid weight.";
//     // setErrors(errs);
//     // if (Object.keys(errs).length) return;

//     const errs: { height?: string; weight?: string } = {};

//     if (unit === "metric") {
//       if (!height || isNaN(+height)) {
//         errs.height = "Please enter a valid height in cm.";
//       }
//     } else {
//       if (!heightFeet || isNaN(+heightFeet)) {
//         errs.height = "Please enter feet.";
//       } else if (!heightInches || isNaN(+heightInches)) {
//         errs.height = "Please enter inches.";
//       } else if (+heightInches < 0 || +heightInches > 11) {
//         errs.height = "Inches must be between 0 and 11.";
//       }
//     }

//     if (!weight || isNaN(+weight)) {
//       errs.weight = "Please enter a valid weight.";
//     }
//     setErrors(errs);
//     if (Object.keys(errs).length) return;

//     setLoading(true);

//     try {
//       // Convert to metric before sending
//       const heightCm =
//         unit === "imperial" ? Number(height) * 2.54 : Number(height);
//       const weightKg =
//         unit === "imperial" ? Number(weight) * 0.453592 : Number(weight);

//       const response = await fetch("http://127.0.0.1:8000/predict", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           height: heightCm,
//           weight: weightKg,
//           chest_size: chest || "M",
//           waist_size: waist || "M",
//         }),
//       });

//       if (!response.ok) throw new Error("API error");

//       const data = await response.json();

//       setResult({
//         size: data.predicted_size,
//         confidence: data.confidence,
//       });

//       setTimeout(() => {
//         document
//           .getElementById("result-section")
//           ?.scrollIntoView({ behavior: "smooth", block: "center" });
//       }, 100);
//     } catch (error) {
//       console.error("Prediction failed:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       {/* ===== HERO ===== */}
//       <header className="gradient-hero relative overflow-hidden">
//         <div
//           className="absolute inset-0 opacity-10"
//           style={{
//             backgroundImage:
//               "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
//             backgroundSize: "60px 60px",
//           }}
//         />
//         <div className="relative z-10 flex flex-col items-center justify-center py-16 px-4 text-center">
//           <div className="flex items-center gap-2 mb-4">
//             <Shirt className="w-8 h-8 text-white/90" />
//             <span className="text-white/70 text-sm font-semibold tracking-widest uppercase">
//               TrytoFit
//             </span>
//           </div>
//           <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-3 leading-tight tracking-tight">
//             Find Your <span className="text-yellow-300">Perfect</span> Fit
//           </h1>
//           <p className="text-white/80 text-lg md:text-xl max-w-md">
//             Enter your measurements and get your ideal clothing size instantly —
//             no guesswork.
//           </p>
//         </div>
//       </header>

//       <main className="max-w-5xl mx-auto px-4 py-10">
//         {/* FORM */}
//         <section className="bg-card rounded-2xl shadow-card-brand border border-border overflow-hidden mb-8">
//           <div className="grid md:grid-cols-2 gap-0">
//             <div className="p-8 border-b md:border-b-0 md:border-r border-border">
//               <h2 className="text-2xl font-bold text-foreground mb-6">
//                 Your Measurements
//               </h2>

//               {/* Unit Toggle */}
//               <div className="mb-6">
//                 <div className="inline-flex rounded-full p-1 bg-muted">
//                   <button
//                     onClick={() => {
//                       setUnit("metric");
//                       setResult(null);
//                     }}
//                     className={`px-5 py-2 rounded-full text-sm font-semibold ${
//                       unit === "metric"
//                         ? "gradient-cta text-white"
//                         : "text-muted-foreground"
//                     }`}
//                   >
//                     cm / kg
//                   </button>
//                   <button
//                     onClick={() => {
//                       setUnit("imperial");
//                       setResult(null);
//                     }}
//                     className={`px-5 py-2 rounded-full text-sm font-semibold ${
//                       unit === "imperial"
//                         ? "gradient-cta text-white"
//                         : "text-muted-foreground"
//                     }`}
//                   >
//                     in / lbs
//                   </button>
//                 </div>
//               </div>

//               {/* Height */}
//               {/* <div className="mb-5">
//                 <Label className="flex items-center gap-2 mb-2 text-sm font-semibold">
//                   <Ruler className="w-4 h-4" />
//                   Height ({heightUnit})
//                 </Label>
//                 <Input
//                   type="number"
//                   value={height}
//                   onChange={(e) => setHeight(e.target.value)}
//                 />
//               </div> */}

//               {/* Height */}
//               <div className="mb-5">
//                 <Label className="flex items-center gap-2 mb-2 text-sm font-semibold">
//                   <Ruler className="w-4 h-4" />
//                   Height ({unit === "metric" ? "cm" : "ft / in"})
//                 </Label>

//                 {unit === "metric" ? (
//                   <Input
//                     type="number"
//                     value={height}
//                     min={140}
//                     max={210}
//                     onChange={(e) => setHeight(e.target.value)}
//                     placeholder="e.g. 175"
//                   />
//                 ) : (
//                   <div className="flex gap-3">
//                     <Input
//                       type="number"
//                       value={heightFeet}
//                       min={4}
//                       max={7}
//                       onChange={(e) => setHeightFeet(e.target.value)}
//                       placeholder="ft"
//                     />
//                     <Input
//                       type="number"
//                       value={heightInches}
//                       min={0}
//                       max={11}
//                       onChange={(e) => setHeightInches(e.target.value)}
//                       placeholder="in"
//                     />
//                   </div>
//                 )}

//                 {errors.height && (
//                   <p className="mt-1 text-xs text-red-500">{errors.height}</p>
//                 )}
//               </div>

//               {/* Weight */}
//               <div className="mb-5">
//                 <Label className="flex items-center gap-2 mb-2 text-sm font-semibold">
//                   <Scale className="w-4 h-4" />
//                   Weight ({weightUnit})
//                 </Label>
//                 <Input
//                   type="number"
//                   value={weight}
//                   onChange={(e) => setWeight(e.target.value)}
//                 />
//               </div>

//               {/* Chest size buttons */}
//               <div className="mb-5">
//                 <Label className="block mb-2 text-sm font-semibold text-foreground">
//                   Chest Size (optional)
//                 </Label>
//                 <div className="flex flex-wrap gap-2">
//                   {SIZES.map((s) => (
//                     <button
//                       key={s}
//                       onClick={() => setChest(chest === s ? "" : s)}
//                       className={`w-12 h-10 rounded-lg text-sm font-bold border-2 transition-all duration-200 ${
//                         chest === s
//                           ? "border-primary text-primary-foreground shadow-sm"
//                           : "border-border text-muted-foreground hover:border-primary hover:text-primary"
//                       }`}
//                       style={
//                         chest === s
//                           ? {
//                               background: SIZE_COLOR[s],
//                               borderColor: SIZE_COLOR[s],
//                             }
//                           : {}
//                       }
//                     >
//                       {s}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Waist size buttons */}
//               <div className="mb-7">
//                 <Label className="block mb-2 text-sm font-semibold text-foreground">
//                   Waist Size (optional)
//                 </Label>
//                 <div className="flex flex-wrap gap-2">
//                   {SIZES.map((s) => (
//                     <button
//                       key={s}
//                       onClick={() => setWaist(waist === s ? "" : s)}
//                       className={`w-12 h-10 rounded-lg text-sm font-bold border-2 transition-all duration-200 ${
//                         waist === s
//                           ? "border-secondary text-secondary-foreground shadow-sm"
//                           : "border-border text-muted-foreground hover:border-secondary hover:text-secondary"
//                       }`}
//                       style={
//                         waist === s
//                           ? {
//                               background: SIZE_COLOR[s],
//                               borderColor: SIZE_COLOR[s],
//                             }
//                           : {}
//                       }
//                     >
//                       {s}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Submit */}
//               <button
//                 onClick={handleSubmit}
//                 className="w-full py-4 rounded-xl text-lg font-extrabold text-white gradient-cta"
//               >
//                 {loading ? "Calculating..." : "Get My Size →"}
//               </button>
//             </div>

//             <div className="flex items-center justify-center p-6 md:p-10 bg-gradient-to-br from-primary/5 to-secondary/5">
//               <BodySilhouette unit={unit} />
//             </div>
//           </div>
//         </section>

//         {/* RESULT */}
//         {result && (
//           <section id="result-section" className="mb-8">
//             <div
//               className="rounded-2xl p-8 text-white text-center shadow-result"
//               style={{
//                 background: `linear-gradient(135deg, ${SIZE_COLOR[result.size]}, hsl(275,80%,35%))`,
//               }}
//             >
//               <p className="text-sm uppercase mb-2">Recommended Size</p>
//               <div className="text-8xl font-black my-4">{result.size}</div>
//               <p className="text-base">Confidence: {result.confidence}%</p>
//             </div>
//           </section>
//         )}

//         {/* === SIZE CHART === */}
//         <section aria-label="Size chart">
//           <Collapsible open={chartOpen} onOpenChange={setChartOpen}>
//             <CollapsibleTrigger asChild>
//               <button className="w-full flex items-center justify-between px-6 py-4 bg-card border border-border rounded-2xl shadow-sm hover:shadow-card-brand transition-all duration-200 group mb-2">
//                 <div className="flex items-center gap-3">
//                   <div className="w-8 h-8 rounded-lg gradient-cta flex items-center justify-center">
//                     <Shirt className="w-4 h-4 text-white" />
//                   </div>
//                   <span className="font-bold text-foreground text-lg">
//                     Full Size Chart
//                   </span>
//                   {result && (
//                     <Badge className="bg-primary/10 text-primary border border-primary/20 text-xs font-bold">
//                       {result.size} highlighted
//                     </Badge>
//                   )}
//                 </div>
//                 {chartOpen ? (
//                   <ChevronUp className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
//                 ) : (
//                   <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
//                 )}
//               </button>
//             </CollapsibleTrigger>

//             <CollapsibleContent className="animate-accordion-down">
//               <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
//                 <div className="overflow-x-auto">
//                   <table className="w-full text-sm">
//                     <thead>
//                       <tr className="gradient-cta text-white">
//                         <th className="px-5 py-3 text-left font-bold">Size</th>
//                         <th className="px-5 py-3 text-left font-bold">
//                           Height ({unit === "metric" ? "cm" : "in"})
//                         </th>
//                         <th className="px-5 py-3 text-left font-bold">
//                           Weight ({unit === "metric" ? "kg" : "lbs"})
//                         </th>
//                         <th className="px-5 py-3 text-left font-bold">
//                           Chest ({unit === "metric" ? "cm" : "in"})
//                         </th>
//                         <th className="px-5 py-3 text-left font-bold">
//                           Waist ({unit === "metric" ? "cm" : "in"})
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {SIZE_CHART.map((row, i) => {
//                         const converted = convertRow(row, unit);
//                         const isHighlighted = result?.size === row.size;
//                         return (
//                           <tr
//                             key={row.size}
//                             className={`border-b border-border transition-colors ${
//                               isHighlighted
//                                 ? "text-white font-bold"
//                                 : i % 2 === 0
//                                   ? "bg-muted/30"
//                                   : "bg-background"
//                             }`}
//                             style={
//                               isHighlighted
//                                 ? { background: SIZE_COLOR[row.size] }
//                                 : {}
//                             }
//                           >
//                             <td className="px-5 py-3">
//                               <span
//                                 className={`inline-flex items-center justify-center w-10 h-8 rounded-lg text-xs font-extrabold ${
//                                   isHighlighted
//                                     ? "bg-white/20 text-white"
//                                     : "bg-muted text-foreground"
//                                 }`}
//                               >
//                                 {row.size}
//                               </span>
//                             </td>
//                             <td className="px-5 py-3">{converted.heightCm}</td>
//                             <td className="px-5 py-3">{converted.weightKg}</td>
//                             <td className="px-5 py-3">{converted.chestCm}</td>
//                             <td className="px-5 py-3">{converted.waistCm}</td>
//                           </tr>
//                         );
//                       })}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </CollapsibleContent>
//           </Collapsible>
//         </section>
//       </main>
//       {/* ===== FOOTER ===== */}
//       <footer className="mt-10 border-t border-border">
//         <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-3">
//           <div className="flex items-center gap-2">
//             <Shirt className="w-5 h-5 text-primary" />
//             <span className="font-bold text-foreground">TrytoFit</span>
//           </div>
//           <p className="text-sm text-muted-foreground text-center">
//             Your perfect fit, every time. Size charts are general guidelines —
//             always try before you buy.
//           </p>
//           <p className="text-xs text-muted-foreground">© 2026 TrytoFit</p>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Index;
