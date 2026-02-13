import { redirect } from "next/navigation";
import AuthScreen from "@/components/AuthScreen";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const isDemoMode = !convexUrl || convexUrl.includes("demo-disabled");

export default function AuthPage() {
  if (isDemoMode) {
    redirect("/demo");
  }
  return <AuthScreen />;
}
