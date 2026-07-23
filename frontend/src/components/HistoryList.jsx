import "./HistoryList.css";

export default function HistoryList({ history, loading, onDelete, onClear }) {
  return (
    <div className="drawer">
      <div className="drawer-header">
        <h2>Recently Viewed</h2>
        {history.length > 0 && (
          <button className="clear-button" onClick={onClear}>
            Empty drawer
          </button>
        )}
      </div>

      {loading && history.length === 0 && (
        <p className="drawer-empty">Opening the drawer&hellip;</p>
      )}

      {!loading && history.length === 0 && (
        <p className="drawer-empty">
          Nothing filed yet. Pull a quote and it lands here.
        </p>
      )}

      <ul className="ticket-list">
        {history.map((item, idx) => (
          <li className="ticket" key={item._id ?? idx}>
            <span className="ticket-index">{String(idx + 1).padStart(2, "0")}</span>
            <div className="ticket-body">
              <p className="ticket-text">&ldquo;{item.text}&rdquo;</p>
              <div className="ticket-meta">
                <span className="ticket-author">{item.author}</span>
                <span className="ticket-date">
                  {new Date(item.viewedAt || item.createdAt).toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
            {item._id && (
              <button
                className="ticket-delete"
                onClick={() => onDelete(item._id)}
                aria-label="Remove this card from history"
                title="Remove"
              >
                &times;
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
