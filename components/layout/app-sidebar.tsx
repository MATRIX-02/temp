'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { navItems } from '@/constants/data';
import {
  BadgeCheck,
  Bell,
  ChevronRight,
  ChevronsUpDown,
  CreditCard,
  LogOut
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import { Breadcrumbs } from '../breadcrumbs';
import { Icons } from '../icons';
import SearchInput from '../search-input';
import ThemeToggle from './ThemeToggle/theme-toggle';
import { UserNav } from './user-nav';
import Image from 'next/image';
import easeworkaiLogo from '@/public/easeworkai_logo.png';
import easeworkaiName from '@/public/Easeworkai_name_transparent.png';
import { NavItem } from '@/types';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  checkAuthStatus,
  initiateLogout,
  selectAuth
} from '@/lib/store/features/auth/authSlice';
import { LoadingScreen } from './loading';

export const company = {
  name: 'Easework AI',
  logo: easeworkaiLogo,
  plan: 'Future of work'
};

export default function AppSidebar({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [mounted, setMounted] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const pathname = usePathname();
  const { isAuthenticated, loading, user } = useAppSelector(selectAuth);

  React.useEffect(() => {
    setMounted(true);
    dispatch(checkAuthStatus());
  }, [dispatch]);

  React.useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push('/');
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !mounted) {
    return <LoadingScreen />;
  }

  const handleSidebarToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const formatName = (name: string | undefined) => {
    if (!name) return '';
    const words = name.split(' ');
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    } else {
      return `${words[0].charAt(0).toUpperCase()}${words[words.length - 1]
        .charAt(0)
        .toUpperCase()}`;
    }
  };

  // Helper function to render nested dropdown items
  const renderDropdownItems = (items: NavItem[]) => {
    return items.map((item) => {
      const Icon = item.icon ? Icons[item.icon] : Icons.logo;

      if (item.items && item.items.length > 0) {
        return (
          <DropdownMenuSub key={item.title}>
            <DropdownMenuSubTrigger>
              {item.icon && <Icon size={14} className="mr-2" />}
              <span>{item.title}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {renderDropdownItems(item.items)}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        );
      }
      const RIcon = item.icon ? Icons[item.icon] : Icons.logo;
      return (
        <DropdownMenuItem key={item.title} asChild>
          <Link href={item.url}>
            {item.icon && <RIcon size={14} className="mr-2" />}

            <span>{item.title}</span>
          </Link>
        </DropdownMenuItem>
      );
    });
  };

  // Recursive function to render sidebar items
  const renderNavItems = (items: NavItem[]) => {
    return items.map((item) => {
      const Icon = item.icon ? Icons[item.icon] : Icons.logo;

      if (item.items && item.items.length > 0) {
        if (isCollapsed) {
          return (
            <SidebarMenuItem key={item.title}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <Icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="ml-8 min-w-[200px]">
                  {renderDropdownItems(item.items)}
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          );
        }

        return (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={pathname === item.url}
                >
                  {item.icon && <Icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub className="w-full">
                  {renderNavItems(item.items)}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        );
      } else {
        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              tooltip={item.title}
              isActive={pathname === item.url}
            >
              <Link href={item.url}>
                <Icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      }
    });
  };

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex gap-2 py-2 text-sidebar-accent-foreground ">
            <div className="flex aspect-square size-9 items-center justify-center rounded-lg text-sidebar-primary-foreground">
              <Image
                src={company.logo}
                alt="Easework AI Logo"
                width={40}
                className="h-auto w-full bg-transparent "
              />
            </div>
            <div className="grid w-full flex-1 text-left text-sm leading-tight">
              <Image
                src={easeworkaiName}
                alt="Easework AI Logo"
                className="-mt-4 size-10 h-16 w-44 bg-transparent"
              />
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="overflow-x-hidden">
          <SidebarGroup>
            <SidebarGroupLabel>Overview</SidebarGroupLabel>
            <SidebarMenu>{renderNavItems(navItems)}</SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={
                          'https://media.licdn.com/dms/image/v2/C4E03AQHws1UIXlTmJQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1549997841676?e=1735776000&v=beta&t=Z5ZHRUXup60gMUp4yDhjqagB6hPrpNzAa9m4Hya6CGk'
                        }
                        alt={formatName(user?.name)}
                      />
                      <AvatarFallback className="rounded-lg">
                        {formatName(user?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{'Ratha'}</span>
                      <span className="truncate text-xs">
                        {'ratha@easeworkai.com'}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={
                            'https://media.licdn.com/dms/image/v2/C4E03AQHws1UIXlTmJQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1549997841676?e=1735776000&v=beta&t=Z5ZHRUXup60gMUp4yDhjqagB6hPrpNzAa9m4Hya6CGk'
                          }
                          alt={''}
                        />
                        <AvatarFallback className="rounded-lg">
                          {'RN'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {'Ratha'}
                        </span>
                        <span className="truncate text-xs">
                          {'ratha@easeworkai.com'}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <BadgeCheck size={18} className="mr-2" />
                      Account
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CreditCard size={18} className="mr-2" />
                      Billing
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Bell size={18} className="mr-2" />
                      Notifications
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={async () => {
                      try {
                        await dispatch(initiateLogout()).unwrap();
                        // The router.push('/') will happen automatically due to
                        // the useEffect watching isAuthenticated state
                      } catch (error) {
                        console.error('Logout failed:', error);
                        // You might want to show an error toast here
                      }
                    }}
                  >
                    <LogOut size={18} className="mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger
              onClick={handleSidebarToggle}
              className="scale-70 -ml-1"
            />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumbs />
          </div>
          <div className="hidden w-1/3 items-center gap-2 px-4 md:flex">
            <SearchInput />
          </div>
          <div className="flex items-center gap-2 px-4">
            <UserNav />
            <ThemeToggle />
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
