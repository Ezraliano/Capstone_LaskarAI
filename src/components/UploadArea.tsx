import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { UploadCloud, Image } from 'lucide-react';

interface UploadAreaProps {
  onFileSelected: (file: File) => void;
}

const UploadArea = ({ onFileSelected }: UploadAreaProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (isValidFile(file)) {
        onFileSelected(file);
      } else {
        alert('Please upload a valid image file (PNG, JPG, JPEG)');
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (isValidFile(file)) {
        onFileSelected(file);
      } else {
        alert('Please upload a valid image file (PNG, JPG, JPEG)');
      }
    }
  };

  const isValidFile = (file: File) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    return validTypes.includes(file.type);
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className={`upload-area ${isDragging ? 'active' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="mb-4 p-4 rounded-full bg-primary-100 text-primary-600">
        <UploadCloud size={40} />
      </div>
      <h3 className="text-lg font-medium text-gray-700 mb-2">
        Drag and drop your dental image
      </h3>
      <p className="text-gray-500 mb-4">
        Support for JPG, JPEG, PNG
      </p>
      <div className="flex gap-4">
        <button
          onClick={handleButtonClick}
          className="btn btn-primary flex items-center gap-2"
          type="button"
        >
          <Image size={18} />
          Browse Files
        </button>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".jpg,.jpeg,.png"
        />
      </div>
    </div>
  );
};

export default UploadArea;