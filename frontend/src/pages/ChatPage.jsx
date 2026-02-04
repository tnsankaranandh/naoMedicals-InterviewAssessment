import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import DoctorList from "../components/DoctorList";
import PatientList from "../components/PatientList";
import ChatBox from "../components/Chat/ChatBox";
import SearchBar from "../components/SearchBar";
import SummaryModal from "../components/SummaryModal";

export default function MessageBubble({ message, isOwn }) {
  const { user } = useContext(AuthContext);
  const [conversation, setConversation] = useState("");
  const [search, setSearch] = useState("");
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);

  const _getConversation = (doctorId, patientId) => {
    return api.post("/conversations/", {
      doctorId, patientId
    });
  };

  const loadDoctorConversation = async dId => {
    setConversation((await _getConversation(dId._id, user.id)).data);
  };

  const loadPatientConversation = async pId => {
    setConversation((await _getConversation(user.id, pId._id)).data);
  };

  const handleOpenSummary = async () => {
    setSummaryOpen(true);
    setSummaryLoading(true);
    try {
      const res = await api.post(`/summary/${conversation._id}`);
      setSummary(res.data.summaryText || "No summary available.");
    } catch (e) {
      setSummary("Failed to generate summary.");
    }
    setSummaryLoading(false);
  };

  return (
    <div style={{ display: "flex" }}>
      {user.role === "patient" && <DoctorList onSelect={loadDoctorConversation} />}
      {user.role === "doctor" && <PatientList onSelect={loadPatientConversation} />}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {conversation && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <SearchBar
                value={search}
                onChange={setSearch}
                onClear={() => setSearch("")}
              />
              <button onClick={handleOpenSummary} style={{ height: 40 }}>AI Summary</button>
            </div>
            <ChatBox conversation={conversation} search={search} />
            <SummaryModal
              open={summaryOpen}
              onClose={() => setSummaryOpen(false)}
              summary={summary}
              loading={summaryLoading}
            />
          </>
        )}
      </div>
    </div>
  );
}
