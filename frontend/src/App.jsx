import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import QuoteCard from "./components/QuoteCard.jsx";
import HistoryList from "./components/HistoryList.jsx";
import "./App.css";

const api = axios.create({ baseURL: "/api" });

export default function App() {
  const [quote, setQuote] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState("");
  const [stampKey, setStampKey] = useState(0);

  const loadHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const { data } = await api.get("/quotes/history?limit=25");
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  const pullNewQuote = useCallback(async () => {
    setLoadingQuote(true);
    setError("");
    try {
      const { data } = await api.get("/quotes/random");
      setQuote(data);
      setStampKey((k) => k + 1);
      await loadHistory();
    } catch (err) {
      console.error(err);
      setError("Couldn't reach the archive. Check that the backend is running.");
    } finally {
      setLoadingQuote(false);
    }
  }, [loadHistory]);

  const deleteEntry = useCallback(
    async (id) => {
      try {
        await api.delete(`/quotes/history/${id}`);
        setHistory((prev) => prev.filter((q) => q._id !== id));
      } catch (err) {
        console.error(err);
      }
    },
    []
  );

  const clearHistory = useCallback(async () => {
    try {
      await api.delete("/quotes/history");
      setHistory([]);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    loadHistory();
    pullNewQuote();
  }, []);

  return (
    <div className="archive">
      <header className="archive-header">
        <h1>The Quote Archive</h1>
        <p className="tagline">Pull a card. Keep the drawer.</p>
      </header>

      <main className="archive-main">
        <section className="catalog-desk" aria-label="Current quote">
          <QuoteCard
            quote={quote}
            loading={loadingQuote}
            stampKey={stampKey}
            onPull={pullNewQuote}
          />
          {error && <p className="error-banner" role="alert">{error}</p>}
        </section>

        <section className="catalog-drawer" aria-label="Quote history">
          <HistoryList
            history={history}
            loading={loadingHistory}
            onDelete={deleteEntry}
            onClear={clearHistory}
          />
        </section>
      </main>

      <footer className="archive-footer">
        <span>Some Inspiring Quotes direct to your Drawer</span>
      </footer>
    </div>
  );
}
