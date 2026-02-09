import Editor, { loader } from "@monaco-editor/react";
import GITHUB_DARK_THEME from "../../misc/MonacoGithubDarkTheme";
import toast from "react-hot-toast";
import { useEffect } from "react";

function downloadFile(filename: string, text: string) {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

const buttonStyling =
  "flex w-[41.2px] h-[41.2px] flex-col items-start shrink-0 rounded-[10px] border border-blue-500/20 bg-white/5 p-[10.6px]! pb-[0.6px]!";

export function RefreshButton({
  createGameStream,
  gameCode,
}: {
  createGameStream: () => void;
  gameCode: string;
}) {
  return (
    <button
      type="button"
      className={`${buttonStyling}`}
      onClick={() => {
        if (gameCode.trim().length == 0) {
          toast.error("No code in editor");
        } else {
          createGameStream();
        }
      }}
    >
      <i className="fa-solid fa-rotate text-[#FFFFFF99]"></i>
    </button>
  );
}

export function DownloadButton({ gameCode }: { gameCode: string }) {
  return (
    <button
      type="button"
      className={`${buttonStyling}`}
      onClick={() => {
        if (gameCode.trim().length == 0) {
          toast.error("No code in editor");
        } else {
          downloadFile("index.html", gameCode);
        }
      }}
    >
      <i className="fa-solid fa-cloud-arrow-down text-[#FFFFFF99]"></i>
    </button>
  );
}

export function EditorPane({
  gameCode,
  setGameCode,
}: {
  gameCode: string;
  setGameCode: (code: string) => void;
}) {
  useEffect(() => {
    loader.init().then((monaco) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      monaco.editor.defineTheme("editorTheme", GITHUB_DARK_THEME);
    });
  }, []);

  return (
    <div className="flex overflow-auto w-full resize-y rounded-xl h-[65vh]">
      <Editor
        onChange={(value) => setGameCode(value ? value : "")}
        defaultLanguage="html"
        theme="editorTheme"
        options={{
          minimap: { enabled: false },
          padding: { top: 20, bottom: 20 },
          fontSize: 12,
          fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        }}
        value={gameCode}
      />
    </div>
  );
}
