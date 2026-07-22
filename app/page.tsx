import fs from "node:fs";
import path from "node:path";
import { AskExperience } from "@/components/ask-experience";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ProfileSection } from "@/components/profile-section";
import { SignalBar } from "@/components/signal-bar";
import { WorkSection } from "@/components/work-section";
import { loadProjects } from "@/lib/projects";

export default function Home() {
  const projects = loadProjects();
  const hasCv = fs.existsSync(path.join(process.cwd(), "public", "cv.pdf"));

  return (
    <>
      <Header hasCv={hasCv} />
      <main className="relative flex-1">
        {/* background: radial light + drifting geometric grid + oversized rounded rectangles */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="hero-glow absolute inset-x-0 top-0 h-[80vh]" />
          <div className="bg-grid bg-grid-drift absolute -inset-x-8 -top-24 h-[110vh]" />
          <div className="absolute left-1/2 top-24 h-[520px] w-[820px] -translate-x-1/2 rounded-[64px] border border-line" />
          <div className="absolute left-1/2 top-40 h-[520px] w-[640px] -translate-x-1/2 rounded-[48px] border border-line" />
        </div>

        <AskExperience projects={projects} />
        <SignalBar />
        <WorkSection projects={projects} />
        <ProfileSection />
        <ContactSection hasCv={hasCv} />
      </main>
      <Footer />
    </>
  );
}
