import Image from "next/image";

export function HeroImage() {
  return (
    <section className="relative w-full mt-5">
      <div className="mx-auto max-w-4xl px-8 pt-16 pb-2 perspective-distant">
        <div className="flex justify-center transform-3d">
          <div className="relative w-full origin-top transform-[rotateX(22deg)_rotateY(-18deg)_rotateZ(8deg)] drop-shadow-2xl">
            <div className="overflow-hidden rounded-lg mask-[linear-gradient(to_bottom,white_80%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,white_80%,transparent_100%)]">
              <Image
                src="/hero.png"
                alt="Simple Analytics dashboard preview"
                width={2000}
                height={2000}
                className="h-auto w-full border"
                priority
              />
            </div>
          </div>
        </div>
      </div>
      <div className="pointer-events-none h-28" aria-hidden />
    </section>
  );
}
