import { useState } from "react";
import axios from "axios";
export default function AddService() {
  const [username, setUsername] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [qr, setQr] = useState("");
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");

  const handleAddService = async (e) => {
    e.preventDefault();
    setError("");
    setQr("");
    setSecret("");

    try {
      const res = await axios.post(
        "http://localhost:4000/api/auth/add-service",
        {
          username,
          serviceName,
        }
      );
      setQr(res.data.qrDataUrl);
      setSecret(res.data.service.secret);
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    <div>
      <h2>Add Service</h2>
      <form onSubmit={handleAddService} style={{ marginTop: "20px" }}>
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
        <button type="submit" style={{ padding: "8px 16px" }}>
          Add
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {qr && (
        <div style={{ marginTop: "20px" }}>
          <h3>Scan this QR in Authenticator App</h3>
          <img
            src={qr}
            alt="QR Code"
            style={{ width: "200px", height: "200px" }}
          />
          <p>
            Or enter secret: <b>{secret}</b>
          </p>
        </div>
      )}
    </div>
  );
}
