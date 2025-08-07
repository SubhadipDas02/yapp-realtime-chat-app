import React, { useRef, useState } from 'react'
import { useChatStore } from '../store/useChatStore';
import { useGroupStore } from '../store/useGroupStore';
import toast from 'react-hot-toast';
import { Send, Image, X, Mic, Smile } from 'lucide-react';

const MessageInput = () => {
    const [ text, setText ] = useState("");
    const [ imagePreview, setImagePreview ] = useState(null);
    const fileInputRef = useRef(null);
    const { sendMessage, selectedUser } = useChatStore();
    const { sendGroupMessage, selectedGroup } = useGroupStore();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSendMessages = async (e) => {
        e.preventDefault();
        if (!text.trim() && !imagePreview) return;
        
        try {
            const messageData = {
                text: text.trim(),
                image: imagePreview,
            };

            // Send to group or individual chat based on selection
            if (selectedGroup) {
                await sendGroupMessage(selectedGroup._id, messageData);
            } else if (selectedUser) {
                await sendMessage(messageData);
            }

            setText("");
            setImagePreview(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error) {
            console.error("Failed to send message: ", error);
        }
    }
  return (
    <div className='relative z-20 p-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-t border-slate-200/60 dark:border-slate-700/40'>
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-100/20 to-transparent dark:from-slate-900/10 dark:to-transparent"></div>
        
        {imagePreview && (
            <div className='relative mb-3 p-3 bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/40 backdrop-blur-sm'>
                <div className='flex items-center gap-3'>
                    <div className='relative'>
                        <img src={imagePreview} alt="Preview" className='w-12 h-12 object-cover rounded-xl border border-slate-300/60 dark:border-slate-600/40 shadow-lg' />
                        <button 
                            onClick={removeImage} 
                            className='absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 hover:scale-110 transition-all' 
                            type='button'
                        >
                            <X className="size-2.5" />
                        </button>
                    </div>
                    <div className="text-xs text-slate-800 dark:text-slate-200">
                        <p className="font-medium">Image attached</p>
                        <p className="text-slate-500 dark:text-slate-400">Ready to send</p>
                    </div>
                </div>
            </div>
        )}

        <form onSubmit={handleSendMessages} className='relative flex items-end gap-2'>
            {/* Input Container - made smaller */}
            <div className='flex-1 relative'>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-100/50 to-slate-50/30 dark:from-slate-700/30 dark:to-slate-800/20 rounded-2xl"></div>
                <input 
                    type="text" 
                    className='relative w-full px-4 py-3 pr-20 rounded-2xl border border-slate-200/60 dark:border-slate-700/40 bg-slate-50/80 dark:bg-slate-800/50 backdrop-blur-md
                             text-slate-800 dark:text-slate-200 placeholder:text-slate-500 dark:placeholder:text-slate-400 text-sm
                             focus:outline-none focus:ring-2 focus:ring-slate-400/50 dark:focus:ring-slate-500/50 focus:border-slate-300/60 dark:focus:border-slate-600/50 transition-all
                             hover:bg-slate-100/90 dark:hover:bg-slate-700/60' 
                    placeholder={selectedGroup ? `Message ${selectedGroup.name}...` : 'Type your message...'} 
                    value={text} 
                    onChange={(e) => setText(e.target.value)} 
                />
                <input type="file" accept='image/*' className='hidden' ref={fileInputRef} onChange={handleImageChange} />
                
                {/* Input Actions - made smaller */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button 
                        type='button' 
                        className={`p-1.5 rounded-xl transition-all hover:scale-110
                                   ${imagePreview ? "text-slate-600 dark:text-slate-400 bg-slate-200/60 dark:bg-slate-700/50" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/40"}`} 
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Image size={16} />
                    </button>
                    <button 
                        type='button' 
                        className='p-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50/60 dark:hover:bg-amber-900/20 transition-all hover:scale-110'
                    >
                        <Smile size={16} />
                    </button>
                </div>
            </div>
            
            {/* Send/Mic Button - made smaller */}
            {text.trim() || imagePreview ? (
                <button 
                    type='submit' 
                    className='p-3 rounded-2xl bg-gradient-to-r from-slate-600 to-slate-700 dark:from-slate-600 dark:to-slate-500 text-white shadow-lg shadow-slate-500/20 dark:shadow-slate-900/30
                              hover:shadow-xl hover:shadow-slate-500/30 dark:hover:shadow-slate-900/40 hover:scale-110 
                              transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100' 
                    disabled={!text.trim() && !imagePreview}
                >
                    <Send size={18} />
                </button>
            ) : (
                <button 
                    type='button' 
                    className='p-3 rounded-2xl bg-slate-100/80 dark:bg-slate-700/50 border border-slate-200/60 dark:border-slate-600/40 text-slate-600 dark:text-slate-400
                              hover:bg-slate-200/90 dark:hover:bg-slate-600/70 hover:scale-110 transition-all duration-200'
                >
                    <Mic size={18} />
                </button>
            )}
        </form>
    </div>
  )
}

export default MessageInput