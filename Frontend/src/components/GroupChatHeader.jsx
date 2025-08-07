import React from 'react'
import { X, MoreVertical, UserPlus, Users, Settings, LogOut } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore';
import { useGroupStore } from '../store/useGroupStore';

const GroupChatHeader = () => {
    const { selectedGroup, setSelectedGroup, leaveGroup } = useGroupStore();
    const { authUser } = useAuthStore();

    const isAdmin = selectedGroup?.admin._id === authUser._id;

    const handleLeaveGroup = async () => {
        if (window.confirm('Are you sure you want to leave this group?')) {
            await leaveGroup(selectedGroup._id);
        }
    };

    if (!selectedGroup) return null;

    return (
        <div className='relative z-20 p-3 bg-black/20 backdrop-blur-xl border-b border-white/10'>
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5"></div>
            
            <div className='relative flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    {/* Group Avatar - made smaller */}
                    <div className='relative'>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-md opacity-50 animate-pulse"></div>
                        <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center border-2 border-white/30 shadow-2xl overflow-hidden">
                            {selectedGroup.groupPic ? (
                                <img 
                                    src={selectedGroup.groupPic} 
                                    alt={selectedGroup.name}
                                    className='w-full h-full object-cover'
                                />
                            ) : (
                                <Users className="w-5 h-5 text-white" />
                            )}
                        </div>
                        {/* Member count indicator - made smaller */}
                        <div className='absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-black shadow-lg flex items-center justify-center'>
                            <span className="text-[10px] text-white font-bold">{selectedGroup.members?.length || 0}</span>
                        </div>
                    </div>
                    
                    {/* Group Info - made more compact */}
                    <div>
                        <h3 className='font-bold text-base text-white tracking-wide'>{selectedGroup.name}</h3>
                        <div className='flex items-center gap-2 text-xs'>
                            <Users className="w-3 h-3 text-blue-400" />
                            <span className="text-blue-300">
                                {selectedGroup.members?.length || 0} members
                            </span>
                            {selectedGroup.description && (
                                <>
                                    <span className="text-gray-500">•</span>
                                    <span className="text-gray-400 truncate max-w-32">
                                        {selectedGroup.description}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Action Buttons - made smaller */}
                <div className="flex items-center gap-1">
                    {isAdmin && (
                        <button className='p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 hover:scale-110' title="Add Members">
                            <UserPlus size={16} />
                        </button>
                    )}
                    
                    <button className='p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 hover:scale-110' title="Group Settings">
                        <Settings size={16} />
                    </button>
                    
                    <button className='p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 hover:scale-110'>
                        <MoreVertical size={16} />
                    </button>
                    
                    <button 
                        onClick={handleLeaveGroup}
                        className='p-2 rounded-xl text-white/70 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 hover:scale-110'
                        title="Leave Group"
                    >
                        <LogOut size={16} />
                    </button>
                    
                    <button 
                        onClick={() => setSelectedGroup(null)}
                        className='p-2 rounded-xl text-white/70 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 hover:scale-110'
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default GroupChatHeader
