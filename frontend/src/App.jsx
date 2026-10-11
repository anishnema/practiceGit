import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE ?? "";

export default function App() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ a: Number(a), b: Number(b) }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Addition failed");
      }
      setResult(data.result);
    } catch (err) {
      setError(err.message || "Could not reach the calculator backend");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="card">
      <h1>Calculator</h1>
      <p>Addition is available now. Other operations can be added later.</p>
      <form onSubmit={handleSubmit}>
        <label>
          First number
          <input
            type="number"
            step="any"
            value={a}
            onChange={(event) => setA(event.target.value)}
            required
          />
        </label>
        <label>
          Second number
          <input
            type="number"
            step="any"
            value={b}
            onChange={(event) => setB(event.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add"}
        </button>
      </form>
      {result !== null && <div className="result">Sum: {result}</div>}
      {error && <div className="error">{error}</div>}
    </main>
  );
}
