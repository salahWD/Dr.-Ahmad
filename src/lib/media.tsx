import {
  Accessibility,
  Activity,
  Bone,
  Brain,
  Droplet,
  Dumbbell,
  Footprints,
  HandHeart,
  HeartPulse,
  House,
  Stethoscope,
  Syringe,
  type LucideIcon,
} from "lucide-react";

export const serviceIcons: Record<string, LucideIcon> = {
  activity: Activity,
  syringe: Syringe,
  droplet: Droplet,
  dumbbell: Dumbbell,
  "hand-heart": HandHeart,
  bone: Bone,
  "heart-pulse": HeartPulse,
  stethoscope: Stethoscope,
  footprints: Footprints,
  accessibility: Accessibility,
  house: House,
  brain: Brain,
};

/** Photographs bundled in public/images, each in 640/1200/1536 widths. */
export const bundledPhotos = [
  "first-visit",
  "movement-assessment",
  "demo-entrance",
  "demo-portrait",
  "blue-portrait",
] as const;

/**
 * Image values are "photo:<bundled name>", "/media/<uploaded file>", or "".
 */
export function Photo({
  src,
  alt = "",
  hero = false,
  sizes = "(max-width: 760px) 92vw, (max-width: 1440px) 50vw, 730px",
}: {
  src: string;
  alt?: string;
  hero?: boolean;
  sizes?: string;
}) {
  const loading = hero ? "eager" : "lazy";
  const fetchPriority = hero ? "high" : "auto";
  if (src.startsWith("photo:")) {
    const kind = src.slice(6);
    if (!(bundledPhotos as readonly string[]).includes(kind)) return null;
    return (
      <img
        className="photo"
        src={`/images/${kind}-1200.webp`}
        srcSet={`/images/${kind}-640.webp 640w, /images/${kind}-1200.webp 1200w, /images/${kind}-1536.webp 1536w`}
        sizes={sizes}
        alt={alt}
        width="1536"
        height="1024"
        loading={loading}
        fetchPriority={fetchPriority}
      />
    );
  }
  if (/^\/media\/[\w-]+\.(jpg|png|webp)$/.test(src)) {
    return (
      <img
        className="photo"
        src={src}
        alt={alt}
        width="1536"
        height="1024"
        loading={loading}
        fetchPriority={fetchPriority}
      />
    );
  }
  return null;
}
