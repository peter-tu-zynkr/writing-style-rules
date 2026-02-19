import ReactDiffViewer from "react-diff-viewer-continued";

export default function DiffPanel({ before, after }) {
  return (
    <div style={styles.panel}>
      <h3 style={styles.title}>變更對照</h3>
      <div style={styles.viewer}>
        <ReactDiffViewer
          oldValue={before}
          newValue={after}
          splitView={true}
          leftTitle="修改前"
          rightTitle="修改後"
          useDarkTheme={false}
        />
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
  },
  title: {
    margin: "0 0 12px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#333",
  },
  viewer: {
    overflow: "auto",
    maxHeight: "300px",
    fontSize: "13px",
  },
};
