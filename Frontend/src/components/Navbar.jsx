import { LogOut, MessageSquare, Settings, User, Zap, Plus, Camera, Archive, Star, Menu } from "lucide-react";
import {useAuthStore} from "../store/useAuthStore.js";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useState, useRef } from "react";
import toast from "react-hot-toast";

const Navbar = () => {
    const {logout, authUser} = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isStoryMenuOpen, setIsStoryMenuOpen] = useState(false);
    const storyInputRef = useRef(null);

    // Determine active section
    const activeTab = searchParams.get('tab') || 'chats';
    const isHome = location.pathname === '/';

    const handleStoryUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
            toast.error("Please select an image or video file");
            return;
        }

        const fileSize = file.size / 1024 / 1024; // Convert to MB
        if (fileSize > 50) {
            toast.error("File size should be less than 50MB");
            return;
        }

        // TODO: Implement story upload functionality
        toast.success(`Story upload coming soon! File "${file.name}" selected.`);
        setIsStoryMenuOpen(false);
        
        // Reset input
        if (storyInputRef.current) {
            storyInputRef.current.value = '';
        }
    };

    const handleStoriesClick = () => {
        // For now, show a coming soon message
        toast.success("Stories feature coming soon!");
        setIsStoryMenuOpen(false);
    };

    const handleChatsClick = () => {
        // Navigate to home with chats tab active (default)
        navigate("/?tab=chats");
        // Close any open menus
        setIsDropdownOpen(false);
        setIsStoryMenuOpen(false);
    };
    
    return (
        <nav className="fixed left-0 top-0 h-full w-16 z-50 flex flex-col">
            {/* Background with blur and gradient */}
            <div className="absolute inset-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-r border-slate-200/80 dark:border-slate-700/50">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-100/50 via-transparent to-slate-200/30 dark:from-slate-800/30 dark:via-transparent dark:to-slate-900/30"></div>
            </div>
            
            <div className="relative flex flex-col h-full p-3">
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-6">
                    <Link to="/" className="group relative flex flex-col items-center">
                        {/* Glow effect behind logo */}
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-600 dark:from-slate-600 dark:to-slate-400 rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity"></div>
                        
                        <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-600 to-slate-800 dark:from-slate-700 dark:to-slate-500 flex items-center justify-center shadow-lg border border-slate-300/20 dark:border-slate-600/30 hover:scale-110 transition-all duration-300">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        
                        {/* Animated dot */}
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse shadow-lg shadow-emerald-500/30"></div>
                        
                        {/* App Name */}
                        <div className="mt-1.5 text-slate-700 dark:text-slate-300 font-bold text-xs tracking-wide">
                            Yapp
                        </div>
                    </Link>
                </div>

                {/* Navigation Items */}
                <div className="flex flex-col gap-3 flex-1">
                    {/* Story Upload Button */}
                    <div className="relative">
                        <button 
                            onClick={() => setIsStoryMenuOpen(!isStoryMenuOpen)}
                            className="group w-10 h-10 rounded-2xl bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/50 flex items-center justify-center hover:bg-slate-200/90 dark:hover:bg-slate-700/70 hover:border-slate-300/80 dark:hover:border-slate-600/70 transition-all duration-300 hover:scale-110"
                            title="Add Story"
                        >
                            <Plus className="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors" />
                        </button>

                        {/* Story Upload Menu */}
                        {isStoryMenuOpen && (
                            <div 
                                className="fixed left-20 top-16 w-48 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-slate-700/50 shadow-xl overflow-hidden z-50"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="p-2 space-y-1">
                                    <button 
                                        onClick={() => storyInputRef.current?.click()}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-700/50 transition-all duration-200 w-full text-left group"
                                    >
                                        <Camera className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                        <span className="font-medium">Upload Story</span>
                                    </button>
                                    
                                    <button 
                                        onClick={handleStoriesClick}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-700/50 transition-all duration-200 w-full text-left group"
                                    >
                                        <Star className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                        <span className="font-medium">View Stories</span>
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        <input 
                            type="file" 
                            ref={storyInputRef}
                            onChange={handleStoryUpload}
                            accept="image/*,video/*"
                            className="hidden"
                        />
                    </div>

                    {/* Chats Button */}
                    <button 
                        onClick={handleChatsClick}
                        className={`group w-10 h-10 rounded-2xl border flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                            isHome && activeTab === 'chats'
                                ? 'bg-slate-200/90 dark:bg-slate-700/70 border-slate-400/80 dark:border-slate-500/60 text-slate-700 dark:text-slate-300' 
                                : 'bg-slate-100/80 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/50 hover:bg-slate-200/90 dark:hover:bg-slate-700/70 hover:border-slate-300/80 dark:hover:border-slate-600/70'
                        }`} 
                        title="Chats"
                    >
                        <MessageSquare className={`w-4 h-4 transition-colors ${
                            isHome && activeTab === 'chats'
                                ? 'text-slate-700 dark:text-slate-300' 
                                : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'
                        }`} />
                    </button>
                </div>

                {/* Bottom Navigation - User Profile & Settings */}
                <div className="flex flex-col gap-3 mt-auto">
                    {authUser && (
                        <div className="relative">
                            {/* Profile Button */}
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsDropdownOpen(!isDropdownOpen);
                                }}
                                className="group w-10 h-10 rounded-2xl bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/50 hover:bg-slate-200/90 dark:hover:bg-slate-700/70 hover:border-slate-300/80 dark:hover:border-slate-600/70 transition-all duration-300 hover:scale-110 flex items-center justify-center"
                                title="Profile Menu"
                            >
                                {/* Icon glow */}
                                <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-600 dark:from-slate-600 dark:to-slate-400 rounded-2xl blur-md opacity-0 group-hover:opacity-10 transition-opacity"></div>
                                
                                <Menu className="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors relative z-10" />
                            </button>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div 
                                    className="fixed left-20 bottom-4 w-48 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-slate-700/50 shadow-xl overflow-hidden z-50"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="p-2 space-y-1">
                                        <Link 
                                            to="/profile" 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsDropdownOpen(false);
                                            }}
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-700/50 transition-all duration-200 group"
                                        >
                                            <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                            <span className="font-medium">Profile</span>
                                        </Link>
                                        
                                        <Link 
                                            to="/settings" 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsDropdownOpen(false);
                                            }}
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-700/50 transition-all duration-200 group"
                                        >
                                            <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                                            <span className="font-medium">Settings</span>
                                        </Link>
                                        
                                        <div className="h-px bg-slate-200/80 dark:bg-slate-700/50 my-2"></div>
                                        
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsDropdownOpen(false);
                                                logout();
                                            }}
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/80 dark:hover:bg-red-900/20 transition-all duration-200 w-full text-left group"
                                        >
                                            <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                            <span className="font-medium">Logout</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Overlay to close dropdown */}
            {(isDropdownOpen || isStoryMenuOpen) && (
                <div 
                    className="fixed inset-0 z-30" 
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsDropdownOpen(false);
                        setIsStoryMenuOpen(false);
                    }}
                ></div>
            )}
        </nav>
    )
}
export default Navbar;