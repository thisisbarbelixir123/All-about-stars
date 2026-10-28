import React, { useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { CelestialBody } from '../types';
import { StageDisplayableItem } from './stage/types';
import { CelestialCanvas3D } from './stage/CelestialCanvas3D';
import { PLANET_VERTEX_SHADER, PLANET_FRAGMENT_SHADER, getThemeIndex } from '../utils/planetShaderUtils';

export const KM_TO_STAGE_RADIUS = 0.5 / 12742;

export interface ExoplanetDisplayItem extends StageDisplayableItem {
  rawBody: CelestialBody;
}

interface ExoplanetCanvas3DProps {
  items: CelestialBody[];
  initialIndex?: number;
}

// Single unit sphere geometry shared by all procedural planets (scaled via mesh.scale)
const SHARED_SPHERE_GEOMETRY = new THREE.SphereGeometry(1.0, 32, 32);

// Cache materials by theme index so GPU doesn't compile 60 separate shader programs
const MATERIAL_CACHE = new Map<number, THREE.ShaderMaterial>();

function getOrCreateShaderMaterial(themeIndex: number, tempK: number): THREE.ShaderMaterial {
  if (!MATERIAL_CACHE.has(themeIndex)) {
    const mat = new THREE.ShaderMaterial({
      vertexShader: PLANET_VERTEX_SHADER,
      fragmentShader: PLANET_FRAGMENT_SHADER,
      uniforms: {
        time: { value: 0 },
        themeIndex: { value: themeIndex },
        temperatureK: { value: tempK },
        lightDir: { value: new THREE.Vector3(1.0, 0.4, 0.8).normalize() },
        seed: { value: Math.random() * 10.0 },
      },
    });
    MATERIAL_CACHE.set(themeIndex, mat);
  }
  return MATERIAL_CACHE.get(themeIndex)!;
}

export const ExoplanetCanvas3D: React.FC<ExoplanetCanvas3DProps> = ({ items, initialIndex = 0 }) => {
  const textureLoader = useMemo(() => new THREE.TextureLoader(), []);

  // Adapt CelestialBody[] into generic StageDisplayableItem[]
  const displayItems: ExoplanetDisplayItem[] = useMemo(() => {
    return items.map((body) => {
      const subtitlePills: string[] = [body.classification];
      if (body.hostSystem) subtitlePills.push(`Host: ${body.hostSystem}`);
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

  // Mesh creation callback implementing shared geometries & cached materials
  const renderItemMesh = useCallback(
    (item: ExoplanetDisplayItem, scene: THREE.Scene, onMeshCreated: (mesh: THREE.Object3D) => void) => {
      const body = item.rawBody;
      const radius = item.meshRadius;

      let mesh: THREE.Mesh;

      if (body.textureSource === 'official' && body.texturePath) {
        const texture = textureLoader.load(body.texturePath);
        const mat = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.8,
          metalness: 0.1,
        });
        mesh = new THREE.Mesh(SHARED_SPHERE_GEOMETRY, mat);
      } else {
        const themeIndex = getThemeIndex(body.textureTheme);
        const mat = getOrCreateShaderMaterial(themeIndex, body.temperatureK || 300);
        mesh = new THREE.Mesh(SHARED_SPHERE_GEOMETRY, mat);
      }

      // Scale unit sphere to exact physical radius
      mesh.scale.setScalar(radius);
      // Position tangent to grid floor (y = 0)
      mesh.position.set(0, radius, 0);

      onMeshCreated(mesh);
    },
    [textureLoader]
  );

  return (
    <CelestialCanvas3D
      items={displayItems}
      initialIndex={initialIndex}
      renderItemMesh={renderItemMesh}
    />
  );
};
