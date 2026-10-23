import { useState, useEffect } from 'react';

export interface CelestialData {
  dsos: any[];
  lines: any[];
  starNames: Record<string, any>;
  bounds: any[];
  borders: any[];
  dsoNames: Record<string, any>;
}

const DEFAULT_CELESTIAL_DATA: CelestialData = {
  dsos: [],
  lines: [],
  starNames: {},
  bounds: [],
  borders: [],
  dsoNames: {}
};

// In-memory cache across component mounts to avoid re-fetching ~MBs of static celestial geo-data
let cachedCelestialData: CelestialData | null = null;
let fetchPromise: Promise<CelestialData> | null = null;

export const useCelestialData = () => {
  const [data, setData] = useState<CelestialData>(cachedCelestialData || DEFAULT_CELESTIAL_DATA);
  const [isLoading, setIsLoading] = useState<boolean>(!cachedCelestialData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cachedCelestialData) {
      setData(cachedCelestialData);
      setIsLoading(false);
      return;
    }

    const safeFetch = async (url: string) => {
      try {
        const res = await fetch(url);
        const contentType = res.headers.get('content-type');
        if (res.ok && contentType && contentType.includes('application/json')) {
          return await res.json();
        }
        return null;
      } catch (err) {
        return null;
      }
    };

    if (!fetchPromise) {
      fetchPromise = (async () => {
        try {
          const [dsoJson, linesJson, namesJson, boundsJson, bordersJson, dsoNamesJson] = await Promise.all([
            safeFetch('/data/dsos.6.json'),
            safeFetch('/data/constellations.lines.json'),
            safeFetch('/data/starnames.json'),
            safeFetch('/data/constellations.bounds.json'),
            safeFetch('/data/constellations.borders.json'),
            safeFetch('/data/dsonames.json')
          ]);

          const loadedData: CelestialData = {
            dsos: dsoJson ? (Array.isArray(dsoJson) ? dsoJson : (dsoJson.features || [])) : [],
            lines: linesJson ? (Array.isArray(linesJson) ? linesJson : (linesJson.features || [])) : [],
            starNames: namesJson || {},
            bounds: boundsJson ? (Array.isArray(boundsJson) ? boundsJson : (boundsJson.features || [])) : [],
            borders: bordersJson ? (Array.isArray(bordersJson) ? bordersJson : (bordersJson.features || [])) : [],
            dsoNames: dsoNamesJson || {}
          };
          cachedCelestialData = loadedData;
          return loadedData;
        } catch (err: any) {
          fetchPromise = null;
          throw err;
        }
      })();
    }

    fetchPromise
      .then((loadedData) => {
        setData(loadedData);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err?.message || 'Failed to load celestial data');
        setIsLoading(false);
      });
  }, []);

  return { celestialData: data, isLoading, error };
};
