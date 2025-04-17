'use client';

import * as React from 'react';
import { Moon, Sun, Laptop } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant='ghost' size='icon' className='w-10 h-10 relative'>
        <div className='animate-pulse h-5 w-5 rounded-full bg-muted' />
        <span className='sr-only'>加载中</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          className='w-10 h-10 rounded-full border-primary/20 bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-offset-2 transition-all duration-300 relative overflow-hidden group'
        >
          <Sun
            className={cn(
              'h-[1.2rem] w-[1.2rem] absolute transition-all duration-500',
              theme === 'light'
                ? 'opacity-100 rotate-0 scale-100'
                : 'opacity-0 rotate-90 scale-0'
            )}
          />
          <Moon
            className={cn(
              'h-[1.2rem] w-[1.2rem] absolute transition-all duration-500',
              theme === 'dark'
                ? 'opacity-100 rotate-0 scale-100'
                : 'opacity-0 -rotate-90 scale-0'
            )}
          />
          <Laptop
            className={cn(
              'h-[1.2rem] w-[1.2rem] absolute transition-all duration-500',
              theme === 'system'
                ? 'opacity-100 rotate-0 scale-100'
                : 'opacity-0 rotate-90 scale-0'
            )}
          />
          <span className='sr-only'>切换主题</span>

          <span className='absolute inset-0 w-full h-full bg-background/80 dark:bg-background/50 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='animate-in slide-in-from-top-2 duration-200 w-40'
      >
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className='flex items-center gap-2 cursor-pointer group'
        >
          <Sun className='h-4 w-4 group-hover:text-amber-500 transition-colors' />
          <span className='group-hover:font-medium transition-all'>
            浅色模式
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className='flex items-center gap-2 cursor-pointer group'
        >
          <Moon className='h-4 w-4 group-hover:text-indigo-500 transition-colors' />
          <span className='group-hover:font-medium transition-all'>
            深色模式
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className='flex items-center gap-2 cursor-pointer group'
        >
          <Laptop className='h-4 w-4 group-hover:text-cyan-500 transition-colors' />
          <span className='group-hover:font-medium transition-all'>
            系统默认
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
