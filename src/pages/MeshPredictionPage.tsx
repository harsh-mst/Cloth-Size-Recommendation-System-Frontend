import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, Ruler, Scale, Shirt, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import BodySilhouette from "@/components/BodySilhouette";
import ModelViewer from "@/components/ModelViewer";

type Unit = "metric" | "imperial";
type SizeOption = "XS" | "S" | "M" | "L" | "XL" | "XXL";
type GenderOption = "male" | "female";

interface SizeRow {
  size: SizeOption;
  heightCm: string;
  weightKg: string;
  chestCm: string;
  waistCm: string;
}

const SIZE_CHART: SizeRow[] = [
  { size: "XS", heightCm: "150–160", weightKg: "45–55", chestCm: "76–84", waistCm: "60–68" },
  { size: "S", heightCm: "158–168", weightKg: "54–64", chestCm: "84–92", waistCm: "68–76" },
  { size: "M", heightCm: "166–176", weightKg: "63–75", chestCm: "92–100", waistCm: "76–84" },
  { size: "L", heightCm: "174–184", weightKg: "74–88", chestCm: "100–108", waistCm: "84–92" },
  { size: "XL", heightCm: "180–190", weightKg: "87–102", chestCm: "108–116", waistCm: "92–100" },
  { size: "XXL", heightCm: "188–198", weightKg: "100–120", chestCm: "116–124", waistCm: "100–108" },
];

const SIZES: SizeOption[] = ["S", "M", "L"];

function cmToIn(val: string) {
  return val.replace(/(\d+)/g, (n) => Math.round(+n * 0.393701).toString());
}

function kgToLbs(val: string) {
  return val.replace(/(\d+)/g, (n) => Math.round(+n * 2.205).toString());
}

function convertRow(row: SizeRow, unit: Unit): SizeRow {
  if (unit === "metric") return row;
  return {
    ...row,
    heightCm: cmToIn(row.heightCm),
    weightKg: kgToLbs(row.weightKg),
    chestCm: cmToIn(row.chestCm),
    waistCm: cmToIn(row.waistCm),
  };
}

const SIZE_COLOR: Record<SizeOption, string> = {
  XS: "hsl(255,75%,55%)",
  S: "hsl(275,80%,50%)",
  M: "hsl(315,85%,52%)",
  L: "hsl(330,85%,55%)",
  XL: "hsl(15,90%,55%)",
  XXL: "hsl(35,90%,52%)",
};

const MeshPredictionPage = () => {
  const [unit, setUnit] = useState<Unit>("metric");
  const [gender, setGender] = useState<GenderOption>("male");
  const [height, setHeight] = useState("");
  const [heightFeet, setHeightFeet] = useState("");
  const [heightInches, setHeightInches] = useState("");
  const [weight, setWeight] = useState("");
  const [chest, setChest] = useState<SizeOption | "">("");
  const [waist, setWaist] = useState<SizeOption | "">("");
  const [chestCm, setChestCm] = useState("");
  const [waistCm, setWaistCm] = useState("");
  const [result, setResult] = useState<{ size: SizeOption; confidence: number } | null>(null);
  const [chartOpen, setChartOpen] = useState(false);
  const [errors, setErrors] = useState<{ height?: string; weight?: string }>({});
  const [loading, setLoading] = useState(false);
  const [generatingModel, setGeneratingModel] = useState(false);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const modelBlobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (modelBlobUrlRef.current) {
        URL.revokeObjectURL(modelBlobUrlRef.current);
      }
    };
  }, []);

  const heightUnit = unit === "metric" ? "cm" : "ft / in";
  const weightUnit = unit === "metric" ? "kg" : "lbs";

  const handleSubmit = async () => {
    const errs: { height?: string; weight?: string } = {};

    if (unit === "metric") {
      if (!height || isNaN(+height)) {
        errs.height = "Please enter a valid height.";
      } else {
        const h = Number(height);
        if (h < 140 || h > 200) {
          errs.height = "Height must be between 140 and 200 cm.";
        }
      }
    } else {
      if (!heightFeet || isNaN(+heightFeet)) {
        errs.height = "Please enter feet.";
      } else if (heightInches === "" || isNaN(+heightInches)) {
        errs.height = "Please enter inches.";
      } else {
        const cm = (Number(heightFeet) * 12 + Number(heightInches)) * 2.54;
        if (cm < 140 || cm > 200) {
          errs.height = "Height must be between 4′7″ and 6′7″.";
        }
      }
    }

    if (!weight || isNaN(+weight)) {
      errs.weight = "Please enter a valid weight.";
    } else {
      const w = Number(weight);
      const wKg = unit === "imperial" ? w * 0.453592 : w;
      if (wKg < 20 || wKg > 150) {
        errs.weight = unit === "metric"
          ? "Weight must be between 20 and 150 kg."
          : "Weight must be between 44 and 331 lbs.";
      }
    }

    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);

    try {
      let heightCmValue: number;
      if (unit === "imperial") {
        const feetNum = Number(heightFeet);
        const inchesNum = Number(heightInches);
        const totalInches = feetNum * 12 + inchesNum;
        heightCmValue = totalInches * 2.54;
      } else {
        heightCmValue = Number(height);
      }

      const weightKgValue = unit === "imperial" ? Number(weight) * 0.453592 : Number(weight);

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          height: heightCmValue,
          weight: weightKgValue,
          gender,
          chest_size: chest || "M",
          waist_size: waist || "M",
        }),
      });

      if (!response.ok) throw new Error("API error");

      const data = await response.json();

      setResult({
        size: data.predicted_size,
        confidence: data.confidence,
      });

      setTimeout(() => {
        document.getElementById("result-section")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);

      setGeneratingModel(true);

      if (modelBlobUrlRef.current) {
        URL.revokeObjectURL(modelBlobUrlRef.current);
        modelBlobUrlRef.current = null;
      }
      setModelUrl(null);

      const SIZE_TO_CHEST_CM: Record<string, number> = {
        XS: 80, S: 88, M: 96, L: 104, XL: 112, XXL: 120,
      };
      const SIZE_TO_WAIST_CM: Record<string, number> = {
        XS: 64, S: 72, M: 80, L: 88, XL: 96, XXL: 104,
      };

      const chestValue = chestCm !== "" ? Number(chestCm) : (chest ? SIZE_TO_CHEST_CM[chest] : 96);
      const waistValue = waistCm !== "" ? Number(waistCm) : (waist ? SIZE_TO_WAIST_CM[waist] : 80);

      const modelResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/generate-mesh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          height: heightCmValue,
          weight: weightKgValue,
          gender,
          chest_size: chest || "M",
          waist_size: waist || "M",
          chest_cm: chestValue,
          waist_cm: waistValue,
        }),
      });

      if (modelResponse.ok) {
        const blob = await modelResponse.blob();
        const blobUrl = URL.createObjectURL(blob);
        modelBlobUrlRef.current = blobUrl;
        setModelUrl(blobUrl);
      } else {
        console.error("3D model generation failed:", await modelResponse.text());
      }
    } catch (error) {
      console.error("Prediction or Model generation failed:", error);
    } finally {
      setLoading(false);
      setGeneratingModel(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="gradient-hero relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="flex items-center gap-2 mb-4">
            <Shirt className="w-8 h-8 text-white/90" />
            <span className="text-white/70 text-sm font-semibold tracking-widest uppercase">
              TrytoFit
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-3 leading-tight tracking-tight">
            Find Your <span className="text-yellow-300">Perfect</span> Fit
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-md">
            Enter your measurements and get your ideal clothing size instantly — no guesswork.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <section className="bg-card rounded-2xl shadow-card-brand border border-border overflow-hidden mb-8">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="p-8 border-b md:border-b-0 md:border-r border-border">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Your Measurements
              </h2>

              <div className="mb-6">
                <div className="inline-flex rounded-full p-1 bg-muted">
                  <button
                    onClick={() => {
                      setUnit("metric");
                      setResult(null);
                      setHeightFeet("");
                      setHeightInches("");
                    }}
                    className={`px-5 py-2 rounded-full text-sm font-semibold ${
                      unit === "metric" ? "gradient-cta text-white" : "text-muted-foreground"
                    }`}
                  >
                    cm / kg
                  </button>
                  <button
                    onClick={() => {
                      setUnit("imperial");
                      setResult(null);
                      setHeight("");
                    }}
                    className={`px-5 py-2 rounded-full text-sm font-semibold ${
                      unit === "imperial" ? "gradient-cta text-white" : "text-muted-foreground"
                    }`}
                  >
                    ft / in, lbs
                  </button>
                </div>
              </div>

              <div className="mb-5">
                <Label className="flex items-center gap-2 mb-2 text-sm font-semibold">
                  <User className="w-4 h-4" />
                  Gender
                </Label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setGender("male")}
                    className={`px-5 py-2 rounded-lg text-sm font-bold border-2 transition-all duration-200 ${
                      gender === "male"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                    }`}
                  >
                    Male
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender("female")}
                    className={`px-5 py-2 rounded-lg text-sm font-bold border-2 transition-all duration-200 ${
                      gender === "female"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                    }`}
                  >
                    Female
                  </button>
                </div>
              </div>

              <div className="mb-5">
                <Label className="flex items-center gap-2 mb-2 text-sm font-semibold">
                  <Ruler className="w-4 h-4" />
                  Height ({heightUnit})
                </Label>

                {unit === "metric" ? (
                  <>
                    <Input
                      type="number"
                      value={height}
                      min={140}
                      max={200}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="e.g. 175"
                    />
                    {errors.height && (
                      <p className="mt-1 text-xs text-red-500">{errors.height}</p>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex gap-3">
                      <Input
                        type="number"
                        value={heightFeet}
                        min={4}
                        max={6}
                        onChange={(e) => setHeightFeet(e.target.value)}
                        placeholder="ft"
                      />
                      <Input
                        type="number"
                        value={heightInches}
                        min={0}
                        max={11}
                        onChange={(e) => setHeightInches(e.target.value)}
                        placeholder="in"
                      />
                    </div>
                    {errors.height && (
                      <p className="mt-1 text-xs text-red-500">{errors.height}</p>
                    )}
                  </>
                )}
              </div>

              <div className="mb-5">
                <Label className="flex items-center gap-2 mb-2 text-sm font-semibold">
                  <Scale className="w-4 h-4" />
                  Weight ({weightUnit})
                </Label>
                <Input
                  type="number"
                  value={weight}
                  min={unit === "metric" ? 20 : 44}
                  max={unit === "metric" ? 150 : 331}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder={unit === "metric" ? "e.g. 70" : "e.g. 154"}
                />
                {errors.weight && (
                  <p className="mt-1 text-xs text-red-500">{errors.weight}</p>
                )}
              </div>

              <div className="mb-5">
                <Label className="block mb-2 text-sm font-semibold text-foreground">
                  Chest Size (optional)
                </Label>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setChest(chest === s ? "" : s)}
                      className={`w-12 h-10 rounded-lg text-sm font-bold border-2 transition-all duration-200 ${
                        chest === s
                          ? "border-primary text-primary-foreground shadow-sm"
                          : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                      }`}
                      style={
                        chest === s
                          ? { background: SIZE_COLOR[s], borderColor: SIZE_COLOR[s] }
                          : {}
                      }
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-7">
                <Label className="block mb-2 text-sm font-semibold text-foreground">
                  Waist Size (optional)
                </Label>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setWaist(waist === s ? "" : s)}
                      className={`w-12 h-10 rounded-lg text-sm font-bold border-2 transition-all duration-200 ${
                        waist === s
                          ? "border-secondary text-secondary-foreground shadow-sm"
                          : "border-border text-muted-foreground hover:border-secondary hover:text-secondary"
                      }`}
                      style={
                        waist === s
                          ? { background: SIZE_COLOR[s], borderColor: SIZE_COLOR[s] }
                          : {}
                      }
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                className="w-full py-4 rounded-xl text-lg font-extrabold text-white gradient-cta"
              >
                {loading ? "Calculating..." : "Get My Size →"}
              </button>
            </div>

            <div className="flex flex-col items-center justify-center p-6 md:p-10 bg-gradient-to-br from-primary/5 to-secondary/5 relative min-h-[400px]">
              {modelUrl ? (
                <ModelViewer modelUrl={modelUrl} />
              ) : (
                <>
                  <BodySilhouette unit={unit} />
                  {generatingModel && (
                    <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center flex-col gap-4 z-20">
                      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-foreground font-bold animate-pulse">Generating 3D Avatar...</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>

        {result && (
          <section id="result-section" className="mb-8">
            <div
              className="rounded-2xl p-8 text-white text-center shadow-result"
              style={{
                background: `linear-gradient(135deg, ${SIZE_COLOR[result.size]}, hsl(275,80%,35%))`,
              }}
            >
              <p className="text-sm uppercase mb-2">Recommended Size</p>
              <div className="text-8xl font-black my-4">{result.size}</div>
              <p className="text-base">Confidence: {result.confidence}%</p>
              <p className="text-sm mt-2 opacity-90">Gender: {gender}</p>
            </div>
          </section>
        )}

        <section aria-label="Size chart">
          <Collapsible open={chartOpen} onOpenChange={setChartOpen}>
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="w-full flex items-center justify-between px-6 py-4 bg-card border border-border rounded-2xl shadow-sm hover:shadow-card-brand transition-all duration-200 group mb-2"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg gradient-cta flex items-center justify-center">
                    <Shirt className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-foreground text-lg">
                    Full Size Chart
                  </span>
                  {result && (
                    <Badge className="bg-primary/10 text-primary border border-primary/20 text-xs font-bold">
                      {result.size} highlighted
                    </Badge>
                  )}
                </div>
                {chartOpen ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                )}
              </button>
            </CollapsibleTrigger>

            <CollapsibleContent className="animate-accordion-down">
              <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="gradient-cta text-white">
                        <th className="px-5 py-3 text-left font-bold">Size</th>
                        <th className="px-5 py-3 text-left font-bold">
                          Height ({unit === "metric" ? "cm" : "in"})
                        </th>
                        <th className="px-5 py-3 text-left font-bold">
                          Weight ({unit === "metric" ? "kg" : "lbs"})
                        </th>
                        <th className="px-5 py-3 text-left font-bold">
                          Chest ({unit === "metric" ? "cm" : "in"})
                        </th>
                        <th className="px-5 py-3 text-left font-bold">
                          Waist ({unit === "metric" ? "cm" : "in"})
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {SIZE_CHART.map((row, i) => {
                        const converted = convertRow(row, unit);
                        const isHighlighted = result?.size === row.size;
                        return (
                          <tr
                            key={row.size}
                            className={`border-b border-border transition-colors ${
                              isHighlighted
                                ? "text-white font-bold"
                                : i % 2 === 0
                                  ? "bg-muted/30"
                                  : "bg-background"
                            }`}
                            style={isHighlighted ? { background: SIZE_COLOR[row.size] } : {}}
                          >
                            <td className="px-5 py-3">
                              <span
                                className={`inline-flex items-center justify-center w-10 h-8 rounded-lg text-xs font-extrabold ${
                                  isHighlighted ? "bg-white/20 text-white" : "bg-muted text-foreground"
                                }`}
                              >
                                {row.size}
                              </span>
                            </td>
                            <td className="px-5 py-3">{converted.heightCm}</td>
                            <td className="px-5 py-3">{converted.weightKg}</td>
                            <td className="px-5 py-3">{converted.chestCm}</td>
                            <td className="px-5 py-3">{converted.waistCm}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </section>
      </main>

      <footer className="mt-10 border-t border-border">
        <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Shirt className="w-5 h-5 text-primary" />
            <span className="font-bold text-foreground">TrytoFit</span>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Your perfect fit, every time. Size charts are general guidelines — always try before you buy.
          </p>
          <p className="text-xs text-muted-foreground">© 2026 TrytoFit</p>
        </div>
      </footer>
    </div>
  );
};

export default MeshPredictionPage;