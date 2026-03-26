"use client";

interface StarterPromptChipsProps {
  prompts: string[];
  onSelect: (prompt: string) => void;
}

export function StarterPromptChips({ prompts, onSelect }: StarterPromptChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 px-2 pb-1">
      {prompts.map((prompt) => (
        <button
          key={prompt}
          type="button"
          onClick={() => onSelect(prompt)}
          className="
            text-[13px] font-medium
            px-3 py-1.5
            rounded-full
            border border-gray-300
            text-gray-700
            bg-transparent
            hover:bg-gray-100 hover:border-gray-400
            transition-colors
            cursor-pointer
            whitespace-nowrap
          "
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
