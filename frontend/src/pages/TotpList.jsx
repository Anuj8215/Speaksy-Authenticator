import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export default function TotpList() {
  const [username, setUsername] = useState("");
  const [codes, setCodes] = useState([]);
  const [error, setError] = useState("");

  const fetchCodes = useCallback(async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/auth/totp/${username}`
      );
      setCodes(res.data.codes);
      setError("");
    } catch (error) {
      setError(`Could not fetch codes: ${error.message}`);
      setCodes([]);
    }
  }, [username]);

  useEffect(() => {
    if (username) {
      fetchCodes();
      const interval = setInterval(fetchCodes, 30000); // refresh every 30s
      return () => clearInterval(interval);
    }
  }, [fetchCodes, username]);

  return (
    <div>
      <h2>TOTP Codes</h2>
      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ padding: "8px", marginRight: "10px" }}
      />
      <button onClick={fetchCodes} style={{ padding: "8px 16px" }}>
        Load Codes
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {codes.length > 0 && (
        <ul style={{ marginTop: "20px" }}>
          {codes.map((c, i) => (
            <li key={i}>
              <b>{c.name}</b>: {c.code}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
