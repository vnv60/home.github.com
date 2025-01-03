import { useContext, useEffect, useRef, useState } from "react";
import "./chat.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { format, register } from "timeago.js";
import { SocketContext } from "../../context/SocketContext";
import { useNotificationStore } from "../../lib/notificationStore";
import Footer from "../Footer/footer";

// Đăng ký ngôn ngữ tiếng Việt
const viLocale = (number, index) => {
  return [
    ["vừa xong", "một lúc"],
    ["%s giây trước", "trong %s giây"],
    ["1 phút trước", "trong 1 phút"],
    ["%s phút trước", "trong %s phút"],
    ["1 giờ trước", "trong 1 giờ"],
    ["%s giờ trước", "trong %s giờ"],
    ["1 ngày trước", "trong 1 ngày"],
    ["%s ngày trước", "trong %s ngày"],
    ["1 tuần trước", "trong 1 tuần"],
    ["%s tuần trước", "trong %s tuần"],
    ["1 tháng trước", "trong 1 tháng"],
    ["%s tháng trước", "trong %s tháng"],
    ["1 năm trước", "trong 1 năm"],
    ["%s năm trước", "trong %s năm"],
  ][index];
};
register("vi", viLocale); // Đăng ký ngôn ngữ 'vi'

function Chat({ chats }) {
  const [chat, setChat] = useState(null); // Trạng thái cho cuộc trò chuyện hiện tại
  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);

  const messageEndRef = useRef();
  const decrease = useNotificationStore((state) => state.decrease);

  // Cuộn đến cuối khi có tin nhắn mới
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // Mở một cuộc trò chuyện
  const handleOpenChat = async (id, receiver) => {
    try {
      const res = await apiRequest(`/chats/${id}`);
      if (!res.data.seenBy.includes(currentUser.id)) {
        decrease(); // Giảm số lượng thông báo nếu tin nhắn chưa được đọc
      }
      setChat({ ...res.data, receiver });
    } catch (err) {
      console.error("Lỗi mở chat:", err);
    }
  };

  // Gửi tin nhắn
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const text = formData.get("text");
    if (!text) return;

    try {
      const res = await apiRequest.post(`/messages/${chat.id}`, { text });
      setChat((prev) => ({
        ...prev,
        messages: [...(prev?.messages || []), res.data],
      }));
      e.target.reset();
      socket.emit("sendMessage", {
        receiverId: chat.receiver.id,
        data: res.data,
      });
    } catch (err) {
      console.error("Lỗi gửi tin nhắn:", err);
    }
  };

  // Nhận tin nhắn qua socket
  useEffect(() => {
    const read = async () => {
      try {
        if (chat?.id) await apiRequest.put(`/chats/read/${chat.id}`);
      } catch (err) {
        console.error("Lỗi đánh dấu đã đọc:", err);
      }
    };

    if (chat && socket) {
      const handleIncomingMessage = (data) => {
        if (chat.id === data.chatId) {
          setChat((prev) => ({
            ...prev,
            messages: [...(prev?.messages || []), data],
          }));
          read();
        }
      };

      socket.on("getMessage", handleIncomingMessage);

      // Hủy lắng nghe sự kiện khi component unmount hoặc `chat` thay đổi
      return () => {
        socket.off("getMessage", handleIncomingMessage);
      };
    }
  }, [socket, chat]);

  return (
    <div className="chat">
      <div className="messages">
        <h1>Tin nhắn</h1>
        {chats?.map((c) => (
          <div
            className="message"
            key={c.id}
            style={{
              backgroundColor:
                c.seenBy.includes(currentUser.id) || chat?.id === c.id
                  ? "white"
                  : "#fecd514e", // Highlight tin nhắn chưa đọc
            }}
            onClick={() => handleOpenChat(c.id, c.receiver)}
          >
            <img src={c.receiver.avatar || "/noavatar.png"} alt="" />
            <span>{c.receiver.username}</span>
            <p>{c.lastMessage}</p>
          </div>
        ))}
      </div>
      {chat && (
        <div className="chatBox">
          <div className="top">
            <div className="user">
              <img src={chat.receiver.avatar || "/noavatar.png"} alt="" />
              {chat.receiver.username}
            </div>
            <span className="close" onClick={() => setChat(null)}>
              X
            </span>
          </div>
          <div className="center">
            {chat.messages?.map((message) => (
              <div
                className="chatMessage"
                style={{
                  alignSelf:
                    message.userId === currentUser.id
                      ? "flex-end"
                      : "flex-start",
                  textAlign:
                    message.userId === currentUser.id ? "right" : "left",
                }}
                key={message.id}
              >
                <p>{message.text}</p>
                <span>{format(message.createdAt, "vi")}</span> {/* Hiển thị thời gian tiếng Việt */}
              </div>
            ))}
            <div ref={messageEndRef}></div>
          </div>
          <form onSubmit={handleSubmit} className="bottom">
            <textarea name="text" placeholder="Nhập tin nhắn..."></textarea>
            <button>Gửi</button>
          </form>
        </div>
      )}
    </div>
   
  );
}

export default Chat;
