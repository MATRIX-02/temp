'use client';

import Link from 'next/link';
import { ChevronDown, ChevronRight, Ellipsis, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import { getMenuList, MenuItem } from '@/lib/menu-list';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

interface NestedDropdownItemProps {
  item: MenuItem;
  level?: number;
}

function NestedDropdownItem({ item, level = 0 }: NestedDropdownItemProps) {
  const Icon = item.icon;
  const hasChildren = item.children && item.children.length > 0;

  return (
    <>
      <DropdownMenuItem asChild className="w-52">
        <Link href={item.href} className="flex items-center">
          <Icon className="mr-2 h-2 w-2" />
          <span className="flex-1">{item.label}</span>
          {hasChildren && <ChevronRight className="ml-auto h-4 w-4" />}
        </Link>
      </DropdownMenuItem>
      {hasChildren && (
        <DropdownMenu>
          <DropdownMenuContent side="right" align="start" className="w-52">
            {item.children?.map((child, index) => (
              <NestedDropdownItem key={index} item={child} level={level + 1} />
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}

interface MenuItemProps {
  item: MenuItem;
  isOpen?: boolean;
  level?: number;
  isExpanded?: boolean;
}

function MenuItemComponent({
  item,
  isOpen,
  level = 0,
  isExpanded = false
}: MenuItemProps) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(isExpanded);
  const Icon = item.icon;
  const hasChildren = item.children && item.children.length > 0;
  const isActive = item.active ?? pathname.startsWith(item.href);

  // Handle collapsed state with dropdown
  if (isOpen === false && hasChildren) {
    return (
      <DropdownMenu>
        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className="mb-0.5 h-8 w-full justify-center"
                >
                  <Icon size={14} />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="right">{item.label}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DropdownMenuContent side="right" className="w-52">
          {item.children?.map((child, index) => (
            <NestedDropdownItem key={index} item={child} />
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="w-full">
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <Button
              variant={isActive ? 'secondary' : 'ghost'}
              className={cn(
                'mb-0.5 h-8 w-full justify-start',
                level > 0 && 'relative ml-3 pl-4'
              )}
              onClick={() => hasChildren && setExpanded(!expanded)}
              asChild={!hasChildren}
            >
              {!hasChildren ? (
                <Link href={item.href}>
                  <div className="flex w-full items-center">
                    <span
                      className={cn(
                        'min-w-[20px]',
                        isOpen === false ? '' : 'mr-2'
                      )}
                    >
                      <Icon size={14} />
                    </span>
                    <p
                      className={cn(
                        'flex-1 truncate text-sm',
                        isOpen === false
                          ? '-translate-x-96 opacity-0'
                          : 'translate-x-0 opacity-100'
                      )}
                    >
                      {item.label}
                    </p>
                  </div>
                </Link>
              ) : (
                <div className="flex w-full items-center">
                  <span
                    className={cn(
                      'min-w-[20px]',
                      isOpen === false ? '' : 'mr-2'
                    )}
                  >
                    <Icon size={14} />
                  </span>
                  <p
                    className={cn(
                      'flex-1 truncate text-sm',
                      isOpen === false
                        ? '-translate-x-96 opacity-0'
                        : 'translate-x-0 opacity-100'
                    )}
                  >
                    {item.label}
                  </p>
                  {hasChildren && isOpen !== false && (
                    <span className="ml-auto">
                      {expanded ? (
                        <ChevronDown size={14} />
                      ) : (
                        <ChevronRight size={14} />
                      )}
                    </span>
                  )}
                </div>
              )}
            </Button>
          </TooltipTrigger>
          {isOpen === false && !hasChildren && (
            <TooltipContent side="right">{item.label}</TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      {hasChildren && expanded && isOpen !== false && (
        <div className="relative ml-3 border-l-2 border-muted pl-4">
          {item.children?.map((child, index) => (
            <MenuItemComponent
              key={index}
              item={child}
              isOpen={isOpen}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface MenuProps {
  isOpen: boolean | undefined;
}

export function Menu({ isOpen }: MenuProps) {
  const pathname = usePathname();
  const menuList = getMenuList(pathname);

  return (
    <ScrollArea className="[&>div>div[style]]:!block">
      <nav className="h-full w-full">
        <ul className="flex min-h-[calc(100vh-48px-36px-16px-32px)] flex-col items-start space-y-0.5 px-2 lg:min-h-[calc(100vh-32px-40px-32px)]">
          {menuList.map(({ groupLabel, icon: GroupIcon, menus }, index) => (
            <li className={cn('w-full', groupLabel ? 'pt-3' : '')} key={index}>
              {(isOpen && groupLabel) || isOpen === undefined ? (
                <div className="flex items-center px-3 pb-1">
                  {GroupIcon && (
                    <GroupIcon
                      size={14}
                      className="mr-2 text-muted-foreground"
                    />
                  )}
                  <p className="truncate text-xs font-medium text-muted-foreground">
                    {groupLabel}
                  </p>
                </div>
              ) : !isOpen && isOpen !== undefined && groupLabel ? (
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger className="w-full">
                      <div className="flex w-full items-center justify-center">
                        <Ellipsis className="h-4 w-4" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{groupLabel}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : null}
              {menus.map((item, index) => (
                <MenuItemComponent key={index} item={item} isOpen={isOpen} />
              ))}
            </li>
          ))}
          <li className="flex w-full grow items-end">
            <TooltipProvider disableHoverableContent>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => {}}
                    variant="outline"
                    className="mt-4 h-8 w-full justify-center"
                  >
                    <span className={cn(isOpen === false ? '' : 'mr-2')}>
                      <LogOut size={16} />
                    </span>
                    <p
                      className={cn(
                        'whitespace-nowrap text-sm',
                        isOpen === false ? 'hidden opacity-0' : 'opacity-100'
                      )}
                    >
                      Sign out
                    </p>
                  </Button>
                </TooltipTrigger>
                {isOpen === false && (
                  <TooltipContent side="right">Sign out</TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </li>
        </ul>
      </nav>
    </ScrollArea>
  );
}
