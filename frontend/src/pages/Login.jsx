import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { Button, TextField, Container, Box, Typography } from "@mui/material";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await api.post("/auth/login", { email, password });
    login(res.data);
    window.location.href = "/chat";
  };

  return (
    <Container>
      <h2>Login</h2>
      <TextField label="Email" fullWidth onChange={e => setEmail(e.target.value)} />
      <TextField label="Password" type="password" fullWidth onChange={e => setPassword(e.target.value)} />
      <Button variant="contained" onClick={handleSubmit}>Login</Button>
      <Box mt={2} textAlign="center">
        <Typography variant="body2">
          Don't have an account? <Link to="/register">Register here</Link>
        </Typography>
      </Box>
    </Container>
  );
}
