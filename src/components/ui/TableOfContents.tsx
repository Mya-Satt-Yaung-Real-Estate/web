import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { List } from 'lucide-react';

interface TableOfContentsItem {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface TableOfContentsProps {
  title: string;
  items: TableOfContentsItem[];
  onItemClick: (sectionId: string) => void;
  className?: string;
}

export const TableOfContents = memo<TableOfContentsProps>(function TableOfContents({
  title,
  items,
  onItemClick,
  className = ''
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <List className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {items.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onItemClick(item.id)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors text-left group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    {index + 1}.
                  </span>
                  <IconComponent className="h-4 w-4 text-primary" />
                </div>
                <span className="group-hover:text-primary transition-colors">
                  {item.title}
                </span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
});
