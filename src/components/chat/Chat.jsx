import { useEffect, useRef, useState } from "react";
import "./chat.css";
import { arrayUnion, doc, getDoc, onSnapshot, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase.js";
import { useChatStore } from "../../lib/chatStore.js";
import { useUserStore } from "../../lib/userStore.js";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const Chat = () => {
  const [chat, setChat] = useState();
  const [text, setText] = useState(""); 

  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();
  const { currentUser } = useUserStore();

  const endRef = useRef(null);

  useEffect(() => {
    const chatDocRef = doc(db, "chats", chatId);
    const unSub = onSnapshot(chatDocRef, (res) => {
      setChat(res.data());
    });
    return () => {
      unSub();
    };
  }, [chatId]);

  const handleSend = async () => {
    if (text === "") return;

    if (!currentUser?.id || !user?.id) {
      console.error("currentUser or user is undefined");
      return;
    }
    
    try {
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
        }),
      });

      await updateDoc(doc(db, "chats", chatId), {
        createdAt: serverTimestamp(), 
      });
    
      const userIDs = [currentUser.id, user.id];
      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();

          const chatIndex = userChatsData?.chats?.findIndex((c) => c.chatId === chatId);
            userChatsData.chats[chatIndex].lastMessage = text;
            userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
            userChatsData.chats[chatIndex].updatedAt = Date.now();

            await updateDoc(userChatsRef, {
              chats: userChatsData.chats,
            });
        }
      });
      setText(""); // Clear input
    } catch (err) {
      console.log(err);
    }
  };

  // Function to clear chat history
  const clearChatHistory = async () => {
    try {
      // Update chat document with empty messages array
      await updateDoc(doc(db, "chats", chatId), {
        messages: [],
      });
    } catch (err) {
      console.error("Error clearing chat history:", err);
    }
  };

  const isOwnMessage = (message) => {
    return message.senderId === currentUser.id;
  };


  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src="./avatar.png" alt="" />
          <div className="texts">
            <span>{user?.username}</span>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </div>
      
      <div className="center">
        {chat?.messages?.map((message) => (
          <div key={message?.id} className={`message ${isOwnMessage(message) ? 'own' : ''}`}>
            <div className="texts">
              <p>{message.text}</p>
              <span>{dayjs(message.createdAt?.toDate()).fromNow()}</span>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="bottom">
        <div className="icons">
        <img src="./img.png" alt="" />
        <img src="./camera.png" alt="" />
        <img src="./mic.png" alt="" />
        </div>
        <input
        type="text"
        placeholder={isCurrentUserBlocked || isReceiverBlocked ? "You cannot send a message" : "Type a message..."}
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isCurrentUserBlocked || isReceiverBlocked} // This should disable the input
      />
      <button className="sendButton" onClick={handleSend} disabled={isCurrentUserBlocked || isReceiverBlocked} // This should disable the button>
      >Send</button>
      
      <button className="clearButton" onClick={clearChatHistory}>Clear Chats</button>
    </div>
    </div>
  );
};

export default Chat;
