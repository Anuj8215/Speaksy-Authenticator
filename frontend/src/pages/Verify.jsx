import { useState } from "react";
import axios from "axios";

export default function Verify() {
  const [username, setUsername] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [token, setToken] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    setResult("");
    setError("");

    try {
      const res = await axios.post("http://localhost:4000/api/auth/verify", {
        username,
        serviceName,
        token,
      });

      if (res.data.verified) {
        setResult("✅ Code is valid!");
      } else {
        setResult("❌ Code is invalid or expired.");
      }
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Something went wrong.");
      }
    }
  };

  return (
    <div>
      <h2>Verify TOTP Code</h2>
      <form onSubmit={handleVerify} style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginRight: "10px", padding: "8px" }}
        />
        <input
          type="text"
          placeholder="Enter service name"
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          style={{ marginRight: "10px", padding: "8px" }}
        />
        <input
          type="text"
          placeholder="Enter TOTP code"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          style={{ marginRight: "10px", padding: "8px" }}
        />
        <button type="submit" style={{ padding: "8px 16px" }}>
          Verify
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {result && <p style={{ marginTop: "20px" }}>{result}</p>}
    </div>
  );
}
