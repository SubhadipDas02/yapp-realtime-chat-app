import React from 'react';
import { 
  Archive, 
  Pin, 
  VolumeX, 
  Trash2, 
  MessageSquare,
  UserX,
  Eye,
  EyeOff
} from 'lucide-react';

const ChatContextMenu = ({ 
  isVisible = false, 
  position = { x: 0, y: 0 }, 
  user = null, 
  onClose = () => {}, 
  onArchive = () => {},
  onPin = () => {},
  onMute = () => {},
  onDelete = () => {},
  onMarkUnread = () => {},
  onBlock = () => {}
}) => {
  if (!isVisible) return null;

  const handleAction = (action) => {
    action();
    onClose();
  };

  // Calculate optimal position to keep menu within viewport
  const getOptimalPosition = () => {
    const menuWidth = 220; // Increased width for better spacing
    const menuHeight = 350; // Increased height to account for all items
    const padding = 20; // Increased padding from screen edges
    
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    let { x, y } = position;
    
    // Ensure we have valid coordinates
    if (!x || !y) return { x: padding, y: padding };
    
    // Adjust horizontal position if menu would go off-screen
    if (x + menuWidth + padding > screenWidth) {
      x = Math.max(padding, screenWidth - menuWidth - padding);
    }
    if (x < padding) {
      x = padding;
    }
    
    // Adjust vertical position - always try to keep menu fully visible
    if (y + menuHeight + padding > screenHeight) {
      // First try positioning above the cursor
      const aboveY = y - menuHeight - 10;
      if (aboveY >= padding) {
        y = aboveY;
      } else {
        // If can't fit above, fit as much as possible in viewport
        y = Math.max(padding, screenHeight - menuHeight - padding);
      }
    } else if (y < padding) {
      y = padding;
    }
    
    // Final safety check to ensure menu is always in bounds
    y = Math.max(padding, Math.min(y, screenHeight - menuHeight - padding));
    x = Math.max(padding, Math.min(x, screenWidth - menuWidth - padding));
    
    return { x, y };
  };

  const optimalPosition = getOptimalPosition();

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-[60]" 
        onClick={onClose}
      />
      
      {/* Context Menu - Updated to match app theme exactly */}
      <div 
        className="fixed z-[60] min-w-[220px] max-h-[80vh] overflow-y-auto"
        style={{
          left: optimalPosition.x,
          top: optimalPosition.y,
        }}
      >
        {/* Context menu with proper app theme and enhanced visibility */}
        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-slate-700/50 shadow-2xl overflow-hidden ring-1 ring-slate-300/30 dark:ring-slate-600/30">
          <div className="p-2 space-y-1">
            {/* Archive Chat */}
            <button
              onClick={() => handleAction(onArchive)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-700/50 transition-all duration-200 w-full text-left group"
            >
              <Archive className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="font-medium">
                {user?.isArchived ? 'Unarchive chat' : 'Archive chat'}
              </span>
            </button>

          {/* Pin Chat */}
          <button
            onClick={() => handleAction(onPin)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-700/50 transition-all duration-200 w-full text-left group"
          >
            <Pin className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="font-medium">
              {user?.isPinned ? 'Unpin chat' : 'Pin chat'}
            </span>
          </button>

          {/* Mute Chat */}
          <button
            onClick={() => handleAction(onMute)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-700/50 transition-all duration-200 w-full text-left group"
          >
            <VolumeX className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="font-medium">
              {user?.isMuted ? 'Unmute chat' : 'Mute notifications'}
            </span>
          </button>

          {/* Mark as Unread */}
          <button
            onClick={() => handleAction(onMarkUnread)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-700/50 transition-all duration-200 w-full text-left group"
          >
            {user?.isUnread ? (
              <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
            ) : (
              <EyeOff className="w-4 h-4 group-hover:scale-110 transition-transform" />
            )}
            <span className="font-medium">
              {user?.isUnread ? 'Mark as read' : 'Mark as unread'}
            </span>
          </button>

          <div className="h-px bg-slate-200/80 dark:bg-slate-700/50 my-2"></div>

          {/* Delete Chat */}
          <button
            onClick={() => handleAction(onDelete)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/80 dark:hover:bg-red-900/20 transition-all duration-200 w-full text-left group"
          >
            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Delete chat</span>
          </button>

          {/* Block User */}
          <button
            onClick={() => handleAction(onBlock)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/80 dark:hover:bg-red-900/20 transition-all duration-200 w-full text-left group"
          >
            <UserX className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Block {user?.fullName}</span>
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default ChatContextMenu;
