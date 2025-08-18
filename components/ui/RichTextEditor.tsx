'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Palette,
  Undo,
  Redo,
  MoreHorizontal
} from 'lucide-react';

// Type definitions
interface RichTextEditorProps {
  value?: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

interface FormatButton {
  icon: React.ComponentType<{ className?: string }>;
  command?: string;
  value?: string;
  action?: () => void;
  title: string;
  mobileHidden?: boolean;
}

interface FormatButtonGroup {
  group: string;
  buttons: FormatButton[];
}

interface FontSize {
  label: string;
  value: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  value = '', 
  onChange, 
  placeholder = 'Start writing your content...',
  className = '',
  minHeight = '200px' 
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState<boolean>(false);
  const [linkUrl, setLinkUrl] = useState<string>('');
  const [linkText, setLinkText] = useState<string>('');
  const [showMoreTools, setShowMoreTools] = useState<boolean>(false);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleContentChange = (): void => {
    if (editorRef.current) {
      const content: string = editorRef.current.innerHTML;
      onChange(content);
    }
  };

  const execCommand = (command: string, value: string | undefined = undefined): void => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleContentChange();
  };

  const handleLinkInsert = (): void => {
    if (linkUrl && linkText) {
      const linkHtml: string = `<a href="${linkUrl}" style="color: #f97316; text-decoration: underline;" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
      execCommand('insertHTML', linkHtml);
      setIsLinkModalOpen(false);
      setLinkUrl('');
      setLinkText('');
    }
  };

  const formatButtons: FormatButtonGroup[] = [
    {
      group: 'text',
      buttons: [
        { icon: Bold, command: 'bold', title: 'Bold (Ctrl+B)' },
        { icon: Italic, command: 'italic', title: 'Italic (Ctrl+I)' },
        { icon: Underline, command: 'underline', title: 'Underline (Ctrl+U)', mobileHidden: true },
      ]
    },
    {
      group: 'align',
      buttons: [
        { icon: AlignLeft, command: 'justifyLeft', title: 'Align Left', mobileHidden: true },
        { icon: AlignCenter, command: 'justifyCenter', title: 'Align Center', mobileHidden: true },
        { icon: AlignRight, command: 'justifyRight', title: 'Align Right', mobileHidden: true },
      ]
    },
    {
      group: 'history',
      buttons: [
        { icon: Undo, command: 'undo', title: 'Undo (Ctrl+Z)', mobileHidden: true },
        { icon: Redo, command: 'redo', title: 'Redo (Ctrl+Y)', mobileHidden: true },
      ]
    }
  ];

  const fontSizes: FontSize[] = [
    { label: 'Small', value: '1' },
    { label: 'Normal', value: '3' },
    { label: 'Large', value: '5' },
    { label: 'Extra Large', value: '7' }
  ];

  const textColors: string[] = [
    '#000000', '#374151', '#6B7280', '#EF4444', '#F97316', 
    '#EAB308', '#22C55E', '#3B82F6', '#8B5CF6', '#EC4899'
  ];

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const value = e.target.value;
    if (value) {
      execCommand('fontSize', value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          execCommand('underline');
          break;
        case 'z':
          if (e.shiftKey) {
            e.preventDefault();
            execCommand('redo');
          } else {
            e.preventDefault();
            execCommand('undo');
          }
          break;
        case 'y':
          e.preventDefault();
          execCommand('redo');
          break;
      }
    }
  };

  // Get visible buttons for mobile
  const getVisibleButtons = () => {
    return formatButtons.map(group => ({
      ...group,
      buttons: group.buttons.filter(btn => !btn.mobileHidden)
    })).filter(group => group.buttons.length > 0);
  };

  // Get hidden buttons for mobile
  const getHiddenButtons = () => {
    return formatButtons.flatMap(group => 
      group.buttons.filter(btn => btn.mobileHidden)
    );
  };

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden bg-white ${className}`}>
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 p-2 sm:p-3">
        <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:flex-wrap sm:items-center gap-2">
          {/* First Row - Font controls */}
          <div className="flex items-center space-x-2 flex-wrap">
            {/* Font Size */}
            <select
              onChange={handleFontSizeChange}
              className="text-xs sm:text-sm border border-gray-300 rounded px-2 py-1 bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Size</option>
              {fontSizes.map((size: FontSize) => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>

            {/* Color Picker */}
            <div className="flex items-center space-x-1">
              <Palette className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
              <div className="flex space-x-1">
                {textColors.slice(0, 5).map((color: string) => (
                  <button
                    key={color}
                    onClick={() => execCommand('foreColor', color)}
                    className="w-4 h-4 sm:w-5 sm:h-5 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={`Text color: ${color}`}
                  />
                ))}
                {/* Show more colors on larger screens */}
                <div className="hidden sm:flex space-x-1">
                  {textColors.slice(5).map((color: string) => (
                    <button
                      key={color}
                      onClick={() => execCommand('foreColor', color)}
                      className="w-5 h-5 rounded border border-gray-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      title={`Text color: ${color}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Second Row - Format buttons */}
          <div className="flex items-center space-x-1 flex-wrap">
            {/* Desktop: Show all buttons */}
            <div className="hidden sm:flex items-center space-x-1">
              {formatButtons.map((group: FormatButtonGroup, groupIndex: number) => (
                <React.Fragment key={group.group}>
                  <div className="flex space-x-1">
                    {group.buttons.map((button: FormatButton, index: number) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          if (button.action) {
                            button.action();
                          } else if (button.command) {
                            execCommand(button.command, button.value || undefined);
                          }
                        }}
                        className="p-2 hover:bg-gray-200 rounded transition-colors duration-200 text-gray-600 hover:text-gray-800"
                        title={button.title}
                      >
                        <button.icon className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                  {groupIndex < formatButtons.length - 1 && (
                    <div className="w-px h-6 bg-gray-300" />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Mobile: Show essential buttons + more menu */}
            <div className="flex sm:hidden items-center space-x-1">
              {getVisibleButtons().map((group: FormatButtonGroup, groupIndex: number) => (
                <React.Fragment key={group.group}>
                  <div className="flex space-x-1">
                    {group.buttons.map((button: FormatButton, index: number) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          if (button.action) {
                            button.action();
                          } else if (button.command) {
                            execCommand(button.command, button.value || undefined);
                          }
                        }}
                        className="p-1.5 hover:bg-gray-200 rounded transition-colors duration-200 text-gray-600 hover:text-gray-800"
                        title={button.title}
                      >
                        <button.icon className="w-3.5 h-3.5" />
                      </button>
                    ))}
                  </div>
                  {groupIndex < getVisibleButtons().length - 1 && (
                    <div className="w-px h-5 bg-gray-300" />
                  )}
                </React.Fragment>
              ))}

              {/* More tools button for mobile */}
              {getHiddenButtons().length > 0 && (
                <>
                  <div className="w-px h-5 bg-gray-300" />
                  <div className="relative">
                    <button
                      onClick={() => setShowMoreTools(!showMoreTools)}
                      className="p-1.5 hover:bg-gray-200 rounded transition-colors duration-200 text-gray-600 hover:text-gray-800"
                      title="More tools"
                    >
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>

                    {/* More tools dropdown */}
                    {showMoreTools && (
                      <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-2">
                        <div className="grid grid-cols-3 gap-1">
                          {getHiddenButtons().map((button: FormatButton, index: number) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => {
                                if (button.action) {
                                  button.action();
                                } else if (button.command) {
                                  execCommand(button.command, button.value || undefined);
                                }
                                setShowMoreTools(false);
                              }}
                              className="p-2 hover:bg-gray-100 rounded transition-colors duration-200 text-gray-600 hover:text-gray-800"
                              title={button.title}
                            >
                              <button.icon className="w-4 h-4" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleContentChange}
        onBlur={handleContentChange}
        onKeyDown={handleKeyDown}
        className="p-3 sm:p-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-inset"
        style={{ 
          minHeight,
          maxHeight: '400px',
          overflowY: 'auto',
          fontSize: '14px',
          lineHeight: '1.6',
          color: '#374151'
        }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />

      {/* Link Modal */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Insert Link</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link Text
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLinkText(e.target.value)}
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Enter link text"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLinkUrl(e.target.value)}
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6">
              <button
                onClick={() => {
                  setIsLinkModalOpen(false);
                  setLinkUrl('');
                  setLinkText('');
                }}
                className="w-full sm:w-auto px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLinkInsert}
                disabled={!linkUrl || !linkText}
                className="w-full sm:w-auto px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors disabled:opacity-50"
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close more tools */}
      {showMoreTools && (
        <div 
          className="fixed inset-0 z-5"
          onClick={() => setShowMoreTools(false)}
        />
      )}

      {/* Custom styles for the editor */}
      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9CA3AF;
          font-style: italic;
        }
        
        [contenteditable] blockquote {
          border-left: 4px solid #f97316;
          padding-left: 16px;
          margin: 16px 0;
          color: #6B7280;
          font-style: italic;
          background-color: #FFF7ED;
          padding: 12px 16px;
          border-radius: 4px;
        }
        
        [contenteditable] pre {
          background-color: #F3F4F6;
          padding: 12px;
          border-radius: 6px;
          font-family: 'Courier New', monospace;
          margin: 8px 0;
          overflow-x: auto;
          font-size: 13px;
          border: 1px solid #E5E7EB;
        }
        
        [contenteditable] ul, [contenteditable] ol {
          padding-left: 20px;
          margin: 8px 0;
        }
        
        [contenteditable] li {
          margin: 4px 0;
        }
        
        [contenteditable] a {
          color: #f97316;
          text-decoration: underline;
        }
        
        [contenteditable] a:hover {
          color: #ea580c;
        }

        [contenteditable] h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.67em 0;
        }

        [contenteditable] h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.75em 0;
        }

        [contenteditable] h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin: 0.83em 0;
        }

        [contenteditable] p {
          margin: 0.5em 0;
        }

        /* Mobile responsive adjustments */
        @media (max-width: 640px) {
          [contenteditable] {
            font-size: 16px; /* Prevent zoom on iOS */
          }
          
          [contenteditable] blockquote {
            padding-left: 12px;
            padding: 8px 12px;
            margin: 12px 0;
          }
          
          [contenteditable] pre {
            padding: 8px;
            font-size: 12px;
          }
          
          [contenteditable] ul, [contenteditable] ol {
            padding-left: 16px;
          }
        }
      `}</style>
    </div>
  );
};