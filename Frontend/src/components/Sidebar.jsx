import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useGroupStore } from "../store/useGroupStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import CreateGroupModal from "./CreateGroupModal";
import ChatContextMenu from "./ChatContextMenu";
import { Users, Plus, UserPlus, Search, Filter, Archive } from "lucide-react";

const Sidebar = () => {
  const { 
    getUsers, 
    users, 
    selectedUser, 
    setSelectedUser, 
    isUsersLoading,
    toggleArchiveChat,
    togglePinChat,
    toggleMuteChat,
    deleteChat,
    toggleReadStatus
  } = useChatStore();
  const { groups, selectedGroup, setSelectedGroup, getGroups } = useGroupStore();
  const { onlineUsers, authUser } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [activeTab, setActiveTab] = useState("chats");
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams] = useSearchParams();
  const [showArchived, setShowArchived] = useState(searchParams.get('archived') === 'true');
  
  // Context menu state
  const [contextMenu, setContextMenu] = useState({
    isVisible: false,
    position: { x: 0, y: 0 },
    user: null
  });

  useEffect(() => {
    getUsers();
    getGroups();
  }, [getUsers, getGroups]);

  useEffect(() => {
    setShowArchived(searchParams.get('archived') === 'true');
    // Handle tab parameter from navbar
    const tabParam = searchParams.get('tab');
    if (tabParam === 'groups') {
      setActiveTab('groups');
    } else if (tabParam === 'chats') {
      setActiveTab('chats');
    }
  }, [searchParams]);

  // Close context menu on outside click or scroll
  useEffect(() => {
    const handleGlobalClick = () => {
      if (contextMenu.isVisible) {
        setContextMenu({ isVisible: false, position: { x: 0, y: 0 }, user: null });
      }
    };

    const handleScroll = () => {
      if (contextMenu.isVisible) {
        setContextMenu({ isVisible: false, position: { x: 0, y: 0 }, user: null });
      }
    };

    if (contextMenu.isVisible) {
      document.addEventListener('click', handleGlobalClick);
      document.addEventListener('scroll', handleScroll, true);
    }

    return () => {
      document.removeEventListener('click', handleGlobalClick);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, [contextMenu.isVisible]);

  const filteredUsers = (users || []).filter((user) => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOnlineFilter = showOnlineOnly ? onlineUsers.includes(user._id) : true;
    const matchesArchiveFilter = showArchived ? user.isArchived : !user.isArchived;
    return matchesSearch && matchesOnlineFilter && matchesArchiveFilter;
  });

  const filteredGroups = (groups || []).filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isUsersLoading) return <SidebarSkeleton />;

  const handleSelectChat = (user) => {
    setSelectedUser(user);
    setSelectedGroup(null);
  };

  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
    setSelectedUser(null);
  };

  const handleRightClick = (e, user) => {
    e.preventDefault();
    e.stopPropagation();
    
    setContextMenu({
      isVisible: true,
      position: { x: e.clientX, y: e.clientY },
      user: user
    });
  };

  const closeContextMenu = () => {
    setContextMenu({
      isVisible: false,
      position: { x: 0, y: 0 },
      user: null
    });
  };

  const handleArchive = () => {
    if (contextMenu.user) {
      toggleArchiveChat(contextMenu.user._id);
    }
  };

  const handlePin = () => {
    if (contextMenu.user) {
      togglePinChat(contextMenu.user._id);
    }
  };

  const handleMute = () => {
    if (contextMenu.user) {
      toggleMuteChat(contextMenu.user._id);
    }
  };

  const handleDelete = () => {
    if (contextMenu.user && window.confirm(`Are you sure you want to delete chat with ${contextMenu.user.fullName}?`)) {
      deleteChat(contextMenu.user._id);
    }
  };

  const handleMarkUnread = () => {
    if (contextMenu.user) {
      toggleReadStatus(contextMenu.user._id);
    }
  };

  const handleBlock = () => {
    if (contextMenu.user && window.confirm(`Are you sure you want to block ${contextMenu.user.fullName}?`)) {
      // TODO: Implement block functionality
      toast.success(`${contextMenu.user.fullName} has been blocked`);
    }
  };

  return {
    sidebarContent: (
    <aside className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/30">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative">
            <div className="w-10 h-10 rounded-full border-2 border-slate-300/60 dark:border-slate-600/40 overflow-hidden">
              <img 
                src={authUser?.profilePic || "/avatar.png"} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800 animate-pulse"></div>
          </div>
          <div className="hidden lg:block flex-1">
            <h2 className="font-bold text-slate-800 dark:text-slate-200 text-lg">
              {showArchived ? "Archived" : "Messages"}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {activeTab === "chats" ? `${filteredUsers.length} conversations` : `${filteredGroups.length} groups`}
            </p>
          </div>
          {/* Archive Toggle */}
          {activeTab === "chats" && (
            <button
              onClick={() => setShowArchived(!showArchived)}
              className={`p-2 rounded-xl transition-all duration-200 ${
                showArchived
                  ? "bg-orange-500/20 text-orange-400 border border-orange-500/50"
                  : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/20"
              }`}
              title={showArchived ? "Show active chats" : "Show archived chats"}
            >
              <Archive className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-100/50 to-slate-50/30 dark:from-slate-800/30 dark:to-slate-700/20 rounded-2xl"></div>
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-4 h-4 text-slate-500 dark:text-slate-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/40 rounded-2xl text-slate-800 dark:text-slate-200 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/50 dark:focus:ring-slate-500/50 focus:border-slate-300/60 dark:focus:border-slate-600/50 transition-all backdrop-blur-sm"
              />
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100/80 dark:bg-slate-800/50 rounded-xl p-1 mb-4">
          <button
            onClick={() => setActiveTab("chats")}
            className={`flex-1 py-2 px-4 rounded-lg transition-all duration-200 text-sm font-medium ${
              activeTab === "chats"
                ? "bg-slate-600 dark:bg-slate-300 text-white dark:text-slate-800 shadow-lg"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            Chats
          </button>
          <button
            onClick={() => setActiveTab("groups")}
            className={`flex-1 py-2 px-4 rounded-lg transition-all duration-200 text-sm font-medium ${
              activeTab === "groups"
                ? "bg-slate-600 dark:bg-slate-300 text-white dark:text-slate-800 shadow-lg"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            Groups
          </button>
        </div>
        
        {/* Actions Row */}
        <div className="flex items-center justify-between gap-2">
          {/* Online Filter - only show for chats */}
          {activeTab === "chats" && (
            <button
              onClick={() => setShowOnlineOnly(!showOnlineOnly)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 border ${
                showOnlineOnly
                  ? "bg-green-500/20 border-green-500/50 text-green-400"
                  : "bg-white/5 border-white/20 text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm hidden lg:inline">Online only</span>
              <div className={`w-2 h-2 rounded-full ${showOnlineOnly ? "bg-green-400" : "bg-gray-400"}`}></div>
            </button>
          )}

          {/* Create Group Button */}
          {activeTab === "groups" && (
            <>
              <div className="flex-1"></div>
              <button
                onClick={() => setShowCreateGroup(true)}
                className="p-3 bg-slate-200/80 dark:bg-slate-700/50 hover:bg-slate-300/90 dark:hover:bg-slate-600/70 rounded-xl border border-slate-300/60 dark:border-slate-600/40 transition-all duration-200 hover:scale-105 group"
                title="Create Group"
              >
                <Plus className="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover:rotate-90 transition-transform" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto overflow-x-visible p-4 space-y-2 relative">
        {activeTab === "chats" ? (
          // Individual Chats
          filteredUsers?.map((user) => (
            <div
              key={user._id}
              onClick={() => handleSelectChat(user)}
              onContextMenu={(e) => handleRightClick(e, user)}
              className={`
                relative group cursor-pointer p-4 rounded-2xl transition-all duration-300 border
                ${selectedUser?._id === user._id 
                  ? "bg-gradient-to-r from-slate-200/90 to-slate-100/90 dark:from-slate-700/60 dark:to-slate-800/60 border-slate-300/70 dark:border-slate-600/50 shadow-lg shadow-slate-300/25 dark:shadow-slate-900/25" 
                  : "bg-slate-50/60 dark:bg-slate-800/30 border-slate-200/40 dark:border-slate-700/30 hover:bg-slate-100/80 dark:hover:bg-slate-700/50 hover:border-slate-300/60 dark:hover:border-slate-600/50"
                }
                ${user.isPinned ? "order-first" : ""}
                ${user.isArchived ? "opacity-60" : ""}
              `}
            >
              {/* Pin Indicator */}
              {user.isPinned && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full"></div>
              )}
              
              {/* Mute Indicator */}
              {user.isMuted && (
                <div className="absolute top-2 right-6 w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full"></div>
              )}

              {/* Selection Indicator */}
              {selectedUser?._id === user._id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-slate-500 to-slate-700 dark:from-slate-400 dark:to-slate-600 rounded-r-full"></div>
              )}
              
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-slate-300/40 dark:ring-slate-600/30">
                    <img
                      src={user.profilePic || "/avatar.png"}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {onlineUsers.includes(user._id) && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                  )}
                </div>

                {/* User Info */}
                <div className="hidden lg:block flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-semibold truncate ${user.isUnread ? 'text-slate-800 dark:text-slate-100 font-bold' : 'text-slate-700 dark:text-slate-200'}`}>
                      {user.fullName}
                    </h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400">2:30 PM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                      {user.isMuted && "🔇 "}
                      {onlineUsers.includes(user._id) ? "Online" : "Last seen recently"}
                    </p>
                    {(selectedUser?._id !== user._id && user.isUnread) && (
                      <div className="w-2 h-2 bg-slate-600 dark:bg-slate-400 rounded-full group-hover:scale-125 transition-transform"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          // Group Chats
          filteredGroups?.map((group) => (
            <div
              key={group._id}
              onClick={() => handleSelectGroup(group)}
              className={`
                relative group cursor-pointer p-4 rounded-2xl transition-all duration-300 border
                ${selectedGroup?._id === group._id 
                  ? "bg-gradient-to-r from-slate-200/90 to-slate-100/90 dark:from-slate-700/60 dark:to-slate-800/60 border-slate-300/70 dark:border-slate-600/50 shadow-lg shadow-slate-300/25 dark:shadow-slate-900/25" 
                  : "bg-slate-50/60 dark:bg-slate-800/30 border-slate-200/40 dark:border-slate-700/30 hover:bg-slate-100/80 dark:hover:bg-slate-700/50 hover:border-slate-300/60 dark:hover:border-slate-600/50"
                }
              `}
            >
              {/* Selection Indicator */}
              {selectedGroup?._id === group._id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-slate-500 to-slate-700 dark:from-slate-400 dark:to-slate-600 rounded-r-full"></div>
              )}
              
              <div className="flex items-center gap-3">
                {/* Group Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-slate-300/40 dark:ring-slate-600/30 bg-gradient-to-r from-slate-400 to-slate-600 dark:from-slate-600 dark:to-slate-400 flex items-center justify-center">
                    {group.groupPic ? (
                      <img
                        src={group.groupPic}
                        alt={group.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Users className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">
                    <span className="text-xs text-white font-bold">{group.members?.length || 0}</span>
                  </div>
                </div>

                {/* Group Info */}
                <div className="hidden lg:block flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 truncate">{group.name}</h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400">1:45 PM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                      {group.description || `${group.members?.length || 0} members`}
                    </p>
                    {selectedGroup?._id !== group._id && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full group-hover:scale-125 transition-transform"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Empty State */}
        {((activeTab === "chats" && filteredUsers.length === 0) || 
          (activeTab === "groups" && groups.length === 0)) && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
              {activeTab === "chats" ? (
                <Users className="w-8 h-8 text-gray-600" />
              ) : (
                <UserPlus className="w-8 h-8 text-gray-600" />
              )}
            </div>
            <p className="text-gray-400">
              {activeTab === "chats" ? "No conversations yet" : "No groups yet"}
            </p>
            <p className="text-gray-500 text-sm mt-1">
              {activeTab === "chats" ? "Start chatting with someone!" : "Create your first group!"}
            </p>
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      <CreateGroupModal 
        isOpen={showCreateGroup} 
        onClose={() => setShowCreateGroup(false)} 
      />
    </aside>
    ),
    contextMenuProps: {
      isVisible: contextMenu.isVisible,
      position: contextMenu.position,
      user: contextMenu.user,
      onClose: closeContextMenu,
      onArchive: handleArchive,
      onPin: handlePin,
      onMute: handleMute,
      onDelete: handleDelete,
      onMarkUnread: handleMarkUnread,
      onBlock: handleBlock
    }
  };
};
export default Sidebar;