import { useEffect, useState } from "react";
import api from "../services/api";
import { List, ListItem, Button } from "@mui/material";

export default function PatientList({ onSelect }) {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    api.get("/users/patients").then(res => setPatients(res.data));
  }, []);

  return (
    <List>
      {patients.map(p => (
        <ListItem key={p._id}>
          {p.name}
          <Button onClick={() => onSelect(p)}>Chat</Button>
        </ListItem>
      ))}
    </List>
  );
}
