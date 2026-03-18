"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface AutoSaveOptions {
  debounceMs?: number;
  onSave: (data: any) => Promise<void>;
  enabled?: boolean;
}

interface AutoSaveState {
  status: "idle" | "saving" | "saved" | "error";
  error?: string;
  lastSaved?: Date;
}

export function useAutoSave<T>(
  data: T,
  { debounceMs = 500, onSave, enabled = true }: AutoSaveOptions
) {
  const [state, setState] = useState<AutoSaveState>({ status: "idle" as const });
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const previousDataRef = useRef<T>(data);
  const isSavingRef = useRef<boolean>(false);

  const save = useCallback(async () => {
    if (isSavingRef.current || !enabled) return;

    try {
      isSavingRef.current = true;
      setState({ status: "saving" });
      
      await onSave(data);
      
      setState({
        status: "saved",
        lastSaved: new Date(),
      });
      
      setTimeout(() => {
        setState((prev) => (prev.status === "saved" ? { ...prev, status: "idle" } : prev));
      }, 2000);
    } catch (error) {
      setState({
        status: "error",
        error: error instanceof Error ? error.message : "Failed to save",
      });
    } finally {
      isSavingRef.current = false;
    }
  }, [data, onSave, enabled]);

  useEffect(() => {
    if (!enabled) return;
    
    const dataChanged = JSON.stringify(data) !== JSON.stringify(previousDataRef.current);
    
    if (!dataChanged) return;
    
    previousDataRef.current = data;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      save();
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, debounceMs, save, enabled]);

  const forceSave = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    await save();
  }, [save]);

  return {
    ...state,
    forceSave,
  };
}
