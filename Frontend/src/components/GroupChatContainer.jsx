import { useGroupStore } from "../store/useGroupStore";
import { useEffect, useRef, useMemo } from "react";
import GroupChatHeader from "./GroupChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { Check, Users } from "lucide-react";

const formatMessageTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const GroupChatContainer = () => {
  const {
    selectedGroup,
    groupMessages,
    getGroupMessages,
    isGroupMessagesLoading,
    subscribeToGroupMessages,
    unsubscribeFromGroupMessages,
  } = useGroupStore();

  const { authUser } = useAuthStore();
  const messagesEndRef = useRef(null);

  // Placeholder messages for now (will be replaced by actual group messages)
  const placeholderMessages = useMemo(() => [
    {
      _id: "1",
      senderId: "user1",
      text: "Hey everyone! How's the project going?",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      sender: { fullName: "Alice Johnson", profilePic: "/avatar.png" }
    },
    {
      _id: "2", 
      senderId: authUser?._id,
      text: "Going great! Just finished the UI components.",
      createdAt: new Date(Date.now() - 1800000).toISOString(),
      sender: { fullName: authUser?.fullName, profilePic: authUser?.profilePic }
    },
    {
      _id: "3",
      senderId: "user2", 
      text: "Awesome! I'll review them later today.",
      createdAt: new Date().toISOString(),
      sender: { fullName: "Bob Smith", profilePic: "/avatar.png" }
    }
  ], [authUser]);

  const displayMessages = groupMessages || placeholderMessages;

  useEffect(() => {
    if (messagesEndRef.current && displayMessages) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [displayMessages]);

  useEffect(() => {
    if (selectedGroup) {
      getGroupMessages?.(selectedGroup._id);
      subscribeToGroupMessages?.();
    }

    return () => unsubscribeFromGroupMessages?.();
  }, [selectedGroup, getGroupMessages, subscribeToGroupMessages, unsubscribeFromGroupMessages]);

  if (isGroupMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-slate-100/50 to-white dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-900">
        <GroupChatHeader />
        <MessageSkeleton />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-slate-100/50 to-white dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-900 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(71,85,105,0.08),transparent)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(148,163,184,0.05),transparent)]"></div>
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(100,116,139,0.05)_180deg,transparent_360deg)] dark:bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(148,163,184,0.03)_180deg,transparent_360deg)]"></div>
      </div>

      <GroupChatHeader />

      {/* Messages Area - made more compact */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 relative z-10">
        {displayMessages.map((message) => (
          <div
            key={message._id}
            className={`flex ${message.senderId === authUser._id ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`
                max-w-xs lg:max-w-md xl:max-w-lg relative group
                ${message.senderId === authUser._id 
                  ? "order-2" 
                  : "order-1"
                }
              `}
            >
              {/* Sender name for group messages - made smaller */}
              {message.senderId !== authUser._id && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 px-2">
                  {message.sender?.fullName || "Unknown User"}
                </p>
              )}

              {/* Message Bubble - reduced padding */}
              <div
                className={`
                  relative px-3 py-2 rounded-2xl backdrop-blur-md border transition-all duration-300 group-hover:scale-[1.02]
                  ${message.senderId === authUser._id
                    ? "bg-gradient-to-r from-slate-600/90 to-slate-700/90 dark:from-slate-600/80 dark:to-slate-700/80 text-white border-slate-500/50 dark:border-slate-600/40 rounded-br-md shadow-lg shadow-slate-500/20 dark:shadow-slate-900/30"
                    : "bg-white/90 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 border-slate-200/60 dark:border-slate-700/50 rounded-bl-md shadow-lg"
                  }
                `}
              >
                {/* Message Content */}
                {message.image && (
                  <div className="mb-2 relative">
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="rounded-xl max-w-full h-auto border border-white/20"
                    />
                    {/* Time overlay for image-only messages */}
                    {!message.text && (
                      <div className="absolute bottom-2 right-2 bg-black/50 rounded px-2 py-1">
                        <span className="text-xs text-white/80">
                          {formatMessageTime(message.createdAt)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                
                {message.text && (
                  <p className="text-sm leading-relaxed pr-16">{message.text}</p>
                )}

                {/* Message Time - moved to bottom-right corner like WhatsApp, only for text messages */}
                {message.text && (
                  <div
                    className={`
                      absolute bottom-1 right-2 text-xs opacity-70
                      ${message.senderId === authUser._id ? "text-white/80" : "text-gray-300"}
                    `}
                  >
                    {formatMessageTime(message.createdAt)}
                  </div>
                )}

                {/* Message Tail - made smaller */}
                <div
                  className={`
                    absolute bottom-0 w-3 h-3
                    ${message.senderId === authUser._id
                      ? "-right-1 bg-gradient-to-br from-slate-600 to-slate-700 dark:from-slate-600 dark:to-slate-700 rounded-tl-full"
                      : "-left-1 bg-white/90 dark:bg-slate-800/90 rounded-tr-full"
                    }
                  `}
                ></div>
              </div>

              {/* Delivery Status - reduced spacing */}
              {message.senderId === authUser._id && (
                <div className="flex justify-end mt-0.5 mr-1">
                  <div className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-slate-300 dark:text-slate-400" />
                    <Check className="w-3 h-3 text-slate-300 dark:text-slate-400 -ml-2" />
                  </div>
                </div>
              )}
            </div>

            {/* Avatar - made smaller */}
            <div
              className={`
                w-6 h-6 rounded-full flex-shrink-0 mx-2 self-end
                ${message.senderId === authUser._id ? "order-1" : "order-2"}
              `}
            >
              <img
                src={
                  message.senderId === authUser._id
                    ? authUser.profilePic || "/avatar.png"
                    : message.sender?.profilePic || "/avatar.png"
                }
                alt="avatar"
                className="w-full h-full rounded-full border-2 border-white/20 object-cover"
              />
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Group Members Info - made more compact */}
      {selectedGroup && (
        <div className="px-4 py-1.5 bg-black/10 border-t border-white/5">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Users className="w-3 h-3" />
            <span>
              {selectedGroup.members?.map(member => member.fullName).join(", ")}
            </span>
          </div>
        </div>
      )}

      <MessageInput />
    </div>
  );
};

export default GroupChatContainer;
