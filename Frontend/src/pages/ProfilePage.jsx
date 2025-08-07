import { Camera, Mail, User, Edit3, Shield, Star } from 'lucide-react';
import {useAuthStore} from '../store/useAuthStore.js';
import { useState } from 'react';

const ProfilePage = () => {
    const {authUser, isUpdatingProfile, updateProfile} = useAuthStore();
    const [selectedImage, setSelectedImage] = useState(null);
    
    const handleImageUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Image = reader.result;
        setSelectedImage(base64Image);
        await updateProfile({ profilePic: base64Image });
      }
    };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-black pl-20 pt-8 px-4">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(147,51,234,0.3),transparent)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(236,72,153,0.3),transparent)]"></div>
      </div>

      <div className="relative container mx-auto max-w-2xl">
        <div className="bg-black/20 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
          {/* Header */}
          <div className="relative p-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10"></div>
            <div className="relative text-center">
              <h1 className='text-3xl font-bold text-white mb-2'>Your Profile</h1>
              <p className='text-gray-300'>Manage your account information</p>
            </div>
          </div>

          {/* Avatar Section */}
          <div className='relative p-8 text-center'>
            <div className='flex flex-col items-center gap-6'>
              <div className='relative group'>
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                
                <img 
                  src={selectedImage || authUser.profilePic || "/avatar.png"} 
                  alt="Profile" 
                  className='relative w-32 h-32 rounded-full object-cover border-4 border-white/20 shadow-2xl group-hover:scale-105 transition-transform' 
                />
                
                <label 
                  htmlFor="avatar-upload" 
                  className={`absolute bottom-2 right-2 bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full cursor-pointer 
                            shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 border-2 border-white/20
                            ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}`}
                >
                  <Camera className='w-5 h-5 text-white' />
                  <input 
                    type="file" 
                    id='avatar-upload' 
                    className='hidden' 
                    accept='image/*' 
                    onChange={handleImageUpload} 
                    disabled={isUpdatingProfile} 
                  />
                </label>
              </div>
              
              <div className="text-center">
                <h2 className="text-xl font-bold text-white">{authUser?.fullName}</h2>
                <p className='text-gray-400 text-sm mt-1'>
                  {isUpdatingProfile ? "Updating profile..." : "Click camera to change photo"}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className='p-8 space-y-6'>
            {/* Personal Info Card */}
            <div className='bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm'>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <User className='w-5 h-5 text-purple-400' />
                </div>
                <h3 className="text-lg font-semibold text-white">Personal Information</h3>
              </div>
              
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <label className='text-sm text-gray-400 flex items-center gap-2'>
                    <User className='w-4 h-4' />
                    Full Name
                  </label>
                  <div className='flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10'>
                    <span className='text-white'>{authUser?.fullName}</span>
                    <Edit3 className='w-4 h-4 text-gray-400 cursor-pointer hover:text-purple-400 transition-colors' />
                  </div>
                </div>

                <div className='space-y-2'>
                  <label className='text-sm text-gray-400 flex items-center gap-2'>
                    <Mail className='w-4 h-4' />
                    Email Address
                  </label>
                  <div className='flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10'>
                    <span className='text-white'>{authUser?.email}</span>
                    <Edit3 className='w-4 h-4 text-gray-400 cursor-pointer hover:text-purple-400 transition-colors' />
                  </div>
                </div>
              </div>
            </div>

            {/* Account Status Card */}
            <div className='bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm'>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Shield className='w-5 h-5 text-green-400' />
                </div>
                <h3 className="text-lg font-semibold text-white">Account Status</h3>
              </div>
              
              <div className='space-y-3'>
                <div className='flex items-center justify-between py-3 border-b border-white/10'>
                  <span className="text-gray-300">Member Since</span>
                  <span className="text-white font-medium">{authUser.createdAt?.split("T")[0]}</span>
                </div>
                <div className='flex items-center justify-between py-3 border-b border-white/10'>
                  <span className="text-gray-300">Account Status</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className='text-green-400 font-medium'>Active</span>
                  </div>
                </div>
                <div className='flex items-center justify-between py-3'>
                  <span className="text-gray-300">Profile Completeness</span>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-white font-medium">85%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
