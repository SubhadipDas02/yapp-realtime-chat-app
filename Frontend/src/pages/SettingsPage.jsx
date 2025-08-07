import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { Bell, Lock, Eye, Download, Trash2, HelpCircle, Info, Moon, Sun } from "lucide-react";
import { useState } from "react";

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();
  const [notifications, setNotifications] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [lastSeen, setLastSeen] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-black pl-20 pt-8 px-4">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(147,51,234,0.3),transparent)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(236,72,153,0.3),transparent)]"></div>
      </div>

      <div className="relative container mx-auto max-w-5xl">
        <div className="bg-black/20 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
          <div className="space-y-8 p-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Settings
              </h2>
              <p className="text-gray-400 mt-2">Customize your chat experience</p>
            </div>

            <div className="space-y-8">
              {/* Theme Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/30">
                    {theme === "dark" ? <Moon className="w-5 h-5 text-purple-400" /> : <Sun className="w-5 h-5 text-yellow-400" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Theme</h3>
                    <p className="text-sm text-gray-400">Choose between light and dark mode</p>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  {THEMES.map((themeOption) => (
                    <button
                      key={themeOption.id}
                      className={`
                        flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-300
                        min-w-[140px] hover:scale-105 backdrop-blur-sm
                        ${theme === themeOption.id 
                          ? "border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/25" 
                          : "border-white/20 hover:border-purple-500/50 bg-white/5 hover:bg-white/10"
                        }
                      `}
                      onClick={() => setTheme(themeOption.id)}
                    >
                      <div className="relative h-12 w-16 rounded-lg overflow-hidden shadow-lg border border-white/10" data-theme={themeOption.id}>
                        <div className="absolute inset-0 grid grid-cols-2 gap-1 p-1">
                          <div className="rounded bg-purple-500"></div>
                          <div className="rounded bg-pink-500"></div>
                          <div className="rounded bg-blue-500"></div>
                          <div className="rounded bg-gray-600"></div>
                        </div>
                      </div>
                      <div className="text-center">
                        <span className="font-semibold text-lg text-white">{themeOption.name}</span>
                        <p className="text-xs text-gray-400 mt-1">
                          {themeOption.id === "nord" ? "Clean & minimal" : "Dark & comfortable"}
                        </p>
                      </div>
                      {theme === themeOption.id && (
                        <div className="w-2 h-2 bg-purple-400 rounded-full shadow-lg shadow-purple-400/50"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notifications Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-yellow-500/20 rounded-xl border border-yellow-500/30">
                    <Bell className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Notifications</h3>
                    <p className="text-sm text-gray-400">Manage your notification preferences</p>
                  </div>
                </div>

                <div className="bg-white/5 rounded-2xl p-6 space-y-4 border border-white/10 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="font-medium text-white">Message notifications</p>
                        <p className="text-sm text-gray-400">Get notified of new messages</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={notifications} 
                        onChange={(e) => setNotifications(e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Privacy Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-500/20 rounded-xl border border-green-500/30">
                    <Lock className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Privacy</h3>
                    <p className="text-sm text-gray-400">Control your privacy settings</p>
                  </div>
                </div>

                <div className="bg-white/5 rounded-2xl p-6 space-y-4 border border-white/10 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Eye className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="font-medium text-white">Read receipts</p>
                        <p className="text-sm text-gray-400">Let others know when you've read their messages</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={readReceipts} 
                        onChange={(e) => setReadReceipts(e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Eye className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="font-medium text-white">Last seen</p>
                        <p className="text-sm text-gray-400">Show when you were last online</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={lastSeen} 
                        onChange={(e) => setLastSeen(e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Data and Storage Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
                    <Download className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Data and Storage</h3>
                    <p className="text-sm text-gray-400">Manage your data usage</p>
                  </div>
                </div>

                <div className="bg-white/5 rounded-2xl p-6 space-y-4 border border-white/10 backdrop-blur-sm">
                  <button className="flex items-center justify-between w-full p-4 rounded-xl hover:bg-white/10 transition-all duration-200 border border-transparent hover:border-blue-500/30">
                    <div className="flex items-center gap-3">
                      <Download className="w-4 h-4 text-blue-400" />
                      <div className="text-left">
                        <p className="font-medium text-white">Download data</p>
                        <p className="text-sm text-gray-400">Export your chat history</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-blue-400 font-medium">Export</p>
                    </div>
                  </button>

                  <button className="flex items-center justify-between w-full p-4 rounded-xl hover:bg-red-500/10 transition-all duration-200 border border-transparent hover:border-red-500/30 text-red-400">
                    <div className="flex items-center gap-3">
                      <Trash2 className="w-4 h-4" />
                      <div className="text-left">
                        <p className="font-medium">Clear chat history</p>
                        <p className="text-sm text-red-400/70">Delete all messages permanently</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Clear</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Help and Support Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-pink-500/20 rounded-xl border border-pink-500/30">
                    <HelpCircle className="w-5 h-5 text-pink-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Help and Support</h3>
                    <p className="text-sm text-gray-400">Get help and information</p>
                  </div>
                </div>

                <div className="bg-white/5 rounded-2xl p-6 space-y-4 border border-white/10 backdrop-blur-sm">
                  <button className="flex items-center justify-between w-full p-4 rounded-xl hover:bg-white/10 transition-all duration-200 border border-transparent hover:border-pink-500/30">
                    <div className="flex items-center gap-3">
                      <HelpCircle className="w-4 h-4 text-pink-400" />
                      <div className="text-left">
                        <p className="font-medium text-white">Help Center</p>
                        <p className="text-sm text-gray-400">Get answers to common questions</p>
                      </div>
                    </div>
                  </button>

                  <button className="flex items-center justify-between w-full p-4 rounded-xl hover:bg-white/10 transition-all duration-200 border border-transparent hover:border-pink-500/30">
                    <div className="flex items-center gap-3">
                      <Info className="w-4 h-4 text-pink-400" />
                      <div className="text-left">
                        <p className="font-medium text-white">About Yapp</p>
                        <p className="text-sm text-gray-400">Version 1.0.0</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingsPage;