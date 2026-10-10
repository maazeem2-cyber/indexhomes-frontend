import { Nav } from "@/components/Nav";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <div className="auth-wrap flex-1 pt-20 sm:pt-24">{children}</div>
    </div>
  );
}
