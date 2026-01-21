import { useEffect, useState } from 'react';

type HealthResponse = { status: string };

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

export default function App() {
  const [state, setState] = useState<string>('');

  useEffect(() => {
    if (!API_BASE_URL) return;

    const run = async () => {
      setState('Loading...');
      try {
        const res = await fetch(`${API_BASE_URL}/health`);
        if (!res.ok) {
          setState(`Error: API responded ${res.status}`);
          return;
        }
        const data = (await res.json()) as Partial<HealthResponse>;
        if (data.status === 'ok') setState(`API is OK`);
        else setState('Error: Unexpected response from API');
      } catch (e) {
        setState('Error: Cannot reach API');
        console.error(e);
      }
    };

    run();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>HMRC Tax Reports</h1>
      <p>{state}</p>
    </div>
  );
}
