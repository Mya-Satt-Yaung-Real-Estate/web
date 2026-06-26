import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

export interface LocationAutocompleteOption {
  id: number;
  name_en: string;
  name_mm: string;
}

interface LocationAutocompleteProps {
  value: string;
  onValueChange: (value: string) => void;
  options: LocationAutocompleteOption[];
  language?: 'en' | 'mm';
  placeholder?: string;
  allLabel?: string;
  allowAll?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  emptyText?: string;
  className?: string;
}

export function getLocationOptionLabel(
  option: LocationAutocompleteOption,
  language: 'en' | 'mm' = 'en'
): string {
  return language === 'mm' ? option.name_mm : option.name_en;
}

export function LocationAutocomplete({
  value,
  onValueChange,
  options,
  language = 'en',
  placeholder = 'Select...',
  allLabel = 'All',
  allowAll = true,
  disabled = false,
  loading = false,
  icon,
  emptyText = 'No results found',
  className,
}: LocationAutocompleteProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const selectedOption = useMemo(
    () => (value === 'all' ? null : options.find((option) => String(option.id) === value) || null),
    [options, value]
  );

  useEffect(() => {
    if (value === 'all') {
      setInputValue('');
      return;
    }

    if (selectedOption) {
      setInputValue(getLocationOptionLabel(selectedOption, language));
    }
  }, [selectedOption, value, language]);

  const filteredOptions = useMemo(() => {
    const query = inputValue.trim().toLowerCase();

    if (!query) {
      return options;
    }

    if (selectedOption && inputValue === getLocationOptionLabel(selectedOption, language)) {
      return options;
    }

    return options.filter((option) => {
      const label = getLocationOptionLabel(option, language).toLowerCase();
      return (
        label.includes(query) ||
        option.name_en.toLowerCase().includes(query) ||
        option.name_mm.toLowerCase().includes(query)
      );
    });
  }, [inputValue, options, selectedOption, language]);

  const showAllOption =
    allowAll &&
    (!inputValue.trim() ||
      allLabel.toLowerCase().includes(inputValue.trim().toLowerCase()));

  const selectableOptions = useMemo(() => {
    const items: Array<{ value: string; label: string }> = [];

    if (showAllOption) {
      items.push({ value: 'all', label: allLabel });
    }

    filteredOptions.forEach((option) => {
      items.push({
        value: String(option.id),
        label: getLocationOptionLabel(option, language),
      });
    });

    return items;
  }, [showAllOption, allLabel, filteredOptions, language]);

  const isFiltering = useMemo(() => {
    const query = inputValue.trim();

    if (!query) {
      return false;
    }

    if (value === 'all') {
      return true;
    }

    if (!selectedOption) {
      return true;
    }

    return inputValue !== getLocationOptionLabel(selectedOption, language);
  }, [inputValue, selectedOption, value, language]);

  useEffect(() => {
    if (!open || selectableOptions.length === 0) {
      setHighlightedIndex(-1);
      return;
    }

    if (isFiltering) {
      setHighlightedIndex(0);
      return;
    }

    const selectedIndex = selectableOptions.findIndex((option) => option.value === value);
    setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
  }, [open, selectableOptions, isFiltering, value]);

  const handleSelect = (nextValue: string, label = '') => {
    onValueChange(nextValue);
    setInputValue(label);
    setOpen(false);
    setHighlightedIndex(-1);
  };

  const handleInputChange = (nextValue: string) => {
    setInputValue(nextValue);
    setOpen(true);

    if (!nextValue.trim() && allowAll) {
      onValueChange('all');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);

      if (selectableOptions.length === 0) {
        return;
      }

      setHighlightedIndex((current) => {
        const nextIndex = current + 1;
        return nextIndex >= selectableOptions.length ? 0 : nextIndex;
      });
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setOpen(true);

      if (selectableOptions.length === 0) {
        return;
      }

      setHighlightedIndex((current) => {
        if (current <= 0) {
          return selectableOptions.length - 1;
        }

        return current - 1;
      });
      return;
    }

    if (event.key === 'Enter') {
      if (!open || selectableOptions.length === 0) {
        return;
      }

      event.preventDefault();
      const index = highlightedIndex >= 0 ? highlightedIndex : 0;
      const option = selectableOptions[index];

      if (option) {
        handleSelect(option.value, option.value === 'all' ? '' : option.label);
      }
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);

      if (value === 'all') {
        setInputValue('');
        return;
      }

      if (selectedOption) {
        setInputValue(getLocationOptionLabel(selectedOption, language));
      }
    }
  };

  const handleBlur = () => {
    window.setTimeout(() => {
      if (containerRef.current?.contains(document.activeElement)) {
        return;
      }

      setOpen(false);

      if (value === 'all') {
        setInputValue('');
        return;
      }

      if (selectedOption) {
        setInputValue(getLocationOptionLabel(selectedOption, language));
      }
    }, 150);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasSelection = value !== 'all';

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-primary">
            {icon}
          </div>
        )}
        <Input
          value={inputValue}
          onChange={(event) => handleInputChange(event.target.value)}
          onFocus={() => !disabled && setOpen(true)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'h-10 bg-background/50 border-border/50 pr-9',
            icon ? 'pl-10' : undefined,
            hasSelection && 'border-primary/40 text-primary',
            open && 'border-primary/50 ring-1 ring-primary/20'
          )}
        />
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => !disabled && setOpen((current) => !current)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
          )}
        </button>
      </div>

      {open && !disabled && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-border bg-popover text-popover-foreground shadow-md">
          {selectableOptions.length === 0 ? (
            <p className="px-3 py-4 text-center text-sm text-muted-foreground">{emptyText}</p>
          ) : (
            selectableOptions.map((option, index) => {
              const isSelected = option.value === value;
              const isHighlighted = highlightedIndex === index;

              return (
                <button
                  key={option.value}
                  type="button"
                  className={cn(
                    'relative flex w-full px-3 py-2 pl-8 text-left text-sm hover:bg-primary/5 hover:text-primary',
                    isSelected && 'bg-primary/10 font-medium text-primary',
                    isHighlighted && !isSelected && 'bg-primary/5 text-primary'
                  )}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => handleSelect(option.value, option.value === 'all' ? '' : option.label)}
                >
                  <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
                    {isSelected && <Check className="h-4 w-4" />}
                  </span>
                  {option.label}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
