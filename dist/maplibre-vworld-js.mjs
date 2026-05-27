import e from "maplibre-gl";
import * as t from "react";
import n, { createContext as r, useCallback as i, useContext as a, useEffect as o, useLayoutEffect as s, useMemo as c, useRef as l, useState as u, useSyncExternalStore as d } from "react";
import { createPortal as f } from "react-dom";
import { z as p } from "zod";
//#region \0rolldown/runtime.js
var m = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), h = /* @__PURE__ */ ((e) => typeof require < "u" ? require : typeof Proxy < "u" ? new Proxy(e, { get: (e, t) => (typeof require < "u" ? require : e)[t] }) : e)(function(e) {
	if (typeof require < "u") return require.apply(this, arguments);
	throw Error("Calling `require` for \"" + e + "\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.");
}), g = !1, _ = /* @__PURE__ */ new Map();
async function v(e, t) {
	let n = `${e || ""}|${t || ""}`, r = _.get(n);
	if (r) return r;
	if (e) try {
		let t = await fetch(e);
		if (t.ok) {
			let e = await t.arrayBuffer();
			return _.set(n, e), e;
		}
	} catch {}
	let i = `<svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
  <rect width="256" height="256" fill="#f5f5f5" />
  <circle cx="128" cy="110" r="24" fill="none" stroke="#ccc" stroke-width="4" />
  <line x1="111" y1="93" x2="145" y2="127" stroke="#ccc" stroke-width="4" />
  <text x="128" y="155" font-family="sans-serif" font-size="14" fill="#999" text-anchor="middle">${t || "지원하지 않는 타일"}</text>
</svg>`, a = await new Blob([i], { type: "image/svg+xml" }).arrayBuffer();
	return _.set(n, a), a;
}
var y = async (e, t) => {
	let n = new URL(e.url), r = n.searchParams.get("fallback"), i = n.searchParams.get("label"), a = n.searchParams.get("mapId");
	n.protocol = "https:", n.searchParams.delete("fallback"), n.searchParams.delete("label"), n.searchParams.delete("mapId");
	let o = n.toString();
	try {
		let e = await fetch(o, { signal: t.signal });
		if (!e.ok) throw Error(`HTTP error ${e.status}: ${e.statusText}`);
		return { data: await e.arrayBuffer() };
	} catch (e) {
		if (t.signal.aborted) throw e;
		return typeof window < "u" && window.dispatchEvent(new CustomEvent("vworld-tile-error", { detail: {
			url: o,
			error: e,
			mapId: a
		} })), { data: await v(r, i) };
	}
};
function b() {
	g || typeof window > "u" || (g = !0, e.addProtocol("vworld", y));
}
var x = new Set(["Hybrid", "Satellite"]), S = "공간정보 오픈플랫폼 브이월드", C = new Set([
	404,
	408,
	429,
	500,
	502,
	503,
	504
]), ee = /(\/req\/wmts\/1\.0\.0\/)([^/?#]+)(\/)/;
function w(e, t) {
	let n = t === "Satellite" ? "jpeg" : "png", r = t === "gray" ? "white" : t;
	return `https://api.vworld.kr/req/wmts/1.0.0/${encodeURIComponent(e.trim())}/${r}/{z}/{y}/{x}.${n}`;
}
function T(e) {
	return x.has(e) ? 18 : 19;
}
function E(e) {
	if (e !== void 0) return e.replace(ee, "$1***$3");
}
function D(e) {
	let t = e.error, n = t?.message?.toLowerCase() ?? "", r = e.sourceId, i = t?.url ?? "";
	return typeof r == "string" && r.startsWith("vworld") || i.includes("/req/wmts/") || n.includes("tile") || n.includes("failed to fetch") || C.has(t?.status ?? 0);
}
function O(e, t) {
	let n = {}, r = [], i = T(t);
	return t === "Hybrid" && (n["vworld-satellite"] = {
		type: "raster",
		tiles: [w(e, "Satellite")],
		tileSize: 256,
		attribution: S,
		maxzoom: i
	}, r.push({
		id: "vworld-satellite-layer",
		type: "raster",
		source: "vworld-satellite",
		minzoom: 0
	})), n[`vworld-${t}`] = {
		type: "raster",
		tiles: [w(e, t)],
		tileSize: 256,
		attribution: S,
		maxzoom: i
	}, r.push({
		id: `vworld-${t}-layer`,
		type: "raster",
		source: `vworld-${t}`,
		minzoom: 0
	}), {
		version: 8,
		sources: n,
		layers: r
	};
}
//#endregion
//#region src/store/mapStore.ts
var k = {
	map: null,
	loaded: !1,
	zoom: 0,
	semanticZoomThreshold: void 0
}, A = class {
	snapshot = k;
	listeners = /* @__PURE__ */ new Set();
	subscribe = (e) => (this.listeners.add(e), () => this.listeners.delete(e));
	getSnapshot = () => this.snapshot;
	setMap(e) {
		this.snapshot.map !== e && (this.snapshot = {
			...this.snapshot,
			map: e,
			loaded: !1
		}, this.emit());
	}
	setLoaded(e) {
		this.snapshot.loaded !== e && (this.snapshot = {
			...this.snapshot,
			loaded: e
		}, this.emit());
	}
	setZoom(e) {
		this.snapshot.zoom !== e && (this.snapshot = {
			...this.snapshot,
			zoom: e
		}, this.emit());
	}
	setSemanticZoomThreshold(e) {
		this.snapshot.semanticZoomThreshold !== e && (this.snapshot = {
			...this.snapshot,
			semanticZoomThreshold: e
		}, this.emit());
	}
	emit() {
		for (let e of this.listeners) e();
	}
}, te = r(null);
function j() {
	let e = a(te);
	if (!e) throw Error("useMap / useMapZoom / useMapLoaded / useMapSelector must be used inside <VWorldMap>.");
	return e;
}
var ne = (e) => e.map, re = (e) => e.zoom, ie = (e) => e.loaded;
function M() {
	let e = j();
	return d(e.subscribe, () => ne(e.getSnapshot()), () => null);
}
function N() {
	let e = j();
	return d(e.subscribe, () => re(e.getSnapshot()), () => 0);
}
function P() {
	let e = j();
	return d(e.subscribe, () => ie(e.getSnapshot()), () => !1);
}
function F(e) {
	let t = j(), n = l(e);
	s(() => {
		n.current = e;
	});
	let r = l(void 0), a = i(() => {
		let e = t.getSnapshot(), i = r.current;
		if (i && i.snapshot === e) return i.value;
		let a = n.current(e);
		return i && Object.is(i.value, a) ? (r.current = {
			snapshot: e,
			value: i.value
		}, i.value) : (r.current = {
			snapshot: e,
			value: a
		}, a);
	}, [t]);
	return d(t.subscribe, a, a);
}
function I(e) {
	let t = l(e);
	return s(() => {
		t.current = e;
	}), i(((...e) => t.current?.(...e)), []);
}
//#endregion
//#region node_modules/react/cjs/react-jsx-runtime.production.js
var ae = /* @__PURE__ */ m(((e) => {
	var t = Symbol.for("react.transitional.element"), n = Symbol.for("react.fragment");
	function r(e, n, r) {
		var i = null;
		if (r !== void 0 && (i = "" + r), n.key !== void 0 && (i = "" + n.key), "key" in n) for (var a in r = {}, n) a !== "key" && (r[a] = n[a]);
		else r = n;
		return n = r.ref, {
			$$typeof: t,
			type: e,
			key: i,
			ref: n === void 0 ? null : n,
			props: r
		};
	}
	e.Fragment = n, e.jsx = r, e.jsxs = r;
})), L = /* @__PURE__ */ m(((e) => {
	process.env.NODE_ENV !== "production" && (function() {
		function t(e) {
			if (e == null) return null;
			if (typeof e == "function") return e.$$typeof === O ? null : e.displayName || e.name || null;
			if (typeof e == "string") return e;
			switch (e) {
				case v: return "Fragment";
				case b: return "Profiler";
				case y: return "StrictMode";
				case ee: return "Suspense";
				case w: return "SuspenseList";
				case D: return "Activity";
			}
			if (typeof e == "object") switch (typeof e.tag == "number" && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), e.$$typeof) {
				case _: return "Portal";
				case S: return e.displayName || "Context";
				case x: return (e._context.displayName || "Context") + ".Consumer";
				case C:
					var n = e.render;
					return e = e.displayName, e ||= (e = n.displayName || n.name || "", e === "" ? "ForwardRef" : "ForwardRef(" + e + ")"), e;
				case T: return n = e.displayName || null, n === null ? t(e.type) || "Memo" : n;
				case E:
					n = e._payload, e = e._init;
					try {
						return t(e(n));
					} catch {}
			}
			return null;
		}
		function n(e) {
			return "" + e;
		}
		function r(e) {
			try {
				n(e);
				var t = !1;
			} catch {
				t = !0;
			}
			if (t) {
				t = console;
				var r = t.error, i = typeof Symbol == "function" && Symbol.toStringTag && e[Symbol.toStringTag] || e.constructor.name || "Object";
				return r.call(t, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", i), n(e);
			}
		}
		function i(e) {
			if (e === v) return "<>";
			if (typeof e == "object" && e && e.$$typeof === E) return "<...>";
			try {
				var n = t(e);
				return n ? "<" + n + ">" : "<...>";
			} catch {
				return "<...>";
			}
		}
		function a() {
			var e = k.A;
			return e === null ? null : e.getOwner();
		}
		function o() {
			return Error("react-stack-top-frame");
		}
		function s(e) {
			if (A.call(e, "key")) {
				var t = Object.getOwnPropertyDescriptor(e, "key").get;
				if (t && t.isReactWarning) return !1;
			}
			return e.key !== void 0;
		}
		function c(e, t) {
			function n() {
				ne || (ne = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", t));
			}
			n.isReactWarning = !0, Object.defineProperty(e, "key", {
				get: n,
				configurable: !0
			});
		}
		function l() {
			var e = t(this.type);
			return re[e] || (re[e] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release.")), e = this.props.ref, e === void 0 ? null : e;
		}
		function u(e, t, n, r, i, a) {
			var o = n.ref;
			return e = {
				$$typeof: g,
				type: e,
				key: t,
				props: n,
				_owner: r
			}, (o === void 0 ? null : o) === null ? Object.defineProperty(e, "ref", {
				enumerable: !1,
				value: null
			}) : Object.defineProperty(e, "ref", {
				enumerable: !1,
				get: l
			}), e._store = {}, Object.defineProperty(e._store, "validated", {
				configurable: !1,
				enumerable: !1,
				writable: !0,
				value: 0
			}), Object.defineProperty(e, "_debugInfo", {
				configurable: !1,
				enumerable: !1,
				writable: !0,
				value: null
			}), Object.defineProperty(e, "_debugStack", {
				configurable: !1,
				enumerable: !1,
				writable: !0,
				value: i
			}), Object.defineProperty(e, "_debugTask", {
				configurable: !1,
				enumerable: !1,
				writable: !0,
				value: a
			}), Object.freeze && (Object.freeze(e.props), Object.freeze(e)), e;
		}
		function d(e, n, i, o, l, d) {
			var p = n.children;
			if (p !== void 0) if (o) if (te(p)) {
				for (o = 0; o < p.length; o++) f(p[o]);
				Object.freeze && Object.freeze(p);
			} else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
			else f(p);
			if (A.call(n, "key")) {
				p = t(e);
				var m = Object.keys(n).filter(function(e) {
					return e !== "key";
				});
				o = 0 < m.length ? "{key: someKey, " + m.join(": ..., ") + ": ...}" : "{key: someKey}", N[p + o] || (m = 0 < m.length ? "{" + m.join(": ..., ") + ": ...}" : "{}", console.error("A props object containing a \"key\" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />", o, p, m, p), N[p + o] = !0);
			}
			if (p = null, i !== void 0 && (r(i), p = "" + i), s(n) && (r(n.key), p = "" + n.key), "key" in n) for (var h in i = {}, n) h !== "key" && (i[h] = n[h]);
			else i = n;
			return p && c(i, typeof e == "function" ? e.displayName || e.name || "Unknown" : e), u(e, p, i, a(), l, d);
		}
		function f(e) {
			p(e) ? e._store && (e._store.validated = 1) : typeof e == "object" && e && e.$$typeof === E && (e._payload.status === "fulfilled" ? p(e._payload.value) && e._payload.value._store && (e._payload.value._store.validated = 1) : e._store && (e._store.validated = 1));
		}
		function p(e) {
			return typeof e == "object" && !!e && e.$$typeof === g;
		}
		var m = h("react"), g = Symbol.for("react.transitional.element"), _ = Symbol.for("react.portal"), v = Symbol.for("react.fragment"), y = Symbol.for("react.strict_mode"), b = Symbol.for("react.profiler"), x = Symbol.for("react.consumer"), S = Symbol.for("react.context"), C = Symbol.for("react.forward_ref"), ee = Symbol.for("react.suspense"), w = Symbol.for("react.suspense_list"), T = Symbol.for("react.memo"), E = Symbol.for("react.lazy"), D = Symbol.for("react.activity"), O = Symbol.for("react.client.reference"), k = m.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, A = Object.prototype.hasOwnProperty, te = Array.isArray, j = console.createTask ? console.createTask : function() {
			return null;
		};
		m = { react_stack_bottom_frame: function(e) {
			return e();
		} };
		var ne, re = {}, ie = m.react_stack_bottom_frame.bind(m, o)(), M = j(i(o)), N = {};
		e.Fragment = v, e.jsx = function(e, t, n) {
			var r = 1e4 > k.recentlyCreatedOwnerStacks++;
			return d(e, t, n, !1, r ? Error("react-stack-top-frame") : ie, r ? j(i(e)) : M);
		}, e.jsxs = function(e, t, n) {
			var r = 1e4 > k.recentlyCreatedOwnerStacks++;
			return d(e, t, n, !0, r ? Error("react-stack-top-frame") : ie, r ? j(i(e)) : M);
		};
	})();
})), R = (/* @__PURE__ */ m(((e, t) => {
	process.env.NODE_ENV === "production" ? t.exports = ae() : t.exports = L();
})))();
function oe(e, t) {
	return e === void 0 ? null : typeof e == "function" ? e(t) : e;
}
function se(e) {
	let t = [e.error?.url, e.url];
	for (let e of t) if (typeof e == "string" && e.length > 0) return e;
}
function ce(e, t) {
	return e.center[0] === t.center[0] && e.center[1] === t.center[1] && e.zoom === t.zoom && e.pitch === t.pitch && e.bearing === t.bearing;
}
function le(e) {
	let t = e.originalEvent?.target, n = "map", r, i = t?.closest(".maplibregl-marker"), a = t?.closest(".maplibregl-popup");
	return i ? (n = i.dataset.isCluster === "true" ? "cluster" : "marker", r = i.dataset.interactionId) : a && (n = "popup", r = a.dataset.interactionId), {
		source: n,
		interactionId: r,
		lngLat: [e.lngLat.lng, e.lngLat.lat],
		defaultPrevented: e.originalEvent?.defaultPrevented ?? !1
	};
}
var ue = 0;
function de(e, t, n) {
	b();
	let r = new URLSearchParams();
	t.imageUrl && r.set("fallback", t.imageUrl), t.label && r.set("label", t.label), r.set("mapId", n);
	let i = { ...e.sources };
	for (let [e, t] of Object.entries(i)) t.type === "raster" && t.tiles && (i[e] = {
		...t,
		tiles: t.tiles.map((e) => e.replace("https://api.vworld.kr", "vworld://api.vworld.kr") + "?" + r.toString())
	});
	return {
		...e,
		sources: i
	};
}
var z = ({ apiKey: t, layerType: n = "Base", center: r, zoom: a = 12, pitch: c = 0, bearing: d = 0, minZoom: f = 6, maxZoom: p = 19, maxBounds: m, semanticZoomThreshold: h, navigation: g = !0, geolocate: _ = !0, scale: v = !0, className: y = "", style: b = {
	width: "100%",
	height: "100%"
}, children: x, onLoad: S, onClick: C, onContextMenu: ee, onMoveEnd: w, onZoomEnd: D, onIdle: k, onError: j, transformRequest: ne, fallback: re, loadingSkeleton: ie, animateCameraChanges: M = !0, flyToOptions: N, lazy: P = !1, lazyEnabled: F = !1, lazyRootMargin: ae = "0px", unsupportedTileFallback: L }) => {
	let z = l(null), [B] = u(() => new A()), [V] = u(() => String(++ue)), [H, U] = u(null), [pe, W] = u(() => P === !1), [G, me] = u(!1), he = l({
		center: r,
		zoom: a,
		pitch: c,
		bearing: d
	}), ge = l(null), _e = l({
		apiKey: t,
		layerType: n
	}), ve = I(S), ye = I(C), be = I(ee), xe = I(w), K = I(D), q = I(k), Se = l(j);
	s(() => {
		Se.current = j;
	});
	let Ce = typeof t == "string" && t.trim().length > 0, we = Ce && H === null && pe;
	o(() => {
		U(null);
	}, [t, n]), o(() => {
		if (!L) return;
		let e = (e) => {
			let t = e;
			if (t.detail.mapId !== V) return;
			let n = Se.current;
			n && n({
				type: "error",
				error: Object.assign(Error(t.detail.error?.message ?? "Tile fetch error"), {
					url: t.detail.url,
					status: t.detail.error?.message?.match(/HTTP error (\d+)/)?.[1]
				})
			});
		};
		return window.addEventListener("vworld-tile-error", e), () => window.removeEventListener("vworld-tile-error", e);
	}, [V, L]), o(() => {
		B.setSemanticZoomThreshold(h);
	}, [B, h]), o(() => {
		if (P === "manual") {
			F && W(!0);
			return;
		}
		if (P !== !0) {
			W(!0);
			return;
		}
		if (pe) return;
		if (typeof IntersectionObserver > "u") {
			W(!0);
			return;
		}
		let e = new IntersectionObserver((t) => {
			t[0]?.isIntersecting && (W(!0), e.disconnect());
		}, { rootMargin: ae });
		return z.current && e.observe(z.current), () => e.disconnect();
	}, [
		P,
		F,
		ae,
		pe
	]), o(() => {
		if (!we || !z.current) return;
		let i = Math.min(p, T(n)), o;
		try {
			let s = O(t, n);
			L && (s = de(s, L, V)), o = new e.Map({
				container: z.current,
				style: s,
				center: r,
				zoom: a,
				pitch: c,
				bearing: d,
				minZoom: f,
				maxZoom: i,
				maxBounds: m,
				transformRequest: ne
			});
		} catch (e) {
			U(e instanceof Error ? e : Error(String(e)));
			return;
		}
		me(!1), _e.current = {
			apiKey: t,
			layerType: n
		}, B.setMap(o), B.setZoom(o.getZoom()), g && o.addControl(new e.NavigationControl({ visualizePitch: !0 }), "top-right"), _ && o.addControl(new e.GeolocateControl({
			positionOptions: { enableHighAccuracy: !0 },
			trackUserLocation: !0
		}), "top-right"), v && o.addControl(new e.ScaleControl({
			maxWidth: 150,
			unit: "metric"
		}), "bottom-right");
		let s = () => {
			B.setLoaded(!0), B.setZoom(o.getZoom()), me(!0), ve(o);
		}, l = (e) => {
			B.setZoom(o.getZoom()), K(e);
		}, u = (e) => {
			Y(o), xe(e);
		}, h = (e) => {
			q(e);
		}, y = (e) => {
			ye(e, le(e));
		}, b = (e) => {
			be(e, le(e));
		}, x = (e) => {
			let t = Se.current;
			if (t) {
				t(e);
				return;
			}
			let n = se(e), r = n ? E(n) : "", i = e.error?.message ?? "unknown error";
			console.warn(`[VWorldMap] ${i}`, r);
		};
		o.on("load", s), o.on("zoomend", l), o.on("moveend", u), o.on("idle", h), o.on("click", y), o.on("contextmenu", b), o.on("error", x);
		let S = typeof ResizeObserver < "u" ? new ResizeObserver(() => o.resize()) : null;
		return S && z.current && S.observe(z.current), () => {
			S?.disconnect(), o.off("load", s), o.off("zoomend", l), o.off("moveend", u), o.off("idle", h), o.off("click", y), o.off("contextmenu", b), o.off("error", x), o.remove(), me(!1), B.setMap(null);
		};
	}, [we]), o(() => {
		let e = B.getSnapshot().map;
		if (!e || !G || _e.current.apiKey === t && _e.current.layerType === n) return;
		let r = O(t, n);
		L && (r = de(r, L, V)), e.setStyle(r), _e.current = {
			apiKey: t,
			layerType: n
		};
	}, [
		t,
		n,
		G,
		B,
		V,
		L
	]);
	let J = l({
		animateCameraChanges: M,
		flyToOptions: N
	});
	s(() => {
		J.current = {
			animateCameraChanges: M,
			flyToOptions: N
		};
	});
	let Y = i((e) => {
		let t = ge.current;
		if (!t || e.isMoving() || e.isEasing()) return;
		let { animateCameraChanges: n, flyToOptions: r } = J.current;
		n ? e.flyTo({
			...r,
			...t
		}) : e.jumpTo(t), he.current = t, ge.current = null;
	}, []);
	o(() => {
		let e = B.getSnapshot().map;
		if (!e || !G) return;
		let t = {
			center: r,
			zoom: a,
			pitch: c,
			bearing: d
		};
		ce(he.current, t) || (ge.current = t, Y(e));
	}, [
		r[0],
		r[1],
		a,
		c,
		d,
		G,
		B,
		Y
	]), o(() => {
		let e = B.getSnapshot().map;
		e && (e.setMinZoom(f), e.setMaxZoom(Math.min(p, T(n))), e.setMaxBounds(m));
	}, [
		f,
		p,
		n,
		m,
		B
	]);
	let Te = Ce ? H ? {
		reason: "map-init-error",
		error: H
	} : null : { reason: "missing-api-key" };
	return /* @__PURE__ */ (0, R.jsx)(te.Provider, {
		value: B,
		children: Te ? oe(re, Te) : /* @__PURE__ */ (0, R.jsxs)(R.Fragment, { children: [/* @__PURE__ */ (0, R.jsx)("div", {
			ref: z,
			className: y,
			style: b,
			"data-testid": "vworld-map-container"
		}), /* @__PURE__ */ (0, R.jsx)(fe, {
			loadingSkeleton: ie,
			children: x
		})] })
	});
}, fe = ({ children: e, loadingSkeleton: t }) => /* @__PURE__ */ (0, R.jsx)(R.Fragment, { children: P() ? e : t }), B = 1e3;
function V(e, t, { selected: n, highlighted: r, zIndex: i, ariaLabel: a, className: o, interactionId: s, isCluster: c }) {
	e.dataset.selected = n ? "true" : "false", e.dataset.highlighted = r ? "true" : "false", s === void 0 ? delete e.dataset.interactionId : e.dataset.interactionId = s, c ? e.dataset.isCluster = "true" : delete e.dataset.isCluster, e.style.zIndex = i === void 0 ? "" : String(i);
	let l = n ? "1.18" : r ? "1.1" : "1";
	e.style.setProperty("--vworld-marker-scale", l), e.style.setProperty("scale", l === "1" ? "" : l), e.style.filter = n ? "drop-shadow(0 6px 14px rgba(0,0,0,0.34))" : r ? "drop-shadow(0 4px 10px rgba(0,0,0,0.26))" : "", a ? (e.setAttribute("aria-label", a), e.setAttribute("role", "button")) : (e.removeAttribute("aria-label"), e.removeAttribute("role"));
	let u = t ? t.split(/\s+/).filter(Boolean) : [], d = o ? o.split(/\s+/).filter(Boolean) : [], f = new Set(d);
	for (let t of u) f.has(t) || e.classList.remove(t);
	let p = new Set(u);
	for (let t of d) p.has(t) || e.classList.add(t);
}
var H = ({ lngLat: t, color: n = "#3FB1CE", anchor: r, offset: i, draggable: a = !1, onDragEnd: u, onClick: d, onContextMenu: p, selected: m, highlighted: h, interactionId: g, isCluster: _, zIndex: v, ariaLabel: y, className: b, children: x }) => {
	let S = M(), C = l(null), ee = l(void 0), w = l(void 0), T = l(v), E = l(d !== void 0);
	T.current !== v && (w.current = void 0, T.current = v);
	let D = l(p !== void 0), O = x != null && x !== !1, k = I(d), A = I(p), te = I(u);
	s(() => {
		E.current = d !== void 0, D.current = p !== void 0;
	}, [d, p]);
	let j = c(() => typeof document > "u" ? null : document.createElement("div"), []);
	return o(() => {
		if (!S) return;
		let o = O && j ? {
			element: j,
			draggable: a,
			anchor: r,
			offset: i
		} : {
			color: n,
			draggable: a,
			anchor: r,
			offset: i
		}, s = new e.Marker(o).setLngLat(t).addTo(S), c = s.getElement(), l = () => ({
			source: _ ? "cluster" : "marker",
			interactionId: g,
			lngLat: [t[0], t[1]],
			defaultPrevented: !1
		}), u = (e) => {
			let t = T.current ?? 0;
			B = Math.max(B, t) + 1, w.current = B, c.style.zIndex = String(w.current), E.current && (e.stopPropagation(), k(e, l(), s));
		}, d = (e) => {
			D.current && (e.preventDefault(), e.stopPropagation(), A(e, l(), s));
		}, f = () => {
			let { lng: e, lat: t } = s.getLngLat();
			te([e, t]);
		};
		return c.addEventListener("click", u), c.addEventListener("contextmenu", d), a && s.on("dragend", f), C.current = s, () => {
			c.removeEventListener("click", u), c.removeEventListener("contextmenu", d), a && s.off("dragend", f), s.remove(), C.current = null;
		};
	}, [
		S,
		O,
		n,
		a,
		r,
		j
	]), o(() => {
		C.current?.setLngLat(t);
	}, [t[0], t[1]]), o(() => {
		i !== void 0 && C.current?.setOffset(i);
	}, [i]), o(() => {
		let e = C.current;
		if (!e) return;
		let t = w.current === void 0 ? v : w.current;
		V(e.getElement(), ee.current, {
			selected: m,
			highlighted: h,
			zIndex: t,
			ariaLabel: y,
			className: b,
			interactionId: g,
			isCluster: _
		}), ee.current = b;
	}, [
		m,
		h,
		v,
		y,
		b,
		g,
		_
	]), O && j ? f(x, j) : null;
}, U = ({ color: e = "#DB4437", icon: t, size: n = 40, showInnerCircle: r = !0, label: i, tooltip: a, ...o }) => {
	let s = n * 1.5;
	return /* @__PURE__ */ (0, R.jsx)(H, {
		...o,
		anchor: "bottom",
		children: /* @__PURE__ */ (0, R.jsxs)("div", {
			title: a,
			style: {
				width: n,
				height: s,
				position: "relative",
				cursor: "pointer"
			},
			children: [
				/* @__PURE__ */ (0, R.jsxs)("svg", {
					viewBox: "0 0 24 36",
					width: n,
					height: s,
					style: {
						position: "absolute",
						top: 0,
						left: 0,
						filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.3))"
					},
					children: [/* @__PURE__ */ (0, R.jsx)("path", {
						fill: e,
						d: "M12,0 C5.372583,0 0,5.372583 0,12 C0,21 12,36 12,36 C12,36 24,21 24,12 C24,5.372583 18.627417,0 12,0 Z"
					}), r && /* @__PURE__ */ (0, R.jsx)("circle", {
						cx: "12",
						cy: "12",
						r: "8",
						fill: "white"
					})]
				}),
				/* @__PURE__ */ (0, R.jsx)("div", {
					style: {
						position: "absolute",
						top: 12 / 36 * s,
						left: "50%",
						transform: "translate(-50%, -50%)",
						width: n * .55,
						height: n * .55,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						zIndex: 1,
						pointerEvents: "none"
					},
					children: t
				}),
				i && /* @__PURE__ */ (0, R.jsx)("div", {
					style: {
						position: "absolute",
						top: s + 4,
						left: "50%",
						transform: "translateX(-50%)",
						background: "rgba(255, 255, 255, 0.9)",
						padding: "2px 6px",
						borderRadius: "4px",
						fontSize: "12px",
						fontWeight: "bold",
						color: "#333",
						whiteSpace: "nowrap",
						boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
						pointerEvents: "none",
						textShadow: "0 0 2px white"
					},
					children: i
				})
			]
		})
	});
}, pe = "https://unpkg.com/@mapbox/maki@8.0.0/icons", W = ({ icon: e, iconBaseUrl: t = pe, color: n = "#2c3e50", iconColor: r = "white", size: i = 40, ...a }) => {
	let o = c(() => `${t.replace(/\/+$/, "")}/${e}.svg`, [t, e]);
	return /* @__PURE__ */ (0, R.jsx)(U, {
		color: n,
		size: i,
		showInnerCircle: !1,
		icon: /* @__PURE__ */ (0, R.jsx)("div", { style: c(() => ({
			width: "100%",
			height: "100%",
			backgroundColor: r,
			WebkitMask: `url(${o}) no-repeat center / contain`,
			mask: `url(${o}) no-repeat center / contain`
		}), [r, o]) }),
		...a
	});
}, G = "vworld-pulsing-marker-keyframes";
function me() {
	if (typeof document > "u" || document.getElementById(G)) return;
	let e = document.createElement("style");
	e.id = G, e.textContent = "\n    @keyframes vworld-pulsing-ripple {\n      0%   { transform: scale(0.3); opacity: 0.8; }\n      80%  { transform: scale(1);   opacity: 0; }\n      100% { transform: scale(1);   opacity: 0; }\n    }\n  ", document.head.appendChild(e);
}
var he = ({ color: e = "#4285F4", size: t = 14, ...n }) => (me(), /* @__PURE__ */ (0, R.jsx)(H, {
	...n,
	children: /* @__PURE__ */ (0, R.jsxs)("div", {
		style: {
			position: "relative",
			width: t,
			height: t
		},
		children: [/* @__PURE__ */ (0, R.jsx)("div", { style: {
			position: "absolute",
			top: 0,
			left: 0,
			width: "100%",
			height: "100%",
			backgroundColor: e,
			borderRadius: "50%",
			border: "2px solid white",
			boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
			zIndex: 2,
			boxSizing: "border-box"
		} }), /* @__PURE__ */ (0, R.jsx)("div", { style: {
			position: "absolute",
			top: "-100%",
			left: "-100%",
			width: "300%",
			height: "300%",
			backgroundColor: e,
			borderRadius: "50%",
			zIndex: 1,
			animation: "vworld-pulsing-ripple 2s infinite ease-out"
		} })]
	})
})), ge = ({ label: e, bgColor: t = "#222", textColor: n = "white", simplifyAtZoom: r, ...a }) => F(i((e) => {
	let t = r ?? e.semanticZoomThreshold;
	return t !== void 0 && e.zoom < t;
}, [r])) ? /* @__PURE__ */ (0, R.jsx)(U, {
	lngLat: a.lngLat,
	color: t,
	size: 20,
	showInnerCircle: !1
}) : /* @__PURE__ */ (0, R.jsx)(H, {
	...a,
	children: /* @__PURE__ */ (0, R.jsx)("div", {
		style: {
			background: t,
			color: n,
			padding: "2px 6px",
			borderRadius: "4px",
			fontSize: "12px",
			fontWeight: "bold",
			whiteSpace: "nowrap",
			boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
			pointerEvents: "none"
		},
		children: e
	})
}), _e = ({ price: e, currency: t = "", isHoverable: n = !0, lodThresholds: r = [13, 11], ...i }) => {
	let [a, o] = u(!1), s = F((e) => e.zoom >= r[0] ? 1 : e.zoom >= r[1] ? 2 : 3), [c, d] = u(!1), f = l(s);
	f.current !== s && (s === 1 && d(!1), f.current = s);
	let p = c ? 1 : s, m = (e) => typeof e == "number" ? e.toLocaleString() : e, h = Array.isArray(e);
	if (p === 3) return /* @__PURE__ */ (0, R.jsx)(H, {
		...i,
		children: /* @__PURE__ */ (0, R.jsx)("div", {
			onClick: () => {
				d(!0);
			},
			onMouseEnter: () => o(!0),
			onMouseLeave: () => o(!1),
			style: {
				width: "12px",
				height: "12px",
				background: a && n ? "#222" : "white",
				border: "2px solid #222",
				borderRadius: "50%",
				boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
				cursor: n ? "pointer" : "default",
				transition: "all 0.2s ease",
				transform: a && n ? "scale(1.2)" : "scale(1)"
			}
		})
	});
	let g = h && p === 2 ? e.slice(0, 2) : e;
	return /* @__PURE__ */ (0, R.jsx)(H, {
		...i,
		children: /* @__PURE__ */ (0, R.jsx)("div", {
			onClick: () => {
				c && d(!1);
			},
			onMouseEnter: () => o(!0),
			onMouseLeave: () => o(!1),
			style: {
				background: a && n ? "#222" : "white",
				color: a && n ? "white" : "#222",
				border: "1px solid #ddd",
				borderRadius: h ? "12px" : "24px",
				padding: h ? "8px 12px" : "6px 12px",
				fontSize: "14px",
				fontWeight: "bold",
				boxShadow: a && n ? "0 4px 12px rgba(0,0,0,0.3)" : "0 2px 6px rgba(0,0,0,0.15)",
				cursor: n ? "pointer" : "default",
				transition: "all 0.2s ease-in-out",
				transform: a && n ? "scale(1.05)" : "scale(1)",
				display: "flex",
				flexDirection: h ? "column" : "row",
				alignItems: h ? "stretch" : "center",
				gap: h ? "4px" : "2px",
				minWidth: h ? "120px" : "auto"
			},
			children: h ? g.map((e, r) => /* @__PURE__ */ (0, R.jsxs)("div", {
				style: {
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					gap: "12px"
				},
				children: [e.label && /* @__PURE__ */ (0, R.jsx)("span", {
					style: {
						color: a && n ? "#aaa" : "#666",
						fontSize: "12px",
						fontWeight: "normal"
					},
					children: e.label
				}), /* @__PURE__ */ (0, R.jsxs)("span", { children: [e.currency === void 0 ? t : e.currency, m(e.price)] })]
			}, r)) : /* @__PURE__ */ (0, R.jsxs)(R.Fragment, { children: [/* @__PURE__ */ (0, R.jsx)("span", { children: t }), /* @__PURE__ */ (0, R.jsx)("span", { children: m(g) })] })
		})
	});
}, ve = ({ label: e, color: t = "#111", size: n = 24, ...r }) => /* @__PURE__ */ (0, R.jsx)(H, {
	...r,
	children: /* @__PURE__ */ (0, R.jsx)("div", {
		style: {
			width: n,
			height: n,
			backgroundColor: t,
			color: "white",
			border: "2px solid white",
			borderRadius: "50%",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			fontWeight: "bold",
			fontSize: n * .55,
			boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
			boxSizing: "border-box"
		},
		children: e
	})
}), ye = ({ count: e, color: t, size: n, onClick: r, ...a }) => {
	let o = n ?? (e > 500 ? 50 : e > 100 ? 40 : 30), s = t ?? (e > 500 ? "#f28cb1" : e > 100 ? "#f1f075" : "#51bbd6"), l = I(r), u = c(() => r ? () => l() : void 0, [r === void 0, l]), d = i((e) => {
		e.currentTarget.style.transform = "scale(1.1)";
	}, []), f = i((e) => {
		e.currentTarget.style.transform = "scale(1)";
	}, []);
	return /* @__PURE__ */ (0, R.jsx)(H, {
		...a,
		onClick: u,
		isCluster: !0,
		children: /* @__PURE__ */ (0, R.jsx)("div", {
			style: {
				width: o,
				height: o,
				backgroundColor: s,
				color: e > 100 ? "#333" : "white",
				borderRadius: "50%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				fontWeight: "bold",
				fontSize: o * .4,
				boxShadow: "0 0 0 4px rgba(255,255,255,0.5), 0 2px 4px rgba(0,0,0,0.3)",
				cursor: r ? "pointer" : "default",
				transition: "transform 0.2s ease"
			},
			onMouseEnter: d,
			onMouseLeave: f,
			children: e > 999 ? "999+" : e
		})
	});
}, be = [
	Int8Array,
	Uint8Array,
	Uint8ClampedArray,
	Int16Array,
	Uint16Array,
	Int32Array,
	Uint32Array,
	Float32Array,
	Float64Array
], xe = 1, K = 8, q = new Uint32Array(96), Se = class e {
	static from(t) {
		if (!t || t.byteLength === void 0 || t.buffer) throw Error("Data must be an instance of ArrayBuffer or SharedArrayBuffer.");
		let [n, r] = new Uint8Array(t, 0, 2);
		if (n !== 219) throw Error("Data does not appear to be in a KDBush format.");
		let i = r >> 4;
		if (i !== xe) throw Error(`Got v${i} data when expected v${xe}.`);
		let a = be[r & 15];
		if (!a) throw Error("Unrecognized array type.");
		let [o] = new Uint16Array(t, 2, 1), [s] = new Uint32Array(t, 4, 1);
		return new e(s, o, a, void 0, t);
	}
	constructor(e, t = 64, n = Float64Array, r = ArrayBuffer, i) {
		if (isNaN(e) || e < 0) throw Error(`Unexpected numItems value: ${e}.`);
		this.numItems = +e, this.nodeSize = Math.min(Math.max(+t, 2), 65535), this.ArrayType = n, this.IndexArrayType = e < 65536 ? Uint16Array : Uint32Array;
		let a = be.indexOf(this.ArrayType), o = e * 2 * this.ArrayType.BYTES_PER_ELEMENT, s = e * this.IndexArrayType.BYTES_PER_ELEMENT, c = (8 - s % 8) % 8;
		if (a < 0) throw Error(`Unexpected typed array class: ${n}.`);
		if (i) this.data = i, this.ids = new this.IndexArrayType(i, K, e), this.coords = new n(i, K + s + c, e * 2), this._pos = e * 2, this._finished = !0;
		else {
			let i = this.data = new r(K + o + s + c);
			this.ids = new this.IndexArrayType(i, K, e), this.coords = new n(i, K + s + c, e * 2), this._pos = 0, this._finished = !1, new Uint8Array(i, 0, 2).set([219, (xe << 4) + a]), new Uint16Array(i, 2, 1)[0] = t, new Uint32Array(i, 4, 1)[0] = e;
		}
	}
	add(e, t) {
		let n = this._pos >> 1;
		return this.ids[n] = n, this.coords[this._pos++] = e, this.coords[this._pos++] = t, n;
	}
	finish() {
		let e = this._pos >> 1;
		if (e !== this.numItems) throw Error(`Added ${e} items when expected ${this.numItems}.`);
		return Ce(this.ids, this.coords, this.nodeSize, 0, this.numItems - 1, 0), this._finished = !0, this;
	}
	range(e, t, n, r) {
		if (!this._finished) throw Error("Data not yet indexed - call index.finish().");
		let { ids: i, coords: a, nodeSize: o } = this;
		q[0] = 0, q[1] = i.length - 1, q[2] = 0;
		let s = 3, c = [];
		for (; s > 0;) {
			let l = q[--s], u = q[--s], d = q[--s];
			if (u - d <= o) {
				for (let o = d; o <= u; o++) {
					let s = a[2 * o], l = a[2 * o + 1];
					s >= e && s <= n && l >= t && l <= r && c.push(i[o]);
				}
				continue;
			}
			let f = d + u >> 1, p = a[2 * f], m = a[2 * f + 1];
			p >= e && p <= n && m >= t && m <= r && c.push(i[f]), (l === 0 ? e <= p : t <= m) && (q[s++] = d, q[s++] = f - 1, q[s++] = 1 - l), (l === 0 ? n >= p : r >= m) && (q[s++] = f + 1, q[s++] = u, q[s++] = 1 - l);
		}
		return c;
	}
	within(e, t, n) {
		let r = [];
		return this.withinInto(e, t, n, r), r;
	}
	withinInto(e, t, n, r) {
		if (!this._finished) throw Error("Data not yet indexed - call index.finish().");
		let { ids: i, coords: a, nodeSize: o } = this;
		q[0] = 0, q[1] = i.length - 1, q[2] = 0;
		let s = 3, c = 0, l = n * n;
		for (; s > 0;) {
			let u = q[--s], d = q[--s], f = q[--s];
			if (d - f <= o) {
				for (let n = f; n <= d; n++) Te(a[2 * n], a[2 * n + 1], e, t) <= l && (r[c++] = i[n]);
				continue;
			}
			let p = f + d >> 1, m = a[2 * p], h = a[2 * p + 1];
			Te(m, h, e, t) <= l && (r[c++] = i[p]), (u === 0 ? e - n <= m : t - n <= h) && (q[s++] = f, q[s++] = p - 1, q[s++] = 1 - u), (u === 0 ? e + n >= m : t + n >= h) && (q[s++] = p + 1, q[s++] = d, q[s++] = 1 - u);
		}
		return c;
	}
};
function Ce(e, t, n, r, i, a) {
	if (i - r <= n) return;
	let o = r + i >> 1;
	we(e, t, o, r, i, a), Ce(e, t, n, r, o - 1, 1 - a), Ce(e, t, n, o + 1, i, 1 - a);
}
function we(e, t, n, r, i, a) {
	for (; i > r;) {
		if (i - r > 600) {
			let o = i - r + 1, s = n - r + 1, c = Math.log(o), l = .5 * Math.exp(2 * c / 3), u = .5 * Math.sqrt(c * l * (o - l) / o) * (s - o / 2 < 0 ? -1 : 1);
			we(e, t, n, Math.max(r, Math.floor(n - s * l / o + u)), Math.min(i, Math.floor(n + (o - s) * l / o + u)), a);
		}
		let o = t[2 * n + a], s = r, c = i;
		for (J(e, t, r, n), t[2 * i + a] > o && J(e, t, r, i); s < c;) {
			for (J(e, t, s, c), s++, c--; t[2 * s + a] < o;) s++;
			for (; t[2 * c + a] > o;) c--;
		}
		t[2 * r + a] === o ? J(e, t, r, c) : (c++, J(e, t, c, i)), c <= n && (r = c + 1), n <= c && (i = c - 1);
	}
}
function J(e, t, n, r) {
	Y(e, n, r), Y(t, 2 * n, 2 * r), Y(t, 2 * n + 1, 2 * r + 1);
}
function Y(e, t, n) {
	let r = e[t];
	e[t] = e[n], e[n] = r;
}
function Te(e, t, n, r) {
	let i = e - n, a = t - r;
	return i * i + a * a;
}
//#endregion
//#region node_modules/supercluster/index.js
var Ee = {
	minZoom: 0,
	maxZoom: 16,
	minPoints: 2,
	radius: 40,
	extent: 512,
	nodeSize: 64,
	log: !1,
	generateId: !1,
	reduce: null,
	map: (e) => e
}, De = Math.fround || ((e) => ((t) => (e[0] = +t, e[0])))(new Float32Array(1)), X = 2, Z = 3, Oe = 4, Q = 5, ke = 6, Ae = class {
	constructor(e) {
		this.options = Object.assign(Object.create(Ee), e), this.trees = Array(this.options.maxZoom + 1), this.stride = this.options.reduce ? 7 : 6, this.clusterProps = [];
	}
	load(e) {
		let { log: t, minZoom: n, maxZoom: r } = this.options;
		t && console.time("total time");
		let i = `prepare ${e.length} points`;
		t && console.time(i), this.points = e;
		let a = [];
		for (let t = 0; t < e.length; t++) {
			let n = e[t];
			if (!n.geometry) continue;
			let [r, i] = n.geometry.coordinates, o = De(Ne(r)), s = De(Pe(i));
			a.push(o, s, Infinity, t, -1, 1), this.options.reduce && a.push(0);
		}
		let o = this.trees[r + 1] = this._createTree(a);
		t && console.timeEnd(i);
		for (let e = r; e >= n; e--) {
			let n = +Date.now();
			o = this.trees[e] = this._createTree(this._cluster(o, e)), t && console.log("z%d: %d clusters in %dms", e, o.numItems, +Date.now() - n);
		}
		return t && console.timeEnd("total time"), this;
	}
	getClusters(e, t) {
		let n = ((e[0] + 180) % 360 + 360) % 360 - 180, r = Math.max(-90, Math.min(90, e[1])), i = e[2] === 180 ? 180 : ((e[2] + 180) % 360 + 360) % 360 - 180, a = Math.max(-90, Math.min(90, e[3]));
		if (e[2] - e[0] >= 360) n = -180, i = 180;
		else if (n > i) {
			let e = this.getClusters([
				n,
				r,
				180,
				a
			], t), o = this.getClusters([
				-180,
				r,
				i,
				a
			], t);
			return e.concat(o);
		}
		let o = this.trees[this._limitZoom(t)], s = o.range(Ne(n), Pe(a), Ne(i), Pe(r)), c = o.data, l = [];
		for (let e of s) {
			let t = this.stride * e;
			l.push(c[t + Q] > 1 ? je(c, t, this.clusterProps) : this.points[c[t + Z]]);
		}
		return l;
	}
	getChildren(e) {
		let t = this._getOriginId(e), n = this._getOriginZoom(e), r = "No cluster with the specified id.", i = this.trees[n];
		if (!i) throw Error(r);
		let a = i.data;
		if (t * this.stride >= a.length) throw Error(r);
		let o = this.options.radius / (this.options.extent * 2 ** (n - 1)), s = a[t * this.stride], c = a[t * this.stride + 1], l = i.within(s, c, o), u = [];
		for (let t of l) {
			let n = t * this.stride;
			a[n + Oe] === e && u.push(a[n + Q] > 1 ? je(a, n, this.clusterProps) : this.points[a[n + Z]]);
		}
		if (u.length === 0) throw Error(r);
		return u;
	}
	getLeaves(e, t, n) {
		t ||= 10, n ||= 0;
		let r = [];
		return this._appendLeaves(r, e, t, n, 0), r;
	}
	getTile(e, t, n) {
		let r = this.trees[this._limitZoom(e)], i = 2 ** e, { extent: a, radius: o } = this.options, s = o / a, c = (n - s) / i, l = (n + 1 + s) / i, u = { features: [] };
		return this._addTileFeatures(r.range((t - s) / i, c, (t + 1 + s) / i, l), r.data, t, n, i, u), t === 0 && this._addTileFeatures(r.range(1 - s / i, c, 1, l), r.data, i, n, i, u), t === i - 1 && this._addTileFeatures(r.range(0, c, s / i, l), r.data, -1, n, i, u), u.features.length ? u : null;
	}
	getClusterExpansionZoom(e) {
		let t = this._getOriginZoom(e) - 1;
		for (; t <= this.options.maxZoom;) {
			let n = this.getChildren(e);
			if (t++, n.length !== 1) break;
			e = n[0].properties.cluster_id;
		}
		return t;
	}
	_appendLeaves(e, t, n, r, i) {
		let a = this.getChildren(t);
		for (let t of a) {
			let a = t.properties;
			if (a && a.cluster ? i + a.point_count <= r ? i += a.point_count : i = this._appendLeaves(e, a.cluster_id, n, r, i) : i < r ? i++ : e.push(t), e.length === n) break;
		}
		return i;
	}
	_createTree(e) {
		let t = new Se(e.length / this.stride | 0, this.options.nodeSize, Float32Array);
		for (let n = 0; n < e.length; n += this.stride) t.add(e[n], e[n + 1]);
		return t.finish(), t.data = e, t;
	}
	_addTileFeatures(e, t, n, r, i, a) {
		for (let o of e) {
			let e = o * this.stride, s = t[e + Q] > 1, c, l, u;
			if (s) c = Me(t, e, this.clusterProps), l = t[e], u = t[e + 1];
			else {
				let n = this.points[t[e + Z]];
				c = n.properties;
				let [r, i] = n.geometry.coordinates;
				l = Ne(r), u = Pe(i);
			}
			let d = {
				type: 1,
				geometry: [[Math.round(this.options.extent * (l * i - n)), Math.round(this.options.extent * (u * i - r))]],
				tags: c
			}, f;
			f = s || this.options.generateId ? t[e + Z] : this.points[t[e + Z]].id, f !== void 0 && (d.id = f), a.features.push(d);
		}
	}
	_limitZoom(e) {
		return Math.max(this.options.minZoom, Math.min(Math.floor(+e), this.options.maxZoom + 1));
	}
	_cluster(e, t) {
		let { radius: n, extent: r, reduce: i, minPoints: a } = this.options, o = n / (r * 2 ** t), s = e.data, c = [], l = this.stride;
		for (let n = 0; n < s.length; n += l) {
			if (s[n + X] <= t) continue;
			s[n + X] = t;
			let r = s[n], u = s[n + 1], d = e.within(s[n], s[n + 1], o), f = s[n + Q], p = f;
			for (let e of d) {
				let n = e * l;
				s[n + X] > t && (p += s[n + Q]);
			}
			if (p > f && p >= a) {
				let e = r * f, a = u * f, o, m = -1, h = ((n / l | 0) << 5) + (t + 1) + this.points.length;
				for (let r of d) {
					let c = r * l;
					if (s[c + X] <= t) continue;
					s[c + X] = t;
					let u = s[c + Q];
					e += s[c] * u, a += s[c + 1] * u, s[c + Oe] = h, i && (o || (o = this._map(s, n, !0), m = this.clusterProps.length, this.clusterProps.push(o)), i(o, this._map(s, c)));
				}
				s[n + Oe] = h, c.push(e / p, a / p, Infinity, h, -1, p), i && c.push(m);
			} else {
				for (let e = 0; e < l; e++) c.push(s[n + e]);
				if (p > 1) for (let e of d) {
					let n = e * l;
					if (!(s[n + X] <= t)) {
						s[n + X] = t;
						for (let e = 0; e < l; e++) c.push(s[n + e]);
					}
				}
			}
		}
		return c;
	}
	_getOriginId(e) {
		return e - this.points.length >> 5;
	}
	_getOriginZoom(e) {
		return (e - this.points.length) % 32;
	}
	_map(e, t, n) {
		if (e[t + Q] > 1) {
			let r = this.clusterProps[e[t + ke]];
			return n ? Object.assign({}, r) : r;
		}
		let r = this.points[e[t + Z]].properties, i = this.options.map(r);
		return n && i === r ? Object.assign({}, i) : i;
	}
};
function je(e, t, n) {
	return {
		type: "Feature",
		id: e[t + Z],
		properties: Me(e, t, n),
		geometry: {
			type: "Point",
			coordinates: [Fe(e[t]), Ie(e[t + 1])]
		}
	};
}
function Me(e, t, n) {
	let r = e[t + Q], i = r >= 1e4 ? `${Math.round(r / 1e3)}k` : r >= 1e3 ? `${Math.round(r / 100) / 10}k` : r, a = e[t + ke], o = a === -1 ? {} : Object.assign({}, n[a]);
	return Object.assign(o, {
		cluster: !0,
		cluster_id: e[t + Z],
		point_count: r,
		point_count_abbreviated: i
	});
}
function Ne(e) {
	return e / 360 + .5;
}
function Pe(e) {
	let t = Math.sin(e * Math.PI / 180), n = .5 - .25 * Math.log((1 + t) / (1 - t)) / Math.PI;
	return n < 0 ? 0 : n > 1 ? 1 : n;
}
function Fe(e) {
	return (e - .5) * 360;
}
function Ie(e) {
	let t = (180 - e * 360) * Math.PI / 180;
	return 360 * Math.atan(Math.exp(t)) / Math.PI - 90;
}
//#endregion
//#region node_modules/dequal/dist/index.mjs
var Le = Object.prototype.hasOwnProperty;
function Re(e, t, n) {
	for (n of e.keys()) if ($(n, t)) return n;
}
function $(e, t) {
	var n, r, i;
	if (e === t) return !0;
	if (e && t && (n = e.constructor) === t.constructor) {
		if (n === Date) return e.getTime() === t.getTime();
		if (n === RegExp) return e.toString() === t.toString();
		if (n === Array) {
			if ((r = e.length) === t.length) for (; r-- && $(e[r], t[r]););
			return r === -1;
		}
		if (n === Set) {
			if (e.size !== t.size) return !1;
			for (r of e) if (i = r, i && typeof i == "object" && (i = Re(t, i), !i) || !t.has(i)) return !1;
			return !0;
		}
		if (n === Map) {
			if (e.size !== t.size) return !1;
			for (r of e) if (i = r[0], i && typeof i == "object" && (i = Re(t, i), !i) || !$(r[1], t.get(i))) return !1;
			return !0;
		}
		if (n === ArrayBuffer) e = new Uint8Array(e), t = new Uint8Array(t);
		else if (n === DataView) {
			if ((r = e.byteLength) === t.byteLength) for (; r-- && e.getInt8(r) === t.getInt8(r););
			return r === -1;
		}
		if (ArrayBuffer.isView(e)) {
			if ((r = e.byteLength) === t.byteLength) for (; r-- && e[r] === t[r];);
			return r === -1;
		}
		if (!n || typeof e == "object") {
			for (n in r = 0, e) if (Le.call(e, n) && ++r && !Le.call(t, n) || !(n in t) || !$(e[n], t[n])) return !1;
			return Object.keys(t).length === r;
		}
	}
	return e !== e && t !== t;
}
//#endregion
//#region node_modules/use-deep-compare-effect/dist/use-deep-compare-effect.esm.js
function ze(e) {
	var n = t.useRef(e), r = t.useRef(0);
	return $(e, n.current) || (n.current = e, r.current += 1), t.useMemo(function() {
		return n.current;
	}, [r.current]);
}
function Be(e, n) {
	return t.useEffect(e, ze(n));
}
//#endregion
//#region node_modules/use-supercluster/dist/use-supercluster.esm.js
var Ve = function(e) {
	var t = e.points, n = e.bounds, r = e.zoom, i = e.options, a = e.disableRefresh, o = l(), s = l(), c = u([]), d = c[0], f = c[1], p = Math.round(r);
	return Be(function() {
		a !== !0 && ((!o.current || !$(s.current, t) || !$(o.current.options, i)) && (o.current = new Ae(i), o.current.load(t)), n && f(o.current.getClusters(n, p)), s.current = t);
	}, [
		t,
		n,
		p,
		i,
		a
	]), {
		clusters: d,
		supercluster: o.current
	};
}, He = ({ points: e, renderMarker: t, renderCluster: r, radius: i = 50, maxZoom: a = 16, generateId: s = !0 }) => {
	let l = M(), [d, f] = u(null), [p, m] = u(() => 0);
	o(() => {
		if (!l) return;
		let e = () => {
			let e = l.getBounds(), t = [
				e.getWest(),
				e.getSouth(),
				e.getEast(),
				e.getNorth()
			];
			f((e) => e && e[0] === t[0] && e[1] === t[1] && e[2] === t[2] && e[3] === t[3] ? e : t), m((e) => {
				let t = l.getZoom();
				return e === t ? e : t;
			});
		};
		return l.loaded() ? e() : l.once("load", e), l.on("moveend", e), l.on("zoomend", e), () => {
			l.off("load", e), l.off("moveend", e), l.off("zoomend", e);
		};
	}, [l]);
	let h = c(() => e.map((e) => ({
		type: "Feature",
		properties: {
			cluster: !1,
			...e
		},
		geometry: {
			type: "Point",
			coordinates: e.lngLat
		}
	})), [e]), g = c(() => ({
		radius: i,
		maxZoom: a,
		generateId: s
	}), [
		i,
		a,
		s
	]), { clusters: _, supercluster: v } = Ve({
		points: h,
		bounds: d ?? void 0,
		zoom: p,
		options: g
	});
	return l ? /* @__PURE__ */ (0, R.jsx)(R.Fragment, { children: _.map((e) => {
		let [i, a] = e.geometry.coordinates, { cluster: o, point_count: s, cluster_id: c } = e.properties;
		if (o) {
			let t = v, o = s ?? 0;
			return r && t ? /* @__PURE__ */ (0, R.jsx)(n.Fragment, { children: r(e, o, t) }, `cluster-${c ?? `${i},${a}`}`) : c === void 0 || !t ? null : /* @__PURE__ */ (0, R.jsx)(ye, {
				lngLat: [i, a],
				count: o,
				onClick: () => {
					l.flyTo({
						center: [i, a],
						zoom: t.getClusterExpansionZoom(c),
						speed: 1.5
					});
				}
			}, `cluster-${c}`);
		}
		let u = e.properties;
		return /* @__PURE__ */ (0, R.jsx)(n.Fragment, { children: t(u) }, u.id);
	}) }) : null;
};
//#endregion
//#region src/components/ServerClusterLayer.tsx
function Ue(e) {
	return [[e[0], e[1]], [e[2], e[3]]];
}
var We = ({ clusters: e, renderCluster: t, onClusterClick: r, fitBoundsOptions: a, flyToOptions: o }) => {
	let s = M(), c = i((e) => {
		if (s) {
			if (r?.(e), e.bounds) {
				s.fitBounds(Ue(e.bounds), {
					padding: 48,
					maxZoom: e.zoomTo,
					...a
				});
				return;
			}
			s.flyTo({
				...o,
				center: e.lngLat,
				zoom: e.zoomTo ?? Math.min(s.getZoom() + 2, 18)
			});
		}
	}, [
		a,
		o,
		s,
		r
	]);
	return s ? /* @__PURE__ */ (0, R.jsx)(R.Fragment, { children: e.map((e) => {
		let r = () => c(e);
		return t ? /* @__PURE__ */ (0, R.jsx)(n.Fragment, { children: t(e, r) }, e.id) : /* @__PURE__ */ (0, R.jsx)(ye, {
			lngLat: e.lngLat,
			count: e.count,
			color: e.color,
			size: e.size,
			ariaLabel: e.label ?? `Cluster with ${e.count} items`,
			onClick: r
		}, e.id);
	}) }) : null;
}, Ge = p.tuple([p.number().min(-180).max(180), p.number().min(-90).max(90)]), Ke = p.tuple([
	p.number().min(-180).max(180),
	p.number().min(-90).max(90),
	p.number().min(-180).max(180),
	p.number().min(-90).max(90)
]);
function qe(e, t) {
	return p.tuple([p.number().min(e[0]).max(e[1]), p.number().min(t[0]).max(t[1])]);
}
function Je(e, t) {
	return p.tuple([
		p.number().min(e[0]).max(e[1]),
		p.number().min(t[0]).max(t[1]),
		p.number().min(e[0]).max(e[1]),
		p.number().min(t[0]).max(t[1])
	]);
}
function Ye(e, t) {
	let n = 10 ** t;
	return Math.round(e * n) / n;
}
function Xe(e, t = 4) {
	return [Ye(e[0], t), Ye(e[1], t)];
}
function Ze(e, t = 6) {
	return e.map((e) => Ye(e, t)).join(",");
}
function Qe(e) {
	let t = e.split(",").map((e) => Number(e.trim()));
	return Ke.parse(t);
}
var $e = p.object({
	id: p.union([p.string(), p.number()]),
	lngLat: Ge
});
function et(e) {
	return $e.extend(e);
}
var tt = p.array(Ge).min(2, "Route must have at least 2 points"), nt = p.object({ type: p.string() }).passthrough(), rt = p.union([p.string().url("data must be a valid URL if passed as string"), nt.refine((e) => {
	if (e.type === "FeatureCollection") return !0;
	if (e.type === "Feature") {
		let t = e.geometry?.type;
		return t === "Polygon" || t === "MultiPolygon";
	}
	return !1;
}, "data must be a GeoJSON Feature(Polygon/MultiPolygon), FeatureCollection, or a valid URL string")]), it = p.union([p.string().url("data must be a valid URL if passed as string"), nt.refine((e) => {
	if (e.type === "FeatureCollection") return !0;
	if (e.type === "Feature") {
		let t = e.geometry?.type;
		return t === "LineString" || t === "MultiLineString";
	}
	return !1;
}, "data must be a GeoJSON Feature(LineString/MultiLineString), FeatureCollection, or a valid URL string")]), at = ({ id: e = "route-line", coordinates: t, data: n, color: r = "#2196F3", width: i = 4, dashArray: a, onClick: s, onMouseEnter: l, onMouseLeave: u }) => {
	let d = M(), f = `${e}-source`, p = `${e}-layer`, m = I(s), h = I(l), g = I(u);
	o(() => {
		if (typeof process < "u" && process.env.NODE_ENV !== "production") {
			if (n) {
				let e = it.safeParse(n);
				e.success || console.warn("[RouteLine] Invalid data prop:", e.error.issues);
			} else if (t) {
				let e = tt.safeParse(t);
				e.success || console.warn("[RouteLine] Invalid coordinates prop:", e.error.issues);
			}
		}
	}, [t, n]);
	let _ = c(() => t ? {
		type: "Feature",
		properties: {},
		geometry: {
			type: "LineString",
			coordinates: t
		}
	} : null, [t]);
	return o(() => {
		if (!d) return;
		let e = () => {
			if (!d.getStyle()) return;
			let e = n || _;
			if (!e) return;
			let t = d.getSource(f);
			t ? t.setData(e) : d.addSource(f, {
				type: "geojson",
				data: e
			}), d.getLayer(p) ? (d.setPaintProperty(p, "line-color", r), d.setPaintProperty(p, "line-width", i), d.setPaintProperty(p, "line-dasharray", a)) : d.addLayer({
				id: p,
				type: "line",
				source: f,
				layout: {
					"line-join": "round",
					"line-cap": "round"
				},
				paint: {
					"line-color": r,
					"line-width": i,
					...a ? { "line-dasharray": a } : {}
				}
			});
		};
		return e(), d.on("style.load", e), () => {
			d.off("style.load", e), d.getStyle() && (d.getLayer(p) && d.removeLayer(p), d.getSource(f) && d.removeSource(f));
		};
	}, [
		d,
		n,
		_,
		r,
		i,
		a,
		f,
		p
	]), o(() => {
		if (!d) return;
		let e = (e) => m(e), t = (e) => {
			(l || s) && (d.getCanvas().style.cursor = "pointer"), h(e);
		}, n = (e) => {
			d.getCanvas().style.cursor = "", g(e);
		};
		return d.on("click", p, e), d.on("mouseenter", p, t), d.on("mouseleave", p, n), () => {
			d.off("click", p, e), d.off("mouseenter", p, t), d.off("mouseleave", p, n);
		};
	}, [
		d,
		p,
		s,
		l,
		m,
		h,
		g
	]), null;
}, ot = ({ id: e, data: t, fillColor: n = "rgba(33, 150, 243, 0.4)", outlineColor: r = "#2196F3", outlineWidth: i = 2, onClick: a, onMouseEnter: s, onMouseLeave: c }) => {
	let l = M(), u = `${e}-source`, d = `${e}-fill-layer`, f = `${e}-line-layer`, p = I(a), m = I(s), h = I(c);
	return o(() => {
		if (typeof process < "u" && process.env.NODE_ENV !== "production") {
			let e = rt.safeParse(t);
			e.success || console.warn("[PolygonArea] Invalid data prop:", e.error.issues);
		}
	}, [t]), o(() => {
		if (!l) return;
		let e = () => {
			if (!l.getStyle()) return;
			let e = l.getSource(u);
			e ? e.setData(t) : l.addSource(u, {
				type: "geojson",
				data: t
			}), l.getLayer(d) ? l.setPaintProperty(d, "fill-color", n) : l.addLayer({
				id: d,
				type: "fill",
				source: u,
				paint: { "fill-color": n }
			}), l.getLayer(f) ? (l.setPaintProperty(f, "line-color", r), l.setPaintProperty(f, "line-width", i)) : l.addLayer({
				id: f,
				type: "line",
				source: u,
				paint: {
					"line-color": r,
					"line-width": i
				}
			});
		};
		return e(), l.on("style.load", e), () => {
			l.off("style.load", e), l.getStyle() && (l.getLayer(d) && l.removeLayer(d), l.getLayer(f) && l.removeLayer(f), l.getSource(u) && l.removeSource(u));
		};
	}, [
		l,
		t,
		n,
		r,
		i,
		u,
		d,
		f
	]), o(() => {
		if (!l) return;
		let e = (e) => p(e), t = (e) => {
			(s || a) && (l.getCanvas().style.cursor = "pointer"), m(e);
		}, n = (e) => {
			l.getCanvas().style.cursor = "", h(e);
		};
		return l.on("click", d, e), l.on("mouseenter", d, t), l.on("mouseleave", d, n), () => {
			l.off("click", d, e), l.off("mouseenter", d, t), l.off("mouseleave", d, n);
		};
	}, [
		l,
		d,
		s,
		a,
		p,
		m,
		h
	]), null;
}, st = 1, ct = ({ lngLat: t, children: n, offset: r, closeButton: i = !0, closeOnClick: a = !0, maxWidth: s, className: u, onClose: d }) => {
	let p = M(), m = l(null), h = I(d), g = l({
		closeButton: i,
		closeOnClick: a,
		className: u
	}), _ = c(() => typeof document > "u" ? null : document.createElement("div"), []);
	return o(() => {
		if (!p || !_) return;
		let n = new e.Popup({
			...g.current,
			offset: r,
			maxWidth: s
		}).setLngLat(t).setDOMContent(_).addTo(p), i = n.getElement(), a = () => {
			i.style.zIndex = String(++st);
		};
		a(), i.addEventListener("click", a);
		let o = () => h();
		return n.on("close", o), m.current = n, () => {
			i.removeEventListener("click", a), n.off("close", o), n.remove(), m.current = null;
		};
	}, [p, _]), o(() => {
		m.current?.setLngLat(t);
	}, [t[0], t[1]]), o(() => {
		r !== void 0 && m.current?.setOffset(r);
	}, [r]), o(() => {
		s !== void 0 && m.current?.setMaxWidth(s);
	}, [s]), _ ? f(n, _) : null;
}, lt = ({ x: e, y: t, onClose: n, children: r, style: i, className: a, disablePortal: s = !1 }) => {
	let c = l(null);
	o(() => {
		let e = (e) => {
			c.current && !c.current.contains(e.target) && n();
		}, t = (e) => {
			e.key === "Escape" && n();
		}, r = setTimeout(() => {
			window.addEventListener("click", e), window.addEventListener("contextmenu", e), window.addEventListener("keydown", t);
		}, 0);
		return () => {
			clearTimeout(r), window.removeEventListener("click", e), window.removeEventListener("contextmenu", e), window.removeEventListener("keydown", t);
		};
	}, [n]);
	let u = /* @__PURE__ */ (0, R.jsx)("div", {
		ref: c,
		className: a,
		style: {
			position: "fixed",
			top: t,
			left: e,
			zIndex: 9999,
			background: "white",
			border: "1px solid #ccc",
			boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
			borderRadius: "4px",
			padding: "4px 0",
			minWidth: "160px",
			fontFamily: "sans-serif",
			...i
		},
		children: r
	});
	return s || typeof document > "u" ? u : f(u, document.body);
};
//#endregion
export { Ke as BoundsSchema, He as ClusterLayer, ye as ClusterMarker, Ge as LngLatSchema, W as MakiMarker, lt as MapContextMenu, A as MapStore, te as MapStoreContext, H as Marker, U as PinMarker, $e as PointSchema, ot as PolygonArea, ct as Popup, _e as PriceMarker, he as PulsingMarker, tt as RouteCoordinatesSchema, at as RouteLine, ve as RoutePointMarker, We as ServerClusterLayer, ge as SimpleMarker, z as VWorldMap, et as extendPointSchema, Xe as formatLngLat, T as getVWorldMaxZoom, O as getVWorldStyle, w as getVWorldTileUrl, D as isVWorldTileError, Je as makeBoundedBoundsSchema, qe as makeBoundedLngLatSchema, Qe as parseBoundsParam, E as redactVWorldUrl, Ze as serializeBounds, I as useEvent, M as useMap, P as useMapLoaded, F as useMapSelector, N as useMapZoom };
