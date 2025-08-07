import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useGroupStore = create((set, get) => ({
  groups: [],
  selectedGroup: null,
  groupMessages: [],
  isGroupsLoading: false,
  isCreatingGroup: false,
  isGroupMessagesLoading: false,

  // Clear all group data (useful for logout)
  clearGroupData: () => {
    set({
      groups: [],
      selectedGroup: null,
      groupMessages: [],
      isGroupsLoading: false,
      isCreatingGroup: false,
      isGroupMessagesLoading: false,
    });
  },

  getGroups: async () => {
    set({ isGroupsLoading: true });
    try {
      const res = await axiosInstance.get("/groups");
      set({ groups: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isGroupsLoading: false });
    }
  },

  createGroup: async (groupData) => {
    set({ isCreatingGroup: true });
    try {
      const res = await axiosInstance.post("/groups/create", groupData);
      set((state) => ({ groups: [...state.groups, res.data] }));
      toast.success("Group created successfully!");
      return res.data;
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isCreatingGroup: false });
    }
  },

  setSelectedGroup: (group) => {
    set({ selectedGroup: group, groupMessages: [] });
  },

  addMemberToGroup: async (groupId, userId) => {
    try {
      const res = await axiosInstance.post(`/groups/${groupId}/add-member`, { userId });
      set((state) => ({
        groups: state.groups.map((group) =>
          group._id === groupId ? res.data : group
        ),
        selectedGroup: state.selectedGroup?._id === groupId ? res.data : state.selectedGroup,
      }));
      toast.success("Member added successfully!");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  removeMemberFromGroup: async (groupId, userId) => {
    try {
      const res = await axiosInstance.post(`/groups/${groupId}/remove-member`, { userId });
      set((state) => ({
        groups: state.groups.map((group) =>
          group._id === groupId ? res.data : group
        ),
        selectedGroup: state.selectedGroup?._id === groupId ? res.data : state.selectedGroup,
      }));
      toast.success("Member removed successfully!");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  leaveGroup: async (groupId) => {
    try {
      await axiosInstance.post(`/groups/${groupId}/leave`);
      set((state) => ({
        groups: state.groups.filter((group) => group._id !== groupId),
        selectedGroup: state.selectedGroup?._id === groupId ? null : state.selectedGroup,
      }));
      toast.success("Left group successfully!");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  deleteGroup: async (groupId) => {
    try {
      await axiosInstance.delete(`/groups/${groupId}`);
      set((state) => ({
        groups: state.groups.filter((group) => group._id !== groupId),
        selectedGroup: state.selectedGroup?._id === groupId ? null : state.selectedGroup,
      }));
      toast.success("Group deleted successfully!");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  // Group Messages
  getGroupMessages: async (groupId) => {
    set({ isGroupMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/groups/${groupId}/messages`);
      set({ groupMessages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isGroupMessagesLoading: false });
    }
  },

  sendGroupMessage: async (groupId, messageData) => {
    const { selectedGroup, groupMessages } = get();
    if (selectedGroup?._id !== groupId) return;

    try {
      const res = await axiosInstance.post(`/groups/${groupId}/messages`, messageData);
      set({ groupMessages: [...groupMessages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  // Socket subscriptions for real-time group messages
  subscribeToGroupMessages: () => {
    const { selectedGroup } = get();
    if (!selectedGroup) return;

    const socket = useAuthStore.getState().socket;

    if (socket) {
      socket.on("newGroupMessage", (newMessage) => {
        const { selectedGroup, groupMessages } = get();
        if (newMessage.groupId !== selectedGroup?._id) return;
        
        set({
          groupMessages: [...groupMessages, newMessage],
        });
      });
    }
  },

  unsubscribeFromGroupMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newGroupMessage");
    }
  },
}));
