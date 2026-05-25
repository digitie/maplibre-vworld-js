import * as e from "react";
import t, { createContext as n, useCallback as r, useContext as i, useEffect as a, useMemo as o, useRef as s, useState as c } from "react";
import l from "maplibre-gl";
import { createPortal as u } from "react-dom";
import { z as d } from "zod";
//#region \0rolldown/runtime.js
var f = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), p = /* @__PURE__ */ ((e) => typeof require < "u" ? require : typeof Proxy < "u" ? new Proxy(e, { get: (e, t) => (typeof require < "u" ? require : e)[t] }) : e)(function(e) {
	if (typeof require < "u") return require.apply(this, arguments);
	throw Error("Calling `require` for \"" + e + "\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.");
}), m = new Set(["Hybrid", "Satellite"]), h = "공간정보 오픈플랫폼 브이월드", g = new Set([
	404,
	408,
	429,
	500,
	502,
	503,
	504
]);
function _(e, t) {
	let n = t === "Satellite" ? "jpeg" : "png", r = t === "gray" ? "white" : t;
	return `https://api.vworld.kr/req/wmts/1.0.0/${encodeURIComponent(e.trim())}/${r}/{z}/{y}/{x}.${n}`;
}
function v(e) {
	return m.has(e) ? 18 : 19;
}
function y(e) {
	return e.replace(/(\/req\/wmts\/1\.0\.0\/)([^/?#]+)(\/)/, "$1***$3");
}
function b(e, t) {
	let n = {}, r = [], i = v(t);
	return t === "Hybrid" && (n["vworld-satellite"] = {
		type: "raster",
		tiles: [_(e, "Satellite")],
		tileSize: 256,
		attribution: h,
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
		attribution: h,
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
function x(e) {
	let t = e.error, n = t.message.toLowerCase(), r = "sourceId" in e ? String(e.sourceId) : "", i = t.url ?? "";
	return r.startsWith("vworld") || i.includes("/req/wmts/") || n.includes("tile") || n.includes("failed to fetch") || g.has(t.status ?? 0);
}
function S(e) {
	return e?.replace(/\/req\/wmts\/1\.0\.0\/[^/]+/, "/req/wmts/1.0.0/[redacted]");
}
//#endregion
//#region node_modules/react/cjs/react-jsx-runtime.production.js
var C = /* @__PURE__ */ f(((e) => {
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
})), w = /* @__PURE__ */ f(((e) => {
	process.env.NODE_ENV !== "production" && (function() {
		function t(e) {
			if (e == null) return null;
			if (typeof e == "function") return e.$$typeof === k ? null : e.displayName || e.name || null;
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
			var e = A.A;
			return e === null ? null : e.getOwner();
		}
		function o() {
			return Error("react-stack-top-frame");
		}
		function s(e) {
			if (ee.call(e, "key")) {
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
			if (ee.call(n, "key")) {
				p = t(e);
				var m = Object.keys(n).filter(function(e) {
					return e !== "key";
				});
				o = 0 < m.length ? "{key: someKey, " + m.join(": ..., ") + ": ...}" : "{key: someKey}", P[p + o] || (m = 0 < m.length ? "{" + m.join(": ..., ") + ": ...}" : "{}", console.error("A props object containing a \"key\" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />", o, p, m, p), P[p + o] = !0);
			}
			if (p = null, i !== void 0 && (r(i), p = "" + i), s(n) && (r(n.key), p = "" + n.key), "key" in n) for (var h in i = {}, n) h !== "key" && (i[h] = n[h]);
			else i = n;
			return p && c(i, typeof e == "function" ? e.displayName || e.name || "Unknown" : e), u(e, p, i, a(), l, d);
		}
		function f(e) {
			m(e) ? e._store && (e._store.validated = 1) : typeof e == "object" && e && e.$$typeof === D && (e._payload.status === "fulfilled" ? m(e._payload.value) && e._payload.value._store && (e._payload.value._store.validated = 1) : e._store && (e._store.validated = 1));
		}
		function m(e) {
			return typeof e == "object" && !!e && e.$$typeof === g;
		}
		var h = p("react"), g = Symbol.for("react.transitional.element"), _ = Symbol.for("react.portal"), v = Symbol.for("react.fragment"), y = Symbol.for("react.strict_mode"), b = Symbol.for("react.profiler"), x = Symbol.for("react.consumer"), S = Symbol.for("react.context"), C = Symbol.for("react.forward_ref"), w = Symbol.for("react.suspense"), T = Symbol.for("react.suspense_list"), E = Symbol.for("react.memo"), D = Symbol.for("react.lazy"), O = Symbol.for("react.activity"), k = Symbol.for("react.client.reference"), A = h.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, ee = Object.prototype.hasOwnProperty, te = Array.isArray, j = console.createTask ? console.createTask : function() {
			return null;
		};
		h = { react_stack_bottom_frame: function(e) {
			return e();
		} };
		var ne, re = {}, M = h.react_stack_bottom_frame.bind(h, o)(), N = j(i(o)), P = {};
		e.Fragment = v, e.jsx = function(e, t, n) {
			var r = 1e4 > A.recentlyCreatedOwnerStacks++;
			return d(e, t, n, !1, r ? Error("react-stack-top-frame") : M, r ? j(i(e)) : N);
		}, e.jsxs = function(e, t, n) {
			var r = 1e4 > A.recentlyCreatedOwnerStacks++;
			return d(e, t, n, !0, r ? Error("react-stack-top-frame") : M, r ? j(i(e)) : N);
		};
	})();
})), T = (/* @__PURE__ */ f(((e, t) => {
	process.env.NODE_ENV === "production" ? t.exports = C() : t.exports = w();
})))(), E = n({ map: null }), D = n(12), O = () => i(E), k = () => i(D), A = () => {
	let e = i(E), t = i(D);
	return {
		...e,
		zoom: t
	};
};
function ee(e, t) {
	return e === void 0 ? null : typeof e == "function" ? e(t) : e;
}
function te(e) {
	let t = [
		e.error?.url,
		e.url,
		e.source?.tiles?.[0]
	];
	for (let e of t) if (typeof e == "string" && e.length > 0) return e;
}
function j(e, t) {
	let n = e.getCenter(), r = e.getBounds();
	return {
		map: e,
		center: [n.lng, n.lat],
		zoom: e.getZoom(),
		bounds: [
			r.getWest(),
			r.getSouth(),
			r.getEast(),
			r.getNorth()
		],
		eventType: t
	};
}
var ne = ({ apiKey: e, layerType: t = "Base", center: n = [127.024612, 37.5326], zoom: r = 12, minZoom: i = 6, maxZoom: u = 19, maxBounds: d, semanticZoomThreshold: f, showNavigationControl: p = !0, showGeolocateControl: m = !0, showScaleControl: h = !0, className: g = "", style: _ = {
	width: "100%",
	height: "100%"
}, children: x, onMapLoad: S, onMapClick: C, onMapContextMenu: w, onViewportChange: O, onMapError: k, tileErrorThreshold: A = Infinity, transformRequest: ne, fallback: re, loadingSkeleton: M, animateCameraChanges: N = !0, flyToOptions: P }) => {
	let F = s(null), I = s(null), [L, ie] = c(!1), [ae, oe] = c(r), [se, R] = c(null), z = s(S), ce = s(C), B = s(w), V = s(O), H = s(k), le = s(A);
	a(() => {
		z.current = S, ce.current = C, B.current = w, V.current = O, H.current = k, le.current = A;
	}, [
		S,
		C,
		w,
		O,
		k,
		A
	]);
	let U = typeof e == "string" && e.trim().length > 0, W = U && se === null;
	a(() => {
		R(null);
	}, [e, t]), a(() => {
		if (!W || !F.current) return;
		let a = Math.min(u, v(t)), o;
		try {
			o = new l.Map({
				container: F.current,
				style: b(e, t),
				center: n,
				zoom: r,
				minZoom: i,
				maxZoom: a,
				maxBounds: d,
				transformRequest: ne
			});
		} catch (e) {
			R(e instanceof Error ? e : Error(String(e)));
			return;
		}
		I.current = o, p && o.addControl(new l.NavigationControl({ visualizePitch: !0 }), "top-right"), m && o.addControl(new l.GeolocateControl({
			positionOptions: { enableHighAccuracy: !0 },
			trackUserLocation: !0
		}), "top-right"), h && o.addControl(new l.ScaleControl({
			maxWidth: 150,
			unit: "metric"
		}), "bottom-right");
		let s = (e) => {
			V.current?.(j(o, e));
		}, c = () => {
			let e = o.getZoom();
			oe((t) => t === e ? t : e);
		}, f = () => {
			ie(!0), c(), z.current?.(o), s("load");
		}, g = () => {
			c(), s("zoomend");
		}, _ = () => {
			c(), s("moveend");
		}, x = () => {
			s("idle");
		}, S = (e) => {
			ce.current?.(e);
		}, C = (e) => {
			B.current?.({
				event: e,
				lngLat: [e.lngLat.lng, e.lngLat.lat],
				point: e.point,
				originalEvent: e.originalEvent
			});
		}, w = 0, T = (e) => {
			w += 1;
			let t = le.current, n = Number.isFinite(t) && w === t, r = te(e), i = r ? y(r) : void 0, a = H.current;
			if (a) a({
				event: e,
				count: w,
				thresholdReached: n,
				redactedUrl: i
			});
			else {
				let t = e.error?.message ?? "unknown error";
				n ? console.warn(`[VWorldMap] map error count reached ${w}: ${t}`, i ?? "") : w === 1 && console.warn(`[VWorldMap] map error: ${t}`, i ?? "");
			}
		};
		o.on("load", f), o.on("zoomend", g), o.on("moveend", _), o.on("idle", x), o.on("click", S), o.on("contextmenu", C), o.on("error", T);
		let E = new ResizeObserver(() => {
			o.resize();
		});
		return E.observe(F.current), () => {
			E.disconnect(), o.off("load", f), o.off("zoomend", g), o.off("moveend", _), o.off("idle", x), o.off("click", S), o.off("contextmenu", C), o.off("error", T), o.remove(), I.current = null;
		};
	}, [W]), a(() => {
		L && I.current && I.current.setStyle(b(e, t));
	}, [
		e,
		t,
		L
	]);
	let G = s(n), K = s(r);
	a(() => {
		if (L && I.current) {
			let e = n && (!G.current || G.current[0] !== n[0] || G.current[1] !== n[1]), t = r !== void 0 && K.current !== r;
			(e || t) && (N ? I.current.flyTo({
				...P,
				center: n,
				zoom: r
			}) : I.current.jumpTo({
				center: n,
				zoom: r
			})), G.current = n, K.current = r;
		}
	}, [
		n,
		r,
		N,
		P
	]), a(() => {
		L && I.current && (i !== void 0 && I.current.setMinZoom(i), u !== void 0 && I.current.setMaxZoom(Math.min(u, v(t))), d !== void 0 && I.current.setMaxBounds(d));
	}, [
		t,
		i,
		u,
		d,
		L
	]);
	let ue = U ? se ? {
		reason: "map-init-error",
		error: se
	} : null : { reason: "missing-api-key" }, de = o(() => ({
		map: I.current,
		semanticZoomThreshold: f
	}), [L, f]);
	return /* @__PURE__ */ (0, T.jsx)(E.Provider, {
		value: de,
		children: /* @__PURE__ */ (0, T.jsx)(D.Provider, {
			value: ae,
			children: ue ? ee(re, ue) : /* @__PURE__ */ (0, T.jsxs)(T.Fragment, { children: [
				/* @__PURE__ */ (0, T.jsx)("div", {
					ref: F,
					className: g,
					style: _,
					"data-testid": "vworld-map-container"
				}),
				!L && M,
				L && x
			] })
		})
	});
};
//#endregion
//#region src/components/Marker.tsx
function re(e, { selected: t, highlighted: n, zIndex: r, ariaLabel: i, className: a }) {
	if (e.dataset.selected = t ? "true" : "false", e.dataset.highlighted = n ? "true" : "false", e.style.zIndex = r === void 0 ? "" : String(r), e.style.setProperty("scale", t ? "1.18" : n ? "1.1" : ""), e.style.filter = t ? "drop-shadow(0 6px 14px rgba(0,0,0,0.34))" : n ? "drop-shadow(0 4px 10px rgba(0,0,0,0.26))" : "", i ? (e.setAttribute("aria-label", i), e.setAttribute("role", "button")) : (e.removeAttribute("aria-label"), e.removeAttribute("role")), a) for (let t of a.split(/\s+/)) t && e.classList.add(t);
}
var M = ({ lngLat: e, color: t = "#3FB1CE", draggable: n = !1, onDragEnd: r, onClick: i, onContextMenu: c, selected: d, highlighted: f, zIndex: p, ariaLabel: m, className: h, children: g }) => {
	let { map: _ } = O(), v = s(null), y = s(void 0), b = s(i), x = s(c), S = s(r);
	a(() => {
		b.current = i, x.current = c, S.current = r;
	}, [
		i,
		c,
		r
	]);
	let C = o(() => document.createElement("div"), []);
	return a(() => {
		if (!_) return;
		let r = {
			color: t,
			draggable: n
		};
		g && (r = {
			element: C,
			draggable: n
		});
		let i = new l.Marker(r).setLngLat(e).addTo(_), a = i.getElement(), o = (e) => {
			b.current && (e.stopPropagation(), b.current(e, i));
		}, s = (e) => {
			x.current && (e.preventDefault(), e.stopPropagation(), x.current(e, i));
		};
		return a.addEventListener("click", o), a.addEventListener("contextmenu", s), n && i.on("dragend", () => {
			let e = i.getLngLat();
			S.current?.([e.lng, e.lat]);
		}), v.current = i, () => {
			a.removeEventListener("click", o), a.removeEventListener("contextmenu", s), i.remove();
		};
	}, [_, g ? C : null]), a(() => {
		v.current && v.current.setLngLat(e);
	}, [e]), a(() => {
		let e = v.current;
		if (!e) return;
		let t = e.getElement();
		if (y.current) for (let e of y.current.split(/\s+/)) e && t.classList.remove(e);
		re(t, {
			selected: d,
			highlighted: f,
			zIndex: p,
			ariaLabel: m,
			className: h
		}), y.current = h;
	}, [
		d,
		f,
		p,
		m,
		h
	]), g ? u(g, C) : null;
}, N = ({ color: e = "#DB4437", icon: t, size: n = 40, showInnerCircle: r = !0, label: i, tooltip: a, ...o }) => /* @__PURE__ */ (0, T.jsx)(M, {
	...o,
	children: /* @__PURE__ */ (0, T.jsxs)("div", {
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
			/* @__PURE__ */ (0, T.jsxs)("svg", {
				viewBox: "0 0 24 36",
				width: n,
				height: n * 1.5,
				style: {
					position: "absolute",
					top: 0,
					left: 0,
					filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.3))"
				},
				children: [/* @__PURE__ */ (0, T.jsx)("path", {
					fill: e,
					d: "M12,0 C5.372583,0 0,5.372583 0,12 C0,21 12,36 12,36 C12,36 24,21 24,12 C24,5.372583 18.627417,0 12,0 Z"
				}), r && /* @__PURE__ */ (0, T.jsx)("circle", {
					cx: "12",
					cy: "12",
					r: "8",
					fill: "white"
				})]
			}),
			/* @__PURE__ */ (0, T.jsx)("div", {
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
			i && /* @__PURE__ */ (0, T.jsx)("div", {
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
}), P = {
	sunny: "☀️",
	cloudy: "☁️",
	rainy: "🌧️",
	snowy: "❄️"
}, F = {
	sunny: "#FFA500",
	cloudy: "#808080",
	rainy: "#4169E1",
	snowy: "#ADD8E6"
}, I = ({ temperature: e, condition: t, hourlyForecast: n, simplifyAtZoom: r, ...i }) => {
	let [a, o] = c(!1), { zoom: s, semanticZoomThreshold: l } = A(), u = r ?? l;
	return u !== void 0 && s < u ? /* @__PURE__ */ (0, T.jsx)(N, {
		lngLat: i.lngLat,
		color: F[t],
		size: 24,
		showInnerCircle: !0
	}) : /* @__PURE__ */ (0, T.jsx)(M, {
		...i,
		children: /* @__PURE__ */ (0, T.jsxs)("div", {
			style: {
				position: "relative",
				display: "flex",
				flexDirection: "column",
				alignItems: "center"
			},
			children: [/* @__PURE__ */ (0, T.jsxs)("div", {
				onClick: (e) => {
					e.stopPropagation(), n && n.length > 0 && o(!a);
				},
				style: {
					background: "white",
					border: `2px solid ${F[t]}`,
					borderRadius: "20px",
					padding: "4px 10px",
					display: "flex",
					alignItems: "center",
					gap: "6px",
					boxShadow: a ? "0 4px 8px rgba(0,0,0,0.3)" : "0 2px 4px rgba(0,0,0,0.2)",
					fontWeight: "bold",
					fontSize: "14px",
					whiteSpace: "nowrap",
					cursor: n && n.length > 0 ? "pointer" : "default",
					transition: "all 0.2s ease",
					transform: a ? "scale(1.05)" : "scale(1)",
					zIndex: a ? 10 : 1
				},
				children: [
					/* @__PURE__ */ (0, T.jsx)("span", {
						style: { fontSize: "16px" },
						children: P[t]
					}),
					/* @__PURE__ */ (0, T.jsxs)("span", { children: [e, "°C"] }),
					n && n.length > 0 && /* @__PURE__ */ (0, T.jsx)("span", {
						style: {
							fontSize: "10px",
							color: "#999",
							marginLeft: "2px"
						},
						children: a ? "▲" : "▼"
					})
				]
			}), a && n && n.length > 0 && /* @__PURE__ */ (0, T.jsxs)("div", {
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
				children: [/* @__PURE__ */ (0, T.jsx)("style", { children: "\n              @keyframes fadeIn {\n                from { opacity: 0; transform: translateY(-10px); }\n                to { opacity: 1; transform: translateY(0); }\n              }\n            " }), n.map((e, t) => /* @__PURE__ */ (0, T.jsxs)("div", {
					style: {
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						minWidth: "40px"
					},
					children: [
						/* @__PURE__ */ (0, T.jsx)("div", {
							style: {
								fontSize: "12px",
								color: "#666",
								marginBottom: "4px"
							},
							children: e.time
						}),
						/* @__PURE__ */ (0, T.jsx)("div", {
							style: {
								fontSize: "18px",
								marginBottom: "4px"
							},
							children: P[e.condition]
						}),
						/* @__PURE__ */ (0, T.jsxs)("div", {
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
}, L = ({ title: e, description: t, category: n, photoUrl: r, link: i, simplifyAtZoom: a, ...o }) => {
	let { zoom: s, semanticZoomThreshold: c } = A(), l = a ?? c;
	return l !== void 0 && s < l ? /* @__PURE__ */ (0, T.jsx)(N, {
		lngLat: o.lngLat,
		color: "#333",
		size: 24,
		showInnerCircle: !1
	}) : /* @__PURE__ */ (0, T.jsx)(M, {
		...o,
		children: /* @__PURE__ */ (0, T.jsxs)("div", {
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
				/* @__PURE__ */ (0, T.jsx)("div", { style: {
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
				r && /* @__PURE__ */ (0, T.jsx)("img", {
					src: r,
					alt: e,
					style: {
						width: "100%",
						height: "100px",
						objectFit: "cover",
						display: "block"
					}
				}),
				/* @__PURE__ */ (0, T.jsxs)("div", {
					style: { padding: "12px" },
					children: [
						/* @__PURE__ */ (0, T.jsx)("div", {
							style: {
								fontSize: "10px",
								color: "#888",
								textTransform: "uppercase",
								letterSpacing: "0.5px",
								marginBottom: "4px"
							},
							children: n
						}),
						/* @__PURE__ */ (0, T.jsx)("div", {
							style: {
								fontSize: "14px",
								fontWeight: "bold",
								marginBottom: "4px",
								color: "#333"
							},
							children: e
						}),
						/* @__PURE__ */ (0, T.jsx)("div", {
							style: {
								fontSize: "12px",
								color: "#666",
								marginBottom: "8px",
								lineHeight: "1.4"
							},
							children: t
						}),
						i && /* @__PURE__ */ (0, T.jsx)("a", {
							href: i,
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
	});
}, ie = ({ label: e, bgColor: t = "#222", textColor: n = "white", simplifyAtZoom: r, ...i }) => {
	let { zoom: a, semanticZoomThreshold: o } = A(), s = r ?? o;
	return s !== void 0 && a < s ? /* @__PURE__ */ (0, T.jsx)(N, {
		lngLat: i.lngLat,
		color: t,
		size: 20,
		showInnerCircle: !1
	}) : /* @__PURE__ */ (0, T.jsx)(M, {
		...i,
		children: /* @__PURE__ */ (0, T.jsx)("div", {
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
	});
}, ae = ({ price: e, currency: t = "₩", isHoverable: n = !0, ...r }) => {
	let [i, a] = c(!1), o = (e) => typeof e == "number" ? e.toLocaleString() : e;
	return /* @__PURE__ */ (0, T.jsx)(M, {
		...r,
		children: /* @__PURE__ */ (0, T.jsxs)("div", {
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
			children: [/* @__PURE__ */ (0, T.jsx)("span", { children: t }), /* @__PURE__ */ (0, T.jsx)("span", { children: o(e) })]
		})
	});
}, oe = ({ color: e = "#4285F4", size: t = 14, ...n }) => /* @__PURE__ */ (0, T.jsx)(M, {
	...n,
	children: /* @__PURE__ */ (0, T.jsxs)("div", {
		style: {
			position: "relative",
			width: t,
			height: t
		},
		children: [
			/* @__PURE__ */ (0, T.jsx)("div", { style: {
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
			/* @__PURE__ */ (0, T.jsx)("div", { style: {
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
			/* @__PURE__ */ (0, T.jsx)("style", { children: "\n          @keyframes pulsing-ripple {\n            0% {\n              transform: scale(0.3);\n              opacity: 0.8;\n            }\n            80% {\n              transform: scale(1);\n              opacity: 0;\n            }\n            100% {\n              transform: scale(1);\n              opacity: 0;\n            }\n          }\n        " })
		]
	})
}), se = "https://unpkg.com/@mapbox/maki@8.0.0/icons", R = ({ iconName: e, icon: t, iconBaseUrl: n = se, fallbackIcon: r = "marker", color: i = "#2c3e50", iconColor: a = "white", size: s = 40, ...c }) => {
	let l = t ?? e ?? r, u = o(() => `${n.replace(/\/+$/, "")}/${l}.svg`, [n, l]);
	return /* @__PURE__ */ (0, T.jsx)(N, {
		color: i,
		size: s,
		showInnerCircle: !1,
		icon: /* @__PURE__ */ (0, T.jsx)("div", { style: o(() => ({
			width: "100%",
			height: "100%",
			backgroundColor: a,
			WebkitMask: `url(${u}) no-repeat center / contain`,
			mask: `url(${u}) no-repeat center / contain`
		}), [a, u]) }),
		...c
	});
}, z = ({ count: e, color: t, size: n, onClick: r, ...i }) => {
	let a = n || 30, o = t || "#51bbd6";
	return e > 100 && (a = n || 40, o = t || "#f1f075"), e > 500 && (a = n || 50, o = t || "#f28cb1"), /* @__PURE__ */ (0, T.jsx)(M, {
		...i,
		children: /* @__PURE__ */ (0, T.jsx)("div", {
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
}, ce = [
	Int8Array,
	Uint8Array,
	Uint8ClampedArray,
	Int16Array,
	Uint16Array,
	Int32Array,
	Uint32Array,
	Float32Array,
	Float64Array
], B = 1, V = 8, H = new Uint32Array(96), le = class e {
	static from(t) {
		if (!t || t.byteLength === void 0 || t.buffer) throw Error("Data must be an instance of ArrayBuffer or SharedArrayBuffer.");
		let [n, r] = new Uint8Array(t, 0, 2);
		if (n !== 219) throw Error("Data does not appear to be in a KDBush format.");
		let i = r >> 4;
		if (i !== B) throw Error(`Got v${i} data when expected v${B}.`);
		let a = ce[r & 15];
		if (!a) throw Error("Unrecognized array type.");
		let [o] = new Uint16Array(t, 2, 1), [s] = new Uint32Array(t, 4, 1);
		return new e(s, o, a, void 0, t);
	}
	constructor(e, t = 64, n = Float64Array, r = ArrayBuffer, i) {
		if (isNaN(e) || e < 0) throw Error(`Unexpected numItems value: ${e}.`);
		this.numItems = +e, this.nodeSize = Math.min(Math.max(+t, 2), 65535), this.ArrayType = n, this.IndexArrayType = e < 65536 ? Uint16Array : Uint32Array;
		let a = ce.indexOf(this.ArrayType), o = e * 2 * this.ArrayType.BYTES_PER_ELEMENT, s = e * this.IndexArrayType.BYTES_PER_ELEMENT, c = (8 - s % 8) % 8;
		if (a < 0) throw Error(`Unexpected typed array class: ${n}.`);
		if (i) this.data = i, this.ids = new this.IndexArrayType(i, V, e), this.coords = new n(i, V + s + c, e * 2), this._pos = e * 2, this._finished = !0;
		else {
			let i = this.data = new r(V + o + s + c);
			this.ids = new this.IndexArrayType(i, V, e), this.coords = new n(i, V + s + c, e * 2), this._pos = 0, this._finished = !1, new Uint8Array(i, 0, 2).set([219, (B << 4) + a]), new Uint16Array(i, 2, 1)[0] = t, new Uint32Array(i, 4, 1)[0] = e;
		}
	}
	add(e, t) {
		let n = this._pos >> 1;
		return this.ids[n] = n, this.coords[this._pos++] = e, this.coords[this._pos++] = t, n;
	}
	finish() {
		let e = this._pos >> 1;
		if (e !== this.numItems) throw Error(`Added ${e} items when expected ${this.numItems}.`);
		return U(this.ids, this.coords, this.nodeSize, 0, this.numItems - 1, 0), this._finished = !0, this;
	}
	range(e, t, n, r) {
		if (!this._finished) throw Error("Data not yet indexed - call index.finish().");
		let { ids: i, coords: a, nodeSize: o } = this;
		H[0] = 0, H[1] = i.length - 1, H[2] = 0;
		let s = 3, c = [];
		for (; s > 0;) {
			let l = H[--s], u = H[--s], d = H[--s];
			if (u - d <= o) {
				for (let o = d; o <= u; o++) {
					let s = a[2 * o], l = a[2 * o + 1];
					s >= e && s <= n && l >= t && l <= r && c.push(i[o]);
				}
				continue;
			}
			let f = d + u >> 1, p = a[2 * f], m = a[2 * f + 1];
			p >= e && p <= n && m >= t && m <= r && c.push(i[f]), (l === 0 ? e <= p : t <= m) && (H[s++] = d, H[s++] = f - 1, H[s++] = 1 - l), (l === 0 ? n >= p : r >= m) && (H[s++] = f + 1, H[s++] = u, H[s++] = 1 - l);
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
		H[0] = 0, H[1] = i.length - 1, H[2] = 0;
		let s = 3, c = 0, l = n * n;
		for (; s > 0;) {
			let u = H[--s], d = H[--s], f = H[--s];
			if (d - f <= o) {
				for (let n = f; n <= d; n++) ue(a[2 * n], a[2 * n + 1], e, t) <= l && (r[c++] = i[n]);
				continue;
			}
			let p = f + d >> 1, m = a[2 * p], h = a[2 * p + 1];
			ue(m, h, e, t) <= l && (r[c++] = i[p]), (u === 0 ? e - n <= m : t - n <= h) && (H[s++] = f, H[s++] = p - 1, H[s++] = 1 - u), (u === 0 ? e + n >= m : t + n >= h) && (H[s++] = p + 1, H[s++] = d, H[s++] = 1 - u);
		}
		return c;
	}
};
function U(e, t, n, r, i, a) {
	if (i - r <= n) return;
	let o = r + i >> 1;
	W(e, t, o, r, i, a), U(e, t, n, r, o - 1, 1 - a), U(e, t, n, o + 1, i, 1 - a);
}
function W(e, t, n, r, i, a) {
	for (; i > r;) {
		if (i - r > 600) {
			let o = i - r + 1, s = n - r + 1, c = Math.log(o), l = .5 * Math.exp(2 * c / 3), u = .5 * Math.sqrt(c * l * (o - l) / o) * (s - o / 2 < 0 ? -1 : 1);
			W(e, t, n, Math.max(r, Math.floor(n - s * l / o + u)), Math.min(i, Math.floor(n + (o - s) * l / o + u)), a);
		}
		let o = t[2 * n + a], s = r, c = i;
		for (G(e, t, r, n), t[2 * i + a] > o && G(e, t, r, i); s < c;) {
			for (G(e, t, s, c), s++, c--; t[2 * s + a] < o;) s++;
			for (; t[2 * c + a] > o;) c--;
		}
		t[2 * r + a] === o ? G(e, t, r, c) : (c++, G(e, t, c, i)), c <= n && (r = c + 1), n <= c && (i = c - 1);
	}
}
function G(e, t, n, r) {
	K(e, n, r), K(t, 2 * n, 2 * r), K(t, 2 * n + 1, 2 * r + 1);
}
function K(e, t, n) {
	let r = e[t];
	e[t] = e[n], e[n] = r;
}
function ue(e, t, n, r) {
	let i = e - n, a = t - r;
	return i * i + a * a;
}
//#endregion
//#region node_modules/supercluster/index.js
var de = {
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
}, fe = Math.fround || ((e) => ((t) => (e[0] = +t, e[0])))(new Float32Array(1)), q = 2, J = 3, pe = 4, Y = 5, me = 6, he = class {
	constructor(e) {
		this.options = Object.assign(Object.create(de), e), this.trees = Array(this.options.maxZoom + 1), this.stride = this.options.reduce ? 7 : 6, this.clusterProps = [];
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
			let [r, i] = n.geometry.coordinates, o = fe(ve(r)), s = fe(ye(i));
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
		let o = this.trees[this._limitZoom(t)], s = o.range(ve(n), ye(a), ve(i), ye(r)), c = o.data, l = [];
		for (let e of s) {
			let t = this.stride * e;
			l.push(c[t + Y] > 1 ? ge(c, t, this.clusterProps) : this.points[c[t + J]]);
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
			a[n + pe] === e && u.push(a[n + Y] > 1 ? ge(a, n, this.clusterProps) : this.points[a[n + J]]);
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
		let t = new le(e.length / this.stride | 0, this.options.nodeSize, Float32Array);
		for (let n = 0; n < e.length; n += this.stride) t.add(e[n], e[n + 1]);
		return t.finish(), t.data = e, t;
	}
	_addTileFeatures(e, t, n, r, i, a) {
		for (let o of e) {
			let e = o * this.stride, s = t[e + Y] > 1, c, l, u;
			if (s) c = _e(t, e, this.clusterProps), l = t[e], u = t[e + 1];
			else {
				let n = this.points[t[e + J]];
				c = n.properties;
				let [r, i] = n.geometry.coordinates;
				l = ve(r), u = ye(i);
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
					e += s[c] * u, a += s[c + 1] * u, s[c + pe] = h, i && (o || (o = this._map(s, n, !0), m = this.clusterProps.length, this.clusterProps.push(o)), i(o, this._map(s, c)));
				}
				s[n + pe] = h, c.push(e / p, a / p, Infinity, h, -1, p), i && c.push(m);
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
			let r = this.clusterProps[e[t + me]];
			return n ? Object.assign({}, r) : r;
		}
		let r = this.points[e[t + J]].properties, i = this.options.map(r);
		return n && i === r ? Object.assign({}, i) : i;
	}
};
function ge(e, t, n) {
	return {
		type: "Feature",
		id: e[t + J],
		properties: _e(e, t, n),
		geometry: {
			type: "Point",
			coordinates: [be(e[t]), xe(e[t + 1])]
		}
	};
}
function _e(e, t, n) {
	let r = e[t + Y], i = r >= 1e4 ? `${Math.round(r / 1e3)}k` : r >= 1e3 ? `${Math.round(r / 100) / 10}k` : r, a = e[t + me], o = a === -1 ? {} : Object.assign({}, n[a]);
	return Object.assign(o, {
		cluster: !0,
		cluster_id: e[t + J],
		point_count: r,
		point_count_abbreviated: i
	});
}
function ve(e) {
	return e / 360 + .5;
}
function ye(e) {
	let t = Math.sin(e * Math.PI / 180), n = .5 - .25 * Math.log((1 + t) / (1 - t)) / Math.PI;
	return n < 0 ? 0 : n > 1 ? 1 : n;
}
function be(e) {
	return (e - .5) * 360;
}
function xe(e) {
	let t = (180 - e * 360) * Math.PI / 180;
	return 360 * Math.atan(Math.exp(t)) / Math.PI - 90;
}
//#endregion
//#region node_modules/dequal/dist/index.mjs
var Se = Object.prototype.hasOwnProperty;
function Ce(e, t, n) {
	for (n of e.keys()) if (X(n, t)) return n;
}
function X(e, t) {
	var n, r, i;
	if (e === t) return !0;
	if (e && t && (n = e.constructor) === t.constructor) {
		if (n === Date) return e.getTime() === t.getTime();
		if (n === RegExp) return e.toString() === t.toString();
		if (n === Array) {
			if ((r = e.length) === t.length) for (; r-- && X(e[r], t[r]););
			return r === -1;
		}
		if (n === Set) {
			if (e.size !== t.size) return !1;
			for (r of e) if (i = r, i && typeof i == "object" && (i = Ce(t, i), !i) || !t.has(i)) return !1;
			return !0;
		}
		if (n === Map) {
			if (e.size !== t.size) return !1;
			for (r of e) if (i = r[0], i && typeof i == "object" && (i = Ce(t, i), !i) || !X(r[1], t.get(i))) return !1;
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
			for (n in r = 0, e) if (Se.call(e, n) && ++r && !Se.call(t, n) || !(n in t) || !X(e[n], t[n])) return !1;
			return Object.keys(t).length === r;
		}
	}
	return e !== e && t !== t;
}
//#endregion
//#region node_modules/use-deep-compare-effect/dist/use-deep-compare-effect.esm.js
function we(t) {
	var n = e.useRef(t), r = e.useRef(0);
	return X(t, n.current) || (n.current = t, r.current += 1), e.useMemo(function() {
		return n.current;
	}, [r.current]);
}
function Te(t, n) {
	return e.useEffect(t, we(n));
}
//#endregion
//#region node_modules/use-supercluster/dist/use-supercluster.esm.js
var Ee = function(e) {
	var t = e.points, n = e.bounds, r = e.zoom, i = e.options, a = e.disableRefresh, o = s(), l = s(), u = c([]), d = u[0], f = u[1], p = Math.round(r);
	return Te(function() {
		a !== !0 && ((!o.current || !X(l.current, t) || !X(o.current.options, i)) && (o.current = new he(i), o.current.load(t)), n && f(o.current.getClusters(n, p)), l.current = t);
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
}, De = ({ points: e, renderMarker: t, renderCluster: n, radius: r = 50, maxZoom: i = 16 }) => {
	let { map: s } = O(), [l, u] = c(null), [d, f] = c(12);
	a(() => {
		if (!s) return;
		let e = () => {
			let e = s.getBounds(), t = [
				e.getWest(),
				e.getSouth(),
				e.getEast(),
				e.getNorth()
			];
			u((e) => e && e[0] === t[0] && e[1] === t[1] && e[2] === t[2] && e[3] === t[3] ? e : t);
			let n = s.getZoom();
			f((e) => e === n ? e : n);
		};
		return e(), s.on("moveend", e), s.on("zoomend", e), () => {
			s.off("moveend", e), s.off("zoomend", e);
		};
	}, [s]);
	let p = o(() => e.map((e) => ({
		type: "Feature",
		properties: {
			cluster: !1,
			...e
		},
		geometry: {
			type: "Point",
			coordinates: e.lngLat
		}
	})), [e]), m = o(() => ({
		radius: r,
		maxZoom: i
	}), [r, i]), { clusters: h, supercluster: g } = Ee({
		points: p,
		bounds: l || void 0,
		zoom: d,
		options: m
	});
	return s ? /* @__PURE__ */ (0, T.jsx)(T.Fragment, { children: h.map((e) => {
		let [r, i] = e.geometry.coordinates, { cluster: a, point_count: o } = e.properties;
		if (a) {
			if (n && g) return n(e, o || 0, g);
			let t = e.properties.cluster_id;
			return t === void 0 || !g ? null : /* @__PURE__ */ (0, T.jsx)(z, {
				lngLat: [r, i],
				count: o || 0,
				onClick: () => {
					let e = g.getClusterExpansionZoom(t);
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
};
//#endregion
//#region src/components/ServerClusterLayer.tsx
function Oe(e) {
	return [[e[0], e[1]], [e[2], e[3]]];
}
var ke = ({ clusters: e, renderCluster: n, onClusterClick: i, fitBoundsOptions: a, flyToOptions: o }) => {
	let { map: s } = O(), c = r((e) => {
		if (s) {
			if (i?.(e), e.bounds) {
				s.fitBounds(Oe(e.bounds), {
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
	return s ? /* @__PURE__ */ (0, T.jsx)(T.Fragment, { children: e.map((e) => {
		let r = () => c(e);
		return n ? /* @__PURE__ */ (0, T.jsx)(t.Fragment, { children: n(e, r) }, e.id) : /* @__PURE__ */ (0, T.jsx)(z, {
			lngLat: e.lngLat,
			count: e.count,
			color: e.color,
			size: e.size,
			ariaLabel: e.label ?? `Cluster with ${e.count} items`,
			onClick: r
		}, e.id);
	}) }) : null;
}, Ae = ({ lngLat: e, children: t, offset: n, closeButton: r = !0, closeOnClick: i = !0, maxWidth: c, className: d, onClose: f }) => {
	let { map: p } = O(), m = s(null), h = s(f), g = o(() => document.createElement("div"), []);
	return a(() => {
		h.current = f;
	}, [f]), a(() => {
		if (!p) return;
		let t = new l.Popup({
			offset: n,
			closeButton: r,
			closeOnClick: i,
			className: d,
			maxWidth: c
		}).setLngLat(e).setDOMContent(g).addTo(p), a = () => {
			h.current?.();
		};
		return t.on("close", a), m.current = t, () => {
			t.off("close", a), t.remove(), m.current = null;
		};
	}, [p, g]), a(() => {
		m.current?.setLngLat(e);
	}, [e]), u(t, g);
}, je = {
	"P-01": {
		hex: "#E53935",
		name: "red",
		labelColor: "#FFFFFF"
	},
	"P-02": {
		hex: "#FB8C00",
		name: "orange",
		labelColor: "#FFFFFF"
	},
	"P-03": {
		hex: "#FDD835",
		name: "yellow",
		labelColor: "#222222"
	},
	"P-04": {
		hex: "#7CB342",
		name: "light-green",
		labelColor: "#FFFFFF"
	},
	"P-05": {
		hex: "#43A047",
		name: "green",
		labelColor: "#FFFFFF"
	},
	"P-06": {
		hex: "#00897B",
		name: "teal",
		labelColor: "#FFFFFF"
	},
	"P-07": {
		hex: "#00ACC1",
		name: "sky",
		labelColor: "#FFFFFF"
	},
	"P-08": {
		hex: "#1E88E5",
		name: "blue",
		labelColor: "#FFFFFF"
	},
	"P-09": {
		hex: "#3949AB",
		name: "indigo",
		labelColor: "#FFFFFF"
	},
	"P-10": {
		hex: "#8E24AA",
		name: "purple",
		labelColor: "#FFFFFF"
	},
	"P-11": {
		hex: "#D81B60",
		name: "magenta",
		labelColor: "#FFFFFF"
	},
	"P-12": {
		hex: "#6D4C41",
		name: "brown",
		labelColor: "#FFFFFF"
	},
	"P-13": {
		hex: "#757575",
		name: "gray",
		labelColor: "#FFFFFF"
	},
	"P-14": {
		hex: "#212121",
		name: "black",
		labelColor: "#FFFFFF"
	},
	"P-15": {
		hex: "#F4511E",
		name: "deep-orange",
		labelColor: "#FFFFFF"
	},
	"P-16": {
		hex: "#039BE5",
		name: "cyan-blue",
		labelColor: "#FFFFFF"
	}
}, Me = {
	fuel: {
		icon: "fuel",
		colorKey: "P-02"
	},
	gas: {
		icon: "fuel",
		colorKey: "P-02"
	},
	주유소: {
		icon: "fuel",
		colorKey: "P-02"
	},
	rest_area: {
		icon: "car",
		colorKey: "P-15"
	},
	restarea: {
		icon: "car",
		colorKey: "P-15"
	},
	휴게소: {
		icon: "car",
		colorKey: "P-15"
	},
	beach: {
		icon: "swimming",
		colorKey: "P-07"
	},
	해수욕장: {
		icon: "swimming",
		colorKey: "P-07"
	},
	golf: {
		icon: "golf",
		colorKey: "P-05"
	},
	골프장: {
		icon: "golf",
		colorKey: "P-05"
	},
	lodging: {
		icon: "lodging",
		colorKey: "P-10"
	},
	숙박: {
		icon: "lodging",
		colorKey: "P-10"
	},
	cafe: {
		icon: "cafe",
		colorKey: "P-12"
	},
	카페: {
		icon: "cafe",
		colorKey: "P-12"
	},
	restaurant: {
		icon: "restaurant",
		colorKey: "P-01"
	},
	food: {
		icon: "restaurant",
		colorKey: "P-01"
	},
	음식점: {
		icon: "restaurant",
		colorKey: "P-01"
	},
	museum: {
		icon: "museum",
		colorKey: "P-09"
	},
	미술관: {
		icon: "museum",
		colorKey: "P-09"
	},
	박물관: {
		icon: "museum",
		colorKey: "P-09"
	},
	attraction: {
		icon: "attraction",
		colorKey: "P-11"
	},
	관광명소: {
		icon: "attraction",
		colorKey: "P-11"
	},
	temple: {
		icon: "religious-buddhist",
		colorKey: "P-03"
	},
	heritage: {
		icon: "monument",
		colorKey: "P-03"
	},
	국가유산: {
		icon: "monument",
		colorKey: "P-03"
	},
	culture: {
		icon: "religious-buddhist",
		colorKey: "P-03"
	},
	문화유산: {
		icon: "religious-buddhist",
		colorKey: "P-03"
	},
	grocery: {
		icon: "grocery",
		colorKey: "P-04"
	},
	편의점: {
		icon: "grocery",
		colorKey: "P-04"
	},
	마트: {
		icon: "grocery",
		colorKey: "P-04"
	},
	hospital: {
		icon: "hospital",
		colorKey: "P-16"
	},
	pharmacy: {
		icon: "hospital",
		colorKey: "P-16"
	},
	약국: {
		icon: "hospital",
		colorKey: "P-16"
	},
	병원: {
		icon: "hospital",
		colorKey: "P-16"
	},
	event: {
		icon: "star",
		colorKey: "P-11"
	},
	festival: {
		icon: "star",
		colorKey: "P-11"
	},
	축제: {
		icon: "star",
		colorKey: "P-11"
	},
	notice: {
		icon: "alert",
		colorKey: "P-14"
	},
	공지: {
		icon: "alert",
		colorKey: "P-14"
	},
	forest: {
		icon: "park-alt1",
		colorKey: "P-05"
	},
	휴양림: {
		icon: "park-alt1",
		colorKey: "P-05"
	},
	수목원: {
		icon: "park-alt1",
		colorKey: "P-05"
	},
	route: {
		icon: "walking",
		colorKey: "P-06"
	},
	walking: {
		icon: "walking",
		colorKey: "P-06"
	},
	트래킹: {
		icon: "walking",
		colorKey: "P-06"
	},
	area: {
		icon: "park",
		colorKey: "P-05"
	},
	park: {
		icon: "park",
		colorKey: "P-05"
	},
	국립공원: {
		icon: "park",
		colorKey: "P-05"
	},
	parking: {
		icon: "parking",
		colorKey: "P-13"
	},
	주차장: {
		icon: "parking",
		colorKey: "P-13"
	}
};
function Ne(e) {
	return !!(e && e in je);
}
function Pe(e, t) {
	let n = e?.trim().toLowerCase();
	return n && n.length > 0 ? n : t;
}
function Fe({ category: e, markerColor: t, markerIcon: n, fallbackCategory: r = "attraction" }) {
	let i = Pe(e, r), a = Me[i] ?? Me[r] ?? Me.attraction, o = Ne(t) ? t : a.colorKey, s = je[o];
	return {
		category: i,
		colorKey: o,
		color: s.hex,
		labelColor: s.labelColor,
		icon: n?.trim() || a.icon
	};
}
//#endregion
//#region src/components/PolygonArea.tsx
var Ie = ({ id: e, data: t, fillColor: n = "rgba(33, 150, 243, 0.4)", outlineColor: r = "#2196F3", outlineWidth: i = 2, onClick: o, onMouseEnter: s, onMouseLeave: c }) => {
	let { map: l } = O(), u = `${e}-source`, d = `${e}-fill-layer`, f = `${e}-line-layer`;
	return a(() => {
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
		return e(), l.on("styledata", e), () => {
			l.off("styledata", e), l.getStyle() && (l.getLayer(d) && l.removeLayer(d), l.getLayer(f) && l.removeLayer(f), l.getSource(u) && l.removeSource(u));
		};
	}, [
		l,
		JSON.stringify(t),
		n,
		r,
		i,
		u,
		d,
		f
	]), a(() => {
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
}, Le = ({ id: e = "route-line", coordinates: t, data: n, color: r = "#2196F3", lineWidth: i = 4, lineDasharray: o, onClick: s, onMouseEnter: c, onMouseLeave: l }) => {
	let { map: u } = O(), d = `${e}-source`, f = `${e}-layer`;
	return a(() => {
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
			let a = u.getSource(d);
			a ? typeof e != "string" && a.setData(e) : u.addSource(d, {
				type: "geojson",
				data: e
			}), u.getLayer(f) ? (u.setPaintProperty(f, "line-color", r), u.setPaintProperty(f, "line-width", i), o && u.setPaintProperty(f, "line-dasharray", o)) : u.addLayer({
				id: f,
				type: "line",
				source: d,
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
		return e(), u.on("styledata", e), () => {
			u.off("styledata", e), u.getStyle() && (u.getLayer(f) && u.removeLayer(f), u.getSource(d) && u.removeSource(d));
		};
	}, [
		u,
		JSON.stringify(t),
		JSON.stringify(n),
		r,
		i,
		JSON.stringify(o),
		d,
		f
	]), a(() => {
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
};
//#endregion
//#region src/components/TripmateFeatureLayer.tsx
function Z(e) {
	return `${e.kind}-${e.id}`;
}
function Re(e) {
	return e.lngLat ?? e.coord ?? e.centroidLngLat;
}
function ze(e) {
	return e?.type === "LineString" || e?.type === "MultiLineString";
}
function Be(e) {
	return e?.type === "Polygon" || e?.type === "MultiPolygon";
}
function Ve(e, t) {
	return {
		type: "Feature",
		id: e,
		properties: {},
		geometry: t
	};
}
function He(e) {
	return /^#[0-9a-fA-F]{6}$/.test(e) ? `${e}33` : e;
}
var Ue = ({ features: e, iconBaseUrl: n, selectedFeatureId: r, highlightedFeatureId: i, renderFeature: a, onFeatureClick: o, onFeatureContextMenu: s }) => /* @__PURE__ */ (0, T.jsx)(T.Fragment, { children: e.map((e) => {
	if (a) return /* @__PURE__ */ (0, T.jsx)(t.Fragment, { children: a(e) }, Z(e));
	let c = Fe({
		category: e.category ?? e.kind,
		markerColor: e.markerColor,
		markerIcon: e.markerIcon
	}), l = r === e.id, u = i === e.id, d = {
		selected: l,
		highlighted: u,
		zIndex: l ? 20 : u ? 10 : void 0,
		ariaLabel: e.name,
		onClick: (t) => o?.(e, t),
		onContextMenu: (t) => s?.(e, t)
	};
	if (e.kind === "route") return e.routeCoordinates ? /* @__PURE__ */ (0, T.jsx)(Le, {
		id: Z(e),
		coordinates: e.routeCoordinates,
		color: c.color
	}, Z(e)) : ze(e.geometry) ? /* @__PURE__ */ (0, T.jsx)(Le, {
		id: Z(e),
		data: Ve(Z(e), e.geometry),
		color: c.color
	}, Z(e)) : null;
	if (e.kind === "area" && Be(e.geometry)) {
		let r = Re(e);
		return /* @__PURE__ */ (0, T.jsxs)(t.Fragment, { children: [/* @__PURE__ */ (0, T.jsx)(Ie, {
			id: Z(e),
			data: Ve(Z(e), e.geometry),
			fillColor: He(c.color),
			outlineColor: c.color
		}), r && /* @__PURE__ */ (0, T.jsx)(R, {
			lngLat: r,
			icon: c.icon,
			iconBaseUrl: n,
			color: c.color,
			iconColor: c.labelColor,
			size: 28,
			...d
		})] }, Z(e));
	}
	let f = Re(e);
	return f ? e.kind === "price" && e.price !== null && e.price !== void 0 ? /* @__PURE__ */ (0, T.jsx)(ae, {
		lngLat: f,
		price: e.price,
		currency: e.currency ?? "₩",
		...d
	}, Z(e)) : e.kind === "weather" && e.weather ? /* @__PURE__ */ (0, T.jsx)(I, {
		lngLat: f,
		temperature: e.weather.temperature,
		condition: e.weather.condition,
		...d
	}, Z(e)) : /* @__PURE__ */ (0, T.jsx)(R, {
		lngLat: f,
		icon: c.icon,
		iconBaseUrl: n,
		color: c.color,
		iconColor: c.labelColor,
		tooltip: e.name,
		...d
	}, Z(e)) : null;
}) }), We = ({ label: e, color: t = "#111", size: n = 24, ...r }) => /* @__PURE__ */ (0, T.jsx)(M, {
	...r,
	children: /* @__PURE__ */ (0, T.jsx)("div", {
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
}), Ge = d.tuple([d.number().min(-180).max(180), d.number().min(-90).max(90)]), Ke = d.tuple([
	d.number().min(-180).max(180),
	d.number().min(-90).max(90),
	d.number().min(-180).max(180),
	d.number().min(-90).max(90)
]), Q = [124, 132], $ = [33, 43], qe = d.tuple([d.number().min(Q[0]).max(Q[1]), d.number().min($[0]).max($[1])]), Je = d.tuple([
	d.number().min(Q[0]).max(Q[1]),
	d.number().min($[0]).max($[1]),
	d.number().min(Q[0]).max(Q[1]),
	d.number().min($[0]).max($[1])
]);
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
var $e = d.object({
	id: d.union([d.string(), d.number()]),
	lngLat: Ge
}), et = (e) => $e.extend(e), tt = d.array(Ge).min(2, "Route must have at least 2 points");
//#endregion
export { $e as BasePointDataSchema, Ke as BoundsSchema, z as ClusterMarker, $ as KOREA_LAT_RANGE, Q as KOREA_LNG_RANGE, Je as KoreaBoundsSchema, qe as KoreaLngLatSchema, Ge as LngLatSchema, R as MakiMarker, Ae as MapPopup, M as Marker, De as MarkerClusterer, N as PinMarker, L as PlaceMarker, Ie as PolygonArea, ae as PriceMarker, oe as PulsingMarker, tt as RouteCoordinatesSchema, Le as RouteLine, We as RoutePointMarker, ke as ServerClusterLayer, ie as SimpleMarker, Me as TRIPMATE_CATEGORY_MARKERS, je as TRIPMATE_MARKER_PALETTE, Ue as TripmateFeatureLayer, ne as VWorldMap, I as WeatherMarker, et as createPointDataSchema, Xe as formatLngLat, v as getVWorldMaxZoom, b as getVWorldStyle, _ as getVWorldTileUrl, Ne as isTripmateMarkerColorKey, x as isVWorldTileError, Qe as parseBoundsParam, S as redactVWorldTileUrl, y as redactVWorldUrl, Fe as resolveTripmateMarkerStyle, Ze as serializeBounds, O as useMap, A as useMapContext, k as useMapZoom };
