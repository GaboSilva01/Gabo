import { SpecialOffer } from "@/components/home/SpecialOffer";
import { OurServices } from "@/components/services/OurServices";

export default function CatalogoPage() {
  return (
    <main className="min-h-screen p-4 pt-0 bg-transparent">
      <SpecialOffer />
      <OurServices />
    </main>
  );
}
