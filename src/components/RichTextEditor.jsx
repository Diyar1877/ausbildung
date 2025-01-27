import React, { useRef } from 'react';
import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react';
import Editor from '@monaco-editor/react';

function RichTextEditor({ value, onChange, isCode }) {
  const editorRef = useRef(null);

  if (isCode) {
    return (
      <div className="border rounded-lg overflow-hidden">
        <Editor
          height="300px"
          defaultLanguage="javascript"
          value={value}
          onChange={onChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 10, bottom: 10 },
          }}
        />
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <TinyMCEEditor
        apiKey="4hfqjdz9tln4jsiofsreguawys5geqgokjeo2ncdg7zl9uic"
        onInit={(evt, editor) => editorRef.current = editor}
        value={value}
        onEditorChange={(content) => onChange(content)}
        init={{
          height: 300,
          menubar: false,
          statusbar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'charmap', 'preview',
            'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | formatselect | ' +
            'bold italic | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat',
          content_style: `
            body { 
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
              font-size: 14px;
              margin: 1rem;
            }
          `,
        }}
      />
    </div>
  );
}

export default RichTextEditor; 