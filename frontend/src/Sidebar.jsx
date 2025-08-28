import "./Sidebar.css";
import { useCallback, useContext, useEffect, useState } from "react";
import MyContext from "./MyContext.jsx";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function Sidebar() {
  const { allThreads, setAllThreads, setCurrThreadId } = useContext(MyContext);
  const [loading, setLoading] = useState(false);

  const getAllThreads = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/thread`);
      const res = await response.json();

      const filteredData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));

      setAllThreads(filteredData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching threads:", err);
      setLoading(false);
    }
  }, [setAllThreads]);

  useEffect(() => {
    getAllThreads();
  }, [getAllThreads]);

  const handleClick = (threadId) => {
    setCurrThreadId(threadId);
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">All Chats</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="thread-list">
          {allThreads.map((thread) => (
            <li
              key={thread.threadId}
              onClick={() => handleClick(thread.threadId)}
              className="thread-item"
            >
              {thread.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Sidebar;
