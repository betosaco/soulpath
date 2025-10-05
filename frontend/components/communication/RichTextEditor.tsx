import React, { useEffect, useState, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import { BaseButton } from '../ui/BaseButton';
import { Separator } from '../ui/separator';
import { PlaceholderAutocomplete } from './PlaceholderAutocomplete';
import { getPlaceholdersGrouped } from '../../lib/communication/placeholders';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link,
  Image,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Type,
  Hash
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
  showToolbar?: boolean;
  language?: string;
  type?: 'email' | 'sms';
}

// Placeholder autocomplete extension for Tiptap
const PlaceholderAutocompleteExtension = (type: 'email' | 'sms' = 'email') => {
  return {
    name: 'placeholderAutocomplete',

    addProseMirrorPlugins() {
      return [
        {
          props: {
            handleKeyDown: (view: any, event: KeyboardEvent) => {
              const { state } = view;
              const { selection } = state;
              const { $head } = selection;

              // Get text before cursor
              const textBefore = $head.parent.textContent.substring(0, $head.parentOffset);

              // Check if user typed {{
              const placeholderMatch = textBefore.match(/\{\{([^}]*)$/);
              if (placeholderMatch) {
                // Show autocomplete
                const searchTerm = placeholderMatch[1];
                showPlaceholderAutocomplete(view, searchTerm, type);
                return true;
              }

              return false;
            },
          },
        },
      ];
    },
  };
};

// Global state for autocomplete
let autocompleteInstance: any = null;

function showPlaceholderAutocomplete(view: any, searchTerm: string, type: 'email' | 'sms') {
  if (autocompleteInstance) {
    autocompleteInstance.destroy();
  }

  const { state } = view;
  const { selection } = state;
  const { $head } = selection;

  // Get cursor position
  const coords = view.coordsAtPos($head.pos);

  autocompleteInstance = tippy(document.body, {
    content: 'Loading...',
    showOnCreate: true,
    interactive: true,
    trigger: 'manual',
    placement: 'bottom-start',
    offset: [coords.left, coords.bottom + 10],
    arrow: false,
    theme: 'light',
    maxWidth: 'none',
    onShow(instance) {
      const placeholders = getPlaceholdersGrouped(type);
      const filtered: Record<string, any[]> = {};

      Object.entries(placeholders).forEach(([category, placeholderList]) => {
        const filteredList = placeholderList.filter(p =>
          p.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filteredList.length > 0) {
          filtered[category] = filteredList;
        }
      });

      const allItems = Object.values(filtered).flat();

      if (allItems.length === 0) {
        instance.setContent('No placeholders found');
        return;
      }

      const content = document.createElement('div');
      content.className = 'p-2 max-h-64 overflow-y-auto';

      Object.entries(filtered).forEach(([category, items]) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'mb-3';

        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'text-xs font-medium text-gray-700 uppercase tracking-wide mb-2';
        categoryHeader.textContent = category;
        categoryDiv.appendChild(categoryHeader);

        items.forEach((placeholder: any) => {
          const itemDiv = document.createElement('div');
          itemDiv.className = 'flex items-center justify-between p-2 rounded hover:bg-gray-100 cursor-pointer';

          const textDiv = document.createElement('div');
          const code = document.createElement('code');
          code.className = 'text-sm px-2 py-1 bg-gray-100 rounded font-mono';
          code.textContent = placeholder.key;
          textDiv.appendChild(code);

          const desc = document.createElement('p');
          desc.className = 'text-xs text-gray-600 mt-1';
          desc.textContent = placeholder.description;
          textDiv.appendChild(desc);

          itemDiv.appendChild(textDiv);

          const button = document.createElement('button');
          button.className = 'text-blue-600 hover:text-blue-800';
          button.innerHTML = '→';
          button.onclick = () => {
            // Insert placeholder
            const { state, dispatch } = view;
            const { selection } = state;
            const { $head } = selection;

            // Find the start of {{
            const textBefore = $head.parent.textContent.substring(0, $head.parentOffset);
            const match = textBefore.match(/\{\{[^}]*$/);
            if (match) {
              const startPos = $head.pos - match[0].length;
              const endPos = $head.pos;

              view.dispatch(
                state.tr.replaceWith(startPos, endPos, state.schema.text(placeholder.key))
              );
            }

            instance.destroy();
            autocompleteInstance = null;
            view.focus();
          };

          itemDiv.appendChild(button);
          categoryDiv.appendChild(itemDiv);
        });

        content.appendChild(categoryDiv);
      });

      instance.setContent(content);
    },
    onHide() {
      autocompleteInstance = null;
    },
  });
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="border-b border-gray-200 p-2 flex flex-wrap gap-1 bg-gray-50">
      {/* Text Formatting */}
      <div className="flex gap-1">
        <BaseButton
          size="sm"
          variant={editor.isActive('bold') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="h-8 w-8 p-0"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </BaseButton>
        <BaseButton
          size="sm"
          variant={editor.isActive('italic') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="h-8 w-8 p-0"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </BaseButton>
        <BaseButton
          size="sm"
          variant={editor.isActive('strike') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className="h-8 w-8 p-0"
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </BaseButton>
        <BaseButton
          size="sm"
          variant={editor.isActive('code') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleCode().run()}
          className="h-8 w-8 p-0"
          title="Inline Code"
        >
          <Code className="h-4 w-4" />
        </BaseButton>
      </div>

      <Separator orientation="vertical" className="h-8 mx-1" />

      {/* Headings */}
      <div className="flex gap-1">
        <BaseButton
          size="sm"
          variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className="h-8 px-2 text-xs"
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4 mr-1" />
          H1
        </BaseButton>
        <BaseButton
          size="sm"
          variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className="h-8 px-2 text-xs"
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4 mr-1" />
          H2
        </BaseButton>
        <BaseButton
          size="sm"
          variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className="h-8 px-2 text-xs"
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4 mr-1" />
          H3
        </BaseButton>
      </div>

      <Separator orientation="vertical" className="h-8 mx-1" />

      {/* Lists */}
      <div className="flex gap-1">
        <BaseButton
          size="sm"
          variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="h-8 w-8 p-0"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </BaseButton>
        <BaseButton
          size="sm"
          variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="h-8 w-8 p-0"
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </BaseButton>
        <BaseButton
          size="sm"
          variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className="h-8 w-8 p-0"
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </BaseButton>
      </div>

      <Separator orientation="vertical" className="h-8 mx-1" />

      {/* Media */}
      <div className="flex gap-1">
        <BaseButton
          size="sm"
          variant="ghost"
          onClick={addLink}
          className="h-8 w-8 p-0"
          title="Add Link"
        >
          <Link className="h-4 w-4" />
        </BaseButton>
        <BaseButton
          size="sm"
          variant="ghost"
          onClick={addImage}
          className="h-8 w-8 p-0"
          title="Add Image"
        >
          <Image className="h-4 w-4" />
        </BaseButton>
      </div>

      <Separator orientation="vertical" className="h-8 mx-1" />

      {/* History */}
      <div className="flex gap-1">
        <BaseButton
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="h-8 w-8 p-0"
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </BaseButton>
        <BaseButton
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="h-8 w-8 p-0"
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </BaseButton>
      </div>
    </div>
  );
};

export function RichTextEditor({
  content,
  onChange,
  placeholder = 'Start writing...',
  className = '',
  rows = 10,
  showToolbar = true,
  language = 'en',
  type = 'email'
}: RichTextEditorProps) {
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [htmlContent, setHtmlContent] = useState(content);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      CharacterCount.configure({
        limit: 10000,
      }),
      PlaceholderAutocompleteExtension(type),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setHtmlContent(html);
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4',
      },
    },
  });

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  // Handle HTML mode toggle
  const handleHtmlModeToggle = () => {
    if (!isHtmlMode) {
      // Switching to HTML mode - get current HTML
      setHtmlContent(editor?.getHTML() || '');
    } else {
      // Switching to rich text mode - set content
      editor?.commands.setContent(htmlContent);
    }
    setIsHtmlMode(!isHtmlMode);
  };

  const characterCount = editor?.storage?.characterCount?.characters() || 0;
  const wordCount = editor?.storage?.characterCount?.words() || 0;

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      {showToolbar && (
        <div className="bg-gray-50 border-b border-gray-200">
          <MenuBar editor={editor} />
          <div className="flex items-center justify-between px-3 py-2 bg-white border-t border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                {characterCount.toLocaleString()} characters, {wordCount} words
              </span>
            </div>
            <BaseButton
              size="sm"
              variant="ghost"
              onClick={handleHtmlModeToggle}
              className="text-xs"
            >
              {isHtmlMode ? <Type className="h-4 w-4 mr-1" /> : <Code className="h-4 w-4 mr-1" />}
              {isHtmlMode ? 'Rich Text' : 'HTML'}
            </BaseButton>
          </div>
        </div>
      )}

      {/* Editor Content */}
      <div className="relative">
        {isHtmlMode ? (
          <textarea
            value={htmlContent}
            onChange={(e) => {
              setHtmlContent(e.target.value);
              onChange(e.target.value);
            }}
            placeholder={placeholder}
            className="w-full p-4 font-mono text-sm bg-white border-0 focus:outline-none focus:ring-0 resize-none"
            style={{ minHeight: `${rows * 1.5}rem` }}
            rows={rows}
          />
        ) : (
          <EditorContent
            editor={editor}
            className="min-h-[200px] bg-white"
            style={{ minHeight: `${rows * 1.5}rem` }}
          />
        )}
      </div>

      {/* Footer with stats */}
      <div className="bg-gray-50 px-3 py-2 border-t border-gray-200 text-xs text-gray-500 flex items-center justify-between">
        <span>Language: {language.toUpperCase()}</span>
        <span>
          {characterCount > 9000 && (
            <span className="text-amber-600 mr-2">Approaching limit</span>
          )}
          {characterCount}/10,000 characters
        </span>
      </div>
    </div>
  );
}
