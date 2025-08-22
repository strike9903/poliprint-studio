"use client";

import { ReactNode } from 'react';
import { Drawer } from 'vaul';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileDrawerProps {
  children: ReactNode;
  trigger?: ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  title?: string;
  description?: string;
  snapPoints?: (string | number)[];
  modal?: boolean;
  direction?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  contentClassName?: string;
  shouldScaleBackground?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function MobileDrawer({
  children,
  trigger,
  isOpen,
  onClose,
  title,
  description,
  snapPoints,
  modal = true,
  direction = 'bottom',
  className,
  contentClassName,
  shouldScaleBackground = true,
  onOpenChange
}: MobileDrawerProps) {
  return (
    <Drawer.Root 
      open={isOpen} 
      onOpenChange={onOpenChange || onClose}
      modal={modal}
      direction={direction}
      snapPoints={snapPoints}
      shouldScaleBackground={shouldScaleBackground}
    >
      {trigger && <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>}
      
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Drawer.Content 
          className={cn(
            "fixed z-50 flex flex-col rounded-t-[10px] bg-background",
            direction === 'bottom' && "bottom-0 left-0 right-0 mt-24 max-h-[96%]",
            direction === 'top' && "top-0 left-0 right-0 mb-24 max-h-[96%]",
            direction === 'left' && "left-0 top-0 bottom-0 mr-24 max-w-[96%] w-full rounded-t-none rounded-r-[10px]",
            direction === 'right' && "right-0 top-0 bottom-0 ml-24 max-w-[96%] w-full rounded-t-none rounded-l-[10px]",
            className
          )}
        >
          {/* Handle for dragging */}
          {(direction === 'bottom' || direction === 'top') && (
            <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
          )}
          
          {/* Header */}
          {(title || description) && (
            <div className="flex items-center justify-between p-4 pb-2">
              <div className="flex-1">
                {title && (
                  <Drawer.Title className="text-lg font-semibold">
                    {title}
                  </Drawer.Title>
                )}
                {description && (
                  <Drawer.Description className="text-sm text-muted-foreground mt-1">
                    {description}
                  </Drawer.Description>
                )}
              </div>
              
              {onClose && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
          
          {/* Content */}
          <div 
            className={cn(
              "flex-1 overflow-auto p-4",
              contentClassName
            )}
          >
            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}