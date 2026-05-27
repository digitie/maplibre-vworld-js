import React, { useState, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import {
  VWorldMap, Marker, WeatherMarker, PlaceMarker, SimpleMarker,
  PriceMarker, PulsingMarker, PinMarker, MakiMarker, ClusterLayer, RoutePointMarker, RouteLine,
  type VWorldLayerType, PolygonArea, type ClusterPoint,
} from '../src';

const API_KEY = import.meta.env.VITE_VWORLD_API_KEY || 'YOUR_API_KEY';

const App = () => {
  const [layerType, setLayerType] = useState<VWorldLayerType>('Base');
  const [markerPos, setMarkerPos] = useState<[number, number]>([127.024612, 37.532600]);
  const [semanticThreshold, setSemanticThreshold] = useState<number>(13);

  // States for Area and Route hover
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);
  const [hoveredRoute, setHoveredRoute] = useState<string | null>(null);

  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    type: 'map' | 'marker';
    data?: any;
  } | null>(null);

  // Close context menu on external click
  useEffect(() => {
    const handleWindowClick = () => setContextMenu(null);
    window.addEventListener('click', handleWindowClick);
    return () => window.removeEventListener('click', handleWindowClick);
  }, []);

  // Dummy GeoJSON for Namsan Park Area (Polygon)
  const namsanAreaGeoJSON = useMemo<GeoJSON.Feature<GeoJSON.Polygon>>(() => ({
    type: 'Feature',
    properties: { name: '남산공원' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [126.985, 37.555],
        [126.995, 37.555],
        [126.995, 37.545],
        [126.985, 37.545],
        [126.985, 37.555]
      ]]
    }
  }), []);

  // Dummy GeoJSON for a Trail (LineString)
  const namsanTrailGeoJSON = useMemo<GeoJSON.Feature<GeoJSON.LineString>>(() => ({
    type: 'Feature',
    properties: { name: '남산 둘레길' },
    geometry: {
      type: 'LineString',
      coordinates: [
        [126.985, 37.545],
        [126.990, 37.548],
        [126.992, 37.552],
        [126.995, 37.555]
      ]
    }
  }), []);

  // Generate 500 random points around Seoul for clustering
  const clusterPoints = useMemo(() => {
    return Array.from({ length: 500 }).map((_, i) => ({
      id: i,
      lngLat: [
        126.9 + Math.random() * 0.2, // ~ longitude range
        37.45 + Math.random() * 0.2  // ~ latitude range
      ] as [number, number],
      category: Math.random() > 0.5 ? 'cafe' : 'restaurant'
    }));
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <VWorldMap
        apiKey={API_KEY}
        layerType={layerType}
        center={[127.024612, 37.532600]}
        zoom={12}
        maxBounds={[
          [124.5, 33.0], // Southwest coordinates of Korea
          [132.0, 38.9]  // Northeast coordinates of Korea
        ]}
        semanticZoomThreshold={semanticThreshold}
        onContextMenu={(e) => {
          e.originalEvent.preventDefault();
          setContextMenu({
            x: e.originalEvent.clientX,
            y: e.originalEvent.clientY,
            type: 'map',
            data: e.lngLat,
          });
        }}
      >
        <Marker
          lngLat={markerPos}
          draggable
          onDragEnd={(pos) => setMarkerPos(pos)}
          color="#ff0000"
        />
        
        {/* Simple Markers */}
        <SimpleMarker 
          lngLat={[127.02, 37.53]} 
          label="강남역 주변 (우클릭 해보세요)" 
          bgColor="#ff5500" 
          onContextMenu={(e, _context, marker) => {
            e.preventDefault();
            e.stopPropagation();
            setContextMenu({
              x: e.clientX,
              y: e.clientY,
              type: 'marker',
              data: { label: '강남역 주변', lngLat: marker.getLngLat() }
            });
          }}
        />
        <SimpleMarker lngLat={[126.97, 37.55]} label="서울역" bgColor="#0055ff" />

        {/* Weather Markers */}
        <WeatherMarker 
          lngLat={[127.05, 37.51]} 
          condition="sunny" 
          temperature={24} 
          hourlyForecast={[
            { time: '12시', temperature: 24, condition: 'sunny' },
            { time: '15시', temperature: 26, condition: 'sunny' },
            { time: '18시', temperature: 22, condition: 'cloudy' },
            { time: '21시', temperature: 19, condition: 'rainy' }
          ]}
        />
        <WeatherMarker 
          lngLat={[126.98, 37.57]} 
          condition="cloudy" 
          temperature={19}
          hourlyForecast={[
            { time: '12시', temperature: 19, condition: 'cloudy' },
            { time: '15시', temperature: 20, condition: 'cloudy' },
            { time: '18시', temperature: 17, condition: 'rainy' }
          ]}
        />
        <WeatherMarker lngLat={[127.08, 37.55]} condition="rainy" temperature={15} />

        {/* Place Detail Markers */}
        <PlaceMarker 
          lngLat={[127.0276, 37.4979]} 
          title="강남 핫플레이스 카페" 
          description="분위기 좋은 넓은 카페입니다. 스터디하기 좋아요." 
          category="Cafe" 
          photoUrl="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80"
          link="#"
        />
        <PlaceMarker 
          lngLat={[126.9780, 37.5665]} 
          title="서울시청" 
          description="대한민국 서울특별시의 행정 업무를 총괄하는 곳" 
          category="Government" 
        />

        {/* New Markers Showcase */}
        <PinMarker 
          lngLat={[126.9822, 37.5492]} 
          color="#0F9D58" 
          icon={<span style={{ fontSize: '18px' }}>🌲</span>} 
          size={50} 
          label="남산" 
          tooltip="남산 서울타워"
        />

        {/* Namsan Park Area (Polygon) */}
        <PolygonArea 
          id="namsan-park"
          data={namsanAreaGeoJSON}
          fillColor={hoveredArea ? 'rgba(76, 175, 80, 0.6)' : 'rgba(76, 175, 80, 0.3)'}
          outlineColor="#2E7D32"
          outlineWidth={hoveredArea ? 4 : 2}
          onMouseEnter={() => setHoveredArea('namsan')}
          onMouseLeave={() => setHoveredArea(null)}
          onClick={() => alert('남산공원 영역을 클릭했습니다!')}
        />

        {/* Namsan Trail (Route) */}
        <RouteLine
          id="namsan-trail"
          coordinates={namsanTrailGeoJSON.geometry.coordinates as [number, number][]}
          color={hoveredRoute ? '#FF5722' : '#795548'}
          width={hoveredRoute ? 8 : 4}
          dashArray={hoveredRoute ? undefined : [2, 2]}
          onMouseEnter={() => setHoveredRoute('trail')}
          onMouseLeave={() => setHoveredRoute(null)}
          onClick={() => alert('남산 둘레길 경로를 클릭했습니다!')}
        />

        {/* Price Markers (Airbnb style) */}
        <PriceMarker lngLat={[127.03, 37.52]} price={150000} currency="₩" />
        <PriceMarker lngLat={[127.04, 37.53]} price="Sold Out" currency="" color="#888" />

        {/* Multi-Price Marker (e.g., Gas Station) */}
        <PriceMarker 
          lngLat={[127.02, 37.51]} 
          currency="₩"
          price={[
            { label: '휘발유', price: 1299 },
            { label: '고급유', price: 1920 },
            { label: '경유', price: 1900 },
            { label: '등유', price: 1290 },
            { label: 'LPG', price: 129 },
          ]}
        />

        {/* Pulsing Marker */}
        <PulsingMarker lngLat={[126.99, 37.54]} color="#E91E63" />

        {/* Dynamic Marker Clustering Showcase */}
        <ClusterLayer
          points={clusterPoints}
          radius={40}
          maxZoom={15}
          renderMarker={(point: ClusterPoint) => (
            <SimpleMarker
              key={`point-${point.id}`}
              lngLat={point.lngLat}
              label={String(point.category)}
              bgColor={point.category === 'cafe' ? '#e67e22' : '#e74c3c'}
            />
          )}
        />

        {/* Route Point Markers - Diverse Examples */}
        {/* Route 1: Numbered Steps (e.g. Delivery or Itinerary) */}
        <RouteLine
          id="route-1"
          coordinates={[
            [127.01, 37.50],
            [127.015, 37.49],
            [127.02, 37.48],
            [127.025, 37.47],
          ]}
          color="#4CAF50"
          width={5}
        />
        <RoutePointMarker lngLat={[127.01, 37.50]} label={1} color="#4CAF50" />
        <RoutePointMarker lngLat={[127.015, 37.49]} label={2} color="#4CAF50" />
        <RoutePointMarker lngLat={[127.02, 37.48]} label={3} color="#4CAF50" />
        <RoutePointMarker lngLat={[127.025, 37.47]} label="도착" color="#2E7D32" size={32} />

        {/* Route 2: Alphabetical Points with dashed line (e.g. Points of Interest) */}
        <RouteLine
          id="route-2"
          coordinates={[
            [126.96, 37.53],
            [126.97, 37.52],
            [126.98, 37.51],
          ]}
          color="#9C27B0"
          width={4}
          dashArray={[4, 4]}
        />
        <RoutePointMarker lngLat={[126.96, 37.53]} label="A" color="#9C27B0" />
        <RoutePointMarker lngLat={[126.97, 37.52]} label="B" color="#9C27B0" />
        <RoutePointMarker lngLat={[126.98, 37.51]} label="C" color="#9C27B0" />

        {/* Maki Markers (Travel / Leisure) */}
        <MakiMarker
          lngLat={[126.98, 37.55]} icon="restaurant" color="#e74c3c"
          label="남산 레스토랑" tooltip="남산타워 뷰가 보이는 고급 레스토랑입니다."
        />
        <MakiMarker
          lngLat={[126.99, 37.56]} icon="museum" color="#3498db"
          label="국립박물관" tooltip="무료 입장 가능"
        />
        <MakiMarker lngLat={[127.01, 37.55]} icon="park" color="#2ecc71" tooltip="휴식하기 좋은 벤치가 많습니다." />
        <MakiMarker lngLat={[127.00, 37.53]} icon="lodging" color="#9b59b6" label="그랜드 호텔" />
        <MakiMarker lngLat={[127.03, 37.55]} icon="cafe" color="#e67e22" tooltip="24시간 오픈" />
        <MakiMarker lngLat={[127.05, 37.54]} icon="airport" color="#34495e" label="도심공항" tooltip="공항버스 탑승 장소" />
      </VWorldMap>

      <div style={{
        position: 'absolute',
        top: 10,
        left: 10,
        background: 'white',
        padding: 10,
        borderRadius: 8,
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <label>
          <b>Layer Type: </b>
          <select value={layerType} onChange={(e) => setLayerType(e.target.value as VWorldLayerType)}>
            <option value="Base">Base</option>
            <option value="Satellite">Satellite</option>
            <option value="Hybrid">Hybrid</option>
            <option value="gray">Gray</option>
            <option value="midnight">Midnight</option>
          </select>
        </label>
        <label>
          <b>Semantic Zoom Threshold: </b>
          <input 
            type="range" 
            min="6" max="18" 
            value={semanticThreshold} 
            onChange={(e) => setSemanticThreshold(Number(e.target.value))} 
          />
          <span style={{ marginLeft: '8px' }}>{semanticThreshold}</span>
        </label>
        <div style={{ fontSize: '12px' }}>
          Marker Pos: {markerPos[0].toFixed(4)}, {markerPos[1].toFixed(4)}
        </div>
        <div style={{ marginTop: '12px', fontSize: '12px', color: '#666' }}>
          * 지도 빈 곳이나 '강남역 주변' 마커를 <b>우클릭</b>해 보세요.
          <br/>
          * 남산 영역(Polygon)과 둘레길(Line)에 마우스를 올리거나 클릭해보세요.
        </div>
      </div>

      {/* Context Menu UI */}
      {contextMenu && (
        <div
          style={{
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
            background: 'white',
            border: '1px solid #ccc',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            padding: '8px 0',
            borderRadius: '4px',
            zIndex: 9999,
            minWidth: '160px',
            fontFamily: 'sans-serif'
          }}
        >
          {contextMenu.type === 'map' ? (
            <>
              <div style={{ padding: '4px 16px', fontSize: '12px', fontWeight: 'bold', color: '#888', borderBottom: '1px solid #eee', marginBottom: '4px' }}>지도 옵션</div>
              <div 
                style={{ padding: '8px 16px', cursor: 'pointer', fontSize: '14px' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                onClick={() => alert(`여기에 마커 추가: ${contextMenu.data.lng.toFixed(4)}, ${contextMenu.data.lat.toFixed(4)}`)}
              >
                📍 여기에 마커 추가하기
              </div>
              <div 
                style={{ padding: '8px 16px', cursor: 'pointer', fontSize: '14px' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                onClick={() => alert('위치 공유하기')}
              >
                🔗 위치 공유하기
              </div>
            </>
          ) : (
            <>
              <div style={{ padding: '4px 16px', fontSize: '12px', fontWeight: 'bold', color: '#888', borderBottom: '1px solid #eee', marginBottom: '4px' }}>마커 옵션</div>
              <div 
                style={{ padding: '8px 16px', cursor: 'pointer', fontSize: '14px' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                onClick={() => alert(`'${contextMenu.data.label}' 정보 보기`)}
              >
                ℹ️ 상세 정보 보기
              </div>
              <div 
                style={{ padding: '8px 16px', cursor: 'pointer', fontSize: '14px', color: '#e74c3c' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#ffe5e5'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                onClick={() => alert('마커 삭제하기')}
              >
                🗑️ 마커 삭제
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
