import {
  Archive,
  BookOpen,
  Boxes,
  Clock3,
  FileText,
  Github,
  Home,
  Infinity,
  Link2,
  Mail,
  MessageCircle,
  Moon,
  Play,
  Sun,
  User,
  Youtube
} from "lucide-react";

const icons = {
  archives: Archive,
  book: BookOpen,
  categories: Boxes,
  clock: Clock3,
  file: FileText,
  github: Github,
  "brand-github": Github,
  home: Home,
  infinity: Infinity,
  link: Link2,
  mail: Mail,
  messages: MessageCircle,
  moon: Moon,
  play: Play,
  sun: Sun,
  user: User,
  youtube: Youtube,
  "brand-youtube": Youtube,
  "brand-bilibili": Play,
  "brand-xiaohongshu": BookOpen
};

export function Icon({ name, size = 20 }: { name?: string; size?: number }) {
  const Component = icons[(name || "link") as keyof typeof icons] || Link2;
  return (
    <span className="inline-icon" aria-hidden="true">
      <Component size={size} strokeWidth={1.9} />
    </span>
  );
}
