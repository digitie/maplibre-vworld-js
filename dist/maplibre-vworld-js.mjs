import * as e from "react";
import { createContext as t, useContext as n, useEffect as r, useMemo as i, useRef as a, useState as o } from "react";
import s from "maplibre-gl";
import { Fragment as c, jsx as l, jsxs as u } from "react/jsx-runtime";
import { createPortal as d } from "react-dom";
//#region src/vworld.ts
var f = new Set(["Hybrid", "Satellite"]), p = "공간정보 오픈플랫폼 브이월드";
function m(e, t) {
	let n = t === "Satellite" ? "jpeg" : "png", r = t === "gray" ? "white" : t;
	return `https://api.vworld.kr/req/wmts/1.0.0/${encodeURIComponent(e.trim())}/${r}/{z}/{y}/{x}.${n}`;
}
function h(e) {
	return f.has(e) ? 18 : 19;
}
function ee(e) {
	return e.replace(/(\/req\/wmts\/1\.0\.0\/)([^/?#]+)(\/)/, "$1***$3");
}
function te(e, t) {
	let n = {}, r = [], i = h(t);
	return t === "Hybrid" && (n["vworld-satellite"] = {
		type: "raster",
		tiles: [m(e, "Satellite")],
		tileSize: 256,
		attribution: p,
		maxzoom: i
	}, r.push({
		id: "vworld-satellite-layer",
		type: "raster",
		source: "vworld-satellite",
		minzoom: 0
	})), n[`vworld-${t}`] = {
		type: "raster",
		tiles: [m(e, t)],
		tileSize: 256,
		attribution: p,
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
//#region src/components/VWorldMap.tsx
var g = t({
	map: null,
	zoom: 12
}), _ = () => n(g), ne = () => n(g), re = () => n(g).zoom;
function ie(e, t) {
	return e === void 0 ? null : typeof e == "function" ? e(t) : e;
}
function ae(e) {
	let t = [
		e.error?.url,
		e.url,
		e.source?.tiles?.[0]
	];
	for (let e of t) if (typeof e == "string" && e.length > 0) return e;
}
var oe = ({ apiKey: e, layerType: t = "Base", center: n = [127.024612, 37.5326], zoom: i = 12, minZoom: d = 6, maxZoom: f = 19, maxBounds: p, semanticZoomThreshold: m, showNavigationControl: _ = !0, showGeolocateControl: ne = !0, showScaleControl: re = !0, className: oe = "", style: v = {
	width: "100%",
	height: "100%"
}, children: y, onMapLoad: se, onMapClick: ce, onMapError: le, tileErrorThreshold: ue = Infinity, transformRequest: de, fallback: fe, loadingSkeleton: pe, animateCameraChanges: me = !0 }) => {
	let b = a(null), x = a(null), [S, C] = o(!1), [w, he] = o(i), [T, ge] = o(null), E = a(ce), _e = a(le), ve = a(ue);
	r(() => {
		E.current = ce;
	}, [ce]), r(() => {
		_e.current = le;
	}, [le]), r(() => {
		ve.current = ue;
	}, [ue]);
	let ye = typeof e == "string" && e.trim().length > 0, be = ye && T === null;
	r(() => {
		if (!be || !b.current) return;
		let r = Math.min(f, h(t)), a;
		try {
			a = new s.Map({
				container: b.current,
				style: te(e, t),
				center: n,
				zoom: i,
				minZoom: d,
				maxZoom: r,
				maxBounds: p,
				transformRequest: de
			});
		} catch (e) {
			ge(e instanceof Error ? e : Error(String(e)));
			return;
		}
		x.current = a, _ && a.addControl(new s.NavigationControl({ visualizePitch: !0 }), "top-right"), ne && a.addControl(new s.GeolocateControl({
			positionOptions: { enableHighAccuracy: !0 },
			trackUserLocation: !0
		}), "top-right"), re && a.addControl(new s.ScaleControl({
			maxWidth: 150,
			unit: "metric"
		}), "bottom-right");
		let o = () => {
			C(!0), he(a.getZoom()), se && se(a);
		}, c = () => {
			he(a.getZoom());
		}, l = (e) => {
			E.current?.(e);
		}, u = 0, m = (e) => {
			u += 1;
			let t = ve.current, n = Number.isFinite(t) && u === t, r = ae(e), i = r ? ee(r) : void 0, a = _e.current;
			if (a) a({
				event: e,
				count: u,
				thresholdReached: n,
				redactedUrl: i
			});
			else {
				let t = e.error?.message ?? "unknown error";
				n ? console.warn(`[VWorldMap] map error count reached ${u}: ${t}`, i ?? "") : u === 1 && console.warn(`[VWorldMap] map error: ${t}`, i ?? "");
			}
		};
		a.on("load", o), a.on("zoomend", c), a.on("click", l), a.on("error", m);
		let g = new ResizeObserver(() => {
			a.resize();
		});
		return g.observe(b.current), () => {
			g.disconnect(), a.off("load", o), a.off("zoomend", c), a.off("click", l), a.off("error", m), a.remove(), x.current = null;
		};
	}, [be]), r(() => {
		S && x.current && x.current.setStyle(te(e, t));
	}, [
		e,
		t,
		S
	]);
	let D = a(n), O = a(i);
	r(() => {
		if (S && x.current) {
			let e = n && (!D.current || D.current[0] !== n[0] || D.current[1] !== n[1]), t = i !== void 0 && O.current !== i;
			(e || t) && (me ? x.current.flyTo({
				center: n,
				zoom: i
			}) : x.current.jumpTo({
				center: n,
				zoom: i
			})), D.current = n, O.current = i;
		}
	}, [
		n,
		i,
		me
	]), r(() => {
		S && x.current && (d !== void 0 && x.current.setMinZoom(d), f !== void 0 && x.current.setMaxZoom(Math.min(f, h(t))), p !== void 0 && x.current.setMaxBounds(p));
	}, [
		t,
		d,
		f,
		p,
		S
	]);
	let xe = ye ? T ? {
		reason: "map-init-error",
		error: T
	} : null : { reason: "missing-api-key" };
	return /* @__PURE__ */ l(g.Provider, {
		value: {
			map: x.current,
			zoom: w,
			semanticZoomThreshold: m
		},
		children: xe ? ie(fe, xe) : /* @__PURE__ */ u(c, { children: [
			/* @__PURE__ */ l("div", {
				ref: b,
				className: oe,
				style: v,
				"data-testid": "vworld-map-container"
			}),
			!S && pe,
			S && y
		] })
	});
}, v = ({ lngLat: e, color: t = "#3FB1CE", draggable: n = !1, onDragEnd: o, children: c }) => {
	let { map: l } = _(), u = a(null), f = i(() => document.createElement("div"), []);
	return r(() => {
		if (!l) return;
		let r = {
			color: t,
			draggable: n
		};
		c && (r = {
			element: f,
			draggable: n
		});
		let i = new s.Marker(r).setLngLat(e).addTo(l);
		return n && o && i.on("dragend", () => {
			let e = i.getLngLat();
			o([e.lng, e.lat]);
		}), u.current = i, () => {
			i.remove();
		};
	}, [l, c ? f : null]), r(() => {
		u.current && u.current.setLngLat(e);
	}, [e]), c ? d(c, f) : null;
}, y = ({ color: e = "#DB4437", icon: t, size: n = 40, showInnerCircle: r = !0, label: i, tooltip: a, ...o }) => /* @__PURE__ */ l(v, {
	...o,
	children: /* @__PURE__ */ u("div", {
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
			/* @__PURE__ */ u("svg", {
				viewBox: "0 0 24 36",
				width: n,
				height: n * 1.5,
				style: {
					position: "absolute",
					top: 0,
					left: 0,
					filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.3))"
				},
				children: [/* @__PURE__ */ l("path", {
					fill: e,
					d: "M12,0 C5.372583,0 0,5.372583 0,12 C0,21 12,36 12,36 C12,36 24,21 24,12 C24,5.372583 18.627417,0 12,0 Z"
				}), r && /* @__PURE__ */ l("circle", {
					cx: "12",
					cy: "12",
					r: "8",
					fill: "white"
				})]
			}),
			/* @__PURE__ */ l("div", {
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
			i && /* @__PURE__ */ l("div", {
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
}), se = {
	sunny: "☀️",
	cloudy: "☁️",
	rainy: "🌧️",
	snowy: "❄️"
}, ce = {
	sunny: "#FFA500",
	cloudy: "#808080",
	rainy: "#4169E1",
	snowy: "#ADD8E6"
}, le = ({ temperature: e, condition: t, hourlyForecast: n, simplifyAtZoom: r, ...i }) => {
	let [a, s] = o(!1), { zoom: c, semanticZoomThreshold: d } = ne(), f = r ?? d;
	return f !== void 0 && c < f ? /* @__PURE__ */ l(y, {
		lngLat: i.lngLat,
		color: ce[t],
		size: 24,
		showInnerCircle: !0
	}) : /* @__PURE__ */ l(v, {
		...i,
		children: /* @__PURE__ */ u("div", {
			style: {
				position: "relative",
				display: "flex",
				flexDirection: "column",
				alignItems: "center"
			},
			children: [/* @__PURE__ */ u("div", {
				onClick: (e) => {
					e.stopPropagation(), n && n.length > 0 && s(!a);
				},
				style: {
					background: "white",
					border: `2px solid ${ce[t]}`,
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
					/* @__PURE__ */ l("span", {
						style: { fontSize: "16px" },
						children: se[t]
					}),
					/* @__PURE__ */ u("span", { children: [e, "°C"] }),
					n && n.length > 0 && /* @__PURE__ */ l("span", {
						style: {
							fontSize: "10px",
							color: "#999",
							marginLeft: "2px"
						},
						children: a ? "▲" : "▼"
					})
				]
			}), a && n && n.length > 0 && /* @__PURE__ */ u("div", {
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
				children: [/* @__PURE__ */ l("style", { children: "\n              @keyframes fadeIn {\n                from { opacity: 0; transform: translateY(-10px); }\n                to { opacity: 1; transform: translateY(0); }\n              }\n            " }), n.map((e, t) => /* @__PURE__ */ u("div", {
					style: {
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						minWidth: "40px"
					},
					children: [
						/* @__PURE__ */ l("div", {
							style: {
								fontSize: "12px",
								color: "#666",
								marginBottom: "4px"
							},
							children: e.time
						}),
						/* @__PURE__ */ l("div", {
							style: {
								fontSize: "18px",
								marginBottom: "4px"
							},
							children: se[e.condition]
						}),
						/* @__PURE__ */ u("div", {
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
}, ue = ({ title: e, description: t, category: n, photoUrl: r, link: i, simplifyAtZoom: a, ...o }) => {
	let { zoom: s, semanticZoomThreshold: c } = ne(), d = a ?? c;
	return d !== void 0 && s < d ? /* @__PURE__ */ l(y, {
		lngLat: o.lngLat,
		color: "#333",
		size: 24,
		showInnerCircle: !1
	}) : /* @__PURE__ */ l(v, {
		...o,
		children: /* @__PURE__ */ u("div", {
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
				/* @__PURE__ */ l("div", { style: {
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
				r && /* @__PURE__ */ l("img", {
					src: r,
					alt: e,
					style: {
						width: "100%",
						height: "100px",
						objectFit: "cover",
						display: "block"
					}
				}),
				/* @__PURE__ */ u("div", {
					style: { padding: "12px" },
					children: [
						/* @__PURE__ */ l("div", {
							style: {
								fontSize: "10px",
								color: "#888",
								textTransform: "uppercase",
								letterSpacing: "0.5px",
								marginBottom: "4px"
							},
							children: n
						}),
						/* @__PURE__ */ l("div", {
							style: {
								fontSize: "14px",
								fontWeight: "bold",
								marginBottom: "4px",
								color: "#333"
							},
							children: e
						}),
						/* @__PURE__ */ l("div", {
							style: {
								fontSize: "12px",
								color: "#666",
								marginBottom: "8px",
								lineHeight: "1.4"
							},
							children: t
						}),
						i && /* @__PURE__ */ l("a", {
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
}, de = ({ label: e, bgColor: t = "#222", textColor: n = "white", simplifyAtZoom: r, ...i }) => {
	let { zoom: a, semanticZoomThreshold: o } = ne(), s = r ?? o;
	return s !== void 0 && a < s ? /* @__PURE__ */ l(y, {
		lngLat: i.lngLat,
		color: t,
		size: 20,
		showInnerCircle: !1
	}) : /* @__PURE__ */ l(v, {
		...i,
		children: /* @__PURE__ */ l("div", {
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
}, fe = ({ price: e, currency: t = "₩", isHoverable: n = !0, ...r }) => {
	let [i, a] = o(!1), s = (e) => typeof e == "number" ? e.toLocaleString() : e;
	return /* @__PURE__ */ l(v, {
		...r,
		children: /* @__PURE__ */ u("div", {
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
			children: [/* @__PURE__ */ l("span", { children: t }), /* @__PURE__ */ l("span", { children: s(e) })]
		})
	});
}, pe = ({ color: e = "#4285F4", size: t = 14, ...n }) => /* @__PURE__ */ l(v, {
	...n,
	children: /* @__PURE__ */ u("div", {
		style: {
			position: "relative",
			width: t,
			height: t
		},
		children: [
			/* @__PURE__ */ l("div", { style: {
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
			/* @__PURE__ */ l("div", { style: {
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
			/* @__PURE__ */ l("style", { children: "\n          @keyframes pulsing-ripple {\n            0% {\n              transform: scale(0.3);\n              opacity: 0.8;\n            }\n            80% {\n              transform: scale(1);\n              opacity: 0;\n            }\n            100% {\n              transform: scale(1);\n              opacity: 0;\n            }\n          }\n        " })
		]
	})
}), me = ({ iconName: e, color: t = "#2c3e50", iconColor: n = "white", size: r = 40, ...i }) => {
	let a = `https://unpkg.com/@mapbox/maki@8.0.0/icons/${e}.svg`;
	return /* @__PURE__ */ l(y, {
		color: t,
		size: r,
		showInnerCircle: !1,
		icon: /* @__PURE__ */ l("div", { style: {
			width: "100%",
			height: "100%",
			backgroundColor: n,
			WebkitMask: `url(${a}) no-repeat center / contain`,
			mask: `url(${a}) no-repeat center / contain`
		} }),
		...i
	});
}, b = ({ count: e, color: t, size: n, onClick: r, ...i }) => {
	let a = n || 30, o = t || "#51bbd6";
	return e > 100 && (a = n || 40, o = t || "#f1f075"), e > 500 && (a = n || 50, o = t || "#f28cb1"), /* @__PURE__ */ l(v, {
		...i,
		children: /* @__PURE__ */ l("div", {
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
}, x = [
	Int8Array,
	Uint8Array,
	Uint8ClampedArray,
	Int16Array,
	Uint16Array,
	Int32Array,
	Uint32Array,
	Float32Array,
	Float64Array
], S = 1, C = 8, w = new Uint32Array(96), he = class e {
	static from(t) {
		if (!t || t.byteLength === void 0 || t.buffer) throw Error("Data must be an instance of ArrayBuffer or SharedArrayBuffer.");
		let [n, r] = new Uint8Array(t, 0, 2);
		if (n !== 219) throw Error("Data does not appear to be in a KDBush format.");
		let i = r >> 4;
		if (i !== S) throw Error(`Got v${i} data when expected v${S}.`);
		let a = x[r & 15];
		if (!a) throw Error("Unrecognized array type.");
		let [o] = new Uint16Array(t, 2, 1), [s] = new Uint32Array(t, 4, 1);
		return new e(s, o, a, void 0, t);
	}
	constructor(e, t = 64, n = Float64Array, r = ArrayBuffer, i) {
		if (isNaN(e) || e < 0) throw Error(`Unexpected numItems value: ${e}.`);
		this.numItems = +e, this.nodeSize = Math.min(Math.max(+t, 2), 65535), this.ArrayType = n, this.IndexArrayType = e < 65536 ? Uint16Array : Uint32Array;
		let a = x.indexOf(this.ArrayType), o = e * 2 * this.ArrayType.BYTES_PER_ELEMENT, s = e * this.IndexArrayType.BYTES_PER_ELEMENT, c = (8 - s % 8) % 8;
		if (a < 0) throw Error(`Unexpected typed array class: ${n}.`);
		if (i) this.data = i, this.ids = new this.IndexArrayType(i, C, e), this.coords = new n(i, C + s + c, e * 2), this._pos = e * 2, this._finished = !0;
		else {
			let i = this.data = new r(C + o + s + c);
			this.ids = new this.IndexArrayType(i, C, e), this.coords = new n(i, C + s + c, e * 2), this._pos = 0, this._finished = !1, new Uint8Array(i, 0, 2).set([219, (S << 4) + a]), new Uint16Array(i, 2, 1)[0] = t, new Uint32Array(i, 4, 1)[0] = e;
		}
	}
	add(e, t) {
		let n = this._pos >> 1;
		return this.ids[n] = n, this.coords[this._pos++] = e, this.coords[this._pos++] = t, n;
	}
	finish() {
		let e = this._pos >> 1;
		if (e !== this.numItems) throw Error(`Added ${e} items when expected ${this.numItems}.`);
		return T(this.ids, this.coords, this.nodeSize, 0, this.numItems - 1, 0), this._finished = !0, this;
	}
	range(e, t, n, r) {
		if (!this._finished) throw Error("Data not yet indexed - call index.finish().");
		let { ids: i, coords: a, nodeSize: o } = this;
		w[0] = 0, w[1] = i.length - 1, w[2] = 0;
		let s = 3, c = [];
		for (; s > 0;) {
			let l = w[--s], u = w[--s], d = w[--s];
			if (u - d <= o) {
				for (let o = d; o <= u; o++) {
					let s = a[2 * o], l = a[2 * o + 1];
					s >= e && s <= n && l >= t && l <= r && c.push(i[o]);
				}
				continue;
			}
			let f = d + u >> 1, p = a[2 * f], m = a[2 * f + 1];
			p >= e && p <= n && m >= t && m <= r && c.push(i[f]), (l === 0 ? e <= p : t <= m) && (w[s++] = d, w[s++] = f - 1, w[s++] = 1 - l), (l === 0 ? n >= p : r >= m) && (w[s++] = f + 1, w[s++] = u, w[s++] = 1 - l);
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
		w[0] = 0, w[1] = i.length - 1, w[2] = 0;
		let s = 3, c = 0, l = n * n;
		for (; s > 0;) {
			let u = w[--s], d = w[--s], f = w[--s];
			if (d - f <= o) {
				for (let n = f; n <= d; n++) ve(a[2 * n], a[2 * n + 1], e, t) <= l && (r[c++] = i[n]);
				continue;
			}
			let p = f + d >> 1, m = a[2 * p], h = a[2 * p + 1];
			ve(m, h, e, t) <= l && (r[c++] = i[p]), (u === 0 ? e - n <= m : t - n <= h) && (w[s++] = f, w[s++] = p - 1, w[s++] = 1 - u), (u === 0 ? e + n >= m : t + n >= h) && (w[s++] = p + 1, w[s++] = d, w[s++] = 1 - u);
		}
		return c;
	}
};
function T(e, t, n, r, i, a) {
	if (i - r <= n) return;
	let o = r + i >> 1;
	ge(e, t, o, r, i, a), T(e, t, n, r, o - 1, 1 - a), T(e, t, n, o + 1, i, 1 - a);
}
function ge(e, t, n, r, i, a) {
	for (; i > r;) {
		if (i - r > 600) {
			let o = i - r + 1, s = n - r + 1, c = Math.log(o), l = .5 * Math.exp(2 * c / 3), u = .5 * Math.sqrt(c * l * (o - l) / o) * (s - o / 2 < 0 ? -1 : 1);
			ge(e, t, n, Math.max(r, Math.floor(n - s * l / o + u)), Math.min(i, Math.floor(n + (o - s) * l / o + u)), a);
		}
		let o = t[2 * n + a], s = r, c = i;
		for (E(e, t, r, n), t[2 * i + a] > o && E(e, t, r, i); s < c;) {
			for (E(e, t, s, c), s++, c--; t[2 * s + a] < o;) s++;
			for (; t[2 * c + a] > o;) c--;
		}
		t[2 * r + a] === o ? E(e, t, r, c) : (c++, E(e, t, c, i)), c <= n && (r = c + 1), n <= c && (i = c - 1);
	}
}
function E(e, t, n, r) {
	_e(e, n, r), _e(t, 2 * n, 2 * r), _e(t, 2 * n + 1, 2 * r + 1);
}
function _e(e, t, n) {
	let r = e[t];
	e[t] = e[n], e[n] = r;
}
function ve(e, t, n, r) {
	let i = e - n, a = t - r;
	return i * i + a * a;
}
//#endregion
//#region node_modules/supercluster/index.js
var ye = {
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
}, be = Math.fround || ((e) => ((t) => (e[0] = +t, e[0])))(new Float32Array(1)), D = 2, O = 3, xe = 4, k = 5, Se = 6, Ce = class {
	constructor(e) {
		this.options = Object.assign(Object.create(ye), e), this.trees = Array(this.options.maxZoom + 1), this.stride = this.options.reduce ? 7 : 6, this.clusterProps = [];
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
			let [r, i] = n.geometry.coordinates, o = be(Ee(r)), s = be(De(i));
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
		let o = this.trees[this._limitZoom(t)], s = o.range(Ee(n), De(a), Ee(i), De(r)), c = o.data, l = [];
		for (let e of s) {
			let t = this.stride * e;
			l.push(c[t + k] > 1 ? we(c, t, this.clusterProps) : this.points[c[t + O]]);
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
			a[n + xe] === e && u.push(a[n + k] > 1 ? we(a, n, this.clusterProps) : this.points[a[n + O]]);
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
		let t = new he(e.length / this.stride | 0, this.options.nodeSize, Float32Array);
		for (let n = 0; n < e.length; n += this.stride) t.add(e[n], e[n + 1]);
		return t.finish(), t.data = e, t;
	}
	_addTileFeatures(e, t, n, r, i, a) {
		for (let o of e) {
			let e = o * this.stride, s = t[e + k] > 1, c, l, u;
			if (s) c = Te(t, e, this.clusterProps), l = t[e], u = t[e + 1];
			else {
				let n = this.points[t[e + O]];
				c = n.properties;
				let [r, i] = n.geometry.coordinates;
				l = Ee(r), u = De(i);
			}
			let d = {
				type: 1,
				geometry: [[Math.round(this.options.extent * (l * i - n)), Math.round(this.options.extent * (u * i - r))]],
				tags: c
			}, f;
			f = s || this.options.generateId ? t[e + O] : this.points[t[e + O]].id, f !== void 0 && (d.id = f), a.features.push(d);
		}
	}
	_limitZoom(e) {
		return Math.max(this.options.minZoom, Math.min(Math.floor(+e), this.options.maxZoom + 1));
	}
	_cluster(e, t) {
		let { radius: n, extent: r, reduce: i, minPoints: a } = this.options, o = n / (r * 2 ** t), s = e.data, c = [], l = this.stride;
		for (let n = 0; n < s.length; n += l) {
			if (s[n + D] <= t) continue;
			s[n + D] = t;
			let r = s[n], u = s[n + 1], d = e.within(s[n], s[n + 1], o), f = s[n + k], p = f;
			for (let e of d) {
				let n = e * l;
				s[n + D] > t && (p += s[n + k]);
			}
			if (p > f && p >= a) {
				let e = r * f, a = u * f, o, m = -1, h = ((n / l | 0) << 5) + (t + 1) + this.points.length;
				for (let r of d) {
					let c = r * l;
					if (s[c + D] <= t) continue;
					s[c + D] = t;
					let u = s[c + k];
					e += s[c] * u, a += s[c + 1] * u, s[c + xe] = h, i && (o || (o = this._map(s, n, !0), m = this.clusterProps.length, this.clusterProps.push(o)), i(o, this._map(s, c)));
				}
				s[n + xe] = h, c.push(e / p, a / p, Infinity, h, -1, p), i && c.push(m);
			} else {
				for (let e = 0; e < l; e++) c.push(s[n + e]);
				if (p > 1) for (let e of d) {
					let n = e * l;
					if (!(s[n + D] <= t)) {
						s[n + D] = t;
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
		if (e[t + k] > 1) {
			let r = this.clusterProps[e[t + Se]];
			return n ? Object.assign({}, r) : r;
		}
		let r = this.points[e[t + O]].properties, i = this.options.map(r);
		return n && i === r ? Object.assign({}, i) : i;
	}
};
function we(e, t, n) {
	return {
		type: "Feature",
		id: e[t + O],
		properties: Te(e, t, n),
		geometry: {
			type: "Point",
			coordinates: [Oe(e[t]), ke(e[t + 1])]
		}
	};
}
function Te(e, t, n) {
	let r = e[t + k], i = r >= 1e4 ? `${Math.round(r / 1e3)}k` : r >= 1e3 ? `${Math.round(r / 100) / 10}k` : r, a = e[t + Se], o = a === -1 ? {} : Object.assign({}, n[a]);
	return Object.assign(o, {
		cluster: !0,
		cluster_id: e[t + O],
		point_count: r,
		point_count_abbreviated: i
	});
}
function Ee(e) {
	return e / 360 + .5;
}
function De(e) {
	let t = Math.sin(e * Math.PI / 180), n = .5 - .25 * Math.log((1 + t) / (1 - t)) / Math.PI;
	return n < 0 ? 0 : n > 1 ? 1 : n;
}
function Oe(e) {
	return (e - .5) * 360;
}
function ke(e) {
	let t = (180 - e * 360) * Math.PI / 180;
	return 360 * Math.atan(Math.exp(t)) / Math.PI - 90;
}
//#endregion
//#region node_modules/dequal/dist/index.mjs
var Ae = Object.prototype.hasOwnProperty;
function je(e, t, n) {
	for (n of e.keys()) if (A(n, t)) return n;
}
function A(e, t) {
	var n, r, i;
	if (e === t) return !0;
	if (e && t && (n = e.constructor) === t.constructor) {
		if (n === Date) return e.getTime() === t.getTime();
		if (n === RegExp) return e.toString() === t.toString();
		if (n === Array) {
			if ((r = e.length) === t.length) for (; r-- && A(e[r], t[r]););
			return r === -1;
		}
		if (n === Set) {
			if (e.size !== t.size) return !1;
			for (r of e) if (i = r, i && typeof i == "object" && (i = je(t, i), !i) || !t.has(i)) return !1;
			return !0;
		}
		if (n === Map) {
			if (e.size !== t.size) return !1;
			for (r of e) if (i = r[0], i && typeof i == "object" && (i = je(t, i), !i) || !A(r[1], t.get(i))) return !1;
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
			for (n in r = 0, e) if (Ae.call(e, n) && ++r && !Ae.call(t, n) || !(n in t) || !A(e[n], t[n])) return !1;
			return Object.keys(t).length === r;
		}
	}
	return e !== e && t !== t;
}
//#endregion
//#region node_modules/use-deep-compare-effect/dist/use-deep-compare-effect.esm.js
function Me(t) {
	var n = e.useRef(t), r = e.useRef(0);
	return A(t, n.current) || (n.current = t, r.current += 1), e.useMemo(function() {
		return n.current;
	}, [r.current]);
}
function Ne(t, n) {
	return e.useEffect(t, Me(n));
}
//#endregion
//#region node_modules/use-supercluster/dist/use-supercluster.esm.js
var Pe = function(e) {
	var t = e.points, n = e.bounds, r = e.zoom, i = e.options, s = e.disableRefresh, c = a(), l = a(), u = o([]), d = u[0], f = u[1], p = Math.round(r);
	return Ne(function() {
		s !== !0 && ((!c.current || !A(l.current, t) || !A(c.current.options, i)) && (c.current = new Ce(i), c.current.load(t)), n && f(c.current.getClusters(n, p)), l.current = t);
	}, [
		t,
		n,
		p,
		i,
		s
	]), {
		clusters: d,
		supercluster: c.current
	};
}, Fe = ({ points: e, renderMarker: t, renderCluster: n, radius: i = 50, maxZoom: a = 16 }) => {
	let { map: s } = _(), [u, d] = o(null), [f, p] = o(12);
	r(() => {
		if (!s) return;
		let e = () => {
			let e = s.getBounds();
			d([
				e.getWest(),
				e.getSouth(),
				e.getEast(),
				e.getNorth()
			]), p(s.getZoom());
		};
		return e(), s.on("moveend", e), s.on("zoomend", e), () => {
			s.off("moveend", e), s.off("zoomend", e);
		};
	}, [s]);
	let { clusters: m, supercluster: h } = Pe({
		points: e.map((e) => ({
			type: "Feature",
			properties: {
				cluster: !1,
				...e
			},
			geometry: {
				type: "Point",
				coordinates: e.lngLat
			}
		})),
		bounds: u || void 0,
		zoom: f,
		options: {
			radius: i,
			maxZoom: a
		}
	});
	return s ? /* @__PURE__ */ l(c, { children: m.map((e) => {
		let [r, i] = e.geometry.coordinates, { cluster: a, point_count: o } = e.properties;
		if (a) {
			if (n && h) return n(e, o || 0, h);
			let t = e.properties.cluster_id;
			return t === void 0 || !h ? null : /* @__PURE__ */ l(b, {
				lngLat: [r, i],
				count: o || 0,
				onClick: () => {
					let e = h.getClusterExpansionZoom(t);
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
}, Ie = ({ label: e, color: t = "#111", size: n = 24, ...r }) => /* @__PURE__ */ l(v, {
	...r,
	children: /* @__PURE__ */ l("div", {
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
}), Le = ({ id: e = "route-line", coordinates: t, data: n, color: i = "#2196F3", lineWidth: a = 4, lineDasharray: o, onClick: s, onMouseEnter: c, onMouseLeave: l }) => {
	let { map: u } = _(), d = `${e}-source`, f = `${e}-layer`;
	return r(() => {
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
			let r = u.getSource(d);
			r ? typeof e != "string" && r.setData(e) : u.addSource(d, {
				type: "geojson",
				data: e
			}), u.getLayer(f) ? (u.setPaintProperty(f, "line-color", i), u.setPaintProperty(f, "line-width", a), o && u.setPaintProperty(f, "line-dasharray", o)) : u.addLayer({
				id: f,
				type: "line",
				source: d,
				layout: {
					"line-join": "round",
					"line-cap": "round"
				},
				paint: {
					"line-color": i,
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
		i,
		a,
		JSON.stringify(o),
		d,
		f
	]), r(() => {
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
}, Re = ({ id: e, data: t, fillColor: n = "rgba(33, 150, 243, 0.4)", outlineColor: i = "#2196F3", outlineWidth: a = 2, onClick: o, onMouseEnter: s, onMouseLeave: c }) => {
	let { map: l } = _(), u = `${e}-source`, d = `${e}-fill-layer`, f = `${e}-line-layer`;
	return r(() => {
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
			}), l.getLayer(f) ? (l.setPaintProperty(f, "line-color", i), l.setPaintProperty(f, "line-width", a)) : l.addLayer({
				id: f,
				type: "line",
				source: u,
				paint: {
					"line-color": i,
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
		i,
		a,
		u,
		d,
		f
	]), r(() => {
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
}, j;
(function(e) {
	e.assertEqual = (e) => {};
	function t(e) {}
	e.assertIs = t;
	function n(e) {
		throw Error();
	}
	e.assertNever = n, e.arrayToEnum = (e) => {
		let t = {};
		for (let n of e) t[n] = n;
		return t;
	}, e.getValidEnumValues = (t) => {
		let n = e.objectKeys(t).filter((e) => typeof t[t[e]] != "number"), r = {};
		for (let e of n) r[e] = t[e];
		return e.objectValues(r);
	}, e.objectValues = (t) => e.objectKeys(t).map(function(e) {
		return t[e];
	}), e.objectKeys = typeof Object.keys == "function" ? (e) => Object.keys(e) : (e) => {
		let t = [];
		for (let n in e) Object.prototype.hasOwnProperty.call(e, n) && t.push(n);
		return t;
	}, e.find = (e, t) => {
		for (let n of e) if (t(n)) return n;
	}, e.isInteger = typeof Number.isInteger == "function" ? (e) => Number.isInteger(e) : (e) => typeof e == "number" && Number.isFinite(e) && Math.floor(e) === e;
	function r(e, t = " | ") {
		return e.map((e) => typeof e == "string" ? `'${e}'` : e).join(t);
	}
	e.joinValues = r, e.jsonStringifyReplacer = (e, t) => typeof t == "bigint" ? t.toString() : t;
})(j ||= {});
var ze;
(function(e) {
	e.mergeShapes = (e, t) => ({
		...e,
		...t
	});
})(ze ||= {});
var M = j.arrayToEnum([
	"string",
	"nan",
	"number",
	"integer",
	"float",
	"boolean",
	"date",
	"bigint",
	"symbol",
	"function",
	"undefined",
	"null",
	"array",
	"object",
	"unknown",
	"promise",
	"void",
	"never",
	"map",
	"set"
]), N = (e) => {
	switch (typeof e) {
		case "undefined": return M.undefined;
		case "string": return M.string;
		case "number": return Number.isNaN(e) ? M.nan : M.number;
		case "boolean": return M.boolean;
		case "function": return M.function;
		case "bigint": return M.bigint;
		case "symbol": return M.symbol;
		case "object": return Array.isArray(e) ? M.array : e === null ? M.null : e.then && typeof e.then == "function" && e.catch && typeof e.catch == "function" ? M.promise : typeof Map < "u" && e instanceof Map ? M.map : typeof Set < "u" && e instanceof Set ? M.set : typeof Date < "u" && e instanceof Date ? M.date : M.object;
		default: return M.unknown;
	}
}, P = j.arrayToEnum([
	"invalid_type",
	"invalid_literal",
	"custom",
	"invalid_union",
	"invalid_union_discriminator",
	"invalid_enum_value",
	"unrecognized_keys",
	"invalid_arguments",
	"invalid_return_type",
	"invalid_date",
	"invalid_string",
	"too_small",
	"too_big",
	"invalid_intersection_types",
	"not_multiple_of",
	"not_finite"
]), F = class e extends Error {
	get errors() {
		return this.issues;
	}
	constructor(e) {
		super(), this.issues = [], this.addIssue = (e) => {
			this.issues = [...this.issues, e];
		}, this.addIssues = (e = []) => {
			this.issues = [...this.issues, ...e];
		};
		let t = new.target.prototype;
		Object.setPrototypeOf ? Object.setPrototypeOf(this, t) : this.__proto__ = t, this.name = "ZodError", this.issues = e;
	}
	format(e) {
		let t = e || function(e) {
			return e.message;
		}, n = { _errors: [] }, r = (e) => {
			for (let i of e.issues) if (i.code === "invalid_union") i.unionErrors.map(r);
			else if (i.code === "invalid_return_type") r(i.returnTypeError);
			else if (i.code === "invalid_arguments") r(i.argumentsError);
			else if (i.path.length === 0) n._errors.push(t(i));
			else {
				let e = n, r = 0;
				for (; r < i.path.length;) {
					let n = i.path[r];
					r === i.path.length - 1 ? (e[n] = e[n] || { _errors: [] }, e[n]._errors.push(t(i))) : e[n] = e[n] || { _errors: [] }, e = e[n], r++;
				}
			}
		};
		return r(this), n;
	}
	static assert(t) {
		if (!(t instanceof e)) throw Error(`Not a ZodError: ${t}`);
	}
	toString() {
		return this.message;
	}
	get message() {
		return JSON.stringify(this.issues, j.jsonStringifyReplacer, 2);
	}
	get isEmpty() {
		return this.issues.length === 0;
	}
	flatten(e = (e) => e.message) {
		let t = {}, n = [];
		for (let r of this.issues) if (r.path.length > 0) {
			let n = r.path[0];
			t[n] = t[n] || [], t[n].push(e(r));
		} else n.push(e(r));
		return {
			formErrors: n,
			fieldErrors: t
		};
	}
	get formErrors() {
		return this.flatten();
	}
};
F.create = (e) => new F(e);
//#endregion
//#region node_modules/zod/v3/locales/en.js
var Be = (e, t) => {
	let n;
	switch (e.code) {
		case P.invalid_type:
			n = e.received === M.undefined ? "Required" : `Expected ${e.expected}, received ${e.received}`;
			break;
		case P.invalid_literal:
			n = `Invalid literal value, expected ${JSON.stringify(e.expected, j.jsonStringifyReplacer)}`;
			break;
		case P.unrecognized_keys:
			n = `Unrecognized key(s) in object: ${j.joinValues(e.keys, ", ")}`;
			break;
		case P.invalid_union:
			n = "Invalid input";
			break;
		case P.invalid_union_discriminator:
			n = `Invalid discriminator value. Expected ${j.joinValues(e.options)}`;
			break;
		case P.invalid_enum_value:
			n = `Invalid enum value. Expected ${j.joinValues(e.options)}, received '${e.received}'`;
			break;
		case P.invalid_arguments:
			n = "Invalid function arguments";
			break;
		case P.invalid_return_type:
			n = "Invalid function return type";
			break;
		case P.invalid_date:
			n = "Invalid date";
			break;
		case P.invalid_string:
			typeof e.validation == "object" ? "includes" in e.validation ? (n = `Invalid input: must include "${e.validation.includes}"`, typeof e.validation.position == "number" && (n = `${n} at one or more positions greater than or equal to ${e.validation.position}`)) : "startsWith" in e.validation ? n = `Invalid input: must start with "${e.validation.startsWith}"` : "endsWith" in e.validation ? n = `Invalid input: must end with "${e.validation.endsWith}"` : j.assertNever(e.validation) : n = e.validation === "regex" ? "Invalid" : `Invalid ${e.validation}`;
			break;
		case P.too_small:
			n = e.type === "array" ? `Array must contain ${e.exact ? "exactly" : e.inclusive ? "at least" : "more than"} ${e.minimum} element(s)` : e.type === "string" ? `String must contain ${e.exact ? "exactly" : e.inclusive ? "at least" : "over"} ${e.minimum} character(s)` : e.type === "number" || e.type === "bigint" ? `Number must be ${e.exact ? "exactly equal to " : e.inclusive ? "greater than or equal to " : "greater than "}${e.minimum}` : e.type === "date" ? `Date must be ${e.exact ? "exactly equal to " : e.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(e.minimum))}` : "Invalid input";
			break;
		case P.too_big:
			n = e.type === "array" ? `Array must contain ${e.exact ? "exactly" : e.inclusive ? "at most" : "less than"} ${e.maximum} element(s)` : e.type === "string" ? `String must contain ${e.exact ? "exactly" : e.inclusive ? "at most" : "under"} ${e.maximum} character(s)` : e.type === "number" ? `Number must be ${e.exact ? "exactly" : e.inclusive ? "less than or equal to" : "less than"} ${e.maximum}` : e.type === "bigint" ? `BigInt must be ${e.exact ? "exactly" : e.inclusive ? "less than or equal to" : "less than"} ${e.maximum}` : e.type === "date" ? `Date must be ${e.exact ? "exactly" : e.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(e.maximum))}` : "Invalid input";
			break;
		case P.custom:
			n = "Invalid input";
			break;
		case P.invalid_intersection_types:
			n = "Intersection results could not be merged";
			break;
		case P.not_multiple_of:
			n = `Number must be a multiple of ${e.multipleOf}`;
			break;
		case P.not_finite:
			n = "Number must be finite";
			break;
		default: n = t.defaultError, j.assertNever(e);
	}
	return { message: n };
}, Ve = Be;
function He() {
	return Ve;
}
//#endregion
//#region node_modules/zod/v3/helpers/parseUtil.js
var Ue = (e) => {
	let { data: t, path: n, errorMaps: r, issueData: i } = e, a = [...n, ...i.path || []], o = {
		...i,
		path: a
	};
	if (i.message !== void 0) return {
		...i,
		path: a,
		message: i.message
	};
	let s = "", c = r.filter((e) => !!e).slice().reverse();
	for (let e of c) s = e(o, {
		data: t,
		defaultError: s
	}).message;
	return {
		...i,
		path: a,
		message: s
	};
};
function I(e, t) {
	let n = He(), r = Ue({
		issueData: t,
		data: e.data,
		path: e.path,
		errorMaps: [
			e.common.contextualErrorMap,
			e.schemaErrorMap,
			n,
			n === Be ? void 0 : Be
		].filter((e) => !!e)
	});
	e.common.issues.push(r);
}
var L = class e {
	constructor() {
		this.value = "valid";
	}
	dirty() {
		this.value === "valid" && (this.value = "dirty");
	}
	abort() {
		this.value !== "aborted" && (this.value = "aborted");
	}
	static mergeArray(e, t) {
		let n = [];
		for (let r of t) {
			if (r.status === "aborted") return R;
			r.status === "dirty" && e.dirty(), n.push(r.value);
		}
		return {
			status: e.value,
			value: n
		};
	}
	static async mergeObjectAsync(t, n) {
		let r = [];
		for (let e of n) {
			let t = await e.key, n = await e.value;
			r.push({
				key: t,
				value: n
			});
		}
		return e.mergeObjectSync(t, r);
	}
	static mergeObjectSync(e, t) {
		let n = {};
		for (let r of t) {
			let { key: t, value: i } = r;
			if (t.status === "aborted" || i.status === "aborted") return R;
			t.status === "dirty" && e.dirty(), i.status === "dirty" && e.dirty(), t.value !== "__proto__" && (i.value !== void 0 || r.alwaysSet) && (n[t.value] = i.value);
		}
		return {
			status: e.value,
			value: n
		};
	}
}, R = Object.freeze({ status: "aborted" }), We = (e) => ({
	status: "dirty",
	value: e
}), z = (e) => ({
	status: "valid",
	value: e
}), Ge = (e) => e.status === "aborted", Ke = (e) => e.status === "dirty", B = (e) => e.status === "valid", qe = (e) => typeof Promise < "u" && e instanceof Promise, V;
(function(e) {
	e.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, e.toString = (e) => typeof e == "string" ? e : e?.message;
})(V ||= {});
//#endregion
//#region node_modules/zod/v3/types.js
var H = class {
	constructor(e, t, n, r) {
		this._cachedPath = [], this.parent = e, this.data = t, this._path = n, this._key = r;
	}
	get path() {
		return this._cachedPath.length || (Array.isArray(this._key) ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
	}
}, Je = (e, t) => {
	if (B(t)) return {
		success: !0,
		data: t.value
	};
	if (!e.common.issues.length) throw Error("Validation failed but no issues detected.");
	return {
		success: !1,
		get error() {
			if (this._error) return this._error;
			let t = new F(e.common.issues);
			return this._error = t, this._error;
		}
	};
};
function U(e) {
	if (!e) return {};
	let { errorMap: t, invalid_type_error: n, required_error: r, description: i } = e;
	if (t && (n || r)) throw Error("Can't use \"invalid_type_error\" or \"required_error\" in conjunction with custom error map.");
	return t ? {
		errorMap: t,
		description: i
	} : {
		errorMap: (t, i) => {
			let { message: a } = e;
			return t.code === "invalid_enum_value" ? { message: a ?? i.defaultError } : i.data === void 0 ? { message: a ?? r ?? i.defaultError } : t.code === "invalid_type" ? { message: a ?? n ?? i.defaultError } : { message: i.defaultError };
		},
		description: i
	};
}
var W = class {
	get description() {
		return this._def.description;
	}
	_getType(e) {
		return N(e.data);
	}
	_getOrReturnCtx(e, t) {
		return t || {
			common: e.parent.common,
			data: e.data,
			parsedType: N(e.data),
			schemaErrorMap: this._def.errorMap,
			path: e.path,
			parent: e.parent
		};
	}
	_processInputParams(e) {
		return {
			status: new L(),
			ctx: {
				common: e.parent.common,
				data: e.data,
				parsedType: N(e.data),
				schemaErrorMap: this._def.errorMap,
				path: e.path,
				parent: e.parent
			}
		};
	}
	_parseSync(e) {
		let t = this._parse(e);
		if (qe(t)) throw Error("Synchronous parse encountered promise.");
		return t;
	}
	_parseAsync(e) {
		let t = this._parse(e);
		return Promise.resolve(t);
	}
	parse(e, t) {
		let n = this.safeParse(e, t);
		if (n.success) return n.data;
		throw n.error;
	}
	safeParse(e, t) {
		let n = {
			common: {
				issues: [],
				async: t?.async ?? !1,
				contextualErrorMap: t?.errorMap
			},
			path: t?.path || [],
			schemaErrorMap: this._def.errorMap,
			parent: null,
			data: e,
			parsedType: N(e)
		};
		return Je(n, this._parseSync({
			data: e,
			path: n.path,
			parent: n
		}));
	}
	"~validate"(e) {
		let t = {
			common: {
				issues: [],
				async: !!this["~standard"].async
			},
			path: [],
			schemaErrorMap: this._def.errorMap,
			parent: null,
			data: e,
			parsedType: N(e)
		};
		if (!this["~standard"].async) try {
			let n = this._parseSync({
				data: e,
				path: [],
				parent: t
			});
			return B(n) ? { value: n.value } : { issues: t.common.issues };
		} catch (e) {
			e?.message?.toLowerCase()?.includes("encountered") && (this["~standard"].async = !0), t.common = {
				issues: [],
				async: !0
			};
		}
		return this._parseAsync({
			data: e,
			path: [],
			parent: t
		}).then((e) => B(e) ? { value: e.value } : { issues: t.common.issues });
	}
	async parseAsync(e, t) {
		let n = await this.safeParseAsync(e, t);
		if (n.success) return n.data;
		throw n.error;
	}
	async safeParseAsync(e, t) {
		let n = {
			common: {
				issues: [],
				contextualErrorMap: t?.errorMap,
				async: !0
			},
			path: t?.path || [],
			schemaErrorMap: this._def.errorMap,
			parent: null,
			data: e,
			parsedType: N(e)
		}, r = this._parse({
			data: e,
			path: n.path,
			parent: n
		});
		return Je(n, await (qe(r) ? r : Promise.resolve(r)));
	}
	refine(e, t) {
		let n = (e) => typeof t == "string" || t === void 0 ? { message: t } : typeof t == "function" ? t(e) : t;
		return this._refinement((t, r) => {
			let i = e(t), a = () => r.addIssue({
				code: P.custom,
				...n(t)
			});
			return typeof Promise < "u" && i instanceof Promise ? i.then((e) => e ? !0 : (a(), !1)) : i ? !0 : (a(), !1);
		});
	}
	refinement(e, t) {
		return this._refinement((n, r) => e(n) ? !0 : (r.addIssue(typeof t == "function" ? t(n, r) : t), !1));
	}
	_refinement(e) {
		return new Y({
			schema: this,
			typeName: Q.ZodEffects,
			effect: {
				type: "refinement",
				refinement: e
			}
		});
	}
	superRefine(e) {
		return this._refinement(e);
	}
	constructor(e) {
		this.spa = this.safeParseAsync, this._def = e, this.parse = this.parse.bind(this), this.safeParse = this.safeParse.bind(this), this.parseAsync = this.parseAsync.bind(this), this.safeParseAsync = this.safeParseAsync.bind(this), this.spa = this.spa.bind(this), this.refine = this.refine.bind(this), this.refinement = this.refinement.bind(this), this.superRefine = this.superRefine.bind(this), this.optional = this.optional.bind(this), this.nullable = this.nullable.bind(this), this.nullish = this.nullish.bind(this), this.array = this.array.bind(this), this.promise = this.promise.bind(this), this.or = this.or.bind(this), this.and = this.and.bind(this), this.transform = this.transform.bind(this), this.brand = this.brand.bind(this), this.default = this.default.bind(this), this.catch = this.catch.bind(this), this.describe = this.describe.bind(this), this.pipe = this.pipe.bind(this), this.readonly = this.readonly.bind(this), this.isNullable = this.isNullable.bind(this), this.isOptional = this.isOptional.bind(this), this["~standard"] = {
			version: 1,
			vendor: "zod",
			validate: (e) => this["~validate"](e)
		};
	}
	optional() {
		return X.create(this, this._def);
	}
	nullable() {
		return Z.create(this, this._def);
	}
	nullish() {
		return this.nullable().optional();
	}
	array() {
		return jt.create(this);
	}
	promise() {
		return Kt.create(this, this._def);
	}
	or(e) {
		return Nt.create([this, e], this._def);
	}
	and(e) {
		return It.create(this, e, this._def);
	}
	transform(e) {
		return new Y({
			...U(this._def),
			schema: this,
			typeName: Q.ZodEffects,
			effect: {
				type: "transform",
				transform: e
			}
		});
	}
	default(e) {
		let t = typeof e == "function" ? e : () => e;
		return new qt({
			...U(this._def),
			innerType: this,
			defaultValue: t,
			typeName: Q.ZodDefault
		});
	}
	brand() {
		return new Xt({
			typeName: Q.ZodBranded,
			type: this,
			...U(this._def)
		});
	}
	catch(e) {
		let t = typeof e == "function" ? e : () => e;
		return new Jt({
			...U(this._def),
			innerType: this,
			catchValue: t,
			typeName: Q.ZodCatch
		});
	}
	describe(e) {
		let t = this.constructor;
		return new t({
			...this._def,
			description: e
		});
	}
	pipe(e) {
		return Zt.create(this, e);
	}
	readonly() {
		return Qt.create(this);
	}
	isOptional() {
		return this.safeParse(void 0).success;
	}
	isNullable() {
		return this.safeParse(null).success;
	}
}, Ye = /^c[^\s-]{8,}$/i, Xe = /^[0-9a-z]+$/, Ze = /^[0-9A-HJKMNP-TV-Z]{26}$/i, Qe = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, $e = /^[a-z0-9_-]{21}$/i, et = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, tt = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, nt = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, rt = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$", it, at = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, ot = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/, st = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/, ct = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, lt = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, ut = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/, dt = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", ft = RegExp(`^${dt}$`);
function pt(e) {
	let t = "[0-5]\\d";
	e.precision ? t = `${t}\\.\\d{${e.precision}}` : e.precision ?? (t = `${t}(\\.\\d+)?`);
	let n = e.precision ? "+" : "?";
	return `([01]\\d|2[0-3]):[0-5]\\d(:${t})${n}`;
}
function mt(e) {
	return RegExp(`^${pt(e)}$`);
}
function ht(e) {
	let t = `${dt}T${pt(e)}`, n = [];
	return n.push(e.local ? "Z?" : "Z"), e.offset && n.push("([+-]\\d{2}:?\\d{2})"), t = `${t}(${n.join("|")})`, RegExp(`^${t}$`);
}
function gt(e, t) {
	return !!((t === "v4" || !t) && at.test(e) || (t === "v6" || !t) && st.test(e));
}
function _t(e, t) {
	if (!et.test(e)) return !1;
	try {
		let [n] = e.split(".");
		if (!n) return !1;
		let r = n.replace(/-/g, "+").replace(/_/g, "/").padEnd(n.length + (4 - n.length % 4) % 4, "="), i = JSON.parse(atob(r));
		return !(typeof i != "object" || !i || "typ" in i && i?.typ !== "JWT" || !i.alg || t && i.alg !== t);
	} catch {
		return !1;
	}
}
function vt(e, t) {
	return !!((t === "v4" || !t) && ot.test(e) || (t === "v6" || !t) && ct.test(e));
}
var yt = class e extends W {
	_parse(e) {
		if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== M.string) {
			let t = this._getOrReturnCtx(e);
			return I(t, {
				code: P.invalid_type,
				expected: M.string,
				received: t.parsedType
			}), R;
		}
		let t = new L(), n;
		for (let r of this._def.checks) if (r.kind === "min") e.data.length < r.value && (n = this._getOrReturnCtx(e, n), I(n, {
			code: P.too_small,
			minimum: r.value,
			type: "string",
			inclusive: !0,
			exact: !1,
			message: r.message
		}), t.dirty());
		else if (r.kind === "max") e.data.length > r.value && (n = this._getOrReturnCtx(e, n), I(n, {
			code: P.too_big,
			maximum: r.value,
			type: "string",
			inclusive: !0,
			exact: !1,
			message: r.message
		}), t.dirty());
		else if (r.kind === "length") {
			let i = e.data.length > r.value, a = e.data.length < r.value;
			(i || a) && (n = this._getOrReturnCtx(e, n), i ? I(n, {
				code: P.too_big,
				maximum: r.value,
				type: "string",
				inclusive: !0,
				exact: !0,
				message: r.message
			}) : a && I(n, {
				code: P.too_small,
				minimum: r.value,
				type: "string",
				inclusive: !0,
				exact: !0,
				message: r.message
			}), t.dirty());
		} else if (r.kind === "email") nt.test(e.data) || (n = this._getOrReturnCtx(e, n), I(n, {
			validation: "email",
			code: P.invalid_string,
			message: r.message
		}), t.dirty());
		else if (r.kind === "emoji") it ||= new RegExp(rt, "u"), it.test(e.data) || (n = this._getOrReturnCtx(e, n), I(n, {
			validation: "emoji",
			code: P.invalid_string,
			message: r.message
		}), t.dirty());
		else if (r.kind === "uuid") Qe.test(e.data) || (n = this._getOrReturnCtx(e, n), I(n, {
			validation: "uuid",
			code: P.invalid_string,
			message: r.message
		}), t.dirty());
		else if (r.kind === "nanoid") $e.test(e.data) || (n = this._getOrReturnCtx(e, n), I(n, {
			validation: "nanoid",
			code: P.invalid_string,
			message: r.message
		}), t.dirty());
		else if (r.kind === "cuid") Ye.test(e.data) || (n = this._getOrReturnCtx(e, n), I(n, {
			validation: "cuid",
			code: P.invalid_string,
			message: r.message
		}), t.dirty());
		else if (r.kind === "cuid2") Xe.test(e.data) || (n = this._getOrReturnCtx(e, n), I(n, {
			validation: "cuid2",
			code: P.invalid_string,
			message: r.message
		}), t.dirty());
		else if (r.kind === "ulid") Ze.test(e.data) || (n = this._getOrReturnCtx(e, n), I(n, {
			validation: "ulid",
			code: P.invalid_string,
			message: r.message
		}), t.dirty());
		else if (r.kind === "url") try {
			new URL(e.data);
		} catch {
			n = this._getOrReturnCtx(e, n), I(n, {
				validation: "url",
				code: P.invalid_string,
				message: r.message
			}), t.dirty();
		}
		else r.kind === "regex" ? (r.regex.lastIndex = 0, r.regex.test(e.data) || (n = this._getOrReturnCtx(e, n), I(n, {
			validation: "regex",
			code: P.invalid_string,
			message: r.message
		}), t.dirty())) : r.kind === "trim" ? e.data = e.data.trim() : r.kind === "includes" ? e.data.includes(r.value, r.position) || (n = this._getOrReturnCtx(e, n), I(n, {
			code: P.invalid_string,
			validation: {
				includes: r.value,
				position: r.position
			},
			message: r.message
		}), t.dirty()) : r.kind === "toLowerCase" ? e.data = e.data.toLowerCase() : r.kind === "toUpperCase" ? e.data = e.data.toUpperCase() : r.kind === "startsWith" ? e.data.startsWith(r.value) || (n = this._getOrReturnCtx(e, n), I(n, {
			code: P.invalid_string,
			validation: { startsWith: r.value },
			message: r.message
		}), t.dirty()) : r.kind === "endsWith" ? e.data.endsWith(r.value) || (n = this._getOrReturnCtx(e, n), I(n, {
			code: P.invalid_string,
			validation: { endsWith: r.value },
			message: r.message
		}), t.dirty()) : r.kind === "datetime" ? ht(r).test(e.data) || (n = this._getOrReturnCtx(e, n), I(n, {
			code: P.invalid_string,
			validation: "datetime",
			message: r.message
		}), t.dirty()) : r.kind === "date" ? ft.test(e.data) || (n = this._getOrReturnCtx(e, n), I(n, {
			code: P.invalid_string,
			validation: "date",
			message: r.message
		}), t.dirty()) : r.kind === "time" ? mt(r).test(e.data) || (n = this._getOrReturnCtx(e, n), I(n, {
			code: P.invalid_string,
			validation: "time",
			message: r.message
		}), t.dirty()) : r.kind === "duration" ? tt.test(e.data) || (n = this._getOrReturnCtx(e, n), I(n, {
			validation: "duration",
			code: P.invalid_string,
			message: r.message
		}), t.dirty()) : r.kind === "ip" ? gt(e.data, r.version) || (n = this._getOrReturnCtx(e, n), I(n, {
			validation: "ip",
			code: P.invalid_string,
			message: r.message
		}), t.dirty()) : r.kind === "jwt" ? _t(e.data, r.alg) || (n = this._getOrReturnCtx(e, n), I(n, {
			validation: "jwt",
			code: P.invalid_string,
			message: r.message
		}), t.dirty()) : r.kind === "cidr" ? vt(e.data, r.version) || (n = this._getOrReturnCtx(e, n), I(n, {
			validation: "cidr",
			code: P.invalid_string,
			message: r.message
		}), t.dirty()) : r.kind === "base64" ? lt.test(e.data) || (n = this._getOrReturnCtx(e, n), I(n, {
			validation: "base64",
			code: P.invalid_string,
			message: r.message
		}), t.dirty()) : r.kind === "base64url" ? ut.test(e.data) || (n = this._getOrReturnCtx(e, n), I(n, {
			validation: "base64url",
			code: P.invalid_string,
			message: r.message
		}), t.dirty()) : j.assertNever(r);
		return {
			status: t.value,
			value: e.data
		};
	}
	_regex(e, t, n) {
		return this.refinement((t) => e.test(t), {
			validation: t,
			code: P.invalid_string,
			...V.errToObj(n)
		});
	}
	_addCheck(t) {
		return new e({
			...this._def,
			checks: [...this._def.checks, t]
		});
	}
	email(e) {
		return this._addCheck({
			kind: "email",
			...V.errToObj(e)
		});
	}
	url(e) {
		return this._addCheck({
			kind: "url",
			...V.errToObj(e)
		});
	}
	emoji(e) {
		return this._addCheck({
			kind: "emoji",
			...V.errToObj(e)
		});
	}
	uuid(e) {
		return this._addCheck({
			kind: "uuid",
			...V.errToObj(e)
		});
	}
	nanoid(e) {
		return this._addCheck({
			kind: "nanoid",
			...V.errToObj(e)
		});
	}
	cuid(e) {
		return this._addCheck({
			kind: "cuid",
			...V.errToObj(e)
		});
	}
	cuid2(e) {
		return this._addCheck({
			kind: "cuid2",
			...V.errToObj(e)
		});
	}
	ulid(e) {
		return this._addCheck({
			kind: "ulid",
			...V.errToObj(e)
		});
	}
	base64(e) {
		return this._addCheck({
			kind: "base64",
			...V.errToObj(e)
		});
	}
	base64url(e) {
		return this._addCheck({
			kind: "base64url",
			...V.errToObj(e)
		});
	}
	jwt(e) {
		return this._addCheck({
			kind: "jwt",
			...V.errToObj(e)
		});
	}
	ip(e) {
		return this._addCheck({
			kind: "ip",
			...V.errToObj(e)
		});
	}
	cidr(e) {
		return this._addCheck({
			kind: "cidr",
			...V.errToObj(e)
		});
	}
	datetime(e) {
		return typeof e == "string" ? this._addCheck({
			kind: "datetime",
			precision: null,
			offset: !1,
			local: !1,
			message: e
		}) : this._addCheck({
			kind: "datetime",
			precision: e?.precision === void 0 ? null : e?.precision,
			offset: e?.offset ?? !1,
			local: e?.local ?? !1,
			...V.errToObj(e?.message)
		});
	}
	date(e) {
		return this._addCheck({
			kind: "date",
			message: e
		});
	}
	time(e) {
		return typeof e == "string" ? this._addCheck({
			kind: "time",
			precision: null,
			message: e
		}) : this._addCheck({
			kind: "time",
			precision: e?.precision === void 0 ? null : e?.precision,
			...V.errToObj(e?.message)
		});
	}
	duration(e) {
		return this._addCheck({
			kind: "duration",
			...V.errToObj(e)
		});
	}
	regex(e, t) {
		return this._addCheck({
			kind: "regex",
			regex: e,
			...V.errToObj(t)
		});
	}
	includes(e, t) {
		return this._addCheck({
			kind: "includes",
			value: e,
			position: t?.position,
			...V.errToObj(t?.message)
		});
	}
	startsWith(e, t) {
		return this._addCheck({
			kind: "startsWith",
			value: e,
			...V.errToObj(t)
		});
	}
	endsWith(e, t) {
		return this._addCheck({
			kind: "endsWith",
			value: e,
			...V.errToObj(t)
		});
	}
	min(e, t) {
		return this._addCheck({
			kind: "min",
			value: e,
			...V.errToObj(t)
		});
	}
	max(e, t) {
		return this._addCheck({
			kind: "max",
			value: e,
			...V.errToObj(t)
		});
	}
	length(e, t) {
		return this._addCheck({
			kind: "length",
			value: e,
			...V.errToObj(t)
		});
	}
	nonempty(e) {
		return this.min(1, V.errToObj(e));
	}
	trim() {
		return new e({
			...this._def,
			checks: [...this._def.checks, { kind: "trim" }]
		});
	}
	toLowerCase() {
		return new e({
			...this._def,
			checks: [...this._def.checks, { kind: "toLowerCase" }]
		});
	}
	toUpperCase() {
		return new e({
			...this._def,
			checks: [...this._def.checks, { kind: "toUpperCase" }]
		});
	}
	get isDatetime() {
		return !!this._def.checks.find((e) => e.kind === "datetime");
	}
	get isDate() {
		return !!this._def.checks.find((e) => e.kind === "date");
	}
	get isTime() {
		return !!this._def.checks.find((e) => e.kind === "time");
	}
	get isDuration() {
		return !!this._def.checks.find((e) => e.kind === "duration");
	}
	get isEmail() {
		return !!this._def.checks.find((e) => e.kind === "email");
	}
	get isURL() {
		return !!this._def.checks.find((e) => e.kind === "url");
	}
	get isEmoji() {
		return !!this._def.checks.find((e) => e.kind === "emoji");
	}
	get isUUID() {
		return !!this._def.checks.find((e) => e.kind === "uuid");
	}
	get isNANOID() {
		return !!this._def.checks.find((e) => e.kind === "nanoid");
	}
	get isCUID() {
		return !!this._def.checks.find((e) => e.kind === "cuid");
	}
	get isCUID2() {
		return !!this._def.checks.find((e) => e.kind === "cuid2");
	}
	get isULID() {
		return !!this._def.checks.find((e) => e.kind === "ulid");
	}
	get isIP() {
		return !!this._def.checks.find((e) => e.kind === "ip");
	}
	get isCIDR() {
		return !!this._def.checks.find((e) => e.kind === "cidr");
	}
	get isBase64() {
		return !!this._def.checks.find((e) => e.kind === "base64");
	}
	get isBase64url() {
		return !!this._def.checks.find((e) => e.kind === "base64url");
	}
	get minLength() {
		let e = null;
		for (let t of this._def.checks) t.kind === "min" && (e === null || t.value > e) && (e = t.value);
		return e;
	}
	get maxLength() {
		let e = null;
		for (let t of this._def.checks) t.kind === "max" && (e === null || t.value < e) && (e = t.value);
		return e;
	}
};
yt.create = (e) => new yt({
	checks: [],
	typeName: Q.ZodString,
	coerce: e?.coerce ?? !1,
	...U(e)
});
function bt(e, t) {
	let n = (e.toString().split(".")[1] || "").length, r = (t.toString().split(".")[1] || "").length, i = n > r ? n : r;
	return Number.parseInt(e.toFixed(i).replace(".", "")) % Number.parseInt(t.toFixed(i).replace(".", "")) / 10 ** i;
}
var xt = class e extends W {
	constructor() {
		super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
	}
	_parse(e) {
		if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== M.number) {
			let t = this._getOrReturnCtx(e);
			return I(t, {
				code: P.invalid_type,
				expected: M.number,
				received: t.parsedType
			}), R;
		}
		let t, n = new L();
		for (let r of this._def.checks) r.kind === "int" ? j.isInteger(e.data) || (t = this._getOrReturnCtx(e, t), I(t, {
			code: P.invalid_type,
			expected: "integer",
			received: "float",
			message: r.message
		}), n.dirty()) : r.kind === "min" ? (r.inclusive ? e.data < r.value : e.data <= r.value) && (t = this._getOrReturnCtx(e, t), I(t, {
			code: P.too_small,
			minimum: r.value,
			type: "number",
			inclusive: r.inclusive,
			exact: !1,
			message: r.message
		}), n.dirty()) : r.kind === "max" ? (r.inclusive ? e.data > r.value : e.data >= r.value) && (t = this._getOrReturnCtx(e, t), I(t, {
			code: P.too_big,
			maximum: r.value,
			type: "number",
			inclusive: r.inclusive,
			exact: !1,
			message: r.message
		}), n.dirty()) : r.kind === "multipleOf" ? bt(e.data, r.value) !== 0 && (t = this._getOrReturnCtx(e, t), I(t, {
			code: P.not_multiple_of,
			multipleOf: r.value,
			message: r.message
		}), n.dirty()) : r.kind === "finite" ? Number.isFinite(e.data) || (t = this._getOrReturnCtx(e, t), I(t, {
			code: P.not_finite,
			message: r.message
		}), n.dirty()) : j.assertNever(r);
		return {
			status: n.value,
			value: e.data
		};
	}
	gte(e, t) {
		return this.setLimit("min", e, !0, V.toString(t));
	}
	gt(e, t) {
		return this.setLimit("min", e, !1, V.toString(t));
	}
	lte(e, t) {
		return this.setLimit("max", e, !0, V.toString(t));
	}
	lt(e, t) {
		return this.setLimit("max", e, !1, V.toString(t));
	}
	setLimit(t, n, r, i) {
		return new e({
			...this._def,
			checks: [...this._def.checks, {
				kind: t,
				value: n,
				inclusive: r,
				message: V.toString(i)
			}]
		});
	}
	_addCheck(t) {
		return new e({
			...this._def,
			checks: [...this._def.checks, t]
		});
	}
	int(e) {
		return this._addCheck({
			kind: "int",
			message: V.toString(e)
		});
	}
	positive(e) {
		return this._addCheck({
			kind: "min",
			value: 0,
			inclusive: !1,
			message: V.toString(e)
		});
	}
	negative(e) {
		return this._addCheck({
			kind: "max",
			value: 0,
			inclusive: !1,
			message: V.toString(e)
		});
	}
	nonpositive(e) {
		return this._addCheck({
			kind: "max",
			value: 0,
			inclusive: !0,
			message: V.toString(e)
		});
	}
	nonnegative(e) {
		return this._addCheck({
			kind: "min",
			value: 0,
			inclusive: !0,
			message: V.toString(e)
		});
	}
	multipleOf(e, t) {
		return this._addCheck({
			kind: "multipleOf",
			value: e,
			message: V.toString(t)
		});
	}
	finite(e) {
		return this._addCheck({
			kind: "finite",
			message: V.toString(e)
		});
	}
	safe(e) {
		return this._addCheck({
			kind: "min",
			inclusive: !0,
			value: -(2 ** 53 - 1),
			message: V.toString(e)
		})._addCheck({
			kind: "max",
			inclusive: !0,
			value: 2 ** 53 - 1,
			message: V.toString(e)
		});
	}
	get minValue() {
		let e = null;
		for (let t of this._def.checks) t.kind === "min" && (e === null || t.value > e) && (e = t.value);
		return e;
	}
	get maxValue() {
		let e = null;
		for (let t of this._def.checks) t.kind === "max" && (e === null || t.value < e) && (e = t.value);
		return e;
	}
	get isInt() {
		return !!this._def.checks.find((e) => e.kind === "int" || e.kind === "multipleOf" && j.isInteger(e.value));
	}
	get isFinite() {
		let e = null, t = null;
		for (let n of this._def.checks) if (n.kind === "finite" || n.kind === "int" || n.kind === "multipleOf") return !0;
		else n.kind === "min" ? (t === null || n.value > t) && (t = n.value) : n.kind === "max" && (e === null || n.value < e) && (e = n.value);
		return Number.isFinite(t) && Number.isFinite(e);
	}
};
xt.create = (e) => new xt({
	checks: [],
	typeName: Q.ZodNumber,
	coerce: e?.coerce || !1,
	...U(e)
});
var St = class e extends W {
	constructor() {
		super(...arguments), this.min = this.gte, this.max = this.lte;
	}
	_parse(e) {
		if (this._def.coerce) try {
			e.data = BigInt(e.data);
		} catch {
			return this._getInvalidInput(e);
		}
		if (this._getType(e) !== M.bigint) return this._getInvalidInput(e);
		let t, n = new L();
		for (let r of this._def.checks) r.kind === "min" ? (r.inclusive ? e.data < r.value : e.data <= r.value) && (t = this._getOrReturnCtx(e, t), I(t, {
			code: P.too_small,
			type: "bigint",
			minimum: r.value,
			inclusive: r.inclusive,
			message: r.message
		}), n.dirty()) : r.kind === "max" ? (r.inclusive ? e.data > r.value : e.data >= r.value) && (t = this._getOrReturnCtx(e, t), I(t, {
			code: P.too_big,
			type: "bigint",
			maximum: r.value,
			inclusive: r.inclusive,
			message: r.message
		}), n.dirty()) : r.kind === "multipleOf" ? e.data % r.value !== BigInt(0) && (t = this._getOrReturnCtx(e, t), I(t, {
			code: P.not_multiple_of,
			multipleOf: r.value,
			message: r.message
		}), n.dirty()) : j.assertNever(r);
		return {
			status: n.value,
			value: e.data
		};
	}
	_getInvalidInput(e) {
		let t = this._getOrReturnCtx(e);
		return I(t, {
			code: P.invalid_type,
			expected: M.bigint,
			received: t.parsedType
		}), R;
	}
	gte(e, t) {
		return this.setLimit("min", e, !0, V.toString(t));
	}
	gt(e, t) {
		return this.setLimit("min", e, !1, V.toString(t));
	}
	lte(e, t) {
		return this.setLimit("max", e, !0, V.toString(t));
	}
	lt(e, t) {
		return this.setLimit("max", e, !1, V.toString(t));
	}
	setLimit(t, n, r, i) {
		return new e({
			...this._def,
			checks: [...this._def.checks, {
				kind: t,
				value: n,
				inclusive: r,
				message: V.toString(i)
			}]
		});
	}
	_addCheck(t) {
		return new e({
			...this._def,
			checks: [...this._def.checks, t]
		});
	}
	positive(e) {
		return this._addCheck({
			kind: "min",
			value: BigInt(0),
			inclusive: !1,
			message: V.toString(e)
		});
	}
	negative(e) {
		return this._addCheck({
			kind: "max",
			value: BigInt(0),
			inclusive: !1,
			message: V.toString(e)
		});
	}
	nonpositive(e) {
		return this._addCheck({
			kind: "max",
			value: BigInt(0),
			inclusive: !0,
			message: V.toString(e)
		});
	}
	nonnegative(e) {
		return this._addCheck({
			kind: "min",
			value: BigInt(0),
			inclusive: !0,
			message: V.toString(e)
		});
	}
	multipleOf(e, t) {
		return this._addCheck({
			kind: "multipleOf",
			value: e,
			message: V.toString(t)
		});
	}
	get minValue() {
		let e = null;
		for (let t of this._def.checks) t.kind === "min" && (e === null || t.value > e) && (e = t.value);
		return e;
	}
	get maxValue() {
		let e = null;
		for (let t of this._def.checks) t.kind === "max" && (e === null || t.value < e) && (e = t.value);
		return e;
	}
};
St.create = (e) => new St({
	checks: [],
	typeName: Q.ZodBigInt,
	coerce: e?.coerce ?? !1,
	...U(e)
});
var Ct = class extends W {
	_parse(e) {
		if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== M.boolean) {
			let t = this._getOrReturnCtx(e);
			return I(t, {
				code: P.invalid_type,
				expected: M.boolean,
				received: t.parsedType
			}), R;
		}
		return z(e.data);
	}
};
Ct.create = (e) => new Ct({
	typeName: Q.ZodBoolean,
	coerce: e?.coerce || !1,
	...U(e)
});
var wt = class e extends W {
	_parse(e) {
		if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== M.date) {
			let t = this._getOrReturnCtx(e);
			return I(t, {
				code: P.invalid_type,
				expected: M.date,
				received: t.parsedType
			}), R;
		}
		if (Number.isNaN(e.data.getTime())) return I(this._getOrReturnCtx(e), { code: P.invalid_date }), R;
		let t = new L(), n;
		for (let r of this._def.checks) r.kind === "min" ? e.data.getTime() < r.value && (n = this._getOrReturnCtx(e, n), I(n, {
			code: P.too_small,
			message: r.message,
			inclusive: !0,
			exact: !1,
			minimum: r.value,
			type: "date"
		}), t.dirty()) : r.kind === "max" ? e.data.getTime() > r.value && (n = this._getOrReturnCtx(e, n), I(n, {
			code: P.too_big,
			message: r.message,
			inclusive: !0,
			exact: !1,
			maximum: r.value,
			type: "date"
		}), t.dirty()) : j.assertNever(r);
		return {
			status: t.value,
			value: new Date(e.data.getTime())
		};
	}
	_addCheck(t) {
		return new e({
			...this._def,
			checks: [...this._def.checks, t]
		});
	}
	min(e, t) {
		return this._addCheck({
			kind: "min",
			value: e.getTime(),
			message: V.toString(t)
		});
	}
	max(e, t) {
		return this._addCheck({
			kind: "max",
			value: e.getTime(),
			message: V.toString(t)
		});
	}
	get minDate() {
		let e = null;
		for (let t of this._def.checks) t.kind === "min" && (e === null || t.value > e) && (e = t.value);
		return e == null ? null : new Date(e);
	}
	get maxDate() {
		let e = null;
		for (let t of this._def.checks) t.kind === "max" && (e === null || t.value < e) && (e = t.value);
		return e == null ? null : new Date(e);
	}
};
wt.create = (e) => new wt({
	checks: [],
	coerce: e?.coerce || !1,
	typeName: Q.ZodDate,
	...U(e)
});
var Tt = class extends W {
	_parse(e) {
		if (this._getType(e) !== M.symbol) {
			let t = this._getOrReturnCtx(e);
			return I(t, {
				code: P.invalid_type,
				expected: M.symbol,
				received: t.parsedType
			}), R;
		}
		return z(e.data);
	}
};
Tt.create = (e) => new Tt({
	typeName: Q.ZodSymbol,
	...U(e)
});
var Et = class extends W {
	_parse(e) {
		if (this._getType(e) !== M.undefined) {
			let t = this._getOrReturnCtx(e);
			return I(t, {
				code: P.invalid_type,
				expected: M.undefined,
				received: t.parsedType
			}), R;
		}
		return z(e.data);
	}
};
Et.create = (e) => new Et({
	typeName: Q.ZodUndefined,
	...U(e)
});
var Dt = class extends W {
	_parse(e) {
		if (this._getType(e) !== M.null) {
			let t = this._getOrReturnCtx(e);
			return I(t, {
				code: P.invalid_type,
				expected: M.null,
				received: t.parsedType
			}), R;
		}
		return z(e.data);
	}
};
Dt.create = (e) => new Dt({
	typeName: Q.ZodNull,
	...U(e)
});
var Ot = class extends W {
	constructor() {
		super(...arguments), this._any = !0;
	}
	_parse(e) {
		return z(e.data);
	}
};
Ot.create = (e) => new Ot({
	typeName: Q.ZodAny,
	...U(e)
});
var kt = class extends W {
	constructor() {
		super(...arguments), this._unknown = !0;
	}
	_parse(e) {
		return z(e.data);
	}
};
kt.create = (e) => new kt({
	typeName: Q.ZodUnknown,
	...U(e)
});
var G = class extends W {
	_parse(e) {
		let t = this._getOrReturnCtx(e);
		return I(t, {
			code: P.invalid_type,
			expected: M.never,
			received: t.parsedType
		}), R;
	}
};
G.create = (e) => new G({
	typeName: Q.ZodNever,
	...U(e)
});
var At = class extends W {
	_parse(e) {
		if (this._getType(e) !== M.undefined) {
			let t = this._getOrReturnCtx(e);
			return I(t, {
				code: P.invalid_type,
				expected: M.void,
				received: t.parsedType
			}), R;
		}
		return z(e.data);
	}
};
At.create = (e) => new At({
	typeName: Q.ZodVoid,
	...U(e)
});
var jt = class e extends W {
	_parse(e) {
		let { ctx: t, status: n } = this._processInputParams(e), r = this._def;
		if (t.parsedType !== M.array) return I(t, {
			code: P.invalid_type,
			expected: M.array,
			received: t.parsedType
		}), R;
		if (r.exactLength !== null) {
			let e = t.data.length > r.exactLength.value, i = t.data.length < r.exactLength.value;
			(e || i) && (I(t, {
				code: e ? P.too_big : P.too_small,
				minimum: i ? r.exactLength.value : void 0,
				maximum: e ? r.exactLength.value : void 0,
				type: "array",
				inclusive: !0,
				exact: !0,
				message: r.exactLength.message
			}), n.dirty());
		}
		if (r.minLength !== null && t.data.length < r.minLength.value && (I(t, {
			code: P.too_small,
			minimum: r.minLength.value,
			type: "array",
			inclusive: !0,
			exact: !1,
			message: r.minLength.message
		}), n.dirty()), r.maxLength !== null && t.data.length > r.maxLength.value && (I(t, {
			code: P.too_big,
			maximum: r.maxLength.value,
			type: "array",
			inclusive: !0,
			exact: !1,
			message: r.maxLength.message
		}), n.dirty()), t.common.async) return Promise.all([...t.data].map((e, n) => r.type._parseAsync(new H(t, e, t.path, n)))).then((e) => L.mergeArray(n, e));
		let i = [...t.data].map((e, n) => r.type._parseSync(new H(t, e, t.path, n)));
		return L.mergeArray(n, i);
	}
	get element() {
		return this._def.type;
	}
	min(t, n) {
		return new e({
			...this._def,
			minLength: {
				value: t,
				message: V.toString(n)
			}
		});
	}
	max(t, n) {
		return new e({
			...this._def,
			maxLength: {
				value: t,
				message: V.toString(n)
			}
		});
	}
	length(t, n) {
		return new e({
			...this._def,
			exactLength: {
				value: t,
				message: V.toString(n)
			}
		});
	}
	nonempty(e) {
		return this.min(1, e);
	}
};
jt.create = (e, t) => new jt({
	type: e,
	minLength: null,
	maxLength: null,
	exactLength: null,
	typeName: Q.ZodArray,
	...U(t)
});
function Mt(e) {
	if (e instanceof K) {
		let t = {};
		for (let n in e.shape) {
			let r = e.shape[n];
			t[n] = X.create(Mt(r));
		}
		return new K({
			...e._def,
			shape: () => t
		});
	} else if (e instanceof jt) return new jt({
		...e._def,
		type: Mt(e.element)
	});
	else if (e instanceof X) return X.create(Mt(e.unwrap()));
	else if (e instanceof Z) return Z.create(Mt(e.unwrap()));
	else if (e instanceof J) return J.create(e.items.map((e) => Mt(e)));
	else return e;
}
var K = class e extends W {
	constructor() {
		super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
	}
	_getCached() {
		if (this._cached !== null) return this._cached;
		let e = this._def.shape(), t = j.objectKeys(e);
		return this._cached = {
			shape: e,
			keys: t
		}, this._cached;
	}
	_parse(e) {
		if (this._getType(e) !== M.object) {
			let t = this._getOrReturnCtx(e);
			return I(t, {
				code: P.invalid_type,
				expected: M.object,
				received: t.parsedType
			}), R;
		}
		let { status: t, ctx: n } = this._processInputParams(e), { shape: r, keys: i } = this._getCached(), a = [];
		if (!(this._def.catchall instanceof G && this._def.unknownKeys === "strip")) for (let e in n.data) i.includes(e) || a.push(e);
		let o = [];
		for (let e of i) {
			let t = r[e], i = n.data[e];
			o.push({
				key: {
					status: "valid",
					value: e
				},
				value: t._parse(new H(n, i, n.path, e)),
				alwaysSet: e in n.data
			});
		}
		if (this._def.catchall instanceof G) {
			let e = this._def.unknownKeys;
			if (e === "passthrough") for (let e of a) o.push({
				key: {
					status: "valid",
					value: e
				},
				value: {
					status: "valid",
					value: n.data[e]
				}
			});
			else if (e === "strict") a.length > 0 && (I(n, {
				code: P.unrecognized_keys,
				keys: a
			}), t.dirty());
			else if (e !== "strip") throw Error("Internal ZodObject error: invalid unknownKeys value.");
		} else {
			let e = this._def.catchall;
			for (let t of a) {
				let r = n.data[t];
				o.push({
					key: {
						status: "valid",
						value: t
					},
					value: e._parse(new H(n, r, n.path, t)),
					alwaysSet: t in n.data
				});
			}
		}
		return n.common.async ? Promise.resolve().then(async () => {
			let e = [];
			for (let t of o) {
				let n = await t.key, r = await t.value;
				e.push({
					key: n,
					value: r,
					alwaysSet: t.alwaysSet
				});
			}
			return e;
		}).then((e) => L.mergeObjectSync(t, e)) : L.mergeObjectSync(t, o);
	}
	get shape() {
		return this._def.shape();
	}
	strict(t) {
		return V.errToObj, new e({
			...this._def,
			unknownKeys: "strict",
			...t === void 0 ? {} : { errorMap: (e, n) => {
				let r = this._def.errorMap?.(e, n).message ?? n.defaultError;
				return e.code === "unrecognized_keys" ? { message: V.errToObj(t).message ?? r } : { message: r };
			} }
		});
	}
	strip() {
		return new e({
			...this._def,
			unknownKeys: "strip"
		});
	}
	passthrough() {
		return new e({
			...this._def,
			unknownKeys: "passthrough"
		});
	}
	extend(t) {
		return new e({
			...this._def,
			shape: () => ({
				...this._def.shape(),
				...t
			})
		});
	}
	merge(t) {
		return new e({
			unknownKeys: t._def.unknownKeys,
			catchall: t._def.catchall,
			shape: () => ({
				...this._def.shape(),
				...t._def.shape()
			}),
			typeName: Q.ZodObject
		});
	}
	setKey(e, t) {
		return this.augment({ [e]: t });
	}
	catchall(t) {
		return new e({
			...this._def,
			catchall: t
		});
	}
	pick(t) {
		let n = {};
		for (let e of j.objectKeys(t)) t[e] && this.shape[e] && (n[e] = this.shape[e]);
		return new e({
			...this._def,
			shape: () => n
		});
	}
	omit(t) {
		let n = {};
		for (let e of j.objectKeys(this.shape)) t[e] || (n[e] = this.shape[e]);
		return new e({
			...this._def,
			shape: () => n
		});
	}
	deepPartial() {
		return Mt(this);
	}
	partial(t) {
		let n = {};
		for (let e of j.objectKeys(this.shape)) {
			let r = this.shape[e];
			t && !t[e] ? n[e] = r : n[e] = r.optional();
		}
		return new e({
			...this._def,
			shape: () => n
		});
	}
	required(t) {
		let n = {};
		for (let e of j.objectKeys(this.shape)) if (t && !t[e]) n[e] = this.shape[e];
		else {
			let t = this.shape[e];
			for (; t instanceof X;) t = t._def.innerType;
			n[e] = t;
		}
		return new e({
			...this._def,
			shape: () => n
		});
	}
	keyof() {
		return Ut(j.objectKeys(this.shape));
	}
};
K.create = (e, t) => new K({
	shape: () => e,
	unknownKeys: "strip",
	catchall: G.create(),
	typeName: Q.ZodObject,
	...U(t)
}), K.strictCreate = (e, t) => new K({
	shape: () => e,
	unknownKeys: "strict",
	catchall: G.create(),
	typeName: Q.ZodObject,
	...U(t)
}), K.lazycreate = (e, t) => new K({
	shape: e,
	unknownKeys: "strip",
	catchall: G.create(),
	typeName: Q.ZodObject,
	...U(t)
});
var Nt = class extends W {
	_parse(e) {
		let { ctx: t } = this._processInputParams(e), n = this._def.options;
		function r(e) {
			for (let t of e) if (t.result.status === "valid") return t.result;
			for (let n of e) if (n.result.status === "dirty") return t.common.issues.push(...n.ctx.common.issues), n.result;
			let n = e.map((e) => new F(e.ctx.common.issues));
			return I(t, {
				code: P.invalid_union,
				unionErrors: n
			}), R;
		}
		if (t.common.async) return Promise.all(n.map(async (e) => {
			let n = {
				...t,
				common: {
					...t.common,
					issues: []
				},
				parent: null
			};
			return {
				result: await e._parseAsync({
					data: t.data,
					path: t.path,
					parent: n
				}),
				ctx: n
			};
		})).then(r);
		{
			let e, r = [];
			for (let i of n) {
				let n = {
					...t,
					common: {
						...t.common,
						issues: []
					},
					parent: null
				}, a = i._parseSync({
					data: t.data,
					path: t.path,
					parent: n
				});
				if (a.status === "valid") return a;
				a.status === "dirty" && !e && (e = {
					result: a,
					ctx: n
				}), n.common.issues.length && r.push(n.common.issues);
			}
			if (e) return t.common.issues.push(...e.ctx.common.issues), e.result;
			let i = r.map((e) => new F(e));
			return I(t, {
				code: P.invalid_union,
				unionErrors: i
			}), R;
		}
	}
	get options() {
		return this._def.options;
	}
};
Nt.create = (e, t) => new Nt({
	options: e,
	typeName: Q.ZodUnion,
	...U(t)
});
var q = (e) => e instanceof Vt ? q(e.schema) : e instanceof Y ? q(e.innerType()) : e instanceof Ht ? [e.value] : e instanceof Wt ? e.options : e instanceof Gt ? j.objectValues(e.enum) : e instanceof qt ? q(e._def.innerType) : e instanceof Et ? [void 0] : e instanceof Dt ? [null] : e instanceof X ? [void 0, ...q(e.unwrap())] : e instanceof Z ? [null, ...q(e.unwrap())] : e instanceof Xt || e instanceof Qt ? q(e.unwrap()) : e instanceof Jt ? q(e._def.innerType) : [], Pt = class e extends W {
	_parse(e) {
		let { ctx: t } = this._processInputParams(e);
		if (t.parsedType !== M.object) return I(t, {
			code: P.invalid_type,
			expected: M.object,
			received: t.parsedType
		}), R;
		let n = this.discriminator, r = t.data[n], i = this.optionsMap.get(r);
		return i ? t.common.async ? i._parseAsync({
			data: t.data,
			path: t.path,
			parent: t
		}) : i._parseSync({
			data: t.data,
			path: t.path,
			parent: t
		}) : (I(t, {
			code: P.invalid_union_discriminator,
			options: Array.from(this.optionsMap.keys()),
			path: [n]
		}), R);
	}
	get discriminator() {
		return this._def.discriminator;
	}
	get options() {
		return this._def.options;
	}
	get optionsMap() {
		return this._def.optionsMap;
	}
	static create(t, n, r) {
		let i = /* @__PURE__ */ new Map();
		for (let e of n) {
			let n = q(e.shape[t]);
			if (!n.length) throw Error(`A discriminator value for key \`${t}\` could not be extracted from all schema options`);
			for (let r of n) {
				if (i.has(r)) throw Error(`Discriminator property ${String(t)} has duplicate value ${String(r)}`);
				i.set(r, e);
			}
		}
		return new e({
			typeName: Q.ZodDiscriminatedUnion,
			discriminator: t,
			options: n,
			optionsMap: i,
			...U(r)
		});
	}
};
function Ft(e, t) {
	let n = N(e), r = N(t);
	if (e === t) return {
		valid: !0,
		data: e
	};
	if (n === M.object && r === M.object) {
		let n = j.objectKeys(t), r = j.objectKeys(e).filter((e) => n.indexOf(e) !== -1), i = {
			...e,
			...t
		};
		for (let n of r) {
			let r = Ft(e[n], t[n]);
			if (!r.valid) return { valid: !1 };
			i[n] = r.data;
		}
		return {
			valid: !0,
			data: i
		};
	} else if (n === M.array && r === M.array) {
		if (e.length !== t.length) return { valid: !1 };
		let n = [];
		for (let r = 0; r < e.length; r++) {
			let i = e[r], a = t[r], o = Ft(i, a);
			if (!o.valid) return { valid: !1 };
			n.push(o.data);
		}
		return {
			valid: !0,
			data: n
		};
	} else if (n === M.date && r === M.date && +e == +t) return {
		valid: !0,
		data: e
	};
	else return { valid: !1 };
}
var It = class extends W {
	_parse(e) {
		let { status: t, ctx: n } = this._processInputParams(e), r = (e, r) => {
			if (Ge(e) || Ge(r)) return R;
			let i = Ft(e.value, r.value);
			return i.valid ? ((Ke(e) || Ke(r)) && t.dirty(), {
				status: t.value,
				value: i.data
			}) : (I(n, { code: P.invalid_intersection_types }), R);
		};
		return n.common.async ? Promise.all([this._def.left._parseAsync({
			data: n.data,
			path: n.path,
			parent: n
		}), this._def.right._parseAsync({
			data: n.data,
			path: n.path,
			parent: n
		})]).then(([e, t]) => r(e, t)) : r(this._def.left._parseSync({
			data: n.data,
			path: n.path,
			parent: n
		}), this._def.right._parseSync({
			data: n.data,
			path: n.path,
			parent: n
		}));
	}
};
It.create = (e, t, n) => new It({
	left: e,
	right: t,
	typeName: Q.ZodIntersection,
	...U(n)
});
var J = class e extends W {
	_parse(e) {
		let { status: t, ctx: n } = this._processInputParams(e);
		if (n.parsedType !== M.array) return I(n, {
			code: P.invalid_type,
			expected: M.array,
			received: n.parsedType
		}), R;
		if (n.data.length < this._def.items.length) return I(n, {
			code: P.too_small,
			minimum: this._def.items.length,
			inclusive: !0,
			exact: !1,
			type: "array"
		}), R;
		!this._def.rest && n.data.length > this._def.items.length && (I(n, {
			code: P.too_big,
			maximum: this._def.items.length,
			inclusive: !0,
			exact: !1,
			type: "array"
		}), t.dirty());
		let r = [...n.data].map((e, t) => {
			let r = this._def.items[t] || this._def.rest;
			return r ? r._parse(new H(n, e, n.path, t)) : null;
		}).filter((e) => !!e);
		return n.common.async ? Promise.all(r).then((e) => L.mergeArray(t, e)) : L.mergeArray(t, r);
	}
	get items() {
		return this._def.items;
	}
	rest(t) {
		return new e({
			...this._def,
			rest: t
		});
	}
};
J.create = (e, t) => {
	if (!Array.isArray(e)) throw Error("You must pass an array of schemas to z.tuple([ ... ])");
	return new J({
		items: e,
		typeName: Q.ZodTuple,
		rest: null,
		...U(t)
	});
};
var Lt = class e extends W {
	get keySchema() {
		return this._def.keyType;
	}
	get valueSchema() {
		return this._def.valueType;
	}
	_parse(e) {
		let { status: t, ctx: n } = this._processInputParams(e);
		if (n.parsedType !== M.object) return I(n, {
			code: P.invalid_type,
			expected: M.object,
			received: n.parsedType
		}), R;
		let r = [], i = this._def.keyType, a = this._def.valueType;
		for (let e in n.data) r.push({
			key: i._parse(new H(n, e, n.path, e)),
			value: a._parse(new H(n, n.data[e], n.path, e)),
			alwaysSet: e in n.data
		});
		return n.common.async ? L.mergeObjectAsync(t, r) : L.mergeObjectSync(t, r);
	}
	get element() {
		return this._def.valueType;
	}
	static create(t, n, r) {
		return n instanceof W ? new e({
			keyType: t,
			valueType: n,
			typeName: Q.ZodRecord,
			...U(r)
		}) : new e({
			keyType: yt.create(),
			valueType: t,
			typeName: Q.ZodRecord,
			...U(n)
		});
	}
}, Rt = class extends W {
	get keySchema() {
		return this._def.keyType;
	}
	get valueSchema() {
		return this._def.valueType;
	}
	_parse(e) {
		let { status: t, ctx: n } = this._processInputParams(e);
		if (n.parsedType !== M.map) return I(n, {
			code: P.invalid_type,
			expected: M.map,
			received: n.parsedType
		}), R;
		let r = this._def.keyType, i = this._def.valueType, a = [...n.data.entries()].map(([e, t], a) => ({
			key: r._parse(new H(n, e, n.path, [a, "key"])),
			value: i._parse(new H(n, t, n.path, [a, "value"]))
		}));
		if (n.common.async) {
			let e = /* @__PURE__ */ new Map();
			return Promise.resolve().then(async () => {
				for (let n of a) {
					let r = await n.key, i = await n.value;
					if (r.status === "aborted" || i.status === "aborted") return R;
					(r.status === "dirty" || i.status === "dirty") && t.dirty(), e.set(r.value, i.value);
				}
				return {
					status: t.value,
					value: e
				};
			});
		} else {
			let e = /* @__PURE__ */ new Map();
			for (let n of a) {
				let r = n.key, i = n.value;
				if (r.status === "aborted" || i.status === "aborted") return R;
				(r.status === "dirty" || i.status === "dirty") && t.dirty(), e.set(r.value, i.value);
			}
			return {
				status: t.value,
				value: e
			};
		}
	}
};
Rt.create = (e, t, n) => new Rt({
	valueType: t,
	keyType: e,
	typeName: Q.ZodMap,
	...U(n)
});
var zt = class e extends W {
	_parse(e) {
		let { status: t, ctx: n } = this._processInputParams(e);
		if (n.parsedType !== M.set) return I(n, {
			code: P.invalid_type,
			expected: M.set,
			received: n.parsedType
		}), R;
		let r = this._def;
		r.minSize !== null && n.data.size < r.minSize.value && (I(n, {
			code: P.too_small,
			minimum: r.minSize.value,
			type: "set",
			inclusive: !0,
			exact: !1,
			message: r.minSize.message
		}), t.dirty()), r.maxSize !== null && n.data.size > r.maxSize.value && (I(n, {
			code: P.too_big,
			maximum: r.maxSize.value,
			type: "set",
			inclusive: !0,
			exact: !1,
			message: r.maxSize.message
		}), t.dirty());
		let i = this._def.valueType;
		function a(e) {
			let n = /* @__PURE__ */ new Set();
			for (let r of e) {
				if (r.status === "aborted") return R;
				r.status === "dirty" && t.dirty(), n.add(r.value);
			}
			return {
				status: t.value,
				value: n
			};
		}
		let o = [...n.data.values()].map((e, t) => i._parse(new H(n, e, n.path, t)));
		return n.common.async ? Promise.all(o).then((e) => a(e)) : a(o);
	}
	min(t, n) {
		return new e({
			...this._def,
			minSize: {
				value: t,
				message: V.toString(n)
			}
		});
	}
	max(t, n) {
		return new e({
			...this._def,
			maxSize: {
				value: t,
				message: V.toString(n)
			}
		});
	}
	size(e, t) {
		return this.min(e, t).max(e, t);
	}
	nonempty(e) {
		return this.min(1, e);
	}
};
zt.create = (e, t) => new zt({
	valueType: e,
	minSize: null,
	maxSize: null,
	typeName: Q.ZodSet,
	...U(t)
});
var Bt = class e extends W {
	constructor() {
		super(...arguments), this.validate = this.implement;
	}
	_parse(e) {
		let { ctx: t } = this._processInputParams(e);
		if (t.parsedType !== M.function) return I(t, {
			code: P.invalid_type,
			expected: M.function,
			received: t.parsedType
		}), R;
		function n(e, n) {
			return Ue({
				data: e,
				path: t.path,
				errorMaps: [
					t.common.contextualErrorMap,
					t.schemaErrorMap,
					He(),
					Be
				].filter((e) => !!e),
				issueData: {
					code: P.invalid_arguments,
					argumentsError: n
				}
			});
		}
		function r(e, n) {
			return Ue({
				data: e,
				path: t.path,
				errorMaps: [
					t.common.contextualErrorMap,
					t.schemaErrorMap,
					He(),
					Be
				].filter((e) => !!e),
				issueData: {
					code: P.invalid_return_type,
					returnTypeError: n
				}
			});
		}
		let i = { errorMap: t.common.contextualErrorMap }, a = t.data;
		if (this._def.returns instanceof Kt) {
			let e = this;
			return z(async function(...t) {
				let o = new F([]), s = await e._def.args.parseAsync(t, i).catch((e) => {
					throw o.addIssue(n(t, e)), o;
				}), c = await Reflect.apply(a, this, s);
				return await e._def.returns._def.type.parseAsync(c, i).catch((e) => {
					throw o.addIssue(r(c, e)), o;
				});
			});
		} else {
			let e = this;
			return z(function(...t) {
				let o = e._def.args.safeParse(t, i);
				if (!o.success) throw new F([n(t, o.error)]);
				let s = Reflect.apply(a, this, o.data), c = e._def.returns.safeParse(s, i);
				if (!c.success) throw new F([r(s, c.error)]);
				return c.data;
			});
		}
	}
	parameters() {
		return this._def.args;
	}
	returnType() {
		return this._def.returns;
	}
	args(...t) {
		return new e({
			...this._def,
			args: J.create(t).rest(kt.create())
		});
	}
	returns(t) {
		return new e({
			...this._def,
			returns: t
		});
	}
	implement(e) {
		return this.parse(e);
	}
	strictImplement(e) {
		return this.parse(e);
	}
	static create(t, n, r) {
		return new e({
			args: t || J.create([]).rest(kt.create()),
			returns: n || kt.create(),
			typeName: Q.ZodFunction,
			...U(r)
		});
	}
}, Vt = class extends W {
	get schema() {
		return this._def.getter();
	}
	_parse(e) {
		let { ctx: t } = this._processInputParams(e);
		return this._def.getter()._parse({
			data: t.data,
			path: t.path,
			parent: t
		});
	}
};
Vt.create = (e, t) => new Vt({
	getter: e,
	typeName: Q.ZodLazy,
	...U(t)
});
var Ht = class extends W {
	_parse(e) {
		if (e.data !== this._def.value) {
			let t = this._getOrReturnCtx(e);
			return I(t, {
				received: t.data,
				code: P.invalid_literal,
				expected: this._def.value
			}), R;
		}
		return {
			status: "valid",
			value: e.data
		};
	}
	get value() {
		return this._def.value;
	}
};
Ht.create = (e, t) => new Ht({
	value: e,
	typeName: Q.ZodLiteral,
	...U(t)
});
function Ut(e, t) {
	return new Wt({
		values: e,
		typeName: Q.ZodEnum,
		...U(t)
	});
}
var Wt = class e extends W {
	_parse(e) {
		if (typeof e.data != "string") {
			let t = this._getOrReturnCtx(e), n = this._def.values;
			return I(t, {
				expected: j.joinValues(n),
				received: t.parsedType,
				code: P.invalid_type
			}), R;
		}
		if (this._cache ||= new Set(this._def.values), !this._cache.has(e.data)) {
			let t = this._getOrReturnCtx(e), n = this._def.values;
			return I(t, {
				received: t.data,
				code: P.invalid_enum_value,
				options: n
			}), R;
		}
		return z(e.data);
	}
	get options() {
		return this._def.values;
	}
	get enum() {
		let e = {};
		for (let t of this._def.values) e[t] = t;
		return e;
	}
	get Values() {
		let e = {};
		for (let t of this._def.values) e[t] = t;
		return e;
	}
	get Enum() {
		let e = {};
		for (let t of this._def.values) e[t] = t;
		return e;
	}
	extract(t, n = this._def) {
		return e.create(t, {
			...this._def,
			...n
		});
	}
	exclude(t, n = this._def) {
		return e.create(this.options.filter((e) => !t.includes(e)), {
			...this._def,
			...n
		});
	}
};
Wt.create = Ut;
var Gt = class extends W {
	_parse(e) {
		let t = j.getValidEnumValues(this._def.values), n = this._getOrReturnCtx(e);
		if (n.parsedType !== M.string && n.parsedType !== M.number) {
			let e = j.objectValues(t);
			return I(n, {
				expected: j.joinValues(e),
				received: n.parsedType,
				code: P.invalid_type
			}), R;
		}
		if (this._cache ||= new Set(j.getValidEnumValues(this._def.values)), !this._cache.has(e.data)) {
			let e = j.objectValues(t);
			return I(n, {
				received: n.data,
				code: P.invalid_enum_value,
				options: e
			}), R;
		}
		return z(e.data);
	}
	get enum() {
		return this._def.values;
	}
};
Gt.create = (e, t) => new Gt({
	values: e,
	typeName: Q.ZodNativeEnum,
	...U(t)
});
var Kt = class extends W {
	unwrap() {
		return this._def.type;
	}
	_parse(e) {
		let { ctx: t } = this._processInputParams(e);
		return t.parsedType !== M.promise && t.common.async === !1 ? (I(t, {
			code: P.invalid_type,
			expected: M.promise,
			received: t.parsedType
		}), R) : z((t.parsedType === M.promise ? t.data : Promise.resolve(t.data)).then((e) => this._def.type.parseAsync(e, {
			path: t.path,
			errorMap: t.common.contextualErrorMap
		})));
	}
};
Kt.create = (e, t) => new Kt({
	type: e,
	typeName: Q.ZodPromise,
	...U(t)
});
var Y = class extends W {
	innerType() {
		return this._def.schema;
	}
	sourceType() {
		return this._def.schema._def.typeName === Q.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
	}
	_parse(e) {
		let { status: t, ctx: n } = this._processInputParams(e), r = this._def.effect || null, i = {
			addIssue: (e) => {
				I(n, e), e.fatal ? t.abort() : t.dirty();
			},
			get path() {
				return n.path;
			}
		};
		if (i.addIssue = i.addIssue.bind(i), r.type === "preprocess") {
			let e = r.transform(n.data, i);
			if (n.common.async) return Promise.resolve(e).then(async (e) => {
				if (t.value === "aborted") return R;
				let r = await this._def.schema._parseAsync({
					data: e,
					path: n.path,
					parent: n
				});
				return r.status === "aborted" ? R : r.status === "dirty" || t.value === "dirty" ? We(r.value) : r;
			});
			{
				if (t.value === "aborted") return R;
				let r = this._def.schema._parseSync({
					data: e,
					path: n.path,
					parent: n
				});
				return r.status === "aborted" ? R : r.status === "dirty" || t.value === "dirty" ? We(r.value) : r;
			}
		}
		if (r.type === "refinement") {
			let e = (e) => {
				let t = r.refinement(e, i);
				if (n.common.async) return Promise.resolve(t);
				if (t instanceof Promise) throw Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
				return e;
			};
			if (n.common.async === !1) {
				let r = this._def.schema._parseSync({
					data: n.data,
					path: n.path,
					parent: n
				});
				return r.status === "aborted" ? R : (r.status === "dirty" && t.dirty(), e(r.value), {
					status: t.value,
					value: r.value
				});
			} else return this._def.schema._parseAsync({
				data: n.data,
				path: n.path,
				parent: n
			}).then((n) => n.status === "aborted" ? R : (n.status === "dirty" && t.dirty(), e(n.value).then(() => ({
				status: t.value,
				value: n.value
			}))));
		}
		if (r.type === "transform") if (n.common.async === !1) {
			let e = this._def.schema._parseSync({
				data: n.data,
				path: n.path,
				parent: n
			});
			if (!B(e)) return R;
			let a = r.transform(e.value, i);
			if (a instanceof Promise) throw Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
			return {
				status: t.value,
				value: a
			};
		} else return this._def.schema._parseAsync({
			data: n.data,
			path: n.path,
			parent: n
		}).then((e) => B(e) ? Promise.resolve(r.transform(e.value, i)).then((e) => ({
			status: t.value,
			value: e
		})) : R);
		j.assertNever(r);
	}
};
Y.create = (e, t, n) => new Y({
	schema: e,
	typeName: Q.ZodEffects,
	effect: t,
	...U(n)
}), Y.createWithPreprocess = (e, t, n) => new Y({
	schema: t,
	effect: {
		type: "preprocess",
		transform: e
	},
	typeName: Q.ZodEffects,
	...U(n)
});
var X = class extends W {
	_parse(e) {
		return this._getType(e) === M.undefined ? z(void 0) : this._def.innerType._parse(e);
	}
	unwrap() {
		return this._def.innerType;
	}
};
X.create = (e, t) => new X({
	innerType: e,
	typeName: Q.ZodOptional,
	...U(t)
});
var Z = class extends W {
	_parse(e) {
		return this._getType(e) === M.null ? z(null) : this._def.innerType._parse(e);
	}
	unwrap() {
		return this._def.innerType;
	}
};
Z.create = (e, t) => new Z({
	innerType: e,
	typeName: Q.ZodNullable,
	...U(t)
});
var qt = class extends W {
	_parse(e) {
		let { ctx: t } = this._processInputParams(e), n = t.data;
		return t.parsedType === M.undefined && (n = this._def.defaultValue()), this._def.innerType._parse({
			data: n,
			path: t.path,
			parent: t
		});
	}
	removeDefault() {
		return this._def.innerType;
	}
};
qt.create = (e, t) => new qt({
	innerType: e,
	typeName: Q.ZodDefault,
	defaultValue: typeof t.default == "function" ? t.default : () => t.default,
	...U(t)
});
var Jt = class extends W {
	_parse(e) {
		let { ctx: t } = this._processInputParams(e), n = {
			...t,
			common: {
				...t.common,
				issues: []
			}
		}, r = this._def.innerType._parse({
			data: n.data,
			path: n.path,
			parent: { ...n }
		});
		return qe(r) ? r.then((e) => ({
			status: "valid",
			value: e.status === "valid" ? e.value : this._def.catchValue({
				get error() {
					return new F(n.common.issues);
				},
				input: n.data
			})
		})) : {
			status: "valid",
			value: r.status === "valid" ? r.value : this._def.catchValue({
				get error() {
					return new F(n.common.issues);
				},
				input: n.data
			})
		};
	}
	removeCatch() {
		return this._def.innerType;
	}
};
Jt.create = (e, t) => new Jt({
	innerType: e,
	typeName: Q.ZodCatch,
	catchValue: typeof t.catch == "function" ? t.catch : () => t.catch,
	...U(t)
});
var Yt = class extends W {
	_parse(e) {
		if (this._getType(e) !== M.nan) {
			let t = this._getOrReturnCtx(e);
			return I(t, {
				code: P.invalid_type,
				expected: M.nan,
				received: t.parsedType
			}), R;
		}
		return {
			status: "valid",
			value: e.data
		};
	}
};
Yt.create = (e) => new Yt({
	typeName: Q.ZodNaN,
	...U(e)
});
var Xt = class extends W {
	_parse(e) {
		let { ctx: t } = this._processInputParams(e), n = t.data;
		return this._def.type._parse({
			data: n,
			path: t.path,
			parent: t
		});
	}
	unwrap() {
		return this._def.type;
	}
}, Zt = class e extends W {
	_parse(e) {
		let { status: t, ctx: n } = this._processInputParams(e);
		if (n.common.async) return (async () => {
			let e = await this._def.in._parseAsync({
				data: n.data,
				path: n.path,
				parent: n
			});
			return e.status === "aborted" ? R : e.status === "dirty" ? (t.dirty(), We(e.value)) : this._def.out._parseAsync({
				data: e.value,
				path: n.path,
				parent: n
			});
		})();
		{
			let e = this._def.in._parseSync({
				data: n.data,
				path: n.path,
				parent: n
			});
			return e.status === "aborted" ? R : e.status === "dirty" ? (t.dirty(), {
				status: "dirty",
				value: e.value
			}) : this._def.out._parseSync({
				data: e.value,
				path: n.path,
				parent: n
			});
		}
	}
	static create(t, n) {
		return new e({
			in: t,
			out: n,
			typeName: Q.ZodPipeline
		});
	}
}, Qt = class extends W {
	_parse(e) {
		let t = this._def.innerType._parse(e), n = (e) => (B(e) && (e.value = Object.freeze(e.value)), e);
		return qe(t) ? t.then((e) => n(e)) : n(t);
	}
	unwrap() {
		return this._def.innerType;
	}
};
Qt.create = (e, t) => new Qt({
	innerType: e,
	typeName: Q.ZodReadonly,
	...U(t)
}), K.lazycreate;
var Q;
(function(e) {
	e.ZodString = "ZodString", e.ZodNumber = "ZodNumber", e.ZodNaN = "ZodNaN", e.ZodBigInt = "ZodBigInt", e.ZodBoolean = "ZodBoolean", e.ZodDate = "ZodDate", e.ZodSymbol = "ZodSymbol", e.ZodUndefined = "ZodUndefined", e.ZodNull = "ZodNull", e.ZodAny = "ZodAny", e.ZodUnknown = "ZodUnknown", e.ZodNever = "ZodNever", e.ZodVoid = "ZodVoid", e.ZodArray = "ZodArray", e.ZodObject = "ZodObject", e.ZodUnion = "ZodUnion", e.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", e.ZodIntersection = "ZodIntersection", e.ZodTuple = "ZodTuple", e.ZodRecord = "ZodRecord", e.ZodMap = "ZodMap", e.ZodSet = "ZodSet", e.ZodFunction = "ZodFunction", e.ZodLazy = "ZodLazy", e.ZodLiteral = "ZodLiteral", e.ZodEnum = "ZodEnum", e.ZodEffects = "ZodEffects", e.ZodNativeEnum = "ZodNativeEnum", e.ZodOptional = "ZodOptional", e.ZodNullable = "ZodNullable", e.ZodDefault = "ZodDefault", e.ZodCatch = "ZodCatch", e.ZodPromise = "ZodPromise", e.ZodBranded = "ZodBranded", e.ZodPipeline = "ZodPipeline", e.ZodReadonly = "ZodReadonly";
})(Q ||= {});
var $t = yt.create, $ = xt.create;
Yt.create, St.create, Ct.create, wt.create, Tt.create, Et.create, Dt.create, Ot.create, kt.create, G.create, At.create;
var en = jt.create, tn = K.create;
K.strictCreate;
var nn = Nt.create;
Pt.create, It.create;
var rn = J.create;
Lt.create, Rt.create, zt.create, Bt.create, Vt.create, Ht.create, Wt.create, Gt.create, Kt.create, Y.create, X.create, Z.create, Y.createWithPreprocess, Zt.create;
//#endregion
//#region src/schemas.ts
var an = rn([$().min(-180).max(180), $().min(-90).max(90)]), on = rn([
	$().min(-180).max(180),
	$().min(-90).max(90),
	$().min(-180).max(180),
	$().min(-90).max(90)
]), sn = tn({
	id: nn([$t(), $()]),
	lngLat: an
}), cn = (e) => sn.extend(e), ln = en(an).min(2, "Route must have at least 2 points");
//#endregion
export { sn as BasePointDataSchema, on as BoundsSchema, b as ClusterMarker, an as LngLatSchema, me as MakiMarker, v as Marker, Fe as MarkerClusterer, y as PinMarker, ue as PlaceMarker, Re as PolygonArea, fe as PriceMarker, pe as PulsingMarker, ln as RouteCoordinatesSchema, Le as RouteLine, Ie as RoutePointMarker, de as SimpleMarker, oe as VWorldMap, le as WeatherMarker, cn as createPointDataSchema, h as getVWorldMaxZoom, te as getVWorldStyle, m as getVWorldTileUrl, ee as redactVWorldUrl, _ as useMap, ne as useMapContext, re as useMapZoom };
