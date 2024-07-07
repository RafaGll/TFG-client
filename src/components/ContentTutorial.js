import React, {
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
} from "react";
import api from "../api";
import "@mdxeditor/editor/style.css";
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  UndoRedo,
  toolbarPlugin,
  BoldItalicUnderlineToggles,
  linkPlugin,
  linkDialogPlugin,
  CreateLink,
  InsertImage,
  imagePlugin,
  tablePlugin,
  InsertTable,
  markdownShortcutPlugin,
  Separator,
  BlockTypeSelect,
  CodeToggle,
  codeBlockPlugin,
  InsertCodeBlock,
  sandpackPlugin,
  codeMirrorPlugin,
  StrikeThroughSupSubToggles,
} from "@mdxeditor/editor";

const defaultSnippetContent = `
export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
`.trim();

const simpleSandpackConfig = {
  defaultPreset: "react",
  presets: [
    {
      label: "React",
      name: "react",
      meta: "live react",
      sandpackTemplate: "react",
      sandpackTheme: "light",
      snippetFileName: "/App.js",
      snippetLanguage: "jsx",
      initialSnippetContent: defaultSnippetContent,
    },
  ],
};

const ContentTutorial = forwardRef((props, ref) => {
  const [content, setContent] = useState("Hello world");
  const baseURL = process.env.REACT_APP_API_URL;

  useImperativeHandle(ref, () => ({
    getContent: () => content,
  }));

  return (
    <MDXEditor
      markdown={content}
      onChange={setContent}
      plugins={[
        tablePlugin(),
        imagePlugin({
          imageUploadHandler: async (file) => {
            // Implement image upload logic here
            const formData = new FormData();
            formData.append("image", file);

            try {
              const response = await api.post(`${baseURL}/upload`, formData, {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              });

              // Assuming the response contains the uploaded image URL
              const imageUrl = response.data.imageUrl;
              return imageUrl;
            } catch (error) {
              console.error("Error uploading image:", error);
              throw error;
            }
          },
        }),
        linkPlugin(),
        linkDialogPlugin(),
        headingsPlugin(),
        listsPlugin(),
        linkPlugin(),
        quotePlugin(),
        markdownShortcutPlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: "js" }),
        sandpackPlugin({ sandpackConfig: simpleSandpackConfig }),
        codeMirrorPlugin({
          codeBlockLanguages: {
            js: "JavaScript",
            css: "CSS",
            html: "HTML",
            python: "Python",
            java: "Java",
            cpp: "C++",
          },
          handleTab: true, // Ensure tab key works within code blocks
        }),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <UndoRedo />
              <Separator />
              <BoldItalicUnderlineToggles />
              <BlockTypeSelect />
              <Separator />
              <CreateLink />
              <InsertTable />
              <InsertImage />
              <Separator />
              <StrikeThroughSupSubToggles />
              <Separator />
              <CodeToggle />
              <InsertCodeBlock />
              {/* Add additional buttons as needed */}
            </>
          ),
        }),
      ]}
    />
  );
});

export default ContentTutorial;
