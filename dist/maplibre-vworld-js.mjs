import * as e from "react";
import { createContext as t, useCallback as n, useContext as r, useEffect as i, useLayoutEffect as a, useMemo as o, useRef as s, useState as c, useSyncExternalStore as l } from "react";
import u from "maplibre-gl";
import { createPortal as d } from "react-dom";
import { z as f } from "zod";
//#region \0rolldown/runtime.js
var p = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), m = /* @__PURE__ */ ((e) => typeof require < "u" ? require : typeof Proxy < "u" ? new Proxy(e, { get: (e, t) => (typeof require < "u" ? require : e)[t] }) : e)(function(e) {
	if (typeof require < "u") return require.apply(this, arguments);
	throw Error("Calling `require` for \"" + e + "\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.");
}), h = new Set(["Hybrid", "Satellite"]), g = "공간정보 오픈플랫폼 브이월드";
function _(e, t) {
	let n = t === "Satellite" ? "jpeg" : "png", r = t === "gray" ? "white" : t;
	return `https://api.vworld.kr/req/wmts/1.0.0/${encodeURIComponent(e.trim())}/${r}/{z}/{y}/{x}.${n}`;
}
function v(e) {
	return h.has(e) ? 18 : 19;
}
function ee(e) {
	return e.replace(/(\/req\/wmts\/1\.0\.0\/)([^/?#]+)(\/)/, "$1***$3");
}
function y(e, t) {
	let n = {}, r = [], i = v(t);
	return t === "Hybrid" && (n["vworld-satellite"] = {
		type: "raster",
		tiles: [_(e, "Satellite")],
		tileSize: 256,
		attribution: g,
		maxzoom: i
	}, r.push({
		id: "vworld-satellite-layer",
		type: "raster",
		source: "vworld-satellite",
		minzoom: 0
	})), n[`vworld-${t}`] = {
		type: "raster",
		tiles: [_(e, t)],
		tileSize: 256,
		attribution: g,
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
var b = class {
	snapshot;
	listeners = /* @__PURE__ */ new Set();
	constructor(e = {}) {
		this.snapshot = {
			map: null,
			mapLoaded: !1,
			zoom: 12,
			semanticZoomThreshold: void 0,
			...e
		};
	}
	subscribe = (e) => (this.listeners.add(e), () => {
		this.listeners.delete(e);
	});
	getSnapshot = () => this.snapshot;
	setMap(e) {
		this.snapshot.map !== e && (this.snapshot = {
			...this.snapshot,
			map: e
		}, this.emit());
	}
	setMapLoaded(e) {
		this.snapshot.mapLoaded !== e && (this.snapshot = {
			...this.snapshot,
			mapLoaded: e
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
}, x = t(null), te = x.Provider;
function S() {
	let e = r(x);
	if (!e) throw Error("[maplibre-vworld] hook used outside <VWorldMap>. Wrap your map-dependent components in <VWorldMap>.");
	return e;
}
function C() {
	let e = S();
	return l(e.subscribe, () => e.getSnapshot().map, () => null);
}
function w() {
	let e = S();
	return l(e.subscribe, () => e.getSnapshot().zoom, () => 12);
}
function T() {
	let e = S();
	return l(e.subscribe, () => e.getSnapshot().mapLoaded, () => !1);
}
function E(e) {
	let t = S(), r = n(() => e(t.getSnapshot()), [e, t]);
	return l(t.subscribe, r, r);
}
function D(e) {
	let t = s(e);
	return a(() => {
		t.current = e;
	}), n(((...e) => t.current?.(...e)), []);
}
//#endregion
//#region node_modules/react/cjs/react-jsx-runtime.production.js
var O = /* @__PURE__ */ p(((e) => {
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
})), k = /* @__PURE__ */ p(((e) => {
	process.env.NODE_ENV !== "production" && (function() {
		function t(e) {
			if (e == null) return null;
			if (typeof e == "function") return e.$$typeof === D ? null : e.displayName || e.name || null;
			if (typeof e == "string") return e;
			switch (e) {
				case v: return "Fragment";
				case y: return "Profiler";
				case ee: return "StrictMode";
				case S: return "Suspense";
				case C: return "SuspenseList";
				case E: return "Activity";
			}
			if (typeof e == "object") switch (typeof e.tag == "number" && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), e.$$typeof) {
				case _: return "Portal";
				case x: return e.displayName || "Context";
				case b: return (e._context.displayName || "Context") + ".Consumer";
				case te:
					var n = e.render;
					return e = e.displayName, e ||= (e = n.displayName || n.name || "", e === "" ? "ForwardRef" : "ForwardRef(" + e + ")"), e;
				case w: return n = e.displayName || null, n === null ? t(e.type) || "Memo" : n;
				case T:
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
			if (typeof e == "object" && e && e.$$typeof === T) return "<...>";
			try {
				var n = t(e);
				return n ? "<" + n + ">" : "<...>";
			} catch {
				return "<...>";
			}
		}
		function a() {
			var e = O.A;
			return e === null ? null : e.getOwner();
		}
		function o() {
			return Error("react-stack-top-frame");
		}
		function s(e) {
			if (k.call(e, "key")) {
				var t = Object.getOwnPropertyDescriptor(e, "key").get;
				if (t && t.isReactWarning) return !1;
			}
			return e.key !== void 0;
		}
		function c(e, t) {
			function n() {
				M || (M = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", t));
			}
			n.isReactWarning = !0, Object.defineProperty(e, "key", {
				get: n,
				configurable: !0
			});
		}
		function l() {
			var e = t(this.type);
			return N[e] || (N[e] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release.")), e = this.props.ref, e === void 0 ? null : e;
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
			if (p !== void 0) if (o) if (A(p)) {
				for (o = 0; o < p.length; o++) f(p[o]);
				Object.freeze && Object.freeze(p);
			} else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
			else f(p);
			if (k.call(n, "key")) {
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
			p(e) ? e._store && (e._store.validated = 1) : typeof e == "object" && e && e.$$typeof === T && (e._payload.status === "fulfilled" ? p(e._payload.value) && e._payload.value._store && (e._payload.value._store.validated = 1) : e._store && (e._store.validated = 1));
		}
		function p(e) {
			return typeof e == "object" && !!e && e.$$typeof === g;
		}
		var h = m("react"), g = Symbol.for("react.transitional.element"), _ = Symbol.for("react.portal"), v = Symbol.for("react.fragment"), ee = Symbol.for("react.strict_mode"), y = Symbol.for("react.profiler"), b = Symbol.for("react.consumer"), x = Symbol.for("react.context"), te = Symbol.for("react.forward_ref"), S = Symbol.for("react.suspense"), C = Symbol.for("react.suspense_list"), w = Symbol.for("react.memo"), T = Symbol.for("react.lazy"), E = Symbol.for("react.activity"), D = Symbol.for("react.client.reference"), O = h.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, k = Object.prototype.hasOwnProperty, A = Array.isArray, j = console.createTask ? console.createTask : function() {
			return null;
		};
		h = { react_stack_bottom_frame: function(e) {
			return e();
		} };
		var M, N = {}, P = h.react_stack_bottom_frame.bind(h, o)(), F = j(i(o)), I = {};
		e.Fragment = v, e.jsx = function(e, t, n) {
			var r = 1e4 > O.recentlyCreatedOwnerStacks++;
			return d(e, t, n, !1, r ? Error("react-stack-top-frame") : P, r ? j(i(e)) : F);
		}, e.jsxs = function(e, t, n) {
			var r = 1e4 > O.recentlyCreatedOwnerStacks++;
			return d(e, t, n, !0, r ? Error("react-stack-top-frame") : P, r ? j(i(e)) : F);
		};
	})();
})), A = (/* @__PURE__ */ p(((e, t) => {
	process.env.NODE_ENV === "production" ? t.exports = O() : t.exports = k();
})))();
function j(e, t) {
	return e === void 0 ? null : typeof e == "function" ? e(t) : e;
}
function M(e) {
	let t = [
		e.error?.url,
		e.url,
		e.source?.tiles?.[0]
	];
	for (let e of t) if (typeof e == "string" && e.length > 0) return e;
}
var N = ({ apiKey: e, layerType: t = "Base", center: n = [127.024612, 37.5326], zoom: r = 12, minZoom: a = 6, maxZoom: o = 19, maxBounds: d, semanticZoomThreshold: f, showNavigationControl: p = !0, showGeolocateControl: m = !0, showScaleControl: h = !0, className: g = "", style: _ = {
	width: "100%",
	height: "100%"
}, children: x, onMapLoad: S, onMapClick: C, onMapError: w, tileErrorThreshold: T = Infinity, transformRequest: E, fallback: O, loadingSkeleton: k, animateCameraChanges: N = !0 }) => {
	let P = s(null), F = s(null), [I, L] = c(null), R = s(null);
	R.current === null && (R.current = new b({
		zoom: r,
		semanticZoomThreshold: f
	}));
	let z = R.current;
	i(() => {
		z.setSemanticZoomThreshold(f);
	}, [z, f]);
	let ne = D(C), re = D(w), ie = D(S), B = s(T);
	i(() => {
		B.current = T;
	}, [T]);
	let V = typeof e == "string" && e.trim().length > 0, H = V && I === null;
	i(() => {
		L(null);
	}, [e, t]), i(() => {
		if (!H || !P.current) return;
		let i = Math.min(o, v(t)), s;
		try {
			s = new u.Map({
				container: P.current,
				style: y(e, t),
				center: n,
				zoom: r,
				minZoom: a,
				maxZoom: i,
				maxBounds: d,
				transformRequest: E
			});
		} catch (e) {
			L(e instanceof Error ? e : Error(String(e)));
			return;
		}
		F.current = s, z.setMap(s), p && s.addControl(new u.NavigationControl({ visualizePitch: !0 }), "top-right"), m && s.addControl(new u.GeolocateControl({
			positionOptions: { enableHighAccuracy: !0 },
			trackUserLocation: !0
		}), "top-right"), h && s.addControl(new u.ScaleControl({
			maxWidth: 150,
			unit: "metric"
		}), "bottom-right");
		let c = () => {
			z.setMapLoaded(!0), z.setZoom(s.getZoom()), ie(s);
		}, l = () => {
			z.setZoom(s.getZoom());
		}, f = (e) => {
			ne(e);
		}, g = 0, _ = (e) => {
			g += 1;
			let t = B.current, n = Number.isFinite(t) && g === t, r = M(e), i = r ? ee(r) : void 0;
			if (w) re({
				event: e,
				count: g,
				thresholdReached: n,
				redactedUrl: i
			});
			else {
				let t = e.error?.message ?? "unknown error";
				n ? console.warn(`[VWorldMap] error count reached ${g}: ${t}`, i ?? "") : g === 1 && console.warn(`[VWorldMap] map error: ${t}`, i ?? "");
			}
		};
		s.on("load", c), s.on("zoomend", l), s.on("click", f), s.on("error", _);
		let b = new ResizeObserver(() => s.resize());
		return b.observe(P.current), () => {
			b.disconnect(), s.off("load", c), s.off("zoomend", l), s.off("click", f), s.off("error", _), s.remove(), F.current = null, z.setMap(null), z.setMapLoaded(!1);
		};
	}, [H]), i(() => {
		let n = F.current;
		!n || !H || n.setStyle(y(e, t));
	}, [
		e,
		t,
		H
	]);
	let U = s(n), W = s(r);
	i(() => {
		let e = F.current;
		if (!e) return;
		let t = !U.current || U.current[0] !== n[0] || U.current[1] !== n[1], i = W.current !== r;
		(t || i) && (N ? e.flyTo({
			center: n,
			zoom: r
		}) : e.jumpTo({
			center: n,
			zoom: r
		})), U.current = n, W.current = r;
	}, [
		n[0],
		n[1],
		r,
		N
	]), i(() => {
		let e = F.current;
		e && (e.setMinZoom(a), e.setMaxZoom(Math.min(o, v(t))), d !== void 0 && e.setMaxBounds(d));
	}, [
		t,
		a,
		o,
		d
	]);
	let G = V ? I ? {
		reason: "map-init-error",
		error: I
	} : null : { reason: "missing-api-key" }, ae = l(z.subscribe, () => z.getSnapshot().mapLoaded, () => !1);
	return /* @__PURE__ */ (0, A.jsx)(te, {
		value: z,
		children: G ? j(O, G) : /* @__PURE__ */ (0, A.jsxs)(A.Fragment, { children: [
			/* @__PURE__ */ (0, A.jsx)("div", {
				ref: P,
				className: g,
				style: _,
				"data-testid": "vworld-map-container"
			}),
			!ae && k,
			ae && x
		] })
	});
}, P = ({ lngLat: e, color: t = "#3FB1CE", draggable: n = !1, onDragEnd: r, children: a }) => {
	let c = C(), l = s(null), f = o(() => document.createElement("div"), []);
	return i(() => {
		if (!c) return;
		let i = {
			color: t,
			draggable: n
		};
		a && (i = {
			element: f,
			draggable: n
		});
		let o = new u.Marker(i).setLngLat(e).addTo(c);
		return n && r && o.on("dragend", () => {
			let e = o.getLngLat();
			r([e.lng, e.lat]);
		}), l.current = o, () => {
			o.remove();
		};
	}, [c, a ? f : null]), i(() => {
		l.current && l.current.setLngLat(e);
	}, [e]), a ? d(a, f) : null;
}, F = ({ color: e = "#DB4437", icon: t, size: n = 40, showInnerCircle: r = !0, label: i, tooltip: a, ...o }) => /* @__PURE__ */ (0, A.jsx)(P, {
	...o,
	children: /* @__PURE__ */ (0, A.jsxs)("div", {
		title: a,
		style: {
			width: n,
			height: n,
			position: "relative",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			cursor: "pointer",
			transform: "translate(-50%, -100%)",
			marginTop: n / 2
		},
		children: [
			/* @__PURE__ */ (0, A.jsxs)("svg", {
				viewBox: "0 0 24 36",
				width: n,
				height: n * 1.5,
				style: {
					position: "absolute",
					top: 0,
					left: 0,
					filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.3))"
				},
				children: [/* @__PURE__ */ (0, A.jsx)("path", {
					fill: e,
					d: "M12,0 C5.372583,0 0,5.372583 0,12 C0,21 12,36 12,36 C12,36 24,21 24,12 C24,5.372583 18.627417,0 12,0 Z"
				}), r && /* @__PURE__ */ (0, A.jsx)("circle", {
					cx: "12",
					cy: "12",
					r: "8",
					fill: "white"
				})]
			}),
			/* @__PURE__ */ (0, A.jsx)("div", {
				style: {
					position: "absolute",
					top: n * 1.5 * (12 / 36),
					left: "50%",
					transform: "translate(-50%, -50%)",
					width: n * .55,
					height: n * .55,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					zIndex: 1
				},
				children: t
			}),
			i && /* @__PURE__ */ (0, A.jsx)("div", {
				style: {
					position: "absolute",
					top: n * 1.5 + 4,
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
}), I = {
	sunny: "☀️",
	cloudy: "☁️",
	rainy: "🌧️",
	snowy: "❄️"
}, L = {
	sunny: "#FFA500",
	cloudy: "#808080",
	rainy: "#4169E1",
	snowy: "#ADD8E6"
}, R = ({ temperature: e, condition: t, hourlyForecast: r, simplifyAtZoom: i, ...a }) => {
	let [o, s] = c(!1);
	return E(n((e) => {
		let t = i ?? e.semanticZoomThreshold;
		return t !== void 0 && e.zoom < t;
	}, [i])) ? /* @__PURE__ */ (0, A.jsx)(F, {
		lngLat: a.lngLat,
		color: L[t],
		size: 24,
		showInnerCircle: !0
	}) : /* @__PURE__ */ (0, A.jsx)(P, {
		...a,
		children: /* @__PURE__ */ (0, A.jsxs)("div", {
			style: {
				position: "relative",
				display: "flex",
				flexDirection: "column",
				alignItems: "center"
			},
			children: [/* @__PURE__ */ (0, A.jsxs)("div", {
				onClick: (e) => {
					e.stopPropagation(), r && r.length > 0 && s(!o);
				},
				style: {
					background: "white",
					border: `2px solid ${L[t]}`,
					borderRadius: "20px",
					padding: "4px 10px",
					display: "flex",
					alignItems: "center",
					gap: "6px",
					boxShadow: o ? "0 4px 8px rgba(0,0,0,0.3)" : "0 2px 4px rgba(0,0,0,0.2)",
					fontWeight: "bold",
					fontSize: "14px",
					whiteSpace: "nowrap",
					cursor: r && r.length > 0 ? "pointer" : "default",
					transition: "all 0.2s ease",
					transform: o ? "scale(1.05)" : "scale(1)",
					zIndex: o ? 10 : 1
				},
				children: [
					/* @__PURE__ */ (0, A.jsx)("span", {
						style: { fontSize: "16px" },
						children: I[t]
					}),
					/* @__PURE__ */ (0, A.jsxs)("span", { children: [e, "°C"] }),
					r && r.length > 0 && /* @__PURE__ */ (0, A.jsx)("span", {
						style: {
							fontSize: "10px",
							color: "#999",
							marginLeft: "2px"
						},
						children: o ? "▲" : "▼"
					})
				]
			}), o && r && r.length > 0 && /* @__PURE__ */ (0, A.jsxs)("div", {
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
					animation: "fadeIn 0.2s ease"
				},
				children: [/* @__PURE__ */ (0, A.jsx)("style", { children: "\n              @keyframes fadeIn {\n                from { opacity: 0; transform: translateY(-10px); }\n                to { opacity: 1; transform: translateY(0); }\n              }\n            " }), r.map((e, t) => /* @__PURE__ */ (0, A.jsxs)("div", {
					style: {
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						minWidth: "40px"
					},
					children: [
						/* @__PURE__ */ (0, A.jsx)("div", {
							style: {
								fontSize: "12px",
								color: "#666",
								marginBottom: "4px"
							},
							children: e.time
						}),
						/* @__PURE__ */ (0, A.jsx)("div", {
							style: {
								fontSize: "18px",
								marginBottom: "4px"
							},
							children: I[e.condition]
						}),
						/* @__PURE__ */ (0, A.jsxs)("div", {
							style: {
								fontSize: "13px",
								fontWeight: "bold"
							},
							children: [e.temperature, "°"]
						})
					]
				}, t))]
			})]
		})
	});
}, z = ({ title: e, description: t, category: r, photoUrl: i, link: a, simplifyAtZoom: o, ...s }) => E(n((e) => {
	let t = o ?? e.semanticZoomThreshold;
	return t !== void 0 && e.zoom < t;
}, [o])) ? /* @__PURE__ */ (0, A.jsx)(F, {
	lngLat: s.lngLat,
	color: "#333",
	size: 24,
	showInnerCircle: !1
}) : /* @__PURE__ */ (0, A.jsx)(P, {
	...s,
	children: /* @__PURE__ */ (0, A.jsxs)("div", {
		style: {
			background: "white",
			borderRadius: "8px",
			overflow: "hidden",
			boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
			width: "200px",
			fontFamily: "sans-serif",
			cursor: "default",
			transform: "translate(-50%, -100%)",
			marginTop: "-10px"
		},
		children: [
			/* @__PURE__ */ (0, A.jsx)("div", { style: {
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
			i && /* @__PURE__ */ (0, A.jsx)("img", {
				src: i,
				alt: e,
				style: {
					width: "100%",
					height: "100px",
					objectFit: "cover",
					display: "block"
				}
			}),
			/* @__PURE__ */ (0, A.jsxs)("div", {
				style: { padding: "12px" },
				children: [
					/* @__PURE__ */ (0, A.jsx)("div", {
						style: {
							fontSize: "10px",
							color: "#888",
							textTransform: "uppercase",
							letterSpacing: "0.5px",
							marginBottom: "4px"
						},
						children: r
					}),
					/* @__PURE__ */ (0, A.jsx)("div", {
						style: {
							fontSize: "14px",
							fontWeight: "bold",
							marginBottom: "4px",
							color: "#333"
						},
						children: e
					}),
					/* @__PURE__ */ (0, A.jsx)("div", {
						style: {
							fontSize: "12px",
							color: "#666",
							marginBottom: "8px",
							lineHeight: "1.4"
						},
						children: t
					}),
					a && /* @__PURE__ */ (0, A.jsx)("a", {
						href: a,
						target: "_blank",
						rel: "noreferrer",
						style: {
							fontSize: "12px",
							color: "#0066cc",
							textDecoration: "none",
							fontWeight: "bold"
						},
						children: "더 보기 →"
					})
				]
			})
		]
	})
}), ne = ({ label: e, bgColor: t = "#222", textColor: r = "white", simplifyAtZoom: i, ...a }) => E(n((e) => {
	let t = i ?? e.semanticZoomThreshold;
	return t !== void 0 && e.zoom < t;
}, [i])) ? /* @__PURE__ */ (0, A.jsx)(F, {
	lngLat: a.lngLat,
	color: t,
	size: 20,
	showInnerCircle: !1
}) : /* @__PURE__ */ (0, A.jsx)(P, {
	...a,
	children: /* @__PURE__ */ (0, A.jsx)("div", {
		style: {
			background: t,
			color: r,
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
}), re = ({ price: e, currency: t = "₩", isHoverable: n = !0, ...r }) => {
	let [i, a] = c(!1), o = (e) => typeof e == "number" ? e.toLocaleString() : e;
	return /* @__PURE__ */ (0, A.jsx)(P, {
		...r,
		children: /* @__PURE__ */ (0, A.jsxs)("div", {
			onMouseEnter: () => a(!0),
			onMouseLeave: () => a(!1),
			style: {
				background: i && n ? "#222" : "white",
				color: i && n ? "white" : "#222",
				border: "1px solid #ddd",
				borderRadius: "24px",
				padding: "6px 12px",
				fontSize: "14px",
				fontWeight: "bold",
				boxShadow: i && n ? "0 4px 12px rgba(0,0,0,0.3)" : "0 2px 6px rgba(0,0,0,0.15)",
				cursor: n ? "pointer" : "default",
				transition: "all 0.2s ease-in-out",
				transform: i && n ? "scale(1.05)" : "scale(1)",
				display: "flex",
				alignItems: "center",
				gap: "2px"
			},
			children: [/* @__PURE__ */ (0, A.jsx)("span", { children: t }), /* @__PURE__ */ (0, A.jsx)("span", { children: o(e) })]
		})
	});
}, ie = ({ color: e = "#4285F4", size: t = 14, ...n }) => /* @__PURE__ */ (0, A.jsx)(P, {
	...n,
	children: /* @__PURE__ */ (0, A.jsxs)("div", {
		style: {
			position: "relative",
			width: t,
			height: t
		},
		children: [
			/* @__PURE__ */ (0, A.jsx)("div", { style: {
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
			} }),
			/* @__PURE__ */ (0, A.jsx)("div", { style: {
				position: "absolute",
				top: "-100%",
				left: "-100%",
				width: "300%",
				height: "300%",
				backgroundColor: e,
				borderRadius: "50%",
				zIndex: 1,
				animation: "pulsing-ripple 2s infinite ease-out"
			} }),
			/* @__PURE__ */ (0, A.jsx)("style", { children: "\n          @keyframes pulsing-ripple {\n            0% {\n              transform: scale(0.3);\n              opacity: 0.8;\n            }\n            80% {\n              transform: scale(1);\n              opacity: 0;\n            }\n            100% {\n              transform: scale(1);\n              opacity: 0;\n            }\n          }\n        " })
		]
	})
}), B = ({ iconName: e, color: t = "#2c3e50", iconColor: n = "white", size: r = 40, ...i }) => {
	let a = `https://unpkg.com/@mapbox/maki@8.0.0/icons/${e}.svg`;
	return /* @__PURE__ */ (0, A.jsx)(F, {
		color: t,
		size: r,
		showInnerCircle: !1,
		icon: /* @__PURE__ */ (0, A.jsx)("div", { style: {
			width: "100%",
			height: "100%",
			backgroundColor: n,
			WebkitMask: `url(${a}) no-repeat center / contain`,
			mask: `url(${a}) no-repeat center / contain`
		} }),
		...i
	});
}, V = ({ count: e, color: t, size: n, onClick: r, ...i }) => {
	let a = n || 30, o = t || "#51bbd6";
	return e > 100 && (a = n || 40, o = t || "#f1f075"), e > 500 && (a = n || 50, o = t || "#f28cb1"), /* @__PURE__ */ (0, A.jsx)(P, {
		...i,
		children: /* @__PURE__ */ (0, A.jsx)("div", {
			onClick: r,
			style: {
				width: a,
				height: a,
				backgroundColor: o,
				color: e > 100 ? "#333" : "white",
				borderRadius: "50%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				fontWeight: "bold",
				fontSize: a * .4,
				boxShadow: "0 0 0 4px rgba(255,255,255,0.5), 0 2px 4px rgba(0,0,0,0.3)",
				cursor: r ? "pointer" : "default",
				transition: "transform 0.2s ease"
			},
			onMouseEnter: (e) => e.currentTarget.style.transform = "scale(1.1)",
			onMouseLeave: (e) => e.currentTarget.style.transform = "scale(1)",
			children: e > 999 ? "999+" : e
		})
	});
}, H = [
	Int8Array,
	Uint8Array,
	Uint8ClampedArray,
	Int16Array,
	Uint16Array,
	Int32Array,
	Uint32Array,
	Float32Array,
	Float64Array
], U = 1, W = 8, G = new Uint32Array(96), ae = class e {
	static from(t) {
		if (!t || t.byteLength === void 0 || t.buffer) throw Error("Data must be an instance of ArrayBuffer or SharedArrayBuffer.");
		let [n, r] = new Uint8Array(t, 0, 2);
		if (n !== 219) throw Error("Data does not appear to be in a KDBush format.");
		let i = r >> 4;
		if (i !== U) throw Error(`Got v${i} data when expected v${U}.`);
		let a = H[r & 15];
		if (!a) throw Error("Unrecognized array type.");
		let [o] = new Uint16Array(t, 2, 1), [s] = new Uint32Array(t, 4, 1);
		return new e(s, o, a, void 0, t);
	}
	constructor(e, t = 64, n = Float64Array, r = ArrayBuffer, i) {
		if (isNaN(e) || e < 0) throw Error(`Unexpected numItems value: ${e}.`);
		this.numItems = +e, this.nodeSize = Math.min(Math.max(+t, 2), 65535), this.ArrayType = n, this.IndexArrayType = e < 65536 ? Uint16Array : Uint32Array;
		let a = H.indexOf(this.ArrayType), o = e * 2 * this.ArrayType.BYTES_PER_ELEMENT, s = e * this.IndexArrayType.BYTES_PER_ELEMENT, c = (8 - s % 8) % 8;
		if (a < 0) throw Error(`Unexpected typed array class: ${n}.`);
		if (i) this.data = i, this.ids = new this.IndexArrayType(i, W, e), this.coords = new n(i, W + s + c, e * 2), this._pos = e * 2, this._finished = !0;
		else {
			let i = this.data = new r(W + o + s + c);
			this.ids = new this.IndexArrayType(i, W, e), this.coords = new n(i, W + s + c, e * 2), this._pos = 0, this._finished = !1, new Uint8Array(i, 0, 2).set([219, (U << 4) + a]), new Uint16Array(i, 2, 1)[0] = t, new Uint32Array(i, 4, 1)[0] = e;
		}
	}
	add(e, t) {
		let n = this._pos >> 1;
		return this.ids[n] = n, this.coords[this._pos++] = e, this.coords[this._pos++] = t, n;
	}
	finish() {
		let e = this._pos >> 1;
		if (e !== this.numItems) throw Error(`Added ${e} items when expected ${this.numItems}.`);
		return oe(this.ids, this.coords, this.nodeSize, 0, this.numItems - 1, 0), this._finished = !0, this;
	}
	range(e, t, n, r) {
		if (!this._finished) throw Error("Data not yet indexed - call index.finish().");
		let { ids: i, coords: a, nodeSize: o } = this;
		G[0] = 0, G[1] = i.length - 1, G[2] = 0;
		let s = 3, c = [];
		for (; s > 0;) {
			let l = G[--s], u = G[--s], d = G[--s];
			if (u - d <= o) {
				for (let o = d; o <= u; o++) {
					let s = a[2 * o], l = a[2 * o + 1];
					s >= e && s <= n && l >= t && l <= r && c.push(i[o]);
				}
				continue;
			}
			let f = d + u >> 1, p = a[2 * f], m = a[2 * f + 1];
			p >= e && p <= n && m >= t && m <= r && c.push(i[f]), (l === 0 ? e <= p : t <= m) && (G[s++] = d, G[s++] = f - 1, G[s++] = 1 - l), (l === 0 ? n >= p : r >= m) && (G[s++] = f + 1, G[s++] = u, G[s++] = 1 - l);
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
		G[0] = 0, G[1] = i.length - 1, G[2] = 0;
		let s = 3, c = 0, l = n * n;
		for (; s > 0;) {
			let u = G[--s], d = G[--s], f = G[--s];
			if (d - f <= o) {
				for (let n = f; n <= d; n++) le(a[2 * n], a[2 * n + 1], e, t) <= l && (r[c++] = i[n]);
				continue;
			}
			let p = f + d >> 1, m = a[2 * p], h = a[2 * p + 1];
			le(m, h, e, t) <= l && (r[c++] = i[p]), (u === 0 ? e - n <= m : t - n <= h) && (G[s++] = f, G[s++] = p - 1, G[s++] = 1 - u), (u === 0 ? e + n >= m : t + n >= h) && (G[s++] = p + 1, G[s++] = d, G[s++] = 1 - u);
		}
		return c;
	}
};
function oe(e, t, n, r, i, a) {
	if (i - r <= n) return;
	let o = r + i >> 1;
	se(e, t, o, r, i, a), oe(e, t, n, r, o - 1, 1 - a), oe(e, t, n, o + 1, i, 1 - a);
}
function se(e, t, n, r, i, a) {
	for (; i > r;) {
		if (i - r > 600) {
			let o = i - r + 1, s = n - r + 1, c = Math.log(o), l = .5 * Math.exp(2 * c / 3), u = .5 * Math.sqrt(c * l * (o - l) / o) * (s - o / 2 < 0 ? -1 : 1);
			se(e, t, n, Math.max(r, Math.floor(n - s * l / o + u)), Math.min(i, Math.floor(n + (o - s) * l / o + u)), a);
		}
		let o = t[2 * n + a], s = r, c = i;
		for (K(e, t, r, n), t[2 * i + a] > o && K(e, t, r, i); s < c;) {
			for (K(e, t, s, c), s++, c--; t[2 * s + a] < o;) s++;
			for (; t[2 * c + a] > o;) c--;
		}
		t[2 * r + a] === o ? K(e, t, r, c) : (c++, K(e, t, c, i)), c <= n && (r = c + 1), n <= c && (i = c - 1);
	}
}
function K(e, t, n, r) {
	ce(e, n, r), ce(t, 2 * n, 2 * r), ce(t, 2 * n + 1, 2 * r + 1);
}
function ce(e, t, n) {
	let r = e[t];
	e[t] = e[n], e[n] = r;
}
function le(e, t, n, r) {
	let i = e - n, a = t - r;
	return i * i + a * a;
}
//#endregion
//#region node_modules/supercluster/index.js
var ue = {
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
}, de = Math.fround || ((e) => ((t) => (e[0] = +t, e[0])))(new Float32Array(1)), q = 2, J = 3, fe = 4, Y = 5, pe = 6, me = class {
	constructor(e) {
		this.options = Object.assign(Object.create(ue), e), this.trees = Array(this.options.maxZoom + 1), this.stride = this.options.reduce ? 7 : 6, this.clusterProps = [];
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
			let [r, i] = n.geometry.coordinates, o = de(X(r)), s = de(Z(i));
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
		let o = this.trees[this._limitZoom(t)], s = o.range(X(n), Z(a), X(i), Z(r)), c = o.data, l = [];
		for (let e of s) {
			let t = this.stride * e;
			l.push(c[t + Y] > 1 ? he(c, t, this.clusterProps) : this.points[c[t + J]]);
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
			a[n + fe] === e && u.push(a[n + Y] > 1 ? he(a, n, this.clusterProps) : this.points[a[n + J]]);
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
		let t = new ae(e.length / this.stride | 0, this.options.nodeSize, Float32Array);
		for (let n = 0; n < e.length; n += this.stride) t.add(e[n], e[n + 1]);
		return t.finish(), t.data = e, t;
	}
	_addTileFeatures(e, t, n, r, i, a) {
		for (let o of e) {
			let e = o * this.stride, s = t[e + Y] > 1, c, l, u;
			if (s) c = ge(t, e, this.clusterProps), l = t[e], u = t[e + 1];
			else {
				let n = this.points[t[e + J]];
				c = n.properties;
				let [r, i] = n.geometry.coordinates;
				l = X(r), u = Z(i);
			}
			let d = {
				type: 1,
				geometry: [[Math.round(this.options.extent * (l * i - n)), Math.round(this.options.extent * (u * i - r))]],
				tags: c
			}, f;
			f = s || this.options.generateId ? t[e + J] : this.points[t[e + J]].id, f !== void 0 && (d.id = f), a.features.push(d);
		}
	}
	_limitZoom(e) {
		return Math.max(this.options.minZoom, Math.min(Math.floor(+e), this.options.maxZoom + 1));
	}
	_cluster(e, t) {
		let { radius: n, extent: r, reduce: i, minPoints: a } = this.options, o = n / (r * 2 ** t), s = e.data, c = [], l = this.stride;
		for (let n = 0; n < s.length; n += l) {
			if (s[n + q] <= t) continue;
			s[n + q] = t;
			let r = s[n], u = s[n + 1], d = e.within(s[n], s[n + 1], o), f = s[n + Y], p = f;
			for (let e of d) {
				let n = e * l;
				s[n + q] > t && (p += s[n + Y]);
			}
			if (p > f && p >= a) {
				let e = r * f, a = u * f, o, m = -1, h = ((n / l | 0) << 5) + (t + 1) + this.points.length;
				for (let r of d) {
					let c = r * l;
					if (s[c + q] <= t) continue;
					s[c + q] = t;
					let u = s[c + Y];
					e += s[c] * u, a += s[c + 1] * u, s[c + fe] = h, i && (o || (o = this._map(s, n, !0), m = this.clusterProps.length, this.clusterProps.push(o)), i(o, this._map(s, c)));
				}
				s[n + fe] = h, c.push(e / p, a / p, Infinity, h, -1, p), i && c.push(m);
			} else {
				for (let e = 0; e < l; e++) c.push(s[n + e]);
				if (p > 1) for (let e of d) {
					let n = e * l;
					if (!(s[n + q] <= t)) {
						s[n + q] = t;
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
		if (e[t + Y] > 1) {
			let r = this.clusterProps[e[t + pe]];
			return n ? Object.assign({}, r) : r;
		}
		let r = this.points[e[t + J]].properties, i = this.options.map(r);
		return n && i === r ? Object.assign({}, i) : i;
	}
};
function he(e, t, n) {
	return {
		type: "Feature",
		id: e[t + J],
		properties: ge(e, t, n),
		geometry: {
			type: "Point",
			coordinates: [_e(e[t]), ve(e[t + 1])]
		}
	};
}
function ge(e, t, n) {
	let r = e[t + Y], i = r >= 1e4 ? `${Math.round(r / 1e3)}k` : r >= 1e3 ? `${Math.round(r / 100) / 10}k` : r, a = e[t + pe], o = a === -1 ? {} : Object.assign({}, n[a]);
	return Object.assign(o, {
		cluster: !0,
		cluster_id: e[t + J],
		point_count: r,
		point_count_abbreviated: i
	});
}
function X(e) {
	return e / 360 + .5;
}
function Z(e) {
	let t = Math.sin(e * Math.PI / 180), n = .5 - .25 * Math.log((1 + t) / (1 - t)) / Math.PI;
	return n < 0 ? 0 : n > 1 ? 1 : n;
}
function _e(e) {
	return (e - .5) * 360;
}
function ve(e) {
	let t = (180 - e * 360) * Math.PI / 180;
	return 360 * Math.atan(Math.exp(t)) / Math.PI - 90;
}
//#endregion
//#region node_modules/dequal/dist/index.mjs
var ye = Object.prototype.hasOwnProperty;
function be(e, t, n) {
	for (n of e.keys()) if (Q(n, t)) return n;
}
function Q(e, t) {
	var n, r, i;
	if (e === t) return !0;
	if (e && t && (n = e.constructor) === t.constructor) {
		if (n === Date) return e.getTime() === t.getTime();
		if (n === RegExp) return e.toString() === t.toString();
		if (n === Array) {
			if ((r = e.length) === t.length) for (; r-- && Q(e[r], t[r]););
			return r === -1;
		}
		if (n === Set) {
			if (e.size !== t.size) return !1;
			for (r of e) if (i = r, i && typeof i == "object" && (i = be(t, i), !i) || !t.has(i)) return !1;
			return !0;
		}
		if (n === Map) {
			if (e.size !== t.size) return !1;
			for (r of e) if (i = r[0], i && typeof i == "object" && (i = be(t, i), !i) || !Q(r[1], t.get(i))) return !1;
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
			for (n in r = 0, e) if (ye.call(e, n) && ++r && !ye.call(t, n) || !(n in t) || !Q(e[n], t[n])) return !1;
			return Object.keys(t).length === r;
		}
	}
	return e !== e && t !== t;
}
//#endregion
//#region node_modules/use-deep-compare-effect/dist/use-deep-compare-effect.esm.js
function xe(t) {
	var n = e.useRef(t), r = e.useRef(0);
	return Q(t, n.current) || (n.current = t, r.current += 1), e.useMemo(function() {
		return n.current;
	}, [r.current]);
}
function Se(t, n) {
	return e.useEffect(t, xe(n));
}
//#endregion
//#region node_modules/use-supercluster/dist/use-supercluster.esm.js
var Ce = function(e) {
	var t = e.points, n = e.bounds, r = e.zoom, i = e.options, a = e.disableRefresh, o = s(), l = s(), u = c([]), d = u[0], f = u[1], p = Math.round(r);
	return Se(function() {
		a !== !0 && ((!o.current || !Q(l.current, t) || !Q(o.current.options, i)) && (o.current = new me(i), o.current.load(t)), n && f(o.current.getClusters(n, p)), l.current = t);
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
}, we = ({ points: e, renderMarker: t, renderCluster: n, radius: r = 50, maxZoom: a = 16 }) => {
	let s = C(), [l, u] = c(null), [d, f] = c(12);
	i(() => {
		if (!s) return;
		let e = () => {
			let e = s.getBounds();
			u([
				e.getWest(),
				e.getSouth(),
				e.getEast(),
				e.getNorth()
			]), f(s.getZoom());
		};
		return e(), s.on("moveend", e), s.on("zoomend", e), () => {
			s.off("moveend", e), s.off("zoomend", e);
		};
	}, [s]);
	let { clusters: p, supercluster: m } = Ce({
		points: o(() => e.map((e) => ({
			type: "Feature",
			properties: {
				cluster: !1,
				...e
			},
			geometry: {
				type: "Point",
				coordinates: e.lngLat
			}
		})), [e]),
		bounds: l || void 0,
		zoom: d,
		options: {
			radius: r,
			maxZoom: a
		}
	});
	return s ? /* @__PURE__ */ (0, A.jsx)(A.Fragment, { children: p.map((e) => {
		let [r, i] = e.geometry.coordinates, { cluster: a, point_count: o } = e.properties;
		if (a) {
			if (n && m) return n(e, o || 0, m);
			let t = e.properties.cluster_id;
			return t === void 0 || !m ? null : /* @__PURE__ */ (0, A.jsx)(V, {
				lngLat: [r, i],
				count: o || 0,
				onClick: () => {
					let e = m.getClusterExpansionZoom(t);
					s.flyTo({
						center: [r, i],
						zoom: e,
						speed: 1.5
					});
				}
			}, `cluster-${t}`);
		}
		return t(e.properties);
	}) }) : null;
}, Te = ({ label: e, color: t = "#111", size: n = 24, ...r }) => /* @__PURE__ */ (0, A.jsx)(P, {
	...r,
	children: /* @__PURE__ */ (0, A.jsx)("div", {
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
}), Ee = ({ id: e = "route-line", coordinates: t, data: n, color: r = "#2196F3", lineWidth: a = 4, lineDasharray: o, onClick: s, onMouseEnter: c, onMouseLeave: l }) => {
	let u = C(), d = `${e}-source`, f = `${e}-layer`;
	return i(() => {
		if (!u) return;
		let e = () => {
			if (!u.getStyle()) return;
			let e = n;
			if (!e && t && (e = {
				type: "Feature",
				properties: {},
				geometry: {
					type: "LineString",
					coordinates: t
				}
			}), !e) return;
			let i = u.getSource(d);
			i ? typeof e != "string" && i.setData(e) : u.addSource(d, {
				type: "geojson",
				data: e
			}), u.getLayer(f) ? (u.setPaintProperty(f, "line-color", r), u.setPaintProperty(f, "line-width", a), o && u.setPaintProperty(f, "line-dasharray", o)) : u.addLayer({
				id: f,
				type: "line",
				source: d,
				layout: {
					"line-join": "round",
					"line-cap": "round"
				},
				paint: {
					"line-color": r,
					"line-width": a,
					...o ? { "line-dasharray": o } : {}
				}
			});
		};
		return e(), u.on("styledata", e), () => {
			u.off("styledata", e), u.getStyle() && (u.getLayer(f) && u.removeLayer(f), u.getSource(d) && u.removeSource(d));
		};
	}, [
		u,
		JSON.stringify(t),
		JSON.stringify(n),
		r,
		a,
		JSON.stringify(o),
		d,
		f
	]), i(() => {
		if (!u) return;
		let e = (e) => {
			s && s(e);
		}, t = (e) => {
			u.getCanvas().style.cursor = "pointer", c && c(e);
		}, n = (e) => {
			u.getCanvas().style.cursor = "", l && l(e);
		};
		return u.on("click", f, e), u.on("mouseenter", f, t), u.on("mouseleave", f, n), () => {
			u.off("click", f, e), u.off("mouseenter", f, t), u.off("mouseleave", f, n);
		};
	}, [
		u,
		f,
		s,
		c,
		l
	]), null;
}, De = ({ id: e, data: t, fillColor: n = "rgba(33, 150, 243, 0.4)", outlineColor: r = "#2196F3", outlineWidth: a = 2, onClick: o, onMouseEnter: s, onMouseLeave: c }) => {
	let l = C(), u = `${e}-source`, d = `${e}-fill-layer`, f = `${e}-line-layer`;
	return i(() => {
		if (!l) return;
		let e = () => {
			if (!l.getStyle()) return;
			let e = l.getSource(u);
			e ? typeof t != "string" && e.setData(t) : l.addSource(u, {
				type: "geojson",
				data: t
			}), l.getLayer(d) ? l.setPaintProperty(d, "fill-color", n) : l.addLayer({
				id: d,
				type: "fill",
				source: u,
				paint: { "fill-color": n }
			}), l.getLayer(f) ? (l.setPaintProperty(f, "line-color", r), l.setPaintProperty(f, "line-width", a)) : l.addLayer({
				id: f,
				type: "line",
				source: u,
				paint: {
					"line-color": r,
					"line-width": a
				}
			});
		};
		return e(), l.on("styledata", e), () => {
			l.off("styledata", e), l.getStyle() && (l.getLayer(d) && l.removeLayer(d), l.getLayer(f) && l.removeLayer(f), l.getSource(u) && l.removeSource(u));
		};
	}, [
		l,
		JSON.stringify(t),
		n,
		r,
		a,
		u,
		d,
		f
	]), i(() => {
		if (!l) return;
		let e = (e) => {
			o && o(e);
		}, t = (e) => {
			l.getCanvas().style.cursor = "pointer", s && s(e);
		}, n = (e) => {
			l.getCanvas().style.cursor = "", c && c(e);
		};
		return l.on("click", d, e), l.on("mouseenter", d, t), l.on("mouseleave", d, n), () => {
			l.off("click", d, e), l.off("mouseenter", d, t), l.off("mouseleave", d, n);
		};
	}, [
		l,
		d,
		o,
		s,
		c
	]), null;
}, $ = f.tuple([f.number().min(-180).max(180), f.number().min(-90).max(90)]), Oe = f.tuple([
	f.number().min(-180).max(180),
	f.number().min(-90).max(90),
	f.number().min(-180).max(180),
	f.number().min(-90).max(90)
]), ke = f.object({
	id: f.union([f.string(), f.number()]),
	lngLat: $
}), Ae = (e) => ke.extend(e), je = f.array($).min(2, "Route must have at least 2 points");
//#endregion
export { ke as BasePointDataSchema, Oe as BoundsSchema, V as ClusterMarker, $ as LngLatSchema, B as MakiMarker, b as MapStore, te as MapStoreProvider, P as Marker, we as MarkerClusterer, F as PinMarker, z as PlaceMarker, De as PolygonArea, re as PriceMarker, ie as PulsingMarker, je as RouteCoordinatesSchema, Ee as RouteLine, Te as RoutePointMarker, ne as SimpleMarker, N as VWorldMap, R as WeatherMarker, Ae as createPointDataSchema, v as getVWorldMaxZoom, y as getVWorldStyle, _ as getVWorldTileUrl, ee as redactVWorldUrl, C as useMap, T as useMapLoaded, E as useMapSelector, w as useMapZoom, D as useStableCallback };
