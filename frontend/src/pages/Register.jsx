import { useState } from "react";
import api from "../services/api";
import { Button, TextField, Container, MenuItem } from "@mui/material";

export default function Register() {
  const [form, setForm] = useState({ role: "patient" });

  const submit = async () => {
    await api.post("/auth/register", form);
    window.location.href = "/";
  };

  return (
    <Container>
      <h2>Register</h2>
      <TextField label="Name" fullWidth onChange={e => setForm({...form, name:e.target.value})} />
      <TextField label="Email" fullWidth onChange={e => setForm({...form, email:e.target.value})} />
      <TextField label="Password" type="password" fullWidth onChange={e => setForm({...form, password:e.target.value})} />
      <TextField select label="Role" fullWidth onChange={e => setForm({...form, role:e.target.value})}>
        <MenuItem value="patient">Patient</MenuItem>
        <MenuItem value="doctor">Doctor</MenuItem>
      </TextField>
      <Button variant="contained" onClick={submit}>Register</Button>
    </Container>
  );
}
