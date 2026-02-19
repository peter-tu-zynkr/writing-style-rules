const TABS = [
  { id: "check", label: "檢查" },
  { id: "add", label: "直接新增" },
  { id: "remove", label: "刪除" },
];

const TAB_CONFIG = {
  check: {
    placeholder: "輸入詞彙來檢查是否已存在…",
    buttonLabel: "檢查",
  },
  add: {
    placeholder: "輸入要新增的詞彙…",
    buttonLabel: "直接新增",
  },
  remove: {
    placeholder: "輸入要刪除的詞彙…",
    buttonLabel: "刪除",
  },
};

export default function InputPanel({
  inputValue,
  setInputValue,
  activeTab,
  onTabChange,
  onCheck,
  onDirectAdd,
  onRemove,
}) {
  const config = TAB_CONFIG[activeTab];

  const handleAction = () => {
    if (activeTab === "check") onCheck();
    else if (activeTab === "add") onDirectAdd();
    else if (activeTab === "remove") onRemove();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleAction();
    }
  };

  return (
    <div style={styles.panel}>
      <div style={styles.tabBar}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            style={{
              ...styles.tab,
              ...(activeTab === tab.id ? styles.tabActive : styles.tabInactive),
            }}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <textarea
        style={styles.textarea}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={config.placeholder}
      />
      <button
        style={{
          ...styles.button,
          ...(activeTab === "add" ? styles.buttonAdd : {}),
          ...(activeTab === "remove" ? styles.buttonRemove : {}),
        }}
        onClick={handleAction}
        disabled={!inputValue.trim()}
      >
        {config.buttonLabel}
      </button>
    </div>
  );
}

const styles = {
  panel: {
    background: "#fff",
    borderRadius: "8px",
    padding: "16px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    flex: 1,
  },
  tabBar: {
    display: "flex",
    gap: "4px",
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: "8px",
    marginBottom: "4px",
  },
  tab: {
    flex: 1,
    padding: "6px 0",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 500,
    transition: "background 0.15s",
  },
  tabActive: {
    background: "#3b82f6",
    color: "#fff",
  },
  tabInactive: {
    background: "#f3f4f6",
    color: "#555",
  },
  textarea: {
    flex: 1,
    resize: "none",
    border: "1px solid #ddd",
    borderRadius: "4px",
    padding: "8px",
    fontSize: "16px",
    fontFamily: "inherit",
    outline: "none",
    minHeight: "80px",
  },
  button: {
    padding: "8px 16px",
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 500,
  },
  buttonAdd: {
    background: "#16a34a",
  },
  buttonRemove: {
    background: "#dc2626",
  },
};
