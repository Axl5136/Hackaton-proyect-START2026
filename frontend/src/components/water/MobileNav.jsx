import { BarChart3, Droplets, User } from "lucide-react";

export function MobileNav({ activeTab, onTabChange }) {
  const tabs = [
    { id: "ranking", label: "Ranking", icon: BarChart3 },
    { id: "panorama", label: "Panorama", icon: Droplets },
    { id: "cuenta", label: "Cuenta", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40 md:hidden">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              activeTab === tab.id 
                ? "text-primary bg-primary/10" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="h-5 w-5" />
            <span className="text-xs">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
