"use client";

import { useState } from "react";

const DashboardPage = () => {
  const [adminResponse, setAdminResponse] = useState("");
  const [userResponse, setUserResponse] = useState("");
  const [ginProfileResponse, setGinProfileResponse] = useState("");
  const [error, setError] = useState("");

  const callApi = async (endpoint: string): Promise<string> => {
    setError("");
    try {
      const res = await fetch(endpoint);

      if (!res.ok) {
        throw new Error(`API Error (${res.status}): ${await res.text()}`);
      }

      const data = await res.json();
      return JSON.stringify(data, null, 2);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        console.error("Unknown error:", err);
      }

      return "";
    }
  };

  const handleFetchUser = async () => {
    const data = await callApi("http://localhost:3000/api/proxy/users/me");
    setUserResponse(data);
  };

  const handleFetchAdmin = async () => {
    const data = await callApi("http://localhost:3000/api/proxy/admin");
    setAdminResponse(data);
  };

  const handleFetchGinProfile = async () => {
    const data = await callApi("http://localhost:3000/api/proxy/profile");
    setGinProfileResponse(data);
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <a href="/api/auth/login">Log in</a>
      <br />
      <a href="/api/auth/logout">Log out</a>
      <hr />

      <h3>Quarkus (localhost:8080)</h3>
      <button onClick={handleFetchUser}>User Information</button>
      {userResponse && <pre>{userResponse}</pre>}
      <br />
      <button onClick={handleFetchAdmin}>Administrator information</button>
      {adminResponse && <pre>{adminResponse}</pre>}
      <hr />

      <h3>Gin (localhost:8080)</h3>
      <button onClick={handleFetchGinProfile}>User Profile</button>
      {ginProfileResponse && <pre>{ginProfileResponse}</pre>}

      {error && <p style={{ color: "red" }}>Error: {error}</p>}
    </div>
  );
};

export default DashboardPage;
