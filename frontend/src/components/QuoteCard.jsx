import "./QuoteCard.css";

export default function QuoteCard({ quote, loading, stampKey, onPull }) {
  return (
    <div className="index-card-wrap">
      <div className="index-card" aria-live="polite">
        <span className="punch-hole" aria-hidden="true" />
        <div className="card-rule card-rule-top" aria-hidden="true" />

        <div className="card-body">
          {quote ? (
            <>
              <p className="quote-text">&ldquo;{quote.text}&rdquo;</p>
              <p className="quote-author">&mdash; {quote.author}</p>
            </>
          ) : (
            <p className="quote-text quote-placeholder">
              {loading ? "Pulling a card from the drawer\u2026" : "No card pulled yet."}
            </p>
          )}
        </div>

        <div className="card-rule card-rule-bottom" aria-hidden="true" />
        <div className="card-meta">
          <span>CARD {String(quote?._id ?? "000000").slice(-6).toUpperCase()}</span>
          <span>{quote ? new Date(quote.viewedAt).toLocaleDateString() : "--/--/----"}</span>
        </div>

        {quote && (
          <div className="stamp" key={stampKey} aria-hidden="true">
            VIEWED
          </div>
        )}
      </div>

      <button className="pull-button" onClick={onPull} disabled={loading}>
        {loading ? "Pulling\u2026" : "Pull a new quote"}
      </button>
    </div>
  );
}
