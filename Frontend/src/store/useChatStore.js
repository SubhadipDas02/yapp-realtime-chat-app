import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    // Clear all chat data (useful for logout)
    clearChatData: () => {
        set({
            messages: [],
            users: [],
            selectedUser: null,
            isUsersLoading: false,
            isMessagesLoading: false,
        });
    },

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async(userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (MessageData) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, MessageData);
            set({messages: [...messages, res.data]})
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage) => {
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            if (isMessageSentFromSelectedUser) return;
            set({
                messages: [...get().messages, newMessage],
            });
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),

    // Archive/Unarchive chat
    toggleArchiveChat: async (userId) => {
        try {
            // For now, just toggle locally - you can implement backend later
            set((state) => ({
                users: state.users.map(user => 
                    user._id === userId ? { ...user, isArchived: !user.isArchived } : user
                )
            }));
            toast.success("Chat archived successfully");
        } catch (error) {
            toast.error("Failed to archive chat");
        }
    },

    // Pin/Unpin chat
    togglePinChat: async (userId) => {
        try {
            set((state) => ({
                users: state.users.map(user => 
                    user._id === userId ? { ...user, isPinned: !user.isPinned } : user
                )
            }));
            toast.success("Chat pinned successfully");
        } catch (error) {
            toast.error("Failed to pin chat");
        }
    },

    // Mute/Unmute chat
    toggleMuteChat: async (userId) => {
        try {
            set((state) => ({
                users: state.users.map(user => 
                    user._id === userId ? { ...user, isMuted: !user.isMuted } : user
                )
            }));
            toast.success("Chat muted successfully");
        } catch (error) {
            toast.error("Failed to mute chat");
        }
    },

    // Delete chat
    deleteChat: async (userId) => {
        try {
            set((state) => ({
                users: state.users.filter(user => user._id !== userId),
                selectedUser: state.selectedUser?._id === userId ? null : state.selectedUser
            }));
            toast.success("Chat deleted successfully");
        } catch (error) {
            toast.error("Failed to delete chat");
        }
    },

    // Mark as read/unread
    toggleReadStatus: async (userId) => {
        try {
            set((state) => ({
                users: state.users.map(user => 
                    user._id === userId ? { ...user, isUnread: !user.isUnread } : user
                )
            }));
            toast.success("Read status updated");
        } catch (error) {
            toast.error("Failed to update read status");
        }
    },
}));
