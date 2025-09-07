import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [username, setUsername] = useState("");
  const [qr, setQr] = useState("");
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setQr("");
    setSecret("");

    try {
      const res = await axios.post("http://localhost:4000/api/auth/register", {
        username,
      });

      // ✅ Success → backend returns QR + secret
      setQr(res.data.qrDataUrl);
      setSecret(res.data.secretBase32);
    } catch (err) {
      // ❌ Error handling
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>Register User</h2>

      <form onSubmit={handleRegister} style={{ marginTop: "20px" }}>
        <input
          type="text"
          value={username}
          placeholder="Enter username"
          onChange={(e) => setUsername(e.target.value)}
          style={{
            padding: "10px",
            width: "250px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />
        <button
          type="submit"
          style={{
            marginLeft: "10px",
            padding: "10px 20px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Register
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: "20px" }}>{error}</p>}

      {qr && (
        <div style={{ marginTop: "30px" }}>
          <h3>Scan this QR with Google Authenticator</h3>
          <img
            src={qr}
            alt="TOTP QR"
            style={{ width: "200px", height: "200px", marginTop: "10px" }}
          />
          <p style={{ marginTop: "10px" }}>
            Or use this secret: <b>{secret}</b>
          </p>
        </div>
      )}
    </div>
  );
}
