import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="site-shell flex-1 pb-10 pt-28 sm:pb-12 sm:pt-32">{children}</main>
      <Footer />
    </div>
  );
}
