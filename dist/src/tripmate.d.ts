export declare const TRIPMATE_MARKER_PALETTE: {
    readonly 'P-01': {
        readonly hex: "#E53935";
        readonly name: "red";
        readonly labelColor: "#FFFFFF";
    };
    readonly 'P-02': {
        readonly hex: "#FB8C00";
        readonly name: "orange";
        readonly labelColor: "#FFFFFF";
    };
    readonly 'P-03': {
        readonly hex: "#FDD835";
        readonly name: "yellow";
        readonly labelColor: "#222222";
    };
    readonly 'P-04': {
        readonly hex: "#7CB342";
        readonly name: "light-green";
        readonly labelColor: "#FFFFFF";
    };
    readonly 'P-05': {
        readonly hex: "#43A047";
        readonly name: "green";
        readonly labelColor: "#FFFFFF";
    };
    readonly 'P-06': {
        readonly hex: "#00897B";
        readonly name: "teal";
        readonly labelColor: "#FFFFFF";
    };
    readonly 'P-07': {
        readonly hex: "#00ACC1";
        readonly name: "sky";
        readonly labelColor: "#FFFFFF";
    };
    readonly 'P-08': {
        readonly hex: "#1E88E5";
        readonly name: "blue";
        readonly labelColor: "#FFFFFF";
    };
    readonly 'P-09': {
        readonly hex: "#3949AB";
        readonly name: "indigo";
        readonly labelColor: "#FFFFFF";
    };
    readonly 'P-10': {
        readonly hex: "#8E24AA";
        readonly name: "purple";
        readonly labelColor: "#FFFFFF";
    };
    readonly 'P-11': {
        readonly hex: "#D81B60";
        readonly name: "magenta";
        readonly labelColor: "#FFFFFF";
    };
    readonly 'P-12': {
        readonly hex: "#6D4C41";
        readonly name: "brown";
        readonly labelColor: "#FFFFFF";
    };
    readonly 'P-13': {
        readonly hex: "#757575";
        readonly name: "gray";
        readonly labelColor: "#FFFFFF";
    };
    readonly 'P-14': {
        readonly hex: "#212121";
        readonly name: "black";
        readonly labelColor: "#FFFFFF";
    };
    readonly 'P-15': {
        readonly hex: "#F4511E";
        readonly name: "deep-orange";
        readonly labelColor: "#FFFFFF";
    };
    readonly 'P-16': {
        readonly hex: "#039BE5";
        readonly name: "cyan-blue";
        readonly labelColor: "#FFFFFF";
    };
};
export type TripmateMarkerColorKey = keyof typeof TRIPMATE_MARKER_PALETTE;
export type TripmateCategoryMarker = {
    icon: string;
    colorKey: TripmateMarkerColorKey;
};
export declare const TRIPMATE_CATEGORY_MARKERS: Record<string, TripmateCategoryMarker>;
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
export declare function isTripmateMarkerColorKey(value: string | null | undefined): value is TripmateMarkerColorKey;
export declare function resolveTripmateMarkerStyle({ category, markerColor, markerIcon, fallbackCategory, }: ResolveTripmateMarkerStyleOptions): ResolvedTripmateMarkerStyle;
