"use client";

import { useLenis } from "@/hooks/useLenis";
import { useBootSequenceVisibility } from "@/components/boot/useBootSequenceVisibility";
import { BootSequence } from "@/components/boot/BootSequence";
import { Hud } from "@/components/hud/Hud";
import { ScanlineOverlay } from "@/components/ui/ScanlineOverlay";
import { IntroSection } from "@/components/sections/IntroSection";
import { EngineeringSection } from "@/components/sections/EngineeringSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { LabSection } from "@/components/sections/LabSection";
import { JourneySection } from "@/components/sections/JourneySection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function Home() {
  const lenisRef = useLenis();
  const { shouldShowBoot, markBootComplete } = useBootSequenceVisibility();

  return (
    <>
      {shouldShowBoot && (
        <BootSequence onEnter={markBootComplete} />
      )}

      {shouldShowBoot === false && (
        <>
          <ScanlineOverlay />
          <Hud lenisRef={lenisRef} />
          <main>
            <IntroSection />
            <EngineeringSection />
            <ProjectsSection />
            <LabSection />
            <JourneySection />
            <ContactSection />
          </main>
        </>
      )}
    </>
  );
}
