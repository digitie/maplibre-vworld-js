import React from 'react';
import { resolveTripmateMarkerStyle } from '../tripmate';
import { MakiMarker } from './MakiMarker';
import { PolygonArea } from './PolygonArea';
import { PriceMarker } from './PriceMarker';
import { RouteLine } from './RouteLine';
import { WeatherCondition, WeatherMarker } from './WeatherMarker';

export type TripmateFeatureKind = 'place' | 'event' | 'notice' | 'price' | 'weather' | 'route' | 'area';

export interface TripmateFeatureLike {
  id: string | number;
  kind: TripmateFeatureKind;
  name?: string;
  category?: string | null;
  lngLat?: [number, number];
  coord?: [number, number];
  centroidLngLat?: [number, number];
  markerColor?: string | null;
  markerIcon?: string | null;
  geometry?: GeoJSON.Geometry;
  routeCoordinates?: [number, number][];
  price?: string | number | null;
  currency?: string;
  weather?: {
    temperature: number;
    condition: WeatherCondition;
  } | null;
}

export interface TripmateFeatureLayerProps<TFeature extends TripmateFeatureLike = TripmateFeatureLike> {
  features: TFeature[];
  iconBaseUrl?: string;
  selectedFeatureId?: string | number | null;
  highlightedFeatureId?: string | number | null;
  renderFeature?: (feature: TFeature) => React.ReactNode;
  onFeatureClick?: (feature: TFeature, event: MouseEvent) => void;
  onFeatureContextMenu?: (feature: TFeature, event: MouseEvent) => void;
}

function featureKey(feature: TripmateFeatureLike): string {
  return `${feature.kind}-${feature.id}`;
}

function featurePoint(feature: TripmateFeatureLike): [number, number] | undefined {
  return feature.lngLat ?? feature.coord ?? feature.centroidLngLat;
}

function isLineGeometry(geometry: GeoJSON.Geometry | undefined): geometry is GeoJSON.LineString | GeoJSON.MultiLineString {
  return geometry?.type === 'LineString' || geometry?.type === 'MultiLineString';
}

function isAreaGeometry(geometry: GeoJSON.Geometry | undefined): geometry is GeoJSON.Polygon | GeoJSON.MultiPolygon {
  return geometry?.type === 'Polygon' || geometry?.type === 'MultiPolygon';
}

function geometryFeature<TGeometry extends GeoJSON.Geometry>(
  id: string,
  geometry: TGeometry
): GeoJSON.Feature<TGeometry> {
  return {
    type: 'Feature',
    id,
    properties: {},
    geometry,
  };
}

function markerFillWithAlpha(color: string): string {
  if (/^#[0-9a-fA-F]{6}$/.test(color)) return `${color}33`;
  return color;
}

export const TripmateFeatureLayer = <TFeature extends TripmateFeatureLike>({
  features,
  iconBaseUrl,
  selectedFeatureId,
  highlightedFeatureId,
  renderFeature,
  onFeatureClick,
  onFeatureContextMenu,
}: TripmateFeatureLayerProps<TFeature>) => {
  return (
    <>
      {features.map((feature) => {
        if (renderFeature) {
          return (
            <React.Fragment key={featureKey(feature)}>
              {renderFeature(feature)}
            </React.Fragment>
          );
        }

        const markerStyle = resolveTripmateMarkerStyle({
          category: feature.category ?? feature.kind,
          markerColor: feature.markerColor,
          markerIcon: feature.markerIcon,
        });
        const selected = selectedFeatureId === feature.id;
        const highlighted = highlightedFeatureId === feature.id;
        const commonMarkerProps = {
          selected,
          highlighted,
          zIndex: selected ? 20 : highlighted ? 10 : undefined,
          ariaLabel: feature.name,
          onClick: (event: MouseEvent) => onFeatureClick?.(feature, event),
          onContextMenu: (event: MouseEvent) => onFeatureContextMenu?.(feature, event),
        };

        if (feature.kind === 'route') {
          if (feature.routeCoordinates) {
            return (
              <RouteLine
                key={featureKey(feature)}
                id={featureKey(feature)}
                coordinates={feature.routeCoordinates}
                color={markerStyle.color}
              />
            );
          }
          if (isLineGeometry(feature.geometry)) {
            return (
              <RouteLine
                key={featureKey(feature)}
                id={featureKey(feature)}
                data={geometryFeature(featureKey(feature), feature.geometry)}
                color={markerStyle.color}
              />
            );
          }
          return null;
        }

        if (feature.kind === 'area' && isAreaGeometry(feature.geometry)) {
          const centroid = featurePoint(feature);
          return (
            <React.Fragment key={featureKey(feature)}>
              <PolygonArea
                id={featureKey(feature)}
                data={geometryFeature(featureKey(feature), feature.geometry)}
                fillColor={markerFillWithAlpha(markerStyle.color)}
                outlineColor={markerStyle.color}
              />
              {centroid && (
                <MakiMarker
                  lngLat={centroid}
                  icon={markerStyle.icon}
                  iconBaseUrl={iconBaseUrl}
                  color={markerStyle.color}
                  iconColor={markerStyle.labelColor}
                  size={28}
                  {...commonMarkerProps}
                />
              )}
            </React.Fragment>
          );
        }

        const lngLat = featurePoint(feature);
        if (!lngLat) return null;

        if (feature.kind === 'price' && feature.price !== null && feature.price !== undefined) {
          return (
            <PriceMarker
              key={featureKey(feature)}
              lngLat={lngLat}
              price={feature.price}
              currency={feature.currency ?? '₩'}
              {...commonMarkerProps}
            />
          );
        }

        if (feature.kind === 'weather' && feature.weather) {
          return (
            <WeatherMarker
              key={featureKey(feature)}
              lngLat={lngLat}
              temperature={feature.weather.temperature}
              condition={feature.weather.condition}
              {...commonMarkerProps}
            />
          );
        }

        return (
          <MakiMarker
            key={featureKey(feature)}
            lngLat={lngLat}
            icon={markerStyle.icon}
            iconBaseUrl={iconBaseUrl}
            color={markerStyle.color}
            iconColor={markerStyle.labelColor}
            tooltip={feature.name}
            {...commonMarkerProps}
          />
        );
      })}
    </>
  );
};
