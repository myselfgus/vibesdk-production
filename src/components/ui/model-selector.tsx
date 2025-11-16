/**
 * Shared Model Selector Component
 * Provides consistent model selection UI with search, badges, and proper scrolling
 */

import { useState, useRef, useMemo } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface ModelOption {
  value: string;
  label: string;
  provider: string;
  hasUserKey: boolean;
  byokAvailable: boolean;
}

interface ModelSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  availableModels: ModelOption[];
  placeholder: string;
  label: string;
  systemDefault?: string;
  includeDefaultOption?: boolean;
  disabled?: boolean;
  className?: string;
}

// Helper to get clean model display name
const getModelDisplayName = (model: string): string => {
  return model || '';
};

export function ModelSelector({
  value,
  onValueChange,
  availableModels,
  placeholder,
  label,
  systemDefault,
  includeDefaultOption = false,
  disabled = false,
  className,
}: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  // Group models by provider
  const groupedModels = useMemo(() => {
    const groups: Record<string, ModelOption[]> = {};

    availableModels.forEach(model => {
      const providerKey = model.provider || 'platform';
      if (!groups[providerKey]) {
        groups[providerKey] = [];
      }
      groups[providerKey].push(model);
    });

    // Sort providers: platform first, then alphabetically
    const sortedProviders = Object.keys(groups).sort((a, b) => {
      if (a === 'platform') return -1;
      if (b === 'platform') return 1;
      return a.localeCompare(b);
    });

    return sortedProviders.map(provider => ({
      provider,
      models: groups[provider].sort((a, b) => a.label.localeCompare(b.label))
    }));
  }, [availableModels]);

  // Filter models based on search
  const filteredGroupedModels = useMemo(() => {
    if (!search) return groupedModels;

    return groupedModels
      .map(group => ({
        ...group,
        models: group.models.filter(model =>
          model.label.toLowerCase().includes(search.toLowerCase()) ||
          group.provider.toLowerCase().includes(search.toLowerCase())
        )
      }))
      .filter(group => group.models.length > 0);
  }, [groupedModels, search]);

  // Get display name for selected value
  const getSelectedDisplay = () => {
    if (value === 'default' && includeDefaultOption) {
      return 'Use default';
    }
    if (value && value !== 'default') {
      const selectedModel = availableModels.find((model) => model.value === value);
      return selectedModel?.label || value;
    }
    return '';
  };

  // Enhanced model classification for badges
  const getModelBadge = (model: ModelOption) => {
    // If model has a specific provider (not platform-only)
    if (model.provider && model.provider !== '') {
      if (model.hasUserKey) {
        return (
          <Badge variant="default" className="text-xs">
            BYOK
          </Badge>
        );
      } else {
        return (
          <Badge variant="outline" className="text-xs">
            Key needed
          </Badge>
        );
      }
    } else {
      // Platform model
      return (
        <Badge variant="secondary" className="text-xs">
          Platform
        </Badge>
      );
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      <Label className="text-sm font-medium">{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
          >
            {getSelectedDisplay() || placeholder}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" style={{ width: 'var(--radix-popover-trigger-width)' }}>
          {/* Search Input */}
          <div className="flex items-center border-b border-border px-3 py-2">
            <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
            <Input
              placeholder="Search models..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 border-0 bg-transparent p-0 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          
          {/* Scrollable List */}
          <div
            ref={listRef}
            className="max-h-[300px] overflow-y-auto p-1 scroll-smooth"
            onWheel={(e) => {
              // Ensure wheel events are properly handled
              e.stopPropagation();
            }}
          >
            {/* No results */}
            {filteredGroupedModels.length === 0 && !includeDefaultOption && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No models found.
              </div>
            )}

            {/* Default option if requested */}
            {includeDefaultOption && (
              <div
                key="default"
                onClick={() => {
                  onValueChange('default');
                  setOpen(false);
                  setSearch('');
                }}
                className={cn(
                  "relative flex cursor-pointer select-none items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-muted-foreground focus:bg-accent focus:text-muted-foreground",
                  value === 'default' && "bg-accent text-muted-foreground"
                )}
              >
                <div className="flex items-center gap-2">
                  <Check
                    className={cn(
                      "h-4 w-4 text-foreground",
                      value === 'default' ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="font-medium">Use default</span>
                </div>
              </div>
            )}

            {/* Grouped models by provider */}
            {filteredGroupedModels.map((group) => (
              <div key={group.provider} className="mb-2 last:mb-0">
                {/* Provider header */}
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-secondary/30 sticky top-0 z-10">
                  {group.provider === 'platform' ? 'Platform Models' : `${group.provider.charAt(0).toUpperCase() + group.provider.slice(1)}`}
                </div>

                {/* Models in this provider group */}
                {group.models.map((model) => (
                  <div
                    key={model.value}
                    onClick={() => {
                      onValueChange(model.value);
                      setOpen(false);
                      setSearch('');
                    }}
                    className={cn(
                      "relative flex cursor-pointer select-none items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-muted-foreground focus:bg-accent focus:text-muted-foreground",
                      value === model.value && "bg-accent text-muted-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <Check
                        className={cn(
                          "h-4 w-4 text-foreground shrink-0",
                          value === model.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <span className="truncate">{model.label}</span>
                    </div>
                    <div className="flex items-center gap-1 ml-2 shrink-0">
                      {getModelBadge(model)}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      
      {/* System default display */}
      {systemDefault && (
        <p className="text-xs text-muted-foreground">
          🔧 System default: {getModelDisplayName(systemDefault)}
        </p>
      )}
    </div>
  );
}