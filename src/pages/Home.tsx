import React, { useState, useRef } from 'react';
import { Camera, Upload, Clipboard, ArrowRight, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { analyzeImage } from '../lib/gemini';
import { saveReceipt } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export const Home = () => {
  const [category, setCategory] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleImageUpload = async (file: File) => {
    if (!user) {
      toast.error('Please sign in to upload receipts');
      navigate('/auth');
      return;
    }

    if (!category) {
      toast.error('Please select a category first');
      return;
    }

    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Image = e.target?.result?.toString().split(',')[1];
        if (base64Image) {
          const result = await analyzeImage(base64Image, category);
          await saveReceipt(result);
          toast.success('Receipt processed successfully!');
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing receipt:', error);
      toast.error('Failed to process receipt');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    if (!user) {
      toast.error('Please sign in to upload receipts');
      navigate('/auth');
      return;
    }

    if (!category) {
      toast.error('Please select a category first');
      return;
    }

    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) await handleImageUpload(file);
      }
    }
  };

  const handleTakePhoto = () => {
    if (!user) {
      toast.error('Please sign in to upload receipts');
      navigate('/auth');
      return;
    }

    if (!category) {
      toast.error('Please select a category first');
      return;
    }
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-8">Welcome to Receipt Manager</h1>
        <p className="text-xl mb-8">Please sign in to manage your receipts</p>
        <button
          onClick={() => navigate('/auth')}
          className="inline-flex items-center space-x-2 bg-[#F8BF1E] text-white px-6 py-3 rounded-lg hover:bg-[#F8BF1E]/90"
        >
          <LogIn className="w-5 h-5" />
          <span>Sign In</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">Receipt Manager</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-6">Select Category</h2>
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setCategory('Meals')}
            className={`flex-1 py-4 px-6 rounded-lg text-lg font-medium transition-all ${
              category === 'Meals'
                ? 'bg-[#F8BF1E] text-white'
                : 'bg-white border-2 border-[#F8BF1E] text-[#F8BF1E] hover:bg-[#F8BF1E] hover:text-white'
            }`}
          >
            Meals
          </button>
          <button
            onClick={() => setCategory('Accommodation')}
            className={`flex-1 py-4 px-6 rounded-lg text-lg font-medium transition-all ${
              category === 'Accommodation'
                ? 'bg-[#F8BF1E] text-white'
                : 'bg-white border-2 border-[#F8BF1E] text-[#F8BF1E] hover:bg-[#F8BF1E] hover:text-white'
            }`}
          >
            Accommodation
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={handleTakePhoto}
            disabled={!category || isProcessing}
            className={`flex flex-col items-center justify-center p-8 rounded-lg border-2 border-dashed transition-all ${
              !category
                ? 'border-gray-300 text-gray-400'
                : 'border-[#F8BF1E] hover:bg-[#F8BF1E]/5 text-[#F8BF1E]'
            }`}
          >
            <Camera className="w-12 h-12 mb-4" />
            <span className="text-lg font-medium">Take Photo</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
            />
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={!category || isProcessing}
            className={`flex flex-col items-center justify-center p-8 rounded-lg border-2 border-dashed transition-all ${
              !category
                ? 'border-gray-300 text-gray-400'
                : 'border-[#F8BF1E] hover:bg-[#F8BF1E]/5 text-[#F8BF1E]'
            }`}
          >
            <Upload className="w-12 h-12 mb-4" />
            <span className="text-lg font-medium">Upload Image</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
            />
          </button>

          <div
            onPaste={handlePaste}
            className={`flex flex-col items-center justify-center p-8 rounded-lg border-2 border-dashed transition-all ${
              !category
                ? 'border-gray-300 text-gray-400'
                : 'border-[#F8BF1E] hover:bg-[#F8BF1E]/5 text-[#F8BF1E] cursor-pointer'
            }`}
          >
            <Clipboard className="w-12 h-12 mb-4" />
            <span className="text-lg font-medium">Paste Image</span>
          </div>
        </div>

        {isProcessing && (
          <div className="mt-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F8BF1E] mx-auto"></div>
            <p className="mt-4 text-lg">Processing your receipt...</p>
          </div>
        )}
      </div>

      <div className="text-center">
        <a
          href="/dashboard"
          className="inline-flex items-center space-x-2 text-[#F8BF1E] hover:text-[#F8BF1E]/80"
        >
          <span className="text-lg">View Receipt History</span>
          <ArrowRight className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
};