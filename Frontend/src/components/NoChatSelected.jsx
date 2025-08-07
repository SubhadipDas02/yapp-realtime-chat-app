import { MessageSquare, Zap } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-gradient-to-br from-slate-50/50 to-slate-100/30 dark:from-slate-800/30 dark:to-slate-900/50">
      <div className="max-w-md text-center space-y-8">
        {/* Icon Display */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-slate-200/80 to-slate-300/60 dark:from-slate-700/60 dark:to-slate-800/80 flex items-center justify-center shadow-lg backdrop-blur-sm">
              <Zap className="w-12 h-12 text-slate-600 dark:text-slate-400" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-slate-600 dark:bg-slate-400 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white dark:bg-slate-800 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-300 dark:to-slate-100 bg-clip-text text-transparent">
            Welcome to Yapp!
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
            Select a conversation from the sidebar to start chatting with your friends and colleagues.
          </p>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 gap-4 mt-8">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/30">
            <div className="w-8 h-8 bg-slate-100/80 dark:bg-slate-700/60 rounded-xl flex items-center justify-center">
              <Zap className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </div>
            <span className="text-sm text-slate-600 dark:text-slate-400">Real-time messaging</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/30">
            <div className="w-8 h-8 bg-slate-100/80 dark:bg-slate-700/60 rounded-xl flex items-center justify-center">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            </div>
            <span className="text-sm text-slate-600 dark:text-slate-400">See who's online</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected;