import React, { useState } from 'react';
import { Eye, Edit3, AlignLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import InputForm from './InputForm';
import Button from './Button';

const MarkdownForm = ({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder = "Enter content...", 
  icon = AlignLeft,
  required = false,
  previewHeight = "min-h-[200px]"
}) => {
  const [isPreview, setIsPreview] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-bold font-outfit text-txt-primary uppercase tracking-wider">
          {label} {isPreview ? "(Preview)" : "(Markdown)"}
          {required && !isPreview && <span className="text-red-500 ml-1">*</span>}
        </label>
        <Button 
          type="button" 
          variant="secondary" 
          size="sm" 
          onClick={() => setIsPreview(!isPreview)}
          className="flex gap-2 h-8 py-0"
        >
          {isPreview ? <Edit3 size={14} /> : <Eye size={14} />}
          <span className="text-xs">{isPreview ? "Show Editor" : "Show Preview"}</span>
        </Button>
      </div>
      
      {!isPreview ? (
        <InputForm 
          name={name} 
          type="textarea" 
          value={value} 
          onChange={onChange} 
          placeholder={placeholder}
          icon={icon}
          required={required}
        />
      ) : (
        <div className={`p-6 border border-gray-100 rounded-xl bg-gray-50/50 ${previewHeight} overflow-y-auto prose max-w-none font-roboto animate-fadeIn`}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {value || "*No content provided.*"}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default MarkdownForm;