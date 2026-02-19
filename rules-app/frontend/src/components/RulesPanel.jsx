import ReactMarkdown from "react-markdown";

export default function RulesPanel({ content }) {
  return (
    <div style={styles.panel}>
      <div style={styles.inner}>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}

const styles = {
  panel: {
    background: "#fff",
    borderRadius: "8px",
    padding: "16px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
    height: "100%",
    boxSizing: "border-box",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  inner: {
    overflow: "auto",
    flex: 1,
    fontSize: "14px",
    lineHeight: "1.6",
  },
};
