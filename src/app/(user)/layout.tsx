import UserSidebar from "@/components/UserSidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  // Redirect admins to admin dashboard
  if (session && (session.user as any).role === "ADMIN") {
    redirect("/admin/dashboard");
  }

  return (
    <div className="bg-zinc-950 min-h-screen text-white flex overflow-x-hidden">
      {/* Sidebar fixed position par hai */}
      <UserSidebar />
      
      {/* Content area logic */}
      <div className="flex-1 w-full lg:ml-64 flex flex-col min-h-screen transition-all duration-300 ease-in-out">
        <main className="flex-1 w-full max-w-[100vw] overflow-x-hidden">
          {/* Is container ke andar saare dashboard pages display honge */}
          {children}
        </main>
      </div>
    </div>
  );
}