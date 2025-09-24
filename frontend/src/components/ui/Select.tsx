import React, { useState, useRef, useEffect } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { ChevronDown, Search, X } from 'lucide-react';

const selectVariants = cva(
  "w-full px-4 py-3 border-2 rounded-agricultural transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-gray-200 focus:border-primary-green focus:ring-primary-green focus:ring-opacity-20",
        error: "border-error focus:border-error focus:ring-error focus:ring-opacity-20",
        success: "border-success focus:border-success focus:ring-success focus:ring-opacity-20",
      },
      size: {
        sm: "px-3 py-2 text-sm",
        md: "px-4 py-3",
        lg: "px-6 py-4 text-lg",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      fullWidth: true,
    },
  }
);

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof selectVariants> {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  searchable?: boolean;
  multiple?: boolean;
  containerClassName?: string;
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ 
    className, 
    variant, 
    size, 
    fullWidth, 
    options, 
    value, 
    onChange, 
    placeholder = "Select an option",
    label, 
    error, 
    helperText, 
    disabled, 
    searchable = false,
    multiple = false,
    containerClassName,
    ...props 
  }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedValues, setSelectedValues] = useState<string[]>(value ? [value] : []);
    const selectRef = useRef<HTMLDivElement>(null);

    const filteredOptions = options.filter(option =>
      searchable && searchTerm
        ? option.label.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    );

    const selectedLabels = options
      .filter(option => selectedValues.includes(option.value))
      .map(option => option.label);

    const handleSelect = (optionValue: string) => {
      if (multiple) {
        const newValues = selectedValues.includes(optionValue)
          ? selectedValues.filter(v => v !== optionValue)
          : [...selectedValues, optionValue];
        setSelectedValues(newValues);
        onChange?.(newValues.join(','));
      } else {
        setSelectedValues([optionValue]);
        onChange?.(optionValue);
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    const handleRemove = (optionValue: string) => {
      const newValues = selectedValues.filter(v => v !== optionValue);
      setSelectedValues(newValues);
      onChange?.(newValues.join(','));
    };

    const handleClear = () => {
      setSelectedValues([]);
      onChange?.('');
      setSearchTerm('');
    };

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setSearchTerm('');
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
      if (value) {
        setSelectedValues(value.split(',').filter(Boolean));
      } else {
        setSelectedValues([]);
      }
    }, [value]);

    return (
      <div className={cn("form-group", containerClassName)}>
        {label && (
          <label className="form-label">
            {label}
          </label>
        )}
        
        <div ref={selectRef} className="relative">
          <div
            className={cn(
              selectVariants({ variant: error ? "error" : variant, size, fullWidth, className }),
              "cursor-pointer flex items-center justify-between",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            {...props}
          >
            <div className="flex-1 min-w-0">
              {selectedValues.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {selectedLabels.map((label, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-green text-white"
                    >
                      {label}
                      {multiple && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(options.find(opt => opt.label === label)?.value || '');
                          }}
                          className="ml-1 hover:bg-secondary-green rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-text-light">{placeholder}</span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {selectedValues.length > 0 && multiple && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear();
                  }}
                  className="hover:bg-gray-100 rounded-full p-1"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
              <ChevronDown 
                className={cn(
                  "w-4 h-4 text-gray-400 transition-transform duration-200",
                  isOpen && "rotate-180"
                )} 
              />
            </div>
          </div>

          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-agricultural shadow-lg max-h-60 overflow-auto">
              {searchable && (
                <div className="p-3 border-b border-gray-200">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search options..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-primary-green"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              )}

              <div className="py-1">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <div
                      key={option.value}
                      className={cn(
                        "px-3 py-2 cursor-pointer hover:bg-neutral-gray transition-colors duration-150",
                        selectedValues.includes(option.value) && "bg-primary-green text-white hover:bg-secondary-green",
                        option.disabled && "opacity-50 cursor-not-allowed hover:bg-transparent"
                      )}
                      onClick={() => !option.disabled && handleSelect(option.value)}
                    >
                      {option.label}
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-2 text-text-light text-center">
                    No options found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {error && (
          <p className="form-error">
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="text-sm text-text-light mt-1">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select, selectVariants };



