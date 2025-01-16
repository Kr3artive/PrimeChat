import { useState, useEffect } from "react";
import axios from "axios";

const Chat = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:9000/chats");
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>CHAT</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {data.map((chat, index) => (
        <div key={index}>
          <h2>{chat.chatName}</h2>
        </div>
      ))}
    </div>
  );
};

export default Chat;
