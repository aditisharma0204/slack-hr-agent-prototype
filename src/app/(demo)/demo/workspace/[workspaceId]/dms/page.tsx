"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DemoDMsPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace("/");
  }, [router]);
  
  return (
    <div className="h-full flex items-center justify-center bg-white">
      <p className="text-[#616061] text-sm">Redirecting to boilerplate...</p>
    </div>
  );
}
    if (dms.length > 0) {
      const firstDm = dms[0];
      router.replace(`/demo/workspace/${workspaceId}/channel/${firstDm.id}`, { scroll: false });
    }
  }, [dms, router, workspaceId]);

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 flex items-center justify-center p-8">
        <p className="text-[#616061] text-sm">Select a DM from the sidebar to start a conversation.</p>
      </div>
    </div>
  );
}
