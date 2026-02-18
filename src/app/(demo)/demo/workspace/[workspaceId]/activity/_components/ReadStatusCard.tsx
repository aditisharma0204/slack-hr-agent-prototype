"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  IconCopy,
  IconPencil,
  IconMoreVertical,
  IconHashtag,
  IconMessage,
} from "@/components/icons";
import { getMessageAvatarUrl, useDemoData } from "@/context/DemoDataContext";
import type { DemoActivityPost } from "@/context/DemoDataContext";

function formatContentWithMentions(text: string) {
  const parts = text.split(/(@\w+(?:\s+\w+)?)/g);
  return parts.map((part, i) =>
    part.startsWith("@") ? (
      <span
        key={i}
        className="bg-[#e8f4fc] text-[#1264a3] px-0.5 rounded"
      >
        {part}
      </span>
    ) : (
      part
    )
  );
}

export function ReadStatusCard({ post }: { post: DemoActivityPost }) {
  const params = useParams();
  const { isChannelRead } = useDemoData();
  const workspaceId = params.workspaceId as string;
  const avatarSrc = post.authorImage || getMessageAvatarUrl(post.author) || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author)}&background=611f69&color=fff&size=64`;
  const isUnread = post.read === false && !isChannelRead(post.channelId);
  const isDM = post.type === "dm";
  const commentCount = post.commentCount ?? 0;

  return (
    <Link
      href={`/demo/workspace/${workspaceId}/channel/${post.channelId}?from=activity`}
      className="block w-full rounded-lg p-4 transition-colors"
      style={{
        border: "1px solid",
        borderColor: isUnread ? "#E6E6E6" : "#E0E0E0",
        ...(isUnread && { borderLeft: "2px solid #78317F" }),
        backgroundColor: isUnread ? "#ffffff" : "#F7F7F7",
      }}
    >
      <div className="flex items-start gap-3">
        {/* Profile picture with # overlay (post) or DM icon */}
        <div className="relative shrink-0">
          <img
            src={avatarSrc}
            alt=""
            className="w-10 h-10 rounded-full object-cover"
          />
          {!isDM && (
            <div className="absolute bottom-0 left-0 w-[18px] h-[18px] rounded-full bg-[#616061] flex items-center justify-center">
              <IconHashtag width={10} height={10} className="text-white" stroke="currentColor" strokeWidth={2.5} />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Top row: name + action icons + timestamp */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="font-semibold text-[#1d1c1d]" style={{ fontSize: "15px" }}>
                {post.author}
              </span>
              <div className="mt-0.5 flex items-center gap-1">
                {isDM ? (
                  <span className="text-[#616061] text-sm">DM</span>
                ) : (
                  <>
                    <span className="text-[#616061] text-sm">Post in</span>
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[13px] text-[#1d1c1d]"
                      style={{ backgroundColor: "#f0f0f0" }}
                    >
                      # {post.channelName}
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 opacity-70 hover:opacity-100">
              {commentCount > 0 && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white bg-[#611f69]">
                  <IconMessage width={12} height={12} stroke="currentColor" />
                  {commentCount}
                </span>
              )}
              {post.timestamp && (
                <span className="text-[#616061] text-sm">{post.timestamp}</span>
              )}
              <button type="button" onClick={(e) => e.stopPropagation()} className="p-1.5 rounded hover:bg-[#f0f0f0]" title="Copy">
                <IconCopy width={16} height={16} className="text-[#616061]" stroke="currentColor" />
              </button>
              <button type="button" onClick={(e) => e.stopPropagation()} className="p-1.5 rounded hover:bg-[#f0f0f0]" title="Edit">
                <IconPencil width={16} height={16} className="text-[#616061]" stroke="currentColor" />
              </button>
              <button type="button" onClick={(e) => e.stopPropagation()} className="p-1.5 rounded hover:bg-[#f0f0f0]" title="More">
                <IconMoreVertical width={16} height={16} className="text-[#616061]" stroke="currentColor" />
              </button>
            </div>
          </div>

          {/* Content snippet */}
          <p className="mt-2 min-w-0 text-[#1d1c1d] text-sm leading-relaxed line-clamp-2 break-words">
            {formatContentWithMentions(post.content)}
          </p>
        </div>
      </div>
    </Link>
  );
}
