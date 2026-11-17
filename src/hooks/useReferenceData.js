import { useState, useEffect, useCallback } from 'react';
import { fetchMembers, fetchProjects } from '../api/mockApi';

export function useReferenceData() {
  const [status, setStatus] = useState({ type: 'loading' });
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let ignore = false;

    setStatus({ type: 'loading' });

    Promise.all([fetchMembers(), fetchProjects()])
      .then(([members, projects]) => {
        if (!ignore) {
          setStatus({ type: 'ready', members, projects });
        }
      })
      .catch((err) => {
        if (!ignore) {
          setStatus({ type: 'error', message: err.message });
        }
      });
    
    return () => {
      ignore = true;
    };
  }, [retryCount]);

  const retry = useCallback(() => {
    setStatus((prev) => {
      if (prev.type === 'loading') return prev;
      return { type: 'loading' };
    });
    setRetryCount((c) => c + 1);
  }, []);

  return { status, retry };
}
