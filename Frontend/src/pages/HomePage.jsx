import React from 'react'
import { useChatStore } from '../store/useChatStore';
import { useGroupStore } from '../store/useGroupStore';
import Sidebar from '../components/Sidebar';
import NoChatSelected from '../components/NoChatSelected';
import ChatContainer from '../components/ChatContainer';
import GroupChatContainer from '../components/GroupChatContainer';
import ChatContextMenu from '../components/ChatContextMenu';

const HomePage = () => {
  const { selectedUser } = useChatStore();
  const { selectedGroup } = useGroupStore();

  const showChat = selectedUser || selectedGroup;
  const sidebarData = Sidebar();

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-gray-100 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900'>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(71,85,105,0.05),transparent)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(148,163,184,0.05),transparent)] pointer-events-none"></div>
      
      <div className='flex h-screen pl-16'> {/* Add left padding for vertical navbar */}
        {/* Left Panel - Conversations */}
        <div className='w-80 border-r border-slate-200/80 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl overflow-visible relative'>
          {sidebarData.sidebarContent}
        </div>
        
        {/* Main Chat Area */}
        <div className='flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm'>
          {!showChat ? (
            <NoChatSelected />
          ) : selectedGroup ? (
            <GroupChatContainer />
          ) : (
            <ChatContainer />
          )}
        </div>
      </div>
      
      {/* Context Menu - rendered at root level to avoid clipping */}
      <ChatContextMenu {...sidebarData.contextMenuProps} />
    </div>
  )
}

export default HomePage