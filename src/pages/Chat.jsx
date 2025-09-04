import { useEffect, useState } from "react";
import API from "../api/axios";
import io from "socket.io-client";
import NavBar from "../components/Navbar";
import { getUser } from "../auth/auth";
import { Container, Row, Col, ListGroup, Form, Button } from "react-bootstrap";

const socket = io(import.meta.env.VITE_API_URL);

export default function Chat() {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const user = getUser();

  useEffect(() => {
    API.get("/users").then((res) => setUsers(res.data));

    socket.emit("join", user.id);

    socket.on("receive-message", (msg) => {
      // ✅ Only add if relevant (to or from current user)
      if (
        (msg.sender === user.id && msg.receiver === selected?._id) ||
        (msg.receiver === user.id && msg.sender === selected?._id)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => socket.off("receive-message");
  }, [user.id, selected?._id]);

  const loadMessages = async (otherUser) => {
    setSelected(otherUser);
    const res = await API.get(`/messages/${otherUser._id}`);
    setMessages(res.data);
  };

  const sendMessage = () => {
    if (!input.trim() || !selected) return;

    const msg = {
      to: selected._id,
      from: user.id,
      content: input,
    };

    // ✅ Only emit — don’t push locally
    socket.emit("send-message", msg);
    setInput("");
  };

  return (
    <div className="vh-100 d-flex flex-column">
      <NavBar />
      <Container fluid className="flex-grow-1">
        <Row className="h-100">
          {/* Users */}
          <Col md={3} className="border-end">
            <h5 className="p-3">Users</h5>
            <ListGroup>
              {users.map((u) => (
                <ListGroup.Item
                  key={u._id}
                  action
                  active={selected?._id === u._id}
                  onClick={() => loadMessages(u)}
                >
                  {u.name}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>

          {/* Chat */}
          <Col md={9} className="d-flex flex-column">
            {selected ? (
              <>
                <div className="flex-grow-1 p-3 overflow-auto">
                  {messages.map((m, i) => {
                    const isMe = m.sender === user.id;
                    const sender = isMe ? "You" : selected.name;

                    return (
                      <div
                        key={i}
                        className={`mb-3 d-flex ${isMe ? "justify-content-end" : "justify-content-start"
                          }`}
                      >
                        <div>
                          {/* Sender */}
                          <small
                            className={`d-block mb-1 ${isMe
                              ? "text-end text-primary"
                              : "text-start text-secondary"
                              }`}
                          >
                            {sender}
                          </small>

                          {/* Message Bubble */}
                          <span
                            className={`px-3 py-2 rounded shadow-sm ${isMe ? "bg-primary text-white" : "bg-light border"
                              }`}
                          >
                            {m.content}
                          </span>

                          {/* Timestamp */}
                          <div
                            className={`mt-1 ${isMe ? "text-end" : "text-start"}`}
                          >
                            <small className="text-muted">
                              {new Date(m.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </small>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Input */}
                <div className="p-3 border-top d-flex">
                  <Form.Control
                    type="text"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="me-2"
                  />
                  <Button onClick={sendMessage}>Send</Button>
                </div>
              </>
            ) : (
              <div className="d-flex justify-content-center align-items-center flex-grow-1 text-muted">
                Select a user to start chatting
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
