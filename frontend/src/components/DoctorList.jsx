import { useEffect, useState } from "react";
import api from "../services/api";
import { List, ListItem, Button } from "@mui/material";

export default function DoctorList({ onSelect }) {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    api.get("/users/doctors").then(res => setDoctors(res.data));
  }, []);

  return (
    <List>
      {doctors.map(d => (
        <ListItem key={d._id}>
          {d.name}
          <Button onClick={() => onSelect(d)}>Chat</Button>
        </ListItem>
      ))}
    </List>
  );
}
