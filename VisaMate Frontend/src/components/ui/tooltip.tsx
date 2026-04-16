// "use client";

// import * as React from "react";
// import * as TooltipPrimitive from "@radix-ui/react-tooltip@1.1.8";

// import { cn } from "./utils";

// function TooltipProvider({
//   delayDuration = 0,
//   ...props
// }: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
//   return (
//     <TooltipPrimitive.Provider
//       data-slot="tooltip-provider"
//       delayDuration={delayDuration}
//       {...props}
//     />
//   );
// }

// function Tooltip({
//   ...props
// }: React.ComponentProps<typeof TooltipPrimitive.Root>) {
//   return (
//     <TooltipProvider>
//       <TooltipPrimitive.Root data-slot="tooltip" {...props} />
//     </TooltipProvider>
//   );
// }

// function TooltipTrigger({
//   ...props
// }: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
//   return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
// }

// function TooltipContent({
//   className,
//   sideOffset = 0,
//   children,
//   ...props
// }: React.ComponentProps<typeof TooltipPrimitive.Content>) {
//   return (
//     <TooltipPrimitive.Portal>
//       <TooltipPrimitive.Content
//         data-slot="tooltip-content"
//         sideOffset={sideOffset}
//         className={cn(
//           "bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
//           className,
//         )}
//         {...props}
//       >
//         {children}
//         <TooltipPrimitive.Arrow className="bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
//       </TooltipPrimitive.Content>
//     </TooltipPrimitive.Portal>
//   );
// }

// export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };


// Nov 23, 2025
"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "./utils";

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  sideOffset = 4,
  children,
  style,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  // Extract background color from inline styles to apply to arrow
  const backgroundColor = (style as any)?.backgroundColor;
  
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        style={style}
        className={cn(
          "z-50 overflow-hidden rounded-lg px-3 py-1.5 text-xs shadow-md",
          // Light mode: dark tooltip with good contrast
          "bg-slate-900 text-white",
          // Dark mode: light tooltip with good contrast  
          "dark:bg-slate-100 dark:text-slate-900",
          // Animations
          "animate-in fade-in-0 zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className,
        )}
        {...props}
      >
        {children}
        {/* ✅ Arrow that matches tooltip background - uses inline style if provided */}
        <TooltipPrimitive.Arrow 
          className={cn(
            "fill-slate-900 dark:fill-slate-100"
          )}
          style={backgroundColor ? { fill: backgroundColor } : undefined}
          width={11}
          height={5}
        />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };