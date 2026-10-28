import React, { useMemo, useCallback, useRef, useState } from 'react';
import * as THREE from 'three';
import { CelestialBody, ProceduralTheme } from '../types';
import { StageDisplayableItem } from './stage/types';
import { CelestialCanvas3D, CelestialSortKey } from './stage/CelestialCanvas3D';
import { PLANET_VERTEX_SHADER, PLANET_FRAGMENT_SHADER, getThemeIndex } from '../utils/planetShaderUtils';

// 1 unit in Three.js = 1 Earth Radius (6,371 km)
export const KM_TO_STAGE_RADIUS = 1.0 / 12742;

export interface ExoplanetDisplayItem extends StageDisplayableItem {
  rawBody: CelestialBody;
}

interface ExoplanetCanvas3DProps {
  items: CelestialBody[];
  initialFocusedId?: string | null;
}

const SHARED_SPHERE_GEOMETRY = new THREE.SphereGeometry(1.0, 48, 48);

function inferFallbackTheme(body: CelestialBody): ProceduralTheme {
  if (body.textureTheme) return body.textureTheme;
  const name = body.name.toLowerCase();
  if (name === 'earth') return 'terrestrial-ocean';
  if (name === 'mars' || name === 'mercury' || name === 'the moon' || name === 'vesta' || name === 'ceres') {
    return 'terrestrial-rocky';
  }
  if (name === 'venus' || name === 'titan') return 'super-earth';
  if (name === 'io') return 'lava-world';
  if (name === 'europa' || name === 'enceladus' || name === 'eris' || name === 'triton') return 'kbo-ice';
  if (name === 'pluto' || name === 'charon' || name === 'makemake') return 'kbo-tholin';
  if (body.classification === 'Ice Giants') return 'ice-giant';
  if (body.classification === 'Gas Giants') return 'gas-giant-banded';
  if (body.classification.startsWith('Moon of')) return 'kbo-ice';
  return 'terrestrial-rocky';
}

export const ExoplanetCanvas3D: React.FC<ExoplanetCanvas3DProps> = ({ items, initialFocusedId = null }) => {
  const textureLoader = useMemo(() => new THREE.TextureLoader(), []);
  const sharedTimeUniformRef = useRef<{ value: number }>({ value: 0 });
  const materialCacheRef = useRef<Map<string, THREE.ShaderMaterial>>(new Map());

  // Sorting state matching StarCanvas3D
  const [sortKey, setSortKey] = useState<CelestialSortKey>('size');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Adapt CelestialBody[] into generic StageDisplayableItem[] once
  const displayItems: ExoplanetDisplayItem[] = useMemo(() => {
    return items.map((body) => {
      const subtitlePills: string[] = [body.classification];
      if (body.hostSystem) subtitlePills.push(`Host: ${body.hostSystem}`);
      if (body.massEarth !== undefined && body.massEarth > 0) {
        subtitlePills.push(
          body.massEarth >= 50
            ? `Mass: ${(body.massEarth / 317.828).toFixed(2)} M♃`
            : `Mass: ${body.massEarth.toFixed(2)} M⊕`
        );
      }
      if (body.temperatureK) subtitlePills.push(`${body.temperatureK} K`);
      if (body.discoveryYear && body.discoveryYear > 0) {
        subtitlePills.push(`Discovered: ${body.discoveryYear}`);
      }

      const meshRadius = Math.max(0.005, body.diameterKm * KM_TO_STAGE_RADIUS);

      return {
        id: body.id,
        name: body.name,
        subtitlePills,
        diameterKm: body.diameterKm,
        primaryMultiplierText: `${body.diameterEarth.toFixed(body.diameterEarth < 0.1 ? 4 : 2)} × Earth`,
        secondaryMetricText:
          body.diameterJupiter >= 0.05
            ? `${body.diameterJupiter.toFixed(body.diameterJupiter < 0.1 ? 3 : 2)} × Jupiter`
            : undefined,
        metricLabel: 'DIAMETER',
        meshRadius,
        rawBody: body,
      };
    });
  }, [items]);

  // Cached shader materials
  const getPlanetMaterial = useCallback((body: CelestialBody): THREE.ShaderMaterial => {
    const theme = inferFallbackTheme(body);
    const themeIndex = getThemeIndex(theme);
    const seedBucket = Math.floor(body.diameterKm % 8);
    const cacheKey = `${themeIndex}-${seedBucket}`;

    let mat = materialCacheRef.current.get(cacheKey);
    if (!mat) {
      mat = new THREE.ShaderMaterial({
        vertexShader: PLANET_VERTEX_SHADER,
        fragmentShader: PLANET_FRAGMENT_SHADER,
        uniforms: {
          time: sharedTimeUniformRef.current,
          themeIndex: { value: themeIndex },
          temperatureK: { value: body.temperatureK || 300 },
          lightDir: { value: new THREE.Vector3(1.0, 0.4, 0.8).normalize() },
          seed: { value: seedBucket * 1.37 },
        },
      });
      materialCacheRef.current.set(cacheKey, mat);
    }
    return mat;
  }, []);

  // Mesh creation callback
  const createItemMesh = useCallback(
    (item: ExoplanetDisplayItem): THREE.Object3D => {
      const body = item.rawBody;
      const radius = item.meshRadius;

      const proceduralMat = getPlanetMaterial(body);
      const mesh: THREE.Mesh = new THREE.Mesh(SHARED_SPHERE_GEOMETRY, proceduralMat);
      mesh.scale.setScalar(radius);

      if (body.textureSource === 'official' && body.texturePath) {
        textureLoader.load(
          body.texturePath,
          (loadedTex) => {
            loadedTex.colorSpace = THREE.SRGBColorSpace;
            mesh.material = new THREE.MeshStandardMaterial({
              map: loadedTex,
              roughness: 0.8,
              metalness: 0.08,
            });
          },
          undefined,
          () => {}
        );
      }

      return mesh;
    },
    [getPlanetMaterial, textureLoader]
  );

  return (
    <CelestialCanvas3D
      items={displayItems}
      initialFocusedId={initialFocusedId}
      createItemMesh={createItemMesh}
      sharedTimeUniform={sharedTimeUniformRef.current}
      sortKey={sortKey}
      sortDirection={sortDirection}
      onSortChange={(k) => setSortKey(k)}
      onToggleSortDirection={() => setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))}
    />
  );
};
