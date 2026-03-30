import React, { useRef, useState } from "react";
import { Upload as UploadIcon, X, FileText, Image as ImageIcon } from "lucide-react";

interface UploadProps {
  label?: string;
  onFileSelect?: (file: File) => void;
  accept?: string;
  className?: string;
}

export const Upload: React.FC<UploadProps> = ({
  label,
  onFileSelect,
  accept = "*",
  className = "",
}) => {
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      onFileSelect?.(selectedFile);
    }
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-bold text-text-primary ml-1">
          {label}
        </label>
      )}
      <div
        onClick={() => inputRef.current?.click()}
        className={`
          relative border-2 border-dashed border-gray-200 rounded-2xl p-6
          flex flex-col items-center justify-center gap-2 cursor-pointer
          hover:border-brand-primary hover:bg-brand-primary/5 transition-all
          ${file ? "border-brand-primary bg-brand-primary/5" : ""}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
        
        {file ? (
          <div className="flex items-center gap-3 w-full">
            <div className="w-10 h-10 rounded-xl bg-brand-primary text-white flex items-center justify-center">
              {file.type.startsWith("image/") ? <ImageIcon size={20} /> : <FileText size={20} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-text-primary truncate">{file.name}</p>
              <p className="text-xs text-text-tertiary">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <button
              onClick={clearFile}
              className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors text-text-tertiary hover:text-error"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-text-tertiary group-hover:text-brand-primary transition-colors">
              <UploadIcon size={24} />
            </div>
            <p className="text-sm font-bold text-text-primary">Click to upload document</p>
            <p className="text-xs text-text-tertiary">PDF, JPG or PNG (max 10MB)</p>
          </>
        )}
      </div>
    </div>
  );
};
