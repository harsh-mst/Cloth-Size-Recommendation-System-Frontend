import React, { useState } from "react";

function App() {
  const [form, setForm] = useState({
    height: "",
    weight: "",
    chest_size: "",
    waist_size: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      // Convert empty strings to null for optional fields
      const payload = {
        height: parseFloat(form.height),
        weight: parseFloat(form.weight),
        chest_size: form.chest_size || null,
        waist_size: form.waist_size || null,
      };

      const resp = await fetch("https://cloth-size-recommendation-system.onrender.com/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const data = await resp.json();
        throw new Error(data.detail || "Prediction failed");
      }

      const data = await resp.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "1.5rem" }}>
      <h1>Clothing Size Recommender</h1>
      <p>Enter your measurements to get a size recommendation.</p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
        <div>
          <label>
            Height (cm):
            <input
              type="number"
              name="height"
              value={form.height}
              onChange={handleChange}
              min="140"
              max="200"
              step="1"
              required
              style={{ marginLeft: "0.5rem" }}
            />
          </label>
        </div>

        <div>
          <label>
            Weight (kg):
            <input
              type="number"
              name="weight"
              value={form.weight}
              onChange={handleChange}
              min="20"
              max="150"
              step="1"
              required
              style={{ marginLeft: "0.5rem" }}
            />
          </label>
        </div>

        <div>
          <label>
            Chest size (optional):
            <select
              name="chest_size"
              value={form.chest_size}
              onChange={handleChange}
              style={{ marginLeft: "0.5rem" }}
            >
              <option value="">Select...</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
            </select>
          </label>
        </div>

        <div>
          <label>
            Waist size (optional):
            <select
              name="waist_size"
              value={form.waist_size}
              onChange={handleChange}
              style={{ marginLeft: "0.5rem" }}
            >
              <option value="">Select...</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
            </select>
          </label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Predicting..." : "Get Recommendation"}
        </button>
      </form>

      {error && (
        <div style={{ marginTop: "1rem", color: "red" }}>
          Error: {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: "1.5rem", borderTop: "1px solid #ccc", paddingTop: "1rem" }}>
          <h2>Prediction</h2>
          <p>
            Recommended size: <strong>{result.predicted_size}</strong>
          </p>
          <p>Confidence: {result.confidence.toFixed(2)}%</p>
          <p>{result.message}</p>

          <h3>All probabilities</h3>
          <ul>
            {Object.entries(result.all_probabilities).map(([size, prob]) => (
              <li key={size}>
                {size}: {prob}%
              </li>
            ))}
          </ul>

          <h3>Input used</h3>
          <ul>
            <li>Height: {result.input_data.height} cm</li>
            <li>Weight: {result.input_data.weight} kg</li>
            <li>
              Chest size: {result.input_data.chest_size || "Not provided"}
            </li>
            <li>
              Waist size: {result.input_data.waist_size || "Not provided"}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
