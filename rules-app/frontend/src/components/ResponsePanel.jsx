export default function ResponsePanel({ response, onAdd }) {
  if (!response) {
    return (
      <div style={{ ...styles.panel, ...styles.empty }}>
        <p style={styles.hint}>結果將顯示於此。</p>
      </div>
    );
  }

  return (
    <div style={styles.panel}>
      {response.status === "exists" ? (
        <p style={styles.exists}>⚠️ 此詞彙已存在。</p>
      ) : (
        <>
          <p style={styles.newRule}>
            ✅ 新詞彙：<code style={styles.code}>{response.proposal}</code>
          </p>
          <button style={styles.addButton} onClick={onAdd}>
            確認新增
          </button>
        </>
      )}
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
    flex: "0 0 auto",
  },
  empty: {
    justifyContent: "center",
    alignItems: "center",
  },
  hint: {
    margin: 0,
    color: "#aaa",
    fontSize: "13px",
    textAlign: "center",
  },
  exists: {
    margin: 0,
    color: "#b45309",
    fontSize: "14px",
  },
  newRule: {
    margin: 0,
    color: "#15803d",
    fontSize: "14px",
  },
  code: {
    background: "#f0fdf4",
    padding: "2px 6px",
    borderRadius: "3px",
    fontFamily: "monospace",
  },
  addButton: {
    alignSelf: "flex-start",
    padding: "8px 16px",
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 500,
  },
};
