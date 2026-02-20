import { useState, useEffect, useCallback } from "react";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || "";
import InputPanel from "./components/InputPanel.jsx";
import ResponsePanel from "./components/ResponsePanel.jsx";
import RulesPanel from "./components/RulesPanel.jsx";
import DiffPanel from "./components/DiffPanel.jsx";

export default function App() {
  const [inputValue, setInputValue] = useState("");
  const [response, setResponse] = useState(null);
  const [diff, setDiff] = useState(null);
  const [rulesContent, setRulesContent] = useState("");
  const [activeTab, setActiveTab] = useState("check");

  const fetchRules = useCallback(async () => {
    const res = await axios.get("/api/rules");
    setRulesContent(res.data.content);
  }, []);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setResponse(null);
    setDiff(null);
  };

  const handleCheck = async () => {
    const res = await axios.post("/api/check", { rule: inputValue });
    setResponse(res.data);
    setDiff(null);
  };

  const handleAdd = async () => {
    const res = await axios.post("/api/add", { rule: inputValue });
    setDiff(res.data);
    setResponse(null);
    setInputValue("");
    fetchRules();
  };

  const handleDirectAdd = async () => {
    const res = await axios.post("/api/add", { rule: inputValue });
    if (res.data.status === "exists") {
      setResponse(res.data);
      setDiff(null);
    } else {
      setDiff(res.data);
      setResponse(null);
      setInputValue("");
      fetchRules();
    }
  };

  const handleRemove = async () => {
    const res = await axios.post("/api/remove", { rule: inputValue });
    if (res.data.status === "not_found") {
      setResponse(res.data);
      setDiff(null);
    } else {
      setDiff(res.data);
      setResponse(null);
      setInputValue("");
      fetchRules();
    }
  };

  return (
    <div style={styles.root}>
      <div style={styles.topRow}>
        <div style={styles.leftCol}>
          <InputPanel
            inputValue={inputValue}
            setInputValue={setInputValue}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onCheck={handleCheck}
            onDirectAdd={handleDirectAdd}
            onRemove={handleRemove}
          />
          {activeTab === "check" && (
            <ResponsePanel response={response} onAdd={handleAdd} />
          )}
          {activeTab === "add" && response?.status === "exists" && (
            <div style={styles.errorPanel}>
              <p style={styles.errorText}>⚠️ {response.message}</p>
            </div>
          )}
          {activeTab === "remove" && response?.status === "not_found" && (
            <div style={styles.errorPanel}>
              <p style={styles.errorText}>{response.message}</p>
            </div>
          )}
        </div>
        <div style={styles.rightCol}>
          <RulesPanel content={rulesContent} />
        </div>
      </div>
      {diff && (
        <div style={styles.bottomRow}>
          <DiffPanel before={diff.before} after={diff.after} />
        </div>
      )}
    </div>
  );
}

const styles = {
  root: {
    fontFamily: "sans-serif",
    padding: "16px",
    boxSizing: "border-box",
    minHeight: "100vh",
    background: "#f5f5f5",
  },
  topRow: {
    display: "flex",
    gap: "16px",
    height: "calc(60vh - 16px)",
  },
  leftCol: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    flex: "0 0 380px",
  },
  rightCol: {
    flex: 1,
    overflow: "hidden",
  },
  bottomRow: {
    marginTop: "16px",
  },
  errorPanel: {
    background: "#fff",
    borderRadius: "8px",
    padding: "16px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    margin: 0,
    color: "#b45309",
    fontSize: "14px",
  },
};
