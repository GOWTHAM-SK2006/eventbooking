'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, X, ArrowLeft, ArrowRight, Trash2, Star, RefreshCw, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAuthToken, resolveImageUrl } from '../utils/api';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxCount?: number;
}

interface UploadingFile {
  id: string;
  name: string;
  progress: number;
}

export default function ImageUpload({ images, onChange, maxCount = 10 }: ImageUploadProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);

  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  const maxSizeBytes = 20 * 1024 * 1024; // 20 MB

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(event.target?.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          resolve(dataUrl);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const uploadImage = async (file: File, fileId: string, onProgress: (progress: number) => void): Promise<string> => {
    const compressedDataUrl = await compressImage(file);
    const response = await fetch(compressedDataUrl);
    const blob = await response.blob();
    
    const formData = new FormData();
    formData.append('file', blob, file.name);

    const token = getAuthToken();

    const API_BASE_URL = typeof window !== 'undefined' 
      ? (window.location.host.includes('localhost:3000') 
         ? 'http://localhost:8080/api' 
         : `${window.location.protocol}//${window.location.host}/api`)
      : 'http://localhost:8080/api';

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${API_BASE_URL}/images/upload`, true);
      
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          onProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const resObj = JSON.parse(xhr.responseText);
            resolve(resObj.url);
          } catch (e) {
            reject(new Error('Invalid response from server'));
          }
        } else {
          reject(new Error(xhr.responseText || 'Upload failed'));
        }
      };

      xhr.onerror = () => {
        reject(new Error('Network error during upload'));
      };

      xhr.send(formData);
    });
  };

  const handleFiles = async (files: FileList) => {
    setError(null);
    const validFiles: File[] = [];

    // Calculate available slots
    const availableSlots = maxCount - images.length - uploadingFiles.length;
    if (availableSlots <= 0) {
      setError(`Maximum limit of ${maxCount} images reached.`);
      return;
    }

    const countToUpload = Math.min(files.length, availableSlots);
    if (files.length > availableSlots) {
      setError(`Only adding first ${availableSlots} images to respect the limit of ${maxCount}.`);
    }

    for (let i = 0; i < countToUpload; i++) {
      const file = files[i];
      if (!allowedTypes.includes(file.type)) {
        setError('Unsupported file type. Please upload JPG, PNG, JPEG or WEBP.');
        continue;
      }
      if (file.size > maxSizeBytes) {
        setError('File size too large. Maximum size is 20MB per image.');
        continue;
      }
      validFiles.push(file);
    }

    validFiles.forEach((file) => {
      const id = Math.random().toString(36).substring(7);
      const newUpload = { id, name: file.name, progress: 0 };
      setUploadingFiles((prev) => [...prev, newUpload]);

      uploadImage(file, id, (progress) => {
        setUploadingFiles((prev) =>
          prev.map((f) => (f.id === id ? { ...f, progress } : f))
        );
      })
      .then((url) => {
        onChange([...images, url]);
        setUploadingFiles((prev) => prev.filter((f) => f.id !== id));
      })
      .catch((err) => {
        setError(err.message || 'Error uploading image');
        setUploadingFiles((prev) => prev.filter((f) => f.id !== id));
      });
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleDelete = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleMove = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onChange(updated);
  };

  const handleSetFeatured = (index: number) => {
    if (index === 0) return;
    const updated = [...images];
    const featuredImg = updated.splice(index, 1)[0];
    updated.unshift(featuredImg);
    onChange(updated);
  };

  const triggerReplace = (index: number) => {
    setReplaceIndex(index);
    if (replaceInputRef.current) {
      replaceInputRef.current.value = '';
      replaceInputRef.current.click();
    }
  };

  const handleReplaceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (replaceIndex === null || !e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    if (!allowedTypes.includes(file.type)) {
      setError('Unsupported file type. Please upload JPG, PNG, JPEG or WEBP.');
      return;
    }
    if (file.size > maxSizeBytes) {
      setError('File size too large. Maximum size is 20MB per image.');
      return;
    }

    const id = Math.random().toString(36).substring(7);
    const newUpload = { id, name: file.name, progress: 0 };
    setUploadingFiles((prev) => [...prev, newUpload]);

    const idxToReplace = replaceIndex;
    setReplaceIndex(null);

    uploadImage(file, id, (progress) => {
      setUploadingFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, progress } : f))
      );
    })
    .then((url) => {
      const updated = [...images];
      updated[idxToReplace] = url;
      onChange(updated);
      setUploadingFiles((prev) => prev.filter((f) => f.id !== id));
    })
    .catch((err) => {
      setError(err.message || 'Error uploading image');
      setUploadingFiles((prev) => prev.filter((f) => f.id !== id));
    });
  };

  return (
    <div className="space-y-4">
      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".jpg,.jpeg,.png,.webp"
        onChange={handleFileInput}
        className="hidden"
      />
      <input
        ref={replaceInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        onChange={handleReplaceInput}
        className="hidden"
      />

      {/* Drag & Drop Area */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden ${
          dragActive
            ? 'border-yellow-400 bg-yellow-50/20 scale-[0.99] shadow-xs'
            : 'border-gray-300 hover:border-yellow-400 bg-gray-50/50 hover:bg-white hover:shadow-xs'
        }`}
      >
        <div className="flex flex-col items-center text-center space-y-3 z-10">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-100 shadow-2xs group-hover:scale-105 transition-transform">
            <UploadCloud className="text-yellow-500" size={24} />
          </div>
          <div>
            <p className="text-sm font-extrabold text-gray-800">
              Drag & drop event images here or click to browse
            </p>
            <p className="text-xs text-gray-400 font-semibold mt-1">
              Supports JPEG, PNG, JPG, WEBP (Max 20MB per file, up to {maxCount} images)
            </p>
          </div>
          <button
            type="button"
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition-all"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            Browse Files
          </button>
        </div>
      </div>

      {error && (
        <div className="text-xs font-bold text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {/* Uploading Progress & Thumbnails List */}
      {(images.length > 0 || uploadingFiles.length > 0) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <AnimatePresence initial={false}>
            {images.map((url, index) => (
              <motion.div
                key={url.substring(0, 100) + index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative aspect-video rounded-xl overflow-hidden border border-gray-200 shadow-2xs group"
              >
                <img
                  src={resolveImageUrl(url)}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Index Counter */}
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                  {index + 1}
                </div>

                {/* Featured Badge */}
                {index === 0 && (
                  <div className="absolute top-2 right-2 bg-yellow-400 text-gray-900 text-[9px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs uppercase tracking-wider">
                    <Star size={10} fill="currentColor" /> Featured
                  </div>
                )}

                {/* Hover Action Panel */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex flex-col justify-between p-2.5 transition-opacity duration-200 z-10">
                  <div className="flex justify-between items-center">
                    {index !== 0 ? (
                      <button
                        type="button"
                        onClick={() => handleSetFeatured(index)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 p-1.5 rounded-lg text-[9px] font-black flex items-center gap-0.5 shadow-sm transition-all"
                        title="Set as Featured Image"
                      >
                        <Star size={11} fill="currentColor" /> Featured
                      </button>
                    ) : (
                      <div className="text-[10px] text-yellow-400 font-black flex items-center gap-0.5">
                        <Star size={12} fill="currentColor" /> Featured
                      </div>
                    )}
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => triggerReplace(index)}
                        className="bg-white/10 hover:bg-white/20 text-white p-1.5 rounded-lg transition-all"
                        title="Replace Image"
                      >
                        <RefreshCw size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(index)}
                        className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg transition-all"
                        title="Delete Image"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setPreviewImage(url)}
                      className="bg-white/10 hover:bg-white/20 text-white p-1.5 rounded-lg transition-all"
                      title="Preview Image"
                    >
                      <Eye size={12} />
                    </button>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMove(index, 'left')}
                        className={`bg-white/10 text-white p-1.5 rounded-lg transition-all ${
                          index === 0
                            ? 'opacity-40 cursor-not-allowed'
                            : 'hover:bg-white/20'
                        }`}
                      >
                        <ArrowLeft size={12} />
                      </button>
                      <button
                        type="button"
                        disabled={index === images.length - 1}
                        onClick={() => handleMove(index, 'right')}
                        className={`bg-white/10 text-white p-1.5 rounded-lg transition-all ${
                          index === images.length - 1
                            ? 'opacity-40 cursor-not-allowed'
                            : 'hover:bg-white/20'
                        }`}
                      >
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Uploading progress placeholders */}
            {uploadingFiles.map((file) => (
              <div
                key={file.id}
                className="relative aspect-video rounded-xl overflow-hidden border border-yellow-200 bg-yellow-50/10 flex flex-col justify-center items-center p-3 text-center space-y-2 shadow-2xs"
              >
                <div className="animate-spin text-yellow-500">
                  <RefreshCw size={18} />
                </div>
                <div className="w-full">
                  <p className="text-[10px] font-bold text-gray-700 truncate px-1">
                    {file.name}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1.5 overflow-hidden">
                    <div
                      className="bg-yellow-400 h-1.5 rounded-full transition-all duration-200"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                  <span className="text-[9px] font-black text-yellow-600 mt-1 block">
                    Uploading... {file.progress}%
                  </span>
                </div>
              </div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90"
            onClick={() => setPreviewImage(null)}
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 text-white hover:text-yellow-400 bg-white/10 p-2.5 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            <motion.img
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              src={resolveImageUrl(previewImage)}
              alt="Preview Fullscreen"
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
