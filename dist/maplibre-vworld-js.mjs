import * as e from "react";
import t, { createContext as n, useCallback as r, useContext as i, useEffect as a, useLayoutEffect as o, useMemo as s, useRef as c, useState as l, useSyncExternalStore as u } from "react";
import d from "maplibre-gl";
import { createPortal as f } from "react-dom";
import { z as p } from "zod";
//#region \0rolldown/runtime.js
var m = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), h = /* @__PURE__ */ ((e) => typeof require < "u" ? require : typeof Proxy < "u" ? new Proxy(e, { get: (e, t) => (typeof require < "u" ? require : e)[t] }) : e)(function(e) {
	if (typeof require < "u") return require.apply(this, arguments);
	throw Error("Calling `require` for \"" + e + "\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.");
}), g = new Set(["Hybrid", "Satellite"]), _ = "공간정보 오픈플랫폼 브이월드", v = new Set([
	404,
	408,
	429,
	500,
	502,
	503,
	504
]), y = /(\/req\/wmts\/1\.0\.0\/)([^/?#]+)(\/)/;
function b(e, t) {
	let n = t === "Satellite" ? "jpeg" : "png", r = t === "gray" ? "white" : t;
	return `https://api.vworld.kr/req/wmts/1.0.0/${encodeURIComponent(e.trim())}/${r}/{z}/{y}/{x}.${n}`;
}
function x(e) {
	return g.has(e) ? 18 : 19;
}
function S(e) {
	if (e !== void 0) return e.replace(y, "$1***$3");
}
function C(e) {
	let t = e.error, n = t?.message?.toLowerCase() ?? "", r = e.sourceId, i = t?.url ?? "";
	return typeof r == "string" && r.startsWith("vworld") || i.includes("/req/wmts/") || n.includes("tile") || n.includes("failed to fetch") || v.has(t?.status ?? 0);
}
function w(e, t) {
	let n = {}, r = [], i = x(t);
	return t === "Hybrid" && (n["vworld-satellite"] = {
		type: "raster",
		tiles: [b(e, "Satellite")],
		tileSize: 256,
		attribution: _,
		maxzoom: i
	}, r.push({
		id: "vworld-satellite-layer",
		type: "raster",
		source: "vworld-satellite",
		minzoom: 0
	})), n[`vworld-${t}`] = {
		type: "raster",
		tiles: [b(e, t)],
		tileSize: 256,
		attribution: _,
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
var T = {
	map: null,
	loaded: !1,
	zoom: 0,
	semanticZoomThreshold: void 0
}, E = class {
	snapshot = T;
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
}, D = n(null);
function O() {
	let e = i(D);
	if (!e) throw Error("useMap / useMapZoom / useMapLoaded / useMapSelector must be used inside <VWorldMap>.");
	return e;
}
var ee = (e) => e.map, k = (e) => e.zoom, A = (e) => e.loaded;
function j() {
	let e = O();
	return u(e.subscribe, () => ee(e.getSnapshot()), () => null);
}
function M() {
	let e = O();
	return u(e.subscribe, () => k(e.getSnapshot()), () => 0);
}
function N() {
	let e = O();
	return u(e.subscribe, () => A(e.getSnapshot()), () => !1);
}
function P(e) {
	let t = O(), n = c(e);
	o(() => {
		n.current = e;
	});
	let i = c(void 0), a = r(() => {
		let e = t.getSnapshot(), r = i.current;
		if (r && r.snapshot === e) return r.value;
		let a = n.current(e);
		return r && Object.is(r.value, a) ? (i.current = {
			snapshot: e,
			value: r.value
		}, r.value) : (i.current = {
			snapshot: e,
			value: a
		}, a);
	}, [t]);
	return u(t.subscribe, a, a);
}
function F(e) {
	let t = c(e);
	return o(() => {
		t.current = e;
	}), r(((...e) => t.current?.(...e)), []);
}
//#endregion
//#region node_modules/react/cjs/react-jsx-runtime.production.js
var te = /* @__PURE__ */ m(((e) => {
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
})), I = /* @__PURE__ */ m(((e) => {
	process.env.NODE_ENV !== "production" && (function() {
		function t(e) {
			if (e == null) return null;
			if (typeof e == "function") return e.$$typeof === ee ? null : e.displayName || e.name || null;
			if (typeof e == "string") return e;
			switch (e) {
				case v: return "Fragment";
				case b: return "Profiler";
				case y: return "StrictMode";
				case w: return "Suspense";
				case T: return "SuspenseList";
				case O: return "Activity";
			}
			if (typeof e == "object") switch (typeof e.tag == "number" && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), e.$$typeof) {
				case _: return "Portal";
				case S: return e.displayName || "Context";
				case x: return (e._context.displayName || "Context") + ".Consumer";
				case C:
					var n = e.render;
					return e = e.displayName, e ||= (e = n.displayName || n.name || "", e === "" ? "ForwardRef" : "ForwardRef(" + e + ")"), e;
				case E: return n = e.displayName || null, n === null ? t(e.type) || "Memo" : n;
				case D:
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
			if (typeof e == "object" && e && e.$$typeof === D) return "<...>";
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
				N || (N = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", t));
			}
			n.isReactWarning = !0, Object.defineProperty(e, "key", {
				get: n,
				configurable: !0
			});
		}
		function l() {
			var e = t(this.type);
			return P[e] || (P[e] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release.")), e = this.props.ref, e === void 0 ? null : e;
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
			if (p !== void 0) if (o) if (j(p)) {
				for (o = 0; o < p.length; o++) f(p[o]);
				Object.freeze && Object.freeze(p);
			} else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
			else f(p);
			if (A.call(n, "key")) {
				p = t(e);
				var m = Object.keys(n).filter(function(e) {
					return e !== "key";
				});
				o = 0 < m.length ? "{key: someKey, " + m.join(": ..., ") + ": ...}" : "{key: someKey}", I[p + o] || (m = 0 < m.length ? "{" + m.join(": ..., ") + ": ...}" : "{}", console.error("A props object containing a \"key\" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />", o, p, m, p), I[p + o] = !0);
			}
			if (p = null, i !== void 0 && (r(i), p = "" + i), s(n) && (r(n.key), p = "" + n.key), "key" in n) for (var h in i = {}, n) h !== "key" && (i[h] = n[h]);
			else i = n;
			return p && c(i, typeof e == "function" ? e.displayName || e.name || "Unknown" : e), u(e, p, i, a(), l, d);
		}
		function f(e) {
			p(e) ? e._store && (e._store.validated = 1) : typeof e == "object" && e && e.$$typeof === D && (e._payload.status === "fulfilled" ? p(e._payload.value) && e._payload.value._store && (e._payload.value._store.validated = 1) : e._store && (e._store.validated = 1));
		}
		function p(e) {
			return typeof e == "object" && !!e && e.$$typeof === g;
		}
		var m = h("react"), g = Symbol.for("react.transitional.element"), _ = Symbol.for("react.portal"), v = Symbol.for("react.fragment"), y = Symbol.for("react.strict_mode"), b = Symbol.for("react.profiler"), x = Symbol.for("react.consumer"), S = Symbol.for("react.context"), C = Symbol.for("react.forward_ref"), w = Symbol.for("react.suspense"), T = Symbol.for("react.suspense_list"), E = Symbol.for("react.memo"), D = Symbol.for("react.lazy"), O = Symbol.for("react.activity"), ee = Symbol.for("react.client.reference"), k = m.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, A = Object.prototype.hasOwnProperty, j = Array.isArray, M = console.createTask ? console.createTask : function() {
			return null;
		};
		m = { react_stack_bottom_frame: function(e) {
			return e();
		} };
		var N, P = {}, F = m.react_stack_bottom_frame.bind(m, o)(), te = M(i(o)), I = {};
		e.Fragment = v, e.jsx = function(e, t, n) {
			var r = 1e4 > k.recentlyCreatedOwnerStacks++;
			return d(e, t, n, !1, r ? Error("react-stack-top-frame") : F, r ? M(i(e)) : te);
		}, e.jsxs = function(e, t, n) {
			var r = 1e4 > k.recentlyCreatedOwnerStacks++;
			return d(e, t, n, !0, r ? Error("react-stack-top-frame") : F, r ? M(i(e)) : te);
		};
	})();
})), L = (/* @__PURE__ */ m(((e, t) => {
	process.env.NODE_ENV === "production" ? t.exports = te() : t.exports = I();
})))();
function ne(e, t) {
	return e === void 0 ? null : typeof e == "function" ? e(t) : e;
}
function re(e) {
	let t = [e.error?.url, e.url];
	for (let e of t) if (typeof e == "string" && e.length > 0) return e;
}
function ie(e, t) {
	return e.center[0] === t.center[0] && e.center[1] === t.center[1] && e.zoom === t.zoom && e.pitch === t.pitch && e.bearing === t.bearing;
}
var ae = ({ apiKey: e, layerType: t = "Base", center: n, zoom: i = 12, pitch: s = 0, bearing: u = 0, minZoom: f = 6, maxZoom: p = 19, maxBounds: m, semanticZoomThreshold: h, navigation: g = !0, geolocate: _ = !0, scale: v = !0, className: y = "", style: b = {
	width: "100%",
	height: "100%"
}, children: C, onLoad: T, onClick: O, onContextMenu: ee, onMoveEnd: k, onZoomEnd: A, onIdle: j, onError: M, transformRequest: N, fallback: P, loadingSkeleton: te, animateCameraChanges: I = !0, flyToOptions: ae }) => {
	let R = c(null), [z] = l(() => new E()), [B, V] = l(null), [H, se] = l(!1), ce = c({
		center: n,
		zoom: i,
		pitch: s,
		bearing: u
	}), le = c(null), U = c({
		apiKey: e,
		layerType: t
	}), ue = F(T), de = F(O), fe = F(ee), pe = F(k), me = F(A), he = F(j), ge = c(M);
	o(() => {
		ge.current = M;
	});
	let _e = typeof e == "string" && e.trim().length > 0, ve = _e && B === null;
	a(() => {
		V(null);
	}, [e, t]), a(() => {
		z.setSemanticZoomThreshold(h);
	}, [z, h]), a(() => {
		if (!ve || !R.current) return;
		let r = Math.min(p, x(t)), a;
		try {
			a = new d.Map({
				container: R.current,
				style: w(e, t),
				center: n,
				zoom: i,
				pitch: s,
				bearing: u,
				minZoom: f,
				maxZoom: r,
				maxBounds: m,
				transformRequest: N
			});
		} catch (e) {
			V(e instanceof Error ? e : Error(String(e)));
			return;
		}
		se(!1), U.current = {
			apiKey: e,
			layerType: t
		}, z.setMap(a), z.setZoom(a.getZoom()), g && a.addControl(new d.NavigationControl({ visualizePitch: !0 }), "top-right"), _ && a.addControl(new d.GeolocateControl({
			positionOptions: { enableHighAccuracy: !0 },
			trackUserLocation: !0
		}), "top-right"), v && a.addControl(new d.ScaleControl({
			maxWidth: 150,
			unit: "metric"
		}), "bottom-right");
		let o = () => {
			z.setLoaded(!0), z.setZoom(a.getZoom()), se(!0), ue(a);
		}, c = (e) => {
			z.setZoom(a.getZoom()), me(e);
		}, l = (e) => {
			G(a), pe(e);
		}, h = (e) => {
			he(e);
		}, y = (e) => {
			de(e);
		}, b = (e) => {
			fe(e);
		}, C = (e) => {
			let t = ge.current;
			if (t) {
				t(e);
				return;
			}
			let n = re(e), r = n ? S(n) : "", i = e.error?.message ?? "unknown error";
			console.warn(`[VWorldMap] ${i}`, r);
		};
		a.on("load", o), a.on("zoomend", c), a.on("moveend", l), a.on("idle", h), a.on("click", y), a.on("contextmenu", b), a.on("error", C);
		let T = typeof ResizeObserver < "u" ? new ResizeObserver(() => a.resize()) : null;
		return T && R.current && T.observe(R.current), () => {
			T?.disconnect(), a.off("load", o), a.off("zoomend", c), a.off("moveend", l), a.off("idle", h), a.off("click", y), a.off("contextmenu", b), a.off("error", C), a.remove(), se(!1), z.setMap(null);
		};
	}, [ve]), a(() => {
		let n = z.getSnapshot().map;
		n && H && (U.current.apiKey === e && U.current.layerType === t || (n.setStyle(w(e, t)), U.current = {
			apiKey: e,
			layerType: t
		}));
	}, [
		e,
		t,
		H,
		z
	]);
	let W = c({
		animateCameraChanges: I,
		flyToOptions: ae
	});
	o(() => {
		W.current = {
			animateCameraChanges: I,
			flyToOptions: ae
		};
	});
	let G = r((e) => {
		let t = le.current;
		if (!t || e.isMoving() || e.isEasing()) return;
		let { animateCameraChanges: n, flyToOptions: r } = W.current;
		n ? e.flyTo({
			...r,
			...t
		}) : e.jumpTo(t), ce.current = t, le.current = null;
	}, []);
	a(() => {
		let e = z.getSnapshot().map;
		if (!e || !H) return;
		let t = {
			center: n,
			zoom: i,
			pitch: s,
			bearing: u
		};
		ie(ce.current, t) || (le.current = t, G(e));
	}, [
		n[0],
		n[1],
		i,
		s,
		u,
		H,
		z,
		G
	]), a(() => {
		let e = z.getSnapshot().map;
		e && (e.setMinZoom(f), e.setMaxZoom(Math.min(p, x(t))), e.setMaxBounds(m));
	}, [
		f,
		p,
		t,
		m,
		z
	]);
	let K = _e ? B ? {
		reason: "map-init-error",
		error: B
	} : null : { reason: "missing-api-key" };
	return /* @__PURE__ */ (0, L.jsx)(D.Provider, {
		value: z,
		children: K ? ne(P, K) : /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [/* @__PURE__ */ (0, L.jsx)("div", {
			ref: R,
			className: y,
			style: b,
			"data-testid": "vworld-map-container"
		}), /* @__PURE__ */ (0, L.jsx)(oe, {
			loadingSkeleton: te,
			children: C
		})] })
	});
}, oe = ({ children: e, loadingSkeleton: t }) => /* @__PURE__ */ (0, L.jsx)(L.Fragment, { children: N() ? e : t }), R = 1e3;
function z(e, t, { selected: n, highlighted: r, zIndex: i, ariaLabel: a, className: o }) {
	e.dataset.selected = n ? "true" : "false", e.dataset.highlighted = r ? "true" : "false", e.style.zIndex = i === void 0 ? "" : String(i);
	let s = n ? "1.18" : r ? "1.1" : "1";
	e.style.setProperty("--vworld-marker-scale", s), e.style.setProperty("scale", s === "1" ? "" : s), e.style.filter = n ? "drop-shadow(0 6px 14px rgba(0,0,0,0.34))" : r ? "drop-shadow(0 4px 10px rgba(0,0,0,0.26))" : "", a ? (e.setAttribute("aria-label", a), e.setAttribute("role", "button")) : (e.removeAttribute("aria-label"), e.removeAttribute("role"));
	let c = t ? t.split(/\s+/).filter(Boolean) : [], l = o ? o.split(/\s+/).filter(Boolean) : [], u = new Set(l);
	for (let t of c) u.has(t) || e.classList.remove(t);
	let d = new Set(c);
	for (let t of l) d.has(t) || e.classList.add(t);
}
var B = ({ lngLat: e, color: t = "#3FB1CE", anchor: n, offset: r, draggable: i = !1, onDragEnd: l, onClick: u, onContextMenu: p, selected: m, highlighted: h, zIndex: g, ariaLabel: _, className: v, children: y }) => {
	let b = j(), x = c(null), S = c(void 0), C = c(void 0), w = c(g), T = c(u !== void 0);
	w.current !== g && (C.current = void 0, w.current = g);
	let E = c(p !== void 0), D = y != null && y !== !1, O = F(u), ee = F(p), k = F(l);
	o(() => {
		T.current = u !== void 0, E.current = p !== void 0;
	}, [u, p]);
	let A = s(() => typeof document > "u" ? null : document.createElement("div"), []);
	return a(() => {
		if (!b) return;
		let a = D && A ? {
			element: A,
			draggable: i,
			anchor: n,
			offset: r
		} : {
			color: t,
			draggable: i,
			anchor: n,
			offset: r
		}, o = new d.Marker(a).setLngLat(e).addTo(b), s = o.getElement(), c = (e) => {
			let t = w.current ?? 0;
			R = Math.max(R, t) + 1, C.current = R, s.style.zIndex = String(C.current), T.current && (e.stopPropagation(), O(e, o));
		}, l = (e) => {
			E.current && (e.preventDefault(), e.stopPropagation(), ee(e, o));
		}, u = () => {
			let { lng: e, lat: t } = o.getLngLat();
			k([e, t]);
		};
		return s.addEventListener("click", c), s.addEventListener("contextmenu", l), i && o.on("dragend", u), x.current = o, () => {
			s.removeEventListener("click", c), s.removeEventListener("contextmenu", l), i && o.off("dragend", u), o.remove(), x.current = null;
		};
	}, [
		b,
		D,
		t,
		i,
		n,
		A
	]), a(() => {
		x.current?.setLngLat(e);
	}, [e[0], e[1]]), a(() => {
		r !== void 0 && x.current?.setOffset(r);
	}, [r]), a(() => {
		let e = x.current;
		if (!e) return;
		let t = C.current === void 0 ? g : C.current;
		z(e.getElement(), S.current, {
			selected: m,
			highlighted: h,
			zIndex: t,
			ariaLabel: _,
			className: v
		}), S.current = v;
	}, [
		m,
		h,
		g,
		_,
		v
	]), D && A ? f(y, A) : null;
}, V = ({ color: e = "#DB4437", icon: t, size: n = 40, showInnerCircle: r = !0, label: i, tooltip: a, ...o }) => {
	let s = n * 1.5;
	return /* @__PURE__ */ (0, L.jsx)(B, {
		...o,
		anchor: "bottom",
		children: /* @__PURE__ */ (0, L.jsxs)("div", {
			title: a,
			style: {
				width: n,
				height: s,
				position: "relative",
				cursor: "pointer"
			},
			children: [
				/* @__PURE__ */ (0, L.jsxs)("svg", {
					viewBox: "0 0 24 36",
					width: n,
					height: s,
					style: {
						position: "absolute",
						top: 0,
						left: 0,
						filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.3))"
					},
					children: [/* @__PURE__ */ (0, L.jsx)("path", {
						fill: e,
						d: "M12,0 C5.372583,0 0,5.372583 0,12 C0,21 12,36 12,36 C12,36 24,21 24,12 C24,5.372583 18.627417,0 12,0 Z"
					}), r && /* @__PURE__ */ (0, L.jsx)("circle", {
						cx: "12",
						cy: "12",
						r: "8",
						fill: "white"
					})]
				}),
				/* @__PURE__ */ (0, L.jsx)("div", {
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
				i && /* @__PURE__ */ (0, L.jsx)("div", {
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
}, H = "https://unpkg.com/@mapbox/maki@8.0.0/icons", se = ({ icon: e, iconBaseUrl: t = H, color: n = "#2c3e50", iconColor: r = "white", size: i = 40, ...a }) => {
	let o = s(() => `${t.replace(/\/+$/, "")}/${e}.svg`, [t, e]);
	return /* @__PURE__ */ (0, L.jsx)(V, {
		color: n,
		size: i,
		showInnerCircle: !1,
		icon: /* @__PURE__ */ (0, L.jsx)("div", { style: s(() => ({
			width: "100%",
			height: "100%",
			backgroundColor: r,
			WebkitMask: `url(${o}) no-repeat center / contain`,
			mask: `url(${o}) no-repeat center / contain`
		}), [r, o]) }),
		...a
	});
}, ce = "vworld-pulsing-marker-keyframes";
function le() {
	if (typeof document > "u" || document.getElementById(ce)) return;
	let e = document.createElement("style");
	e.id = ce, e.textContent = "\n    @keyframes vworld-pulsing-ripple {\n      0%   { transform: scale(0.3); opacity: 0.8; }\n      80%  { transform: scale(1);   opacity: 0; }\n      100% { transform: scale(1);   opacity: 0; }\n    }\n  ", document.head.appendChild(e);
}
var U = ({ color: e = "#4285F4", size: t = 14, ...n }) => (le(), /* @__PURE__ */ (0, L.jsx)(B, {
	...n,
	children: /* @__PURE__ */ (0, L.jsxs)("div", {
		style: {
			position: "relative",
			width: t,
			height: t
		},
		children: [/* @__PURE__ */ (0, L.jsx)("div", { style: {
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
		} }), /* @__PURE__ */ (0, L.jsx)("div", { style: {
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
})), ue = ({ label: e, bgColor: t = "#222", textColor: n = "white", simplifyAtZoom: i, ...a }) => P(r((e) => {
	let t = i ?? e.semanticZoomThreshold;
	return t !== void 0 && e.zoom < t;
}, [i])) ? /* @__PURE__ */ (0, L.jsx)(V, {
	lngLat: a.lngLat,
	color: t,
	size: 20,
	showInnerCircle: !1
}) : /* @__PURE__ */ (0, L.jsx)(B, {
	...a,
	children: /* @__PURE__ */ (0, L.jsx)("div", {
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
}), de = ({ title: e, description: t, category: n, photoUrl: i, link: a, linkLabel: o = "View more", simplifyAtZoom: s, ...c }) => P(r((e) => {
	let t = s ?? e.semanticZoomThreshold;
	return t !== void 0 && e.zoom < t;
}, [s])) ? /* @__PURE__ */ (0, L.jsx)(V, {
	lngLat: c.lngLat,
	color: "#333",
	size: 24,
	showInnerCircle: !1
}) : /* @__PURE__ */ (0, L.jsx)(B, {
	...c,
	anchor: "bottom",
	offset: [0, -8],
	children: /* @__PURE__ */ (0, L.jsxs)("div", {
		style: {
			position: "relative",
			background: "white",
			borderRadius: "8px",
			overflow: "visible",
			boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
			width: "200px",
			fontFamily: "sans-serif",
			cursor: "default"
		},
		children: [
			/* @__PURE__ */ (0, L.jsx)("div", { style: {
				position: "absolute",
				bottom: "-8px",
				left: "50%",
				transform: "translateX(-50%)",
				borderWidth: "8px 8px 0",
				borderStyle: "solid",
				borderColor: "white transparent transparent transparent",
				display: "block",
				width: 0
			} }),
			i && /* @__PURE__ */ (0, L.jsx)("img", {
				src: i,
				alt: e,
				style: {
					width: "100%",
					height: "100px",
					objectFit: "cover",
					display: "block"
				}
			}),
			/* @__PURE__ */ (0, L.jsxs)("div", {
				style: { padding: "12px" },
				children: [
					/* @__PURE__ */ (0, L.jsx)("div", {
						style: {
							fontSize: "10px",
							color: "#888",
							textTransform: "uppercase",
							letterSpacing: "0.5px",
							marginBottom: "4px"
						},
						children: n
					}),
					/* @__PURE__ */ (0, L.jsx)("div", {
						style: {
							fontSize: "14px",
							fontWeight: "bold",
							marginBottom: "4px",
							color: "#333"
						},
						children: e
					}),
					/* @__PURE__ */ (0, L.jsx)("div", {
						style: {
							fontSize: "12px",
							color: "#666",
							marginBottom: "8px",
							lineHeight: "1.4"
						},
						children: t
					}),
					a && /* @__PURE__ */ (0, L.jsxs)("a", {
						href: a,
						target: "_blank",
						rel: "noreferrer",
						style: {
							fontSize: "12px",
							color: "#0066cc",
							textDecoration: "none",
							fontWeight: "bold"
						},
						children: [o, " →"]
					})
				]
			})
		]
	})
}), fe = ({ price: e, currency: t = "", isHoverable: n = !0, lodThresholds: r = [13, 11], ...i }) => {
	let [a, o] = l(!1), s = P((e) => e.zoom >= r[0] ? 1 : e.zoom >= r[1] ? 2 : 3), c = (e) => typeof e == "number" ? e.toLocaleString() : e, u = Array.isArray(e);
	if (s === 3) return /* @__PURE__ */ (0, L.jsx)(B, {
		...i,
		children: /* @__PURE__ */ (0, L.jsx)("div", {
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
	let d = u && s === 2 ? e.slice(0, 2) : e;
	return /* @__PURE__ */ (0, L.jsx)(B, {
		...i,
		children: /* @__PURE__ */ (0, L.jsx)("div", {
			onMouseEnter: () => o(!0),
			onMouseLeave: () => o(!1),
			style: {
				background: a && n ? "#222" : "white",
				color: a && n ? "white" : "#222",
				border: "1px solid #ddd",
				borderRadius: u ? "12px" : "24px",
				padding: u ? "8px 12px" : "6px 12px",
				fontSize: "14px",
				fontWeight: "bold",
				boxShadow: a && n ? "0 4px 12px rgba(0,0,0,0.3)" : "0 2px 6px rgba(0,0,0,0.15)",
				cursor: n ? "pointer" : "default",
				transition: "all 0.2s ease-in-out",
				transform: a && n ? "scale(1.05)" : "scale(1)",
				display: "flex",
				flexDirection: u ? "column" : "row",
				alignItems: u ? "stretch" : "center",
				gap: u ? "4px" : "2px",
				minWidth: u ? "120px" : "auto"
			},
			children: u ? d.map((e, r) => /* @__PURE__ */ (0, L.jsxs)("div", {
				style: {
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					gap: "12px"
				},
				children: [e.label && /* @__PURE__ */ (0, L.jsx)("span", {
					style: {
						color: a && n ? "#aaa" : "#666",
						fontSize: "12px",
						fontWeight: "normal"
					},
					children: e.label
				}), /* @__PURE__ */ (0, L.jsxs)("span", { children: [e.currency === void 0 ? t : e.currency, c(e.price)] })]
			}, r)) : /* @__PURE__ */ (0, L.jsxs)(L.Fragment, { children: [/* @__PURE__ */ (0, L.jsx)("span", { children: t }), /* @__PURE__ */ (0, L.jsx)("span", { children: c(d) })] })
		})
	});
}, pe = {
	sunny: "☀️",
	cloudy: "☁️",
	rainy: "🌧️",
	snowy: "❄️"
}, me = {
	sunny: "#FFA500",
	cloudy: "#808080",
	rainy: "#4169E1",
	snowy: "#ADD8E6"
}, he = "vworld-weather-marker-fadein";
function ge() {
	if (typeof document > "u" || document.getElementById(he)) return;
	let e = document.createElement("style");
	e.id = he, e.textContent = "\n    @keyframes vworld-weather-fadeIn {\n      from { opacity: 0; transform: translateY(-10px); }\n      to { opacity: 1; transform: translateY(0); }\n    }\n  ", document.head.appendChild(e);
}
var _e = ({ temperature: e, condition: t, hourlyForecast: n, simplifyAtZoom: i, ...a }) => {
	let [o, s] = l(!1);
	if (P(r((e) => {
		let t = i ?? e.semanticZoomThreshold;
		return t !== void 0 && e.zoom < t;
	}, [i]))) return /* @__PURE__ */ (0, L.jsx)(V, {
		lngLat: a.lngLat,
		color: me[t],
		size: 24,
		showInnerCircle: !0
	});
	ge();
	let c = !!n?.length;
	return /* @__PURE__ */ (0, L.jsx)(B, {
		...a,
		children: /* @__PURE__ */ (0, L.jsxs)("div", {
			style: {
				position: "relative",
				display: "flex",
				flexDirection: "column",
				alignItems: "center"
			},
			children: [/* @__PURE__ */ (0, L.jsxs)("div", {
				onClick: (e) => {
					e.stopPropagation(), c && s((e) => !e);
				},
				style: {
					background: "white",
					border: `2px solid ${me[t]}`,
					borderRadius: "20px",
					padding: "4px 10px",
					display: "flex",
					alignItems: "center",
					gap: "6px",
					boxShadow: o ? "0 4px 8px rgba(0,0,0,0.3)" : "0 2px 4px rgba(0,0,0,0.2)",
					fontWeight: "bold",
					fontSize: "14px",
					whiteSpace: "nowrap",
					cursor: c ? "pointer" : "default",
					transition: "all 0.2s ease",
					transform: o ? "scale(1.05)" : "scale(1)",
					zIndex: o ? 10 : 1
				},
				children: [
					/* @__PURE__ */ (0, L.jsx)("span", {
						style: { fontSize: "16px" },
						children: pe[t]
					}),
					/* @__PURE__ */ (0, L.jsxs)("span", { children: [e, "°C"] }),
					c && /* @__PURE__ */ (0, L.jsx)("span", {
						style: {
							fontSize: "10px",
							color: "#999",
							marginLeft: "2px"
						},
						children: o ? "▲" : "▼"
					})
				]
			}), o && c && /* @__PURE__ */ (0, L.jsx)("div", {
				style: {
					position: "absolute",
					top: "100%",
					marginTop: "8px",
					background: "white",
					borderRadius: "12px",
					boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
					padding: "12px",
					display: "flex",
					gap: "12px",
					zIndex: 10,
					cursor: "default",
					animation: "vworld-weather-fadeIn 0.2s ease"
				},
				children: n.map((e, t) => /* @__PURE__ */ (0, L.jsxs)("div", {
					style: {
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						minWidth: "40px"
					},
					children: [
						/* @__PURE__ */ (0, L.jsx)("div", {
							style: {
								fontSize: "12px",
								color: "#666",
								marginBottom: "4px"
							},
							children: e.time
						}),
						/* @__PURE__ */ (0, L.jsx)("div", {
							style: {
								fontSize: "18px",
								marginBottom: "4px"
							},
							children: pe[e.condition]
						}),
						/* @__PURE__ */ (0, L.jsxs)("div", {
							style: {
								fontSize: "13px",
								fontWeight: "bold"
							},
							children: [e.temperature, "°"]
						})
					]
				}, t))
			})]
		})
	});
}, ve = ({ label: e, color: t = "#111", size: n = 24, ...r }) => /* @__PURE__ */ (0, L.jsx)(B, {
	...r,
	children: /* @__PURE__ */ (0, L.jsx)("div", {
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
}), W = ({ count: e, color: t, size: n, onClick: i, ...a }) => {
	let o = n ?? (e > 500 ? 50 : e > 100 ? 40 : 30), c = t ?? (e > 500 ? "#f28cb1" : e > 100 ? "#f1f075" : "#51bbd6"), l = F(i), u = s(() => i ? () => l() : void 0, [i === void 0, l]), d = r((e) => {
		e.currentTarget.style.transform = "scale(1.1)";
	}, []), f = r((e) => {
		e.currentTarget.style.transform = "scale(1)";
	}, []);
	return /* @__PURE__ */ (0, L.jsx)(B, {
		...a,
		onClick: u,
		children: /* @__PURE__ */ (0, L.jsx)("div", {
			style: {
				width: o,
				height: o,
				backgroundColor: c,
				color: e > 100 ? "#333" : "white",
				borderRadius: "50%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				fontWeight: "bold",
				fontSize: o * .4,
				boxShadow: "0 0 0 4px rgba(255,255,255,0.5), 0 2px 4px rgba(0,0,0,0.3)",
				cursor: i ? "pointer" : "default",
				transition: "transform 0.2s ease"
			},
			onMouseEnter: d,
			onMouseLeave: f,
			children: e > 999 ? "999+" : e
		})
	});
}, G = [
	Int8Array,
	Uint8Array,
	Uint8ClampedArray,
	Int16Array,
	Uint16Array,
	Int32Array,
	Uint32Array,
	Float32Array,
	Float64Array
], K = 1, q = 8, J = new Uint32Array(96), ye = class e {
	static from(t) {
		if (!t || t.byteLength === void 0 || t.buffer) throw Error("Data must be an instance of ArrayBuffer or SharedArrayBuffer.");
		let [n, r] = new Uint8Array(t, 0, 2);
		if (n !== 219) throw Error("Data does not appear to be in a KDBush format.");
		let i = r >> 4;
		if (i !== K) throw Error(`Got v${i} data when expected v${K}.`);
		let a = G[r & 15];
		if (!a) throw Error("Unrecognized array type.");
		let [o] = new Uint16Array(t, 2, 1), [s] = new Uint32Array(t, 4, 1);
		return new e(s, o, a, void 0, t);
	}
	constructor(e, t = 64, n = Float64Array, r = ArrayBuffer, i) {
		if (isNaN(e) || e < 0) throw Error(`Unexpected numItems value: ${e}.`);
		this.numItems = +e, this.nodeSize = Math.min(Math.max(+t, 2), 65535), this.ArrayType = n, this.IndexArrayType = e < 65536 ? Uint16Array : Uint32Array;
		let a = G.indexOf(this.ArrayType), o = e * 2 * this.ArrayType.BYTES_PER_ELEMENT, s = e * this.IndexArrayType.BYTES_PER_ELEMENT, c = (8 - s % 8) % 8;
		if (a < 0) throw Error(`Unexpected typed array class: ${n}.`);
		if (i) this.data = i, this.ids = new this.IndexArrayType(i, q, e), this.coords = new n(i, q + s + c, e * 2), this._pos = e * 2, this._finished = !0;
		else {
			let i = this.data = new r(q + o + s + c);
			this.ids = new this.IndexArrayType(i, q, e), this.coords = new n(i, q + s + c, e * 2), this._pos = 0, this._finished = !1, new Uint8Array(i, 0, 2).set([219, (K << 4) + a]), new Uint16Array(i, 2, 1)[0] = t, new Uint32Array(i, 4, 1)[0] = e;
		}
	}
	add(e, t) {
		let n = this._pos >> 1;
		return this.ids[n] = n, this.coords[this._pos++] = e, this.coords[this._pos++] = t, n;
	}
	finish() {
		let e = this._pos >> 1;
		if (e !== this.numItems) throw Error(`Added ${e} items when expected ${this.numItems}.`);
		return be(this.ids, this.coords, this.nodeSize, 0, this.numItems - 1, 0), this._finished = !0, this;
	}
	range(e, t, n, r) {
		if (!this._finished) throw Error("Data not yet indexed - call index.finish().");
		let { ids: i, coords: a, nodeSize: o } = this;
		J[0] = 0, J[1] = i.length - 1, J[2] = 0;
		let s = 3, c = [];
		for (; s > 0;) {
			let l = J[--s], u = J[--s], d = J[--s];
			if (u - d <= o) {
				for (let o = d; o <= u; o++) {
					let s = a[2 * o], l = a[2 * o + 1];
					s >= e && s <= n && l >= t && l <= r && c.push(i[o]);
				}
				continue;
			}
			let f = d + u >> 1, p = a[2 * f], m = a[2 * f + 1];
			p >= e && p <= n && m >= t && m <= r && c.push(i[f]), (l === 0 ? e <= p : t <= m) && (J[s++] = d, J[s++] = f - 1, J[s++] = 1 - l), (l === 0 ? n >= p : r >= m) && (J[s++] = f + 1, J[s++] = u, J[s++] = 1 - l);
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
		J[0] = 0, J[1] = i.length - 1, J[2] = 0;
		let s = 3, c = 0, l = n * n;
		for (; s > 0;) {
			let u = J[--s], d = J[--s], f = J[--s];
			if (d - f <= o) {
				for (let n = f; n <= d; n++) Ce(a[2 * n], a[2 * n + 1], e, t) <= l && (r[c++] = i[n]);
				continue;
			}
			let p = f + d >> 1, m = a[2 * p], h = a[2 * p + 1];
			Ce(m, h, e, t) <= l && (r[c++] = i[p]), (u === 0 ? e - n <= m : t - n <= h) && (J[s++] = f, J[s++] = p - 1, J[s++] = 1 - u), (u === 0 ? e + n >= m : t + n >= h) && (J[s++] = p + 1, J[s++] = d, J[s++] = 1 - u);
		}
		return c;
	}
};
function be(e, t, n, r, i, a) {
	if (i - r <= n) return;
	let o = r + i >> 1;
	xe(e, t, o, r, i, a), be(e, t, n, r, o - 1, 1 - a), be(e, t, n, o + 1, i, 1 - a);
}
function xe(e, t, n, r, i, a) {
	for (; i > r;) {
		if (i - r > 600) {
			let o = i - r + 1, s = n - r + 1, c = Math.log(o), l = .5 * Math.exp(2 * c / 3), u = .5 * Math.sqrt(c * l * (o - l) / o) * (s - o / 2 < 0 ? -1 : 1);
			xe(e, t, n, Math.max(r, Math.floor(n - s * l / o + u)), Math.min(i, Math.floor(n + (o - s) * l / o + u)), a);
		}
		let o = t[2 * n + a], s = r, c = i;
		for (Y(e, t, r, n), t[2 * i + a] > o && Y(e, t, r, i); s < c;) {
			for (Y(e, t, s, c), s++, c--; t[2 * s + a] < o;) s++;
			for (; t[2 * c + a] > o;) c--;
		}
		t[2 * r + a] === o ? Y(e, t, r, c) : (c++, Y(e, t, c, i)), c <= n && (r = c + 1), n <= c && (i = c - 1);
	}
}
function Y(e, t, n, r) {
	Se(e, n, r), Se(t, 2 * n, 2 * r), Se(t, 2 * n + 1, 2 * r + 1);
}
function Se(e, t, n) {
	let r = e[t];
	e[t] = e[n], e[n] = r;
}
function Ce(e, t, n, r) {
	let i = e - n, a = t - r;
	return i * i + a * a;
}
//#endregion
//#region node_modules/supercluster/index.js
var we = {
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
}, Te = Math.fround || ((e) => ((t) => (e[0] = +t, e[0])))(new Float32Array(1)), X = 2, Z = 3, Ee = 4, Q = 5, De = 6, Oe = class {
	constructor(e) {
		this.options = Object.assign(Object.create(we), e), this.trees = Array(this.options.maxZoom + 1), this.stride = this.options.reduce ? 7 : 6, this.clusterProps = [];
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
			let [r, i] = n.geometry.coordinates, o = Te(je(r)), s = Te(Me(i));
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
		let o = this.trees[this._limitZoom(t)], s = o.range(je(n), Me(a), je(i), Me(r)), c = o.data, l = [];
		for (let e of s) {
			let t = this.stride * e;
			l.push(c[t + Q] > 1 ? ke(c, t, this.clusterProps) : this.points[c[t + Z]]);
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
			a[n + Ee] === e && u.push(a[n + Q] > 1 ? ke(a, n, this.clusterProps) : this.points[a[n + Z]]);
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
		let t = new ye(e.length / this.stride | 0, this.options.nodeSize, Float32Array);
		for (let n = 0; n < e.length; n += this.stride) t.add(e[n], e[n + 1]);
		return t.finish(), t.data = e, t;
	}
	_addTileFeatures(e, t, n, r, i, a) {
		for (let o of e) {
			let e = o * this.stride, s = t[e + Q] > 1, c, l, u;
			if (s) c = Ae(t, e, this.clusterProps), l = t[e], u = t[e + 1];
			else {
				let n = this.points[t[e + Z]];
				c = n.properties;
				let [r, i] = n.geometry.coordinates;
				l = je(r), u = Me(i);
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
					e += s[c] * u, a += s[c + 1] * u, s[c + Ee] = h, i && (o || (o = this._map(s, n, !0), m = this.clusterProps.length, this.clusterProps.push(o)), i(o, this._map(s, c)));
				}
				s[n + Ee] = h, c.push(e / p, a / p, Infinity, h, -1, p), i && c.push(m);
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
			let r = this.clusterProps[e[t + De]];
			return n ? Object.assign({}, r) : r;
		}
		let r = this.points[e[t + Z]].properties, i = this.options.map(r);
		return n && i === r ? Object.assign({}, i) : i;
	}
};
function ke(e, t, n) {
	return {
		type: "Feature",
		id: e[t + Z],
		properties: Ae(e, t, n),
		geometry: {
			type: "Point",
			coordinates: [Ne(e[t]), Pe(e[t + 1])]
		}
	};
}
function Ae(e, t, n) {
	let r = e[t + Q], i = r >= 1e4 ? `${Math.round(r / 1e3)}k` : r >= 1e3 ? `${Math.round(r / 100) / 10}k` : r, a = e[t + De], o = a === -1 ? {} : Object.assign({}, n[a]);
	return Object.assign(o, {
		cluster: !0,
		cluster_id: e[t + Z],
		point_count: r,
		point_count_abbreviated: i
	});
}
function je(e) {
	return e / 360 + .5;
}
function Me(e) {
	let t = Math.sin(e * Math.PI / 180), n = .5 - .25 * Math.log((1 + t) / (1 - t)) / Math.PI;
	return n < 0 ? 0 : n > 1 ? 1 : n;
}
function Ne(e) {
	return (e - .5) * 360;
}
function Pe(e) {
	let t = (180 - e * 360) * Math.PI / 180;
	return 360 * Math.atan(Math.exp(t)) / Math.PI - 90;
}
//#endregion
//#region node_modules/dequal/dist/index.mjs
var Fe = Object.prototype.hasOwnProperty;
function Ie(e, t, n) {
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
			for (r of e) if (i = r, i && typeof i == "object" && (i = Ie(t, i), !i) || !t.has(i)) return !1;
			return !0;
		}
		if (n === Map) {
			if (e.size !== t.size) return !1;
			for (r of e) if (i = r[0], i && typeof i == "object" && (i = Ie(t, i), !i) || !$(r[1], t.get(i))) return !1;
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
			for (n in r = 0, e) if (Fe.call(e, n) && ++r && !Fe.call(t, n) || !(n in t) || !$(e[n], t[n])) return !1;
			return Object.keys(t).length === r;
		}
	}
	return e !== e && t !== t;
}
//#endregion
//#region node_modules/use-deep-compare-effect/dist/use-deep-compare-effect.esm.js
function Le(t) {
	var n = e.useRef(t), r = e.useRef(0);
	return $(t, n.current) || (n.current = t, r.current += 1), e.useMemo(function() {
		return n.current;
	}, [r.current]);
}
function Re(t, n) {
	return e.useEffect(t, Le(n));
}
//#endregion
//#region node_modules/use-supercluster/dist/use-supercluster.esm.js
var ze = function(e) {
	var t = e.points, n = e.bounds, r = e.zoom, i = e.options, a = e.disableRefresh, o = c(), s = c(), u = l([]), d = u[0], f = u[1], p = Math.round(r);
	return Re(function() {
		a !== !0 && ((!o.current || !$(s.current, t) || !$(o.current.options, i)) && (o.current = new Oe(i), o.current.load(t)), n && f(o.current.getClusters(n, p)), s.current = t);
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
}, Be = ({ points: e, renderMarker: n, renderCluster: r, radius: i = 50, maxZoom: o = 16, generateId: c = !0 }) => {
	let u = j(), [d, f] = l(null), [p, m] = l(() => 0);
	a(() => {
		if (!u) return;
		let e = () => {
			let e = u.getBounds(), t = [
				e.getWest(),
				e.getSouth(),
				e.getEast(),
				e.getNorth()
			];
			f((e) => e && e[0] === t[0] && e[1] === t[1] && e[2] === t[2] && e[3] === t[3] ? e : t), m((e) => {
				let t = u.getZoom();
				return e === t ? e : t;
			});
		};
		return u.loaded() ? e() : u.once("load", e), u.on("moveend", e), u.on("zoomend", e), () => {
			u.off("load", e), u.off("moveend", e), u.off("zoomend", e);
		};
	}, [u]);
	let h = s(() => e.map((e) => ({
		type: "Feature",
		properties: {
			cluster: !1,
			...e
		},
		geometry: {
			type: "Point",
			coordinates: e.lngLat
		}
	})), [e]), g = s(() => ({
		radius: i,
		maxZoom: o,
		generateId: c
	}), [
		i,
		o,
		c
	]), { clusters: _, supercluster: v } = ze({
		points: h,
		bounds: d ?? void 0,
		zoom: p,
		options: g
	});
	return u ? /* @__PURE__ */ (0, L.jsx)(L.Fragment, { children: _.map((e) => {
		let [i, a] = e.geometry.coordinates, { cluster: o, point_count: s, cluster_id: c } = e.properties;
		if (o) {
			let n = v, o = s ?? 0;
			return r && n ? /* @__PURE__ */ (0, L.jsx)(t.Fragment, { children: r(e, o, n) }, `cluster-${c ?? `${i},${a}`}`) : c === void 0 || !n ? null : /* @__PURE__ */ (0, L.jsx)(W, {
				lngLat: [i, a],
				count: o,
				onClick: () => {
					u.flyTo({
						center: [i, a],
						zoom: n.getClusterExpansionZoom(c),
						speed: 1.5
					});
				}
			}, `cluster-${c}`);
		}
		let l = e.properties;
		return /* @__PURE__ */ (0, L.jsx)(t.Fragment, { children: n(l) }, l.id);
	}) }) : null;
};
//#endregion
//#region src/components/ServerClusterLayer.tsx
function Ve(e) {
	return [[e[0], e[1]], [e[2], e[3]]];
}
var He = ({ clusters: e, renderCluster: n, onClusterClick: i, fitBoundsOptions: a, flyToOptions: o }) => {
	let s = j(), c = r((e) => {
		if (s) {
			if (i?.(e), e.bounds) {
				s.fitBounds(Ve(e.bounds), {
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
		i
	]);
	return s ? /* @__PURE__ */ (0, L.jsx)(L.Fragment, { children: e.map((e) => {
		let r = () => c(e);
		return n ? /* @__PURE__ */ (0, L.jsx)(t.Fragment, { children: n(e, r) }, e.id) : /* @__PURE__ */ (0, L.jsx)(W, {
			lngLat: e.lngLat,
			count: e.count,
			color: e.color,
			size: e.size,
			ariaLabel: e.label ?? `Cluster with ${e.count} items`,
			onClick: r
		}, e.id);
	}) }) : null;
}, Ue = p.tuple([p.number().min(-180).max(180), p.number().min(-90).max(90)]), We = p.tuple([
	p.number().min(-180).max(180),
	p.number().min(-90).max(90),
	p.number().min(-180).max(180),
	p.number().min(-90).max(90)
]);
function Ge(e, t) {
	return p.tuple([p.number().min(e[0]).max(e[1]), p.number().min(t[0]).max(t[1])]);
}
function Ke(e, t) {
	return p.tuple([
		p.number().min(e[0]).max(e[1]),
		p.number().min(t[0]).max(t[1]),
		p.number().min(e[0]).max(e[1]),
		p.number().min(t[0]).max(t[1])
	]);
}
function qe(e, t) {
	let n = 10 ** t;
	return Math.round(e * n) / n;
}
function Je(e, t = 4) {
	return [qe(e[0], t), qe(e[1], t)];
}
function Ye(e, t = 6) {
	return e.map((e) => qe(e, t)).join(",");
}
function Xe(e) {
	let t = e.split(",").map((e) => Number(e.trim()));
	return We.parse(t);
}
var Ze = p.object({
	id: p.union([p.string(), p.number()]),
	lngLat: Ue
});
function Qe(e) {
	return Ze.extend(e);
}
var $e = p.array(Ue).min(2, "Route must have at least 2 points"), et = p.object({ type: p.string() }).passthrough(), tt = p.union([p.string().url("data must be a valid URL if passed as string"), et.refine((e) => {
	if (e.type === "FeatureCollection") return !0;
	if (e.type === "Feature") {
		let t = e.geometry?.type;
		return t === "Polygon" || t === "MultiPolygon";
	}
	return !1;
}, "data must be a GeoJSON Feature(Polygon/MultiPolygon), FeatureCollection, or a valid URL string")]), nt = p.union([p.string().url("data must be a valid URL if passed as string"), et.refine((e) => {
	if (e.type === "FeatureCollection") return !0;
	if (e.type === "Feature") {
		let t = e.geometry?.type;
		return t === "LineString" || t === "MultiLineString";
	}
	return !1;
}, "data must be a GeoJSON Feature(LineString/MultiLineString), FeatureCollection, or a valid URL string")]), rt = ({ id: e = "route-line", coordinates: t, data: n, color: r = "#2196F3", width: i = 4, dashArray: o, onClick: c, onMouseEnter: l, onMouseLeave: u }) => {
	let d = j(), f = `${e}-source`, p = `${e}-layer`, m = F(c), h = F(l), g = F(u);
	a(() => {
		if (typeof process < "u" && process.env.NODE_ENV !== "production") {
			if (n) {
				let e = nt.safeParse(n);
				e.success || console.warn("[RouteLine] Invalid data prop:", e.error.issues);
			} else if (t) {
				let e = $e.safeParse(t);
				e.success || console.warn("[RouteLine] Invalid coordinates prop:", e.error.issues);
			}
		}
	}, [t, n]);
	let _ = s(() => t ? {
		type: "Feature",
		properties: {},
		geometry: {
			type: "LineString",
			coordinates: t
		}
	} : null, [t]);
	return a(() => {
		if (!d) return;
		let e = () => {
			if (!d.getStyle()) return;
			let e = n || _;
			if (!e) return;
			let t = d.getSource(f);
			t ? t.setData(e) : d.addSource(f, {
				type: "geojson",
				data: e
			}), d.getLayer(p) ? (d.setPaintProperty(p, "line-color", r), d.setPaintProperty(p, "line-width", i), d.setPaintProperty(p, "line-dasharray", o)) : d.addLayer({
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
					...o ? { "line-dasharray": o } : {}
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
		o,
		f,
		p
	]), a(() => {
		if (!d) return;
		let e = (e) => m(e), t = (e) => {
			(l || c) && (d.getCanvas().style.cursor = "pointer"), h(e);
		}, n = (e) => {
			d.getCanvas().style.cursor = "", g(e);
		};
		return d.on("click", p, e), d.on("mouseenter", p, t), d.on("mouseleave", p, n), () => {
			d.off("click", p, e), d.off("mouseenter", p, t), d.off("mouseleave", p, n);
		};
	}, [
		d,
		p,
		c,
		l,
		m,
		h,
		g
	]), null;
}, it = ({ id: e, data: t, fillColor: n = "rgba(33, 150, 243, 0.4)", outlineColor: r = "#2196F3", outlineWidth: i = 2, onClick: o, onMouseEnter: s, onMouseLeave: c }) => {
	let l = j(), u = `${e}-source`, d = `${e}-fill-layer`, f = `${e}-line-layer`, p = F(o), m = F(s), h = F(c);
	return a(() => {
		if (typeof process < "u" && process.env.NODE_ENV !== "production") {
			let e = tt.safeParse(t);
			e.success || console.warn("[PolygonArea] Invalid data prop:", e.error.issues);
		}
	}, [t]), a(() => {
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
	]), a(() => {
		if (!l) return;
		let e = (e) => p(e), t = (e) => {
			(s || o) && (l.getCanvas().style.cursor = "pointer"), m(e);
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
		o,
		p,
		m,
		h
	]), null;
}, at = 1, ot = ({ lngLat: e, children: t, offset: n, closeButton: r = !0, closeOnClick: i = !0, maxWidth: o, className: l, onClose: u }) => {
	let p = j(), m = c(null), h = F(u), g = c({
		closeButton: r,
		closeOnClick: i,
		className: l
	}), _ = s(() => typeof document > "u" ? null : document.createElement("div"), []);
	return a(() => {
		if (!p || !_) return;
		let t = new d.Popup({
			...g.current,
			offset: n,
			maxWidth: o
		}).setLngLat(e).setDOMContent(_).addTo(p), r = t.getElement(), i = () => {
			r.style.zIndex = String(++at);
		};
		i(), r.addEventListener("click", i);
		let a = () => h();
		return t.on("close", a), m.current = t, () => {
			r.removeEventListener("click", i), t.off("close", a), t.remove(), m.current = null;
		};
	}, [p, _]), a(() => {
		m.current?.setLngLat(e);
	}, [e[0], e[1]]), a(() => {
		n !== void 0 && m.current?.setOffset(n);
	}, [n]), a(() => {
		o !== void 0 && m.current?.setMaxWidth(o);
	}, [o]), _ ? f(t, _) : null;
};
//#endregion
export { We as BoundsSchema, Be as ClusterLayer, W as ClusterMarker, Ue as LngLatSchema, se as MakiMarker, E as MapStore, D as MapStoreContext, B as Marker, V as PinMarker, de as PlaceMarker, Ze as PointSchema, it as PolygonArea, ot as Popup, fe as PriceMarker, U as PulsingMarker, $e as RouteCoordinatesSchema, rt as RouteLine, ve as RoutePointMarker, He as ServerClusterLayer, ue as SimpleMarker, ae as VWorldMap, _e as WeatherMarker, Qe as extendPointSchema, Je as formatLngLat, x as getVWorldMaxZoom, w as getVWorldStyle, b as getVWorldTileUrl, C as isVWorldTileError, Ke as makeBoundedBoundsSchema, Ge as makeBoundedLngLatSchema, Xe as parseBoundsParam, S as redactVWorldUrl, Ye as serializeBounds, F as useEvent, j as useMap, N as useMapLoaded, P as useMapSelector, M as useMapZoom };
