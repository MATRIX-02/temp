'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { selectAuth } from '@/lib/store/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/store/features/auth/authSlice';

export function UserNav() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(selectAuth);
  const defaultUser = {
    name: 'Ratha',
    email: 'ratha@easeworkai.com',
    image:
      'https://media.licdn.com/dms/image/v2/C4E03AQHws1UIXlTmJQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1549997841676?e=1735776000&v=beta&t=Z5ZHRUXup60gMUp4yDhjqagB6hPrpNzAa9m4Hya6CGk'
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative w-8 h-8 rounded-full">
          <Avatar className="w-8 h-8">
            <AvatarImage
              src={user?.image ?? defaultUser.image}
              alt={formatName(user?.name) || 'RN'}
            />
            <AvatarFallback>{formatName(user?.name) || 'RN'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.name || 'Ratha'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email || 'ratha@easeworkai.com'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>New Team</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            router.push('/');
            dispatch(logout());
          }}
        >
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
