
// This file is a placeholder/renaming of the original use-toast.ts
// to avoid conflict with the new Sonner-based toast system, but is kept
// to satisfy any legacy imports that might still exist.

// We will re-export from sonner's hook to ensure functionality is maintained
// while centralizing the toast implementation.

import { toast as sonnerToast } from "sonner";

// A mapping from our old toast variants to the new Sonner types
// This is a simplified example. You might need more complex logic
// if your variants were more distinct.
type ToastVariant = "default" | "destructive";

type ToastProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: ToastVariant;
  action?: React.ReactNode; // Sonner can accept components in its toast.
};


// The main toast function
const toast = ({ title, description, variant = "default", action }: ToastProps) => {
  if (variant === "destructive") {
    sonnerToast.error(title, { 
      description: description as React.ReactNode | undefined,
      action,
    });
  } else {
    sonnerToast.success(title, {
      description: description as React.ReactNode | undefined,
      action,
    });
  }
};

// The hook that components will use
export function useToast() {
    // We are no longer tracking toasts in our own state, so we don't need the 
    // state management that was here before (the `toasts` array, `dispatch`, etc.).
    // We just return the `toast` function that directly calls the Sonner library.

    return { 
        toast, 
        // Keep these for compatibility if any components were destructuring them,
        // though they are now no-ops.
        toasts: [],
        dismiss: (id: string | number) => sonnerToast.dismiss(id), 
    };
}
