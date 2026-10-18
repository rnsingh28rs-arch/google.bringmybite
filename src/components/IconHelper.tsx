import React from 'react';
import {
  Sparkles,
  BookOpen,
  Code,
  Cpu,
  Briefcase,
  Mail,
  HardDrive,
  FileText,
  Table,
  Presentation,
  Video,
  Calendar,
  ClipboardCheck,
  Server,
  Flame,
  BarChart2,
  Search,
  MapPin,
  Image,
  Megaphone,
  Terminal,
  PieChart,
  Database,
  CheckSquare,
  DollarSign,
  CreditCard,
  Tv,
  Compass,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  LucideIcon
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Sparkles,
  BookOpen,
  Code,
  Cpu,
  Briefcase,
  Mail,
  HardDrive,
  FileText,
  Table,
  Presentation,
  Video,
  Calendar,
  ClipboardCheck,
  Server,
  Flame,
  BarChart2,
  Search,
  MapPin,
  Image,
  Megaphone,
  Terminal,
  PieChart,
  Database,
  CheckSquare,
  DollarSign,
  CreditCard,
  Tv,
  Compass,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  HelpCircle
};

interface IconHelperProps {
  name: string;
  className?: string;
  size?: number;
}

export const IconHelper: React.FC<IconHelperProps> = ({ name, className = 'w-5 h-5', size }) => {
  const IconComponent = ICON_MAP[name] || Compass;
  return <IconComponent className={className} size={size} />;
};
