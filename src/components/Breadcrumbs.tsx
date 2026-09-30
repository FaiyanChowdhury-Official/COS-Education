import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  route?: string;
  param?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate: (route: string, param?: string) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onNavigate }) => {
  return (
    <nav aria-label="Breadcrumb" className="py-3 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <ol className="flex items-center space-x-2 text-xs text-slate-500 overflow-x-auto whitespace-nowrap scrollbar-none">
        <li>
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1 hover:text-blue-600 transition-colors cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
        </li>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <React.Fragment key={idx}>
              <li className="text-slate-400">
                <ChevronRight className="w-3.5 h-3.5" />
              </li>
              <li>
                {isLast || !item.route ? (
                  <span className="font-semibold text-slate-800" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <button
                    onClick={() => onNavigate(item.route!, item.param)}
                    className="hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};
