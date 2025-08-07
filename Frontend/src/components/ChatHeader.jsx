import React from 'react'
import { X, MoreVertical, Phone, Video } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';

const ChatHeader = () => {
    const { selectedUser, setSelectedUser } = useChatStore();
    const { onlineUsers } = useAuthStore();

  return (
    <div className='relative z-20 p-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/40'>
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-100/30 to-slate-50/20 dark:from-slate-800/20 dark:to-slate-900/10"></div>
        
        <div className='relative flex items-center justify-between'>
            <div className='flex items-center gap-3'>
                {/* Avatar with enhanced glow - made smaller */}
                <div className='relative'>
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-600 dark:from-slate-600 dark:to-slate-400 rounded-full blur-md opacity-20 animate-pulse"></div>
                    <img 
                        src={selectedUser.profilePic || "/avatar.png"} 
                        alt={selectedUser.fullName}
                        className='relative w-10 h-10 rounded-full border-2 border-slate-300/60 dark:border-slate-600/40 shadow-xl object-cover'
                    />
                    {onlineUsers.includes(selectedUser._id) && (
                        <div className='absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800 shadow-lg animate-pulse'></div>
                    )}
                </div>
                
                {/* User Info - made more compact */}
                <div>
                    <h3 className='font-bold text-base text-slate-800 dark:text-slate-200 tracking-wide'>{selectedUser.fullName}</h3>
                    <div className='flex items-center gap-2 text-xs'>
                        <div className={`w-1.5 h-1.5 rounded-full ${onlineUsers.includes(selectedUser._id) ? "bg-emerald-500 shadow-lg shadow-emerald-500/50" : "bg-slate-400 dark:bg-slate-500"}`}></div>
                        <span className={`${onlineUsers.includes(selectedUser._id) ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"}`}>
                            {onlineUsers.includes(selectedUser._id) ? "Active now" : "Last seen recently"}
                        </span>
                    </div>
                </div>
            </div>
            
            {/* Action Buttons - made smaller */}
            <div className="flex items-center gap-1">
                <button className='p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-700/50 transition-all duration-200 hover:scale-110'>
                    <Phone size={16} />
                </button>
                <button className='p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-700/50 transition-all duration-200 hover:scale-110'>
                    <Video size={16} />
                </button>
                <button className='p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-700/50 transition-all duration-200 hover:scale-110'>
                    <MoreVertical size={16} />
                </button>
                <button 
                    onClick={() => setSelectedUser(null)}
                    className='p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/80 dark:hover:bg-red-900/20 transition-all duration-200 hover:scale-110'
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    </div>
  )
}

export default ChatHeader