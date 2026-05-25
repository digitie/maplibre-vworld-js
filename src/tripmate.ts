export const TRIPMATE_MARKER_PALETTE = {
  'P-01': { hex: '#E53935', name: 'red', labelColor: '#FFFFFF' },
  'P-02': { hex: '#FB8C00', name: 'orange', labelColor: '#FFFFFF' },
  'P-03': { hex: '#FDD835', name: 'yellow', labelColor: '#222222' },
  'P-04': { hex: '#7CB342', name: 'light-green', labelColor: '#FFFFFF' },
  'P-05': { hex: '#43A047', name: 'green', labelColor: '#FFFFFF' },
  'P-06': { hex: '#00897B', name: 'teal', labelColor: '#FFFFFF' },
  'P-07': { hex: '#00ACC1', name: 'sky', labelColor: '#FFFFFF' },
  'P-08': { hex: '#1E88E5', name: 'blue', labelColor: '#FFFFFF' },
  'P-09': { hex: '#3949AB', name: 'indigo', labelColor: '#FFFFFF' },
  'P-10': { hex: '#8E24AA', name: 'purple', labelColor: '#FFFFFF' },
  'P-11': { hex: '#D81B60', name: 'magenta', labelColor: '#FFFFFF' },
  'P-12': { hex: '#6D4C41', name: 'brown', labelColor: '#FFFFFF' },
  'P-13': { hex: '#757575', name: 'gray', labelColor: '#FFFFFF' },
  'P-14': { hex: '#212121', name: 'black', labelColor: '#FFFFFF' },
  'P-15': { hex: '#F4511E', name: 'deep-orange', labelColor: '#FFFFFF' },
  'P-16': { hex: '#039BE5', name: 'cyan-blue', labelColor: '#FFFFFF' },
} as const;

export type TripmateMarkerColorKey = keyof typeof TRIPMATE_MARKER_PALETTE;

export type TripmateCategoryMarker = {
  icon: string;
  colorKey: TripmateMarkerColorKey;
};

export const TRIPMATE_CATEGORY_MARKERS: Record<string, TripmateCategoryMarker> = {
  fuel: { icon: 'fuel', colorKey: 'P-02' },
  gas: { icon: 'fuel', colorKey: 'P-02' },
  주유소: { icon: 'fuel', colorKey: 'P-02' },
  rest_area: { icon: 'car', colorKey: 'P-15' },
  restarea: { icon: 'car', colorKey: 'P-15' },
  휴게소: { icon: 'car', colorKey: 'P-15' },
  beach: { icon: 'swimming', colorKey: 'P-07' },
  해수욕장: { icon: 'swimming', colorKey: 'P-07' },
  golf: { icon: 'golf', colorKey: 'P-05' },
  골프장: { icon: 'golf', colorKey: 'P-05' },
  lodging: { icon: 'lodging', colorKey: 'P-10' },
  숙박: { icon: 'lodging', colorKey: 'P-10' },
  cafe: { icon: 'cafe', colorKey: 'P-12' },
  카페: { icon: 'cafe', colorKey: 'P-12' },
  restaurant: { icon: 'restaurant', colorKey: 'P-01' },
  food: { icon: 'restaurant', colorKey: 'P-01' },
  음식점: { icon: 'restaurant', colorKey: 'P-01' },
  museum: { icon: 'museum', colorKey: 'P-09' },
  미술관: { icon: 'museum', colorKey: 'P-09' },
  박물관: { icon: 'museum', colorKey: 'P-09' },
  attraction: { icon: 'attraction', colorKey: 'P-11' },
  관광명소: { icon: 'attraction', colorKey: 'P-11' },
  temple: { icon: 'religious-buddhist', colorKey: 'P-03' },
  heritage: { icon: 'monument', colorKey: 'P-03' },
  국가유산: { icon: 'monument', colorKey: 'P-03' },
  culture: { icon: 'religious-buddhist', colorKey: 'P-03' },
  문화유산: { icon: 'religious-buddhist', colorKey: 'P-03' },
  grocery: { icon: 'grocery', colorKey: 'P-04' },
  편의점: { icon: 'grocery', colorKey: 'P-04' },
  마트: { icon: 'grocery', colorKey: 'P-04' },
  hospital: { icon: 'hospital', colorKey: 'P-16' },
  pharmacy: { icon: 'hospital', colorKey: 'P-16' },
  약국: { icon: 'hospital', colorKey: 'P-16' },
  병원: { icon: 'hospital', colorKey: 'P-16' },
  event: { icon: 'star', colorKey: 'P-11' },
  festival: { icon: 'star', colorKey: 'P-11' },
  축제: { icon: 'star', colorKey: 'P-11' },
  notice: { icon: 'alert', colorKey: 'P-14' },
  공지: { icon: 'alert', colorKey: 'P-14' },
  forest: { icon: 'park-alt1', colorKey: 'P-05' },
  휴양림: { icon: 'park-alt1', colorKey: 'P-05' },
  수목원: { icon: 'park-alt1', colorKey: 'P-05' },
  route: { icon: 'walking', colorKey: 'P-06' },
  walking: { icon: 'walking', colorKey: 'P-06' },
  트래킹: { icon: 'walking', colorKey: 'P-06' },
  area: { icon: 'park', colorKey: 'P-05' },
  park: { icon: 'park', colorKey: 'P-05' },
  국립공원: { icon: 'park', colorKey: 'P-05' },
  parking: { icon: 'parking', colorKey: 'P-13' },
  주차장: { icon: 'parking', colorKey: 'P-13' },
};

export interface ResolveTripmateMarkerStyleOptions {
  category?: string | null;
  markerColor?: string | null;
  markerIcon?: string | null;
  fallbackCategory?: string;
}

export interface ResolvedTripmateMarkerStyle {
  category: string;
  colorKey: TripmateMarkerColorKey;
  color: string;
  labelColor: string;
  icon: string;
}

export function isTripmateMarkerColorKey(value: string | null | undefined): value is TripmateMarkerColorKey {
  return Boolean(value && value in TRIPMATE_MARKER_PALETTE);
}

function normalizeCategory(category: string | null | undefined, fallbackCategory: string): string {
  const normalized = category?.trim().toLowerCase();
  return normalized && normalized.length > 0 ? normalized : fallbackCategory;
}

export function resolveTripmateMarkerStyle({
  category,
  markerColor,
  markerIcon,
  fallbackCategory = 'attraction',
}: ResolveTripmateMarkerStyleOptions): ResolvedTripmateMarkerStyle {
  const normalizedCategory = normalizeCategory(category, fallbackCategory);
  const categoryMarker =
    TRIPMATE_CATEGORY_MARKERS[normalizedCategory] ??
    TRIPMATE_CATEGORY_MARKERS[fallbackCategory] ??
    TRIPMATE_CATEGORY_MARKERS.attraction;
  const colorKey = isTripmateMarkerColorKey(markerColor)
    ? markerColor
    : categoryMarker.colorKey;
  const paletteColor = TRIPMATE_MARKER_PALETTE[colorKey];

  return {
    category: normalizedCategory,
    colorKey,
    color: paletteColor.hex,
    labelColor: paletteColor.labelColor,
    icon: markerIcon?.trim() || categoryMarker.icon,
  };
}
