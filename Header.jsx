import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, User, Plus, Building, LogOut, Settings, Menu, ChevronsUpDown, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import NewTransactionForm from '@/components/NewTransactionForm';
import GlobalSearch from '@/components/GlobalSearch';
import NotificationsPanel from '@/components/NotificationsPanel';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useNavigate, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/customSupabaseClient';
import { useQuery } from '@/hooks/useQuery';


const OrganizationSwitcher = ({ organizations, activeOrgId, switchActiveOrg, organizationSettings }) => {
  const [open, setOpen] = useState(false);
  const activeOrganization = organizations.find(org => org.id === activeOrgId);

  if (!organizations || organizations.length === 0) {
    return null;
  }
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] md:w-[250px] justify-between truncate"
        >
          <div className="flex items-center gap-2 truncate">
            {organizationSettings?.logo ? (
              <img src={organizationSettings.logo} alt="Org Logo" className="w-5 h-5 rounded-sm object-contain" />
            ) : (
              <Building className="mr-2 h-4 w-4 flex-shrink-0" />
            )}
            <span className="truncate">
              {activeOrganization ? activeOrganization.name : "Select organization..."}
            </span>
          </div>
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Search organization..." />
          <CommandList>
            <CommandEmpty>No organization found.</CommandEmpty>
            <CommandGroup>
              {organizations.map((org) => (
                <CommandItem
                  key={org.id}
                  value={org.name}
                  onSelect={() => {
                    switchActiveOrg(org.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      activeOrgId === org.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {org.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};


export default function Header({ organizationSettings, allData, onLogout, onMenuClick, userProfile, organizations, activeOrgId, switchActiveOrg, fetchDataForOrg }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const fetchUnreadCount = async () => {
    if (!activeOrgId) return 0;
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', activeOrgId)
      .eq('is_read', false);
    if (error) {
      console.error("Error fetching unread count:", error);
      return 0;
    }
    return count;
  };
  
  const { data: unreadCount, refetch: refetchUnreadCount } = useQuery(fetchUnreadCount, [activeOrgId]);
  
  useEffect(() => {
    if (!activeOrgId) return;

    const channel = supabase.channel(`public:notifications:org_id=eq.${activeOrgId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' },
        (payload) => {
          refetchUnreadCount();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeOrgId, refetchUnreadCount]);

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsSearchOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, []);

  const handleNewTransaction = () => {
    setIsFormOpen(true);
  };
  
  const handleSaveTransaction = async (transactionData) => {
    const dataToSave = {
        organization_id: activeOrgId,
        date: transactionData.date,
        description: transactionData.description,
        account_id: transactionData.account_id,
        type: transactionData.type,
        amount: transactionData.amount,
        notes: transactionData.notes,
        project_id: transactionData.project_id,
    };
    
    const { error } = await supabase.from('transactions').insert(dataToSave);

    if (error) {
        toast({ variant: "destructive", title: "Error creating transaction", description: error.message });
    } else {
        await fetchDataForOrg(activeOrgId);
        toast({ title: "Success", description: "Transaction created successfully." });
    }
    
    setIsFormOpen(false);
  };

  return (
    <>
      <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-4"
        >
           <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
             <Menu className="h-6 w-6" />
           </Button>
           <div className="hidden sm:flex items-center gap-2">
            <Link to="/app/dashboard" className="flex items-center space-x-2">
              <img src="/logo.svg" alt="Numinote Logo" className="w-8 h-8" />
              <span className="text-xl font-bold gradient-text">Numinote</span>
            </Link>
           </div>
           <div className="hidden sm:flex items-center ml-4">
               {!userProfile ? (
                 <div className="flex items-center justify-center w-[250px]">
                   <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                 </div>
               ) : (
                 <OrganizationSwitcher 
                   organizations={organizations}
                   activeOrgId={activeOrgId}
                   switchActiveOrg={switchActiveOrg}
                   organizationSettings={organizationSettings}
                 />
               )}
           </div>
          <div className="relative hidden md:block ml-4">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="pl-4 pr-10 py-2 w-64 lg:w-80 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition text-left text-gray-500 flex items-center gap-2"
            >
              <Search className="w-5 h-5 text-gray-400" />
              Search...
              <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-2 font-mono text-xs font-medium text-muted-foreground opacity-100 sm:flex">
                <span className="text-lg">⌘</span>K
              </kbd>
            </button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center space-x-2 sm:space-x-4"
        >
          <Button
            onClick={handleNewTransaction}
            className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white"
          >
            <Plus className="w-4 h-4 mr-0 sm:mr-2" />
            <span className="hidden sm:inline">New Transaction</span>
          </Button>

          <Popover onOpenChange={(open) => open && refetchUnreadCount()}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-gray-800 relative"
                >
                    <Bell className="h-6 w-6" />
                    {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0" align="end">
                <NotificationsPanel activeOrgId={activeOrgId} />
            </PopoverContent>
          </Popover>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-gray-800"
              >
                <User className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/app/settings/profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/app/settings/billing')}>
                <Bell className="mr-2 h-4 w-4" />
                <span>Billing</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/app/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </motion.div>
      </header>
      {isFormOpen && (
        <NewTransactionForm
            open={isFormOpen}
            onOpenChange={setIsFormOpen}
            onSave={handleSaveTransaction}
            accounts={allData.accounts || []}
            projects={allData.projects || []}
            transaction={null}
        />
      )}
      <GlobalSearch open={isSearchOpen} setOpen={setIsSearchOpen} allData={allData} />
    </>
  );
}