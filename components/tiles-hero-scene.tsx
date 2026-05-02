"use client";

import { Suspense, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { TilesRenderer, TilesPlugin, TilesRendererContext } from "3d-tiles-renderer/r3f";
import {
  CesiumIonAuthPlugin,
  GLTFExtensionsPlugin,
  ReorientationPlugin,
  UpdateOnChangePlugin,
} from "3d-tiles-renderer/plugins";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import type { Mesh } from "three";

const DRACO = new DRACOLoader().setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");

/**
 * 기본 에셋 — three.js 최신 예제(master `webgl_loader_3dtiles.html`) Ion asset id 와 동기.
 * Cesium Ion 토큰이 없거나 만료된 데모 토큰이면 타일 로드에 403 이 납니다. 로컬은 `.env`에 본인 토큰을 넣어 주세요.
 */
const DEFAULT_ASSET_ID = "2275207";

type TileAttribution = { type: "string" | "html" | "image"; value: string };

type IonCredentials = { token: string | null; assetId: string };

/** 런타임에서만 타일 인스턴스를 넘김 — R3F reconciler 안에 DOM(<div>/portal) 두지 않기 위함 */
type TilesAttributionBridge = {
  tiles: {
    getAttributions(): unknown;
    addEventListener(name: string, cb: () => void): void;
    removeEventListener(name: string, cb: () => void): void;
  };
  overlayHost: HTMLElement;
};

/**
 * Canvas 내부: DOM/포털 없음(null만 반환).
 * 타일즈가 준비되면 바깥 `TilesHeroScene`에 surface를 전달해 일반 React에서 포털한다.
 */
function TilesAttributionBridgeSync({
  onSurface,
}: {
  onSurface: (surface: TilesAttributionBridge | null) => void;
}) {
  const tiles = useContext(TilesRendererContext);
  const gl = useThree((s) => s.gl);

  useEffect(() => {
    const parent = gl.domElement.parentElement;
    if (!tiles || !parent) {
      onSurface(null);
      return;
    }

    const surface = { tiles, overlayHost: parent };
    onSurface(surface);

    return () => {
      onSurface(null);
    };
  }, [tiles, gl, onSurface]);

  return null;
}

/**
 * Canvas 밖 전용 — `createPortal` + DOM은 호스트 reconciler(react-dom)에서만 처리된다.
 */
function TilesAttributionDom({ surface }: { surface: TilesAttributionBridge | null }) {
  const [attributions, setAttributions] = useState<TileAttribution[]>([]);

  useEffect(() => {
    if (!surface) {
      setAttributions([]);
      return;
    }

    const { tiles } = surface;

    let queued = false;
    const flush = () => {
      if (!queued) {
        queued = true;
        queueMicrotask(() => {
          setAttributions(tiles.getAttributions() as TileAttribution[]);
          queued = false;
        });
      }
    };

    tiles.addEventListener("tile-visibility-change", flush);
    tiles.addEventListener("load-tile-set", flush);
    flush();

    return () => {
      tiles.removeEventListener("tile-visibility-change", flush);
      tiles.removeEventListener("load-tile-set", flush);
      setAttributions([]);
    };
  }, [surface]);

  if (!surface) {
    return null;
  }

  const nodes: ReactNode[] = [];
  attributions.forEach((att, i) => {
    if (att.type === "string") {
      nodes.push(<div key={i}>{att.value}</div>);
    } else if (att.type === "html") {
      nodes.push(
        <div key={i} style={{ pointerEvents: "auto" }} dangerouslySetInnerHTML={{ __html: att.value }} />,
      );
    } else if (att.type === "image") {
      nodes.push(
        <div key={i}>
          <img src={att.value} alt="" />
        </div>,
      );
    }
  });

  const { overlayHost } = surface;

  return createPortal(
    <div
      className="tiles-ion-attribution-overlay"
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        padding: "10px",
        color: "rgba(255, 255, 255, 0.75)",
        fontSize: "10px",
        pointerEvents: "none",
      }}
    >
      {nodes}
    </div>,
    overlayHost,
  );
}

/** Ion 타일 미연동 시 로컬 403 방지용(네트워크 없음). 세이지 톤에 맞춘 추상 메시. */
function HeroIonFallbackMesh() {
  const ref = useRef<Mesh>(null);
  useFrame(() => {
    const mesh = ref.current;
    if (!mesh) return;
    mesh.rotation.x += 0.0032;
    mesh.rotation.y += 0.0048;
  });

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[3.8, 1]} />
      <meshStandardMaterial color="#8d9f80" roughness={0.5} metalness={0.14} opacity={0.54} transparent />
    </mesh>
  );
}

function TilesContent({
  ion,
  onTilesSurface,
}: {
  ion: IonCredentials;
  onTilesSurface: (s: TilesAttributionBridge | null) => void;
}) {
  if (!ion.token) {
    return (
      <>
        <ambientLight intensity={0.52} />
        <hemisphereLight args={["#e4e8dc", "#1f1c17", 0.58]} position={[4, 6, 4]} />
        <directionalLight position={[12, 18, 8]} intensity={0.92} />
        <HeroIonFallbackMesh />
        <OrbitControls
          autoRotate
          autoRotateSpeed={0.4}
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2 + 0.2}
          minPolarAngle={0.2}
        />
      </>
    );
  }

  const { token: apiToken, assetId } = ion;

  return (
    <>
      <ambientLight intensity={0.42} />
      <hemisphereLight args={["#e8ebe0", "#1a1714", 0.55]} position={[0, 1, 0]} />
      <TilesRenderer key={`${apiToken}:${assetId}`}>
        <TilesPlugin
          plugin={CesiumIonAuthPlugin}
          args={[
            {
              apiToken,
              assetId: String(assetId),
              autoRefreshToken: true,
            },
          ]}
        />
        <TilesPlugin plugin={GLTFExtensionsPlugin} dracoLoader={DRACO} />
        <TilesPlugin plugin={ReorientationPlugin} />
        <TilesPlugin plugin={UpdateOnChangePlugin} />
        <TilesAttributionBridgeSync onSurface={onTilesSurface} />
      </TilesRenderer>
      <OrbitControls
        autoRotate
        autoRotateSpeed={0.35}
        enableZoom={false}
        enablePan={false}
        minPolarAngle={0.85}
        maxPolarAngle={Math.PI / 2 + 0.15}
      />
    </>
  );
}

/**
 * 메인 히어로 배경용 [3D Tiles](https://threejs.org/examples/#webgl_loader_3dtiles) (Cesium Ion).
 */
export function TilesHeroScene() {
  const [tilesSurface, setTilesSurface] = useState<TilesAttributionBridge | null>(null);
  const onTilesSurface = useCallback((s: TilesAttributionBridge | null) => {
    setTilesSurface(s);
  }, []);

  const ionCredentials = useMemo<IonCredentials>(
    () => ({
      token: process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN?.trim() || null,
      assetId: process.env.NEXT_PUBLIC_CESIUM_ION_ASSET_ID?.trim() || DEFAULT_ASSET_ID,
    }),
    [],
  );

  useEffect(() => {
    if (!ionCredentials.token) {
      setTilesSurface(null);
    }
  }, [ionCredentials.token]);

  const cameraProps = ionCredentials.token
    ? {
        position: [300, 300, 300] as [number, number, number],
        near: 1,
        far: 1e5,
      }
    : {
        position: [0, 0.4, 9] as [number, number, number],
        fov: 48,
        near: 0.1,
        far: 200,
      };

  return (
    <Suspense fallback={null}>
      <>
        <Canvas
          className="tiles-hero-canvas"
          frameloop="always"
          dpr={[1, 1.5]}
          camera={cameraProps}
          gl={{
            logarithmicDepthBuffer: Boolean(ionCredentials.token),
            alpha: true,
            antialias: true,
          }}
          onCreated={({ scene }) => {
            scene.background = null;
          }}
          style={{ width: "100%", height: "100%", display: "block" }}
        >
          <TilesContent ion={ionCredentials} onTilesSurface={onTilesSurface} />
        </Canvas>
        <TilesAttributionDom surface={tilesSurface} />
      </>
    </Suspense>
  );
}
