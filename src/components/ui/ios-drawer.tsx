import React, { useRef, useState, cloneElement, isValidElement, ReactElement } from "react";

interface IOSDrawerContentProps {
  title?: string;
  className?: string;
  showHandle?: boolean;
  children: React.ReactNode;
}

interface IOSDrawerProps {
  children: React.ReactNode;
  open?: boolean;
}

const IOSDrawerContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
} | undefined>(undefined);

const IOSDrawer: React.FC<IOSDrawerProps> & {
  Trigger: React.FC<{ children: React.ReactNode }>;
  Content: React.FC<IOSDrawerContentProps>;
} = ({ children, open: controlledOpen }) => {
  const [open, setOpen] = useState(!!controlledOpen);

  // Sync with controlled prop if provided
  React.useEffect(() => {
    if (typeof controlledOpen === 'boolean') {
      setOpen(controlledOpen);
    }
  }, [controlledOpen]);

  // Split children into Trigger and Content
  let trigger: ReactElement | null = null;
  let content: ReactElement | null = null;

  React.Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if ((child.type as any).displayName === "IOSDrawerTrigger") {
      trigger = cloneElement(child as React.ReactElement<any>, { onClick: () => setOpen(true) });
    } else if ((child.type as any).displayName === "IOSDrawerContent") {
      content = cloneElement(child as React.ReactElement<any>, { open, onClose: () => setOpen(false) });
    }
  });

  return (
    <IOSDrawerContext.Provider value={{ open, setOpen }}>
      {trigger}
      {content}
    </IOSDrawerContext.Provider>
  );
};

const IOSDrawerTrigger: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({ children, onClick }) => {
  // Just render the child with onClick
  if (isValidElement(children)) {
    return cloneElement(children as ReactElement, { onClick });
  }
  return <div className="w-fit h-fit" onClick={onClick}>{children}</div>;
};
IOSDrawerTrigger.displayName = "IOSDrawerTrigger";

const IOSDrawerContent: React.FC<IOSDrawerContentProps & { open?: boolean; onClose?: () => void }> = ({
  open = false,
  onClose = () => {},
  title,
  children,
  className = "",
  showHandle = true,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef<number | null>(null);
  const [drawerOffset, setDrawerOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Touch event handlers for drag-to-close
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    startYRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || startYRef.current === null) return;
    const touchY = e.touches[0].clientY;
    const deltaY = touchY - startYRef.current;
    setDrawerOffset(deltaY > 0 ? deltaY : 0);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (drawerOffset > 80) {
      setDrawerOffset(0);
      onClose();
    } else {
      // Animate back to position
      setDrawerOffset(0);
    }
    startYRef.current = null;
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-end justify-center transition-all duration-300 ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      {/* Dimmed background */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${open ? "opacity-40" : "opacity-0"}`}
        onClick={onClose}
      />
      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`relative min-h-[50vh] w-full max-w-md bg-white rounded-t-2xl shadow-lg transition-transform duration-300 ${className} ${open ? "translate-y-0" : "translate-y-full"}`}
        style={{
          transform: open
            ? `translateY(${drawerOffset}px)`
            : "translateY(100%)",
          transition: isDragging ? "none" : "transform 200ms cubic-bezier(0.4,0,0.2,1)",
          touchAction: "none",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Handle */}
        {showHandle && (
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1.5 bg-gray-300 rounded-full" />
          </div>
        )}
        {/* Title */}
        {title && (
          <div className="text-center font-semibold text-lg pb-2 px-4">{title}</div>
        )}
        {/* Content */}
        <div className="px-4 pb-6 pt-2">{children}</div>
      </div>
    </div>
  );
};
IOSDrawerContent.displayName = "IOSDrawerContent";

IOSDrawer.Trigger = IOSDrawerTrigger;
IOSDrawer.Content = IOSDrawerContent;

export { IOSDrawer, IOSDrawerTrigger, IOSDrawerContent };
