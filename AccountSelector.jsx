
import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const buildHierarchy = (list) => {
  if (!list || !Array.isArray(list)) return [];

  const map = new Map();
  const roots = [];

  list.forEach((item) => {
    map.set(item.id, { ...item, children: [] });
  });

  list.forEach((item) => {
    if (item.parent_id && map.has(item.parent_id)) {
      const parentNode = map.get(item.parent_id);
      if (parentNode) {
        parentNode.children.push(map.get(item.id));
      }
    } else {
      roots.push(map.get(item.id));
    }
  });

  const sortRecursive = (nodes) => {
    nodes.sort((a, b) => {
      if (a.code && b.code) return a.code.localeCompare(b.code);
      return a.name.localeCompare(b.name);
    });
    nodes.forEach((node) => {
      if (node.children.length > 0) sortRecursive(node.children);
    });
  };

  sortRecursive(roots);
  return roots;
};

const flattenForSelect = (accounts, level = 0) => {
  if (!accounts) return [];
  return accounts.flatMap((account) => {
    const has_children = account.children && account.children.length > 0;
    const self = { ...account, level, has_children };
    return has_children
      ? [self, ...flattenForSelect(account.children, level + 1)]
      : [self];
  });
};

const getIndentPrefix = (level) => {
  if (level === 0) return "";
  return "│   ".repeat(level - 1) + "├── ";
};

export default function AccountSelector({
  accounts,
  value,
  onChange,
  categoryFilter = null,
  placeholder = "Select an account...",
  className,
  disabledParent = false,
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const [popoverWidth, setPopoverWidth] = useState(0);

  useEffect(() => {
    if (!triggerRef.current) return;

    const updateWidth = () => {
      if (triggerRef.current) {
        setPopoverWidth(triggerRef.current.offsetWidth);
      }
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(triggerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  const selectedAccount = useMemo(() => {
    if (!value) return null;
    if (typeof value === 'object' && value.id) return value;
    return accounts?.find(acc => acc.id === value) || null;
  }, [value, accounts]);

  const accountOptions = useMemo(() => {
    if (!accounts || !Array.isArray(accounts)) return [];

    let filtered = accounts;
    if (categoryFilter) {
      const filters = Array.isArray(categoryFilter)
        ? categoryFilter
        : [categoryFilter];
      filtered = accounts.filter((acc) => filters.includes(acc.category));
    }

    const hierarchy = buildHierarchy(filtered);
    return flattenForSelect(hierarchy);
  }, [accounts, categoryFilter]);

  const selectedAccountName = useMemo(() => {
    if (!selectedAccount) return placeholder;
    return selectedAccount.code
      ? `${selectedAccount.code} - ${selectedAccount.name}`
      : selectedAccount.name;
  }, [selectedAccount, placeholder]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between font-normal", className)}
        >
          <span className="truncate">{selectedAccountName}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent style={{ width: `${popoverWidth}px` }} className="p-0">
        <Command>
          <CommandInput placeholder="Search accounts..." />
          <CommandList>
            <CommandEmpty>No account found.</CommandEmpty>
            <CommandGroup>
              {accountOptions.map((account) => {
                const isDisabled = disabledParent && account.is_placeholder;
                return (
                  <CommandItem
                    key={account.id}
                    value={`${account.name} ${account.code || ""} ${account.type} ${account.id}`}
                    onSelect={() => {
                      onChange(account);
                      setOpen(false);
                    }}
                    disabled={isDisabled}
                  >
                    <div className="flex-1 truncate">
                      <span
                        className={cn(
                          "font-medium",
                          isDisabled ? "text-gray-500" : ""
                        )}
                      >
                        {getIndentPrefix(account.level)}
                        {account.name}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        {account.code} | {account.type}
                      </span>
                    </div>
                    <Check
                      className={cn(
                        "ml-2 h-4 w-4",
                        selectedAccount?.id === account.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
