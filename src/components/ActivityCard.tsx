import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface ActivityCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  onClick: () => void;
  gradient: string;
}

export const ActivityCard = ({ title, description, icon, onClick, gradient }: ActivityCardProps) => {
  return (
    <Card 
      className={`p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-glow border-0 ${gradient} group`}
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-recoleta font-semibold text-foreground mb-2">{title}</h3>
          <p className="text-sm font-jakarta text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </Card>
  );
};