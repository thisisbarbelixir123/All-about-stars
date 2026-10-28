import React, { useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { CelestialBody } from '../types';
import { StageDisplayableItem } from './stage/types';
import { CelestialCanvas3D } from './stage/CelestialCanvas3D';
import { PLANET_VERTEX_SHADER, PLANET_FRAGMENT_SHADER, getThemeIndex } from '../utils/planetShaderUtils';

// 1 unit in Three.js = 1 Earth Diameter (12,742 km)
export const KM_TO_STAGE_RADIUS = 0.5 / 12742;

export interface ExoplanetDisplayItem extends StageDisplayableItem {
  rawBody: CelestialBody;
}

interface ExoplanetCanvas3DProps {
  items: CelestialBody[];
  initialIndex?: number;
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

  // Mesh creation callback implementing planet-specific shaders / textures
  const renderItemMesh = useCallback(
    (item: ExoplanetDisplayItem, scene: THREE.Scene, onMeshCreated: (mesh: THREE.Object3D) => void) => {
      const body = item.rawBody;
      const radius = item.meshRadius;

      const geometry = new THREE.SphereGeometry(radius, 64, 64);
      let material: THREE.Material;

      if (body.textureSource === 'official' && body.texturePath) {
        const texture = textureLoader.load(body.texturePath);
        material = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.8,
          metalness: 0.1,
        });
      } else {
        material = new THREE.ShaderMaterial({
          vertexShader: PLANET_VERTEX_SHADER,
          fragmentShader: PLANET_FRAGMENT_SHADER,
          uniforms: {
            time: { value: 0 },
            themeIndex: { value: getThemeIndex(body.textureTheme) },
            temperatureK: { value: body.temperatureK || 300 },
            lightDir: { value: new THREE.Vector3(1.0, 0.4, 0.8).normalize() },
            seed: { value: (body.diameterKm % 100) * 0.13 },
          },
        });
      }

      const mesh = new THREE.Mesh(geometry, material);
      // Tangent to y = 0 grid floor
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
