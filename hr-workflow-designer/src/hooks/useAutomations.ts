// src/hooks/useAutomations.ts
import { useState, useEffect } from 'react';
import { getAutomations } from '../api/mockApi';
import type { MockAction } from '../types';

export function useAutomations() {
  const [automations, setAutomations] = useState<MockAction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAutomations().then((data) => {
      setAutomations(data);
      setLoading(false);
    });
  }, []);

  return { automations, loading };
}
