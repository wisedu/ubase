/*!
 * Globalize
 *
 * http://github.com/jquery/globalize
 *
 * Copyright Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 */
(function (j, g) { var r, w, l, x, p, v, u, t, m, a, k, y, q, c, n, s, z, o, i, h, d, f, e, b; r = function (A) { return new r.prototype.init(A) }; if (typeof require !== "undefined" && typeof exports !== "undefined" && typeof module !== "undefined") { module.exports = r } else { j.Globalize = r } r.cultures = {}; r.prototype = { constructor: r, init: function (A) { this.cultures = r.cultures; this.cultureSelector = A; return this } }; r.prototype.init.prototype = r.prototype; r.cultures["default"] = { name: "en", englishName: "English", nativeName: "English", isRTL: false, language: "en", numberFormat: { pattern: ["-n"], decimals: 2, ",": ",", ".": ".", groupSizes: [3], "+": "+", "-": "-", "NaN": "NaN", negativeInfinity: "-Infinity", positiveInfinity: "Infinity", percent: { pattern: ["-n %", "n %"], decimals: 2, groupSizes: [3], ",": ",", ".": ".", symbol: "%" }, currency: { pattern: ["($n)", "$n"], decimals: 2, groupSizes: [3], ",": ",", ".": ".", symbol: "$" } }, calendars: { standard: { name: "Gregorian_USEnglish", "/": "/", ":": ":", firstDay: 0, days: { names: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], namesAbbr: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], namesShort: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] }, months: { names: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""], namesAbbr: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""] }, AM: ["AM", "am", "AM"], PM: ["PM", "pm", "PM"], eras: [{ name: "A.D.", start: null, offset: 0 }], twoDigitYearMax: 2029, patterns: { d: "M/d/yyyy", D: "dddd, MMMM dd, yyyy", t: "h:mm tt", T: "h:mm:ss tt", f: "dddd, MMMM dd, yyyy h:mm tt", F: "dddd, MMMM dd, yyyy h:mm:ss tt", M: "MMMM dd", Y: "yyyy MMMM", S: "yyyy\u0027-\u0027MM\u0027-\u0027dd\u0027T\u0027HH\u0027:\u0027mm\u0027:\u0027ss" } } }, messages: {} }; r.cultures["default"].calendar = r.cultures["default"].calendars.standard; r.cultures.en = r.cultures["default"]; r.cultureSelector = "en"; w = /^0x[a-f0-9]+$/i; l = /^[+\-]?infinity$/i; x = /^[+\-]?\d*\.?\d*(e[+\-]?\d+)?$/; p = /^\s+|\s+$/g; v = function (D, C) { if (D.indexOf) { return D.indexOf(C) } for (var A = 0, B = D.length; A < B; A++) { if (D[A] === C) { return A } } return -1 }; u = function (B, A) { return B.substr(B.length - A.length) === A }; t = function () { var J, C, A, B, G, H, F = arguments[0] || {}, E = 1, D = arguments.length, I = false; if (typeof F === "boolean") { I = F; F = arguments[1] || {}; E = 2 } if (typeof F !== "object" && !a(F)) { F = {} } for (; E < D; E++) { if ((J = arguments[E]) != null) { for (C in J) { A = F[C]; B = J[C]; if (F === B) { continue } if (I && B && (k(B) || (G = m(B)))) { if (G) { G = false; H = A && m(A) ? A : [] } else { H = A && k(A) ? A : {} } F[C] = t(I, H, B) } else { if (B !== g) { F[C] = B } } } } } return F }; m = Array.isArray || function (A) { return Object.prototype.toString.call(A) === "[object Array]" }; a = function (A) { return Object.prototype.toString.call(A) === "[object Function]" }; k = function (A) { return Object.prototype.toString.call(A) === "[object Object]" }; y = function (B, A) { return B.indexOf(A) === 0 }; q = function (A) { return (A + "").replace(p, "") }; c = function (A) { if (isNaN(A)) { return NaN } return Math[A < 0 ? "ceil" : "floor"](A) }; n = function (D, B, C) { var A; for (A = D.length; A < B; A += 1) { D = (C ? ("0" + D) : (D + "0")) } return D }; s = function (D, A) { var C = 0, F = false; for (var E = 0, B = D.length; E < B; E++) { var G = D.charAt(E); switch (G) { case "'": if (F) { A.push("'") } else { C++ } F = false; break; case "\\": if (F) { A.push("\\") } F = !F; break; default: A.push(G); F = false; break } } return C }; z = function (E, D) { D = D || "F"; var C, B = E.patterns, A = D.length; if (A === 1) { C = B[D]; if (!C) { throw "Invalid date format string '" + D + "'." } D = C } else { if (A === 2 && D.charAt(0) === "%") { D = D.charAt(1) } } return D }; o = function (U, Y, Z) { var M = Z.calendar, I = M.convert, ab; if (!Y || !Y.length || Y === "i") { if (Z && Z.name.length) { if (I) { ab = o(U, M.patterns.F, Z) } else { var J = new Date(U.getTime()), Q = d(U, M.eras); J.setFullYear(f(U, M, Q)); ab = J.toLocaleString() } } else { ab = U.toString() } return ab } var V = M.eras, B = Y === "s"; Y = z(M, Y); ab = []; var F, W = ["0", "00", "000"], K, L, A = /([^d]|^)(d|dd)([^d]|$)/g, aa = 0, R = h(), C; function H(ac, af) { var ae, ad = ac + ""; if (af > 1 && ad.length < af) { ae = (W[af - 2] + ad); return ae.substr(ae.length - af, af) } else { ae = ad } return ae } function X() { if (K || L) { return K } K = A.test(Y); L = true; return K } function D(ad, ac) { if (C) { return C[ac] } switch (ac) { case 0: return ad.getFullYear(); case 1: return ad.getMonth(); case 2: return ad.getDate(); default: throw "Invalid part value " + ac } } if (!B && I) { C = I.fromGregorian(U) } for (; ;) { var G = R.lastIndex, P = R.exec(Y); var N = Y.slice(G, P ? P.index : Y.length); aa += s(N, ab); if (!P) { break } if (aa % 2) { ab.push(P[0]); continue } var S = P[0], E = S.length; switch (S) { case "ddd": case "dddd": var O = (E === 3) ? M.days.namesAbbr : M.days.names; ab.push(O[U.getDay()]); break; case "d": case "dd": K = true; ab.push(H(D(U, 2), E)); break; case "MMM": case "MMMM": var T = D(U, 1); ab.push((M.monthsGenitive && X()) ? (M.monthsGenitive[E === 3 ? "namesAbbr" : "names"][T]) : (M.months[E === 3 ? "namesAbbr" : "names"][T])); break; case "M": case "MM": ab.push(H(D(U, 1) + 1, E)); break; case "y": case "yy": case "yyyy": T = C ? C[0] : f(U, M, d(U, V), B); if (E < 4) { T = T % 100 } ab.push(H(T, E)); break; case "h": case "hh": F = U.getHours() % 12; if (F === 0) { F = 12 } ab.push(H(F, E)); break; case "H": case "HH": ab.push(H(U.getHours(), E)); break; case "m": case "mm": ab.push(H(U.getMinutes(), E)); break; case "s": case "ss": ab.push(H(U.getSeconds(), E)); break; case "t": case "tt": T = U.getHours() < 12 ? (M.AM ? M.AM[0] : " ") : (M.PM ? M.PM[0] : " "); ab.push(E === 1 ? T.charAt(0) : T); break; case "f": case "ff": case "fff": ab.push(H(U.getMilliseconds(), 3).substr(0, E)); break; case "z": case "zz": F = U.getTimezoneOffset() / 60; ab.push((F <= 0 ? "+" : "-") + H(Math.floor(Math.abs(F)), E)); break; case "zzz": F = U.getTimezoneOffset() / 60; ab.push((F <= 0 ? "+" : "-") + H(Math.floor(Math.abs(F)), 2) + ":" + H(Math.abs(U.getTimezoneOffset() % 60), 2)); break; case "g": case "gg": if (M.eras) { ab.push(M.eras[d(U, V)].name) } break; case "/": ab.push(M["/"]); break; default: throw "Invalid date format pattern '" + S + "'." } } return ab.join("") }; (function () { var A; A = function (H, I, P) { var F = P.groupSizes, B = F[0], C = 1, M = Math.pow(10, I), D = Math.round(H * M) / M; if (!isFinite(D)) { D = H } H = D; var G = H + "", O = "", L = G.split(/e/i), N = L.length > 1 ? parseInt(L[1], 10) : 0; G = L[0]; L = G.split("."); G = L[0]; O = L.length > 1 ? L[1] : ""; var E; if (N > 0) { O = n(O, N, false); G += O.slice(0, N); O = O.substr(N) } else { if (N < 0) { N = -N; G = n(G, N + 1, true); O = G.slice(-N, G.length) + O; G = G.slice(0, -N) } } if (I > 0) { O = P["."] + ((O.length > I) ? O.slice(0, I) : n(O, I)) } else { O = "" } var K = G.length - 1, Q = P[","], J = ""; while (K >= 0) { if (B === 0 || B > K) { return G.slice(0, K + 1) + (J.length ? (Q + J + O) : O) } J = G.slice(K - B + 1, K + 1) + (J.length ? (Q + J) : ""); K -= B; if (C < F.length) { B = F[C]; C++ } } return G.slice(0, K + 1) + Q + J + O }; i = function (M, L, F) { if (!isFinite(M)) { if (M === Infinity) { return F.numberFormat.positiveInfinity } if (M === -Infinity) { return F.numberFormat.negativeInfinity } return F.numberFormat.NaN } if (!L || L === "i") { return F.name.length ? M.toLocaleString() : M.toString() } L = L || "D"; var D = F.numberFormat, E = Math.abs(M), G = -1, K; if (L.length > 1) { G = parseInt(L.slice(1), 10) } var J = L.charAt(0).toUpperCase(), N; switch (J) { case "D": K = "n"; E = c(E); if (G !== -1) { E = n("" + E, G, true) } if (M < 0) { E = "-" + E } break; case "N": N = D; case "C": N = N || D.currency; case "P": N = N || D.percent; K = M < 0 ? N.pattern[0] : (N.pattern[1] || "n"); if (G === -1) { G = N.decimals } E = A(E * (J === "P" ? 100 : 1), G, N); break; default: throw "Bad number format specifier: " + J }var B = /n|\$|-|%/g, I = ""; for (; ;) { var H = B.lastIndex, C = B.exec(K); I += K.slice(H, C ? C.index : K.length); if (!C) { break } switch (C[0]) { case "n": I += E; break; case "$": I += D.currency.symbol; break; case "-": if (/[1-9]/.test(E)) { I += D["-"] } break; case "%": I += D.percent.symbol; break } } return I } }()); h = function () { return (/\/|dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|fff|ff|f|zzz|zz|z|gg|g/g) }; d = function (C, B) { if (!B) { return 0 } var F, E = C.getTime(); for (var D = 0, A = B.length; D < A; D++) { F = B[D].start; if (F === null || E >= F) { return D } } return 0 }; f = function (B, D, A, E) { var C = B.getFullYear(); if (!E && D.eras) { C -= D.eras[A].offset } return C }; (function () { var B, A, D, C, G, F, E; B = function (M, K) { if (K < 100) { var I = new Date(), H = d(I), L = f(I, M, H), J = M.twoDigitYearMax; J = typeof J === "string" ? new Date().getFullYear() % 100 + parseInt(J, 10) : J; K += L - (L % 100); if (K > J) { K -= 100 } } return K }; A = function (L, K, I) { var H, M = L.days, J = L._upperDays; if (!J) { L._upperDays = J = [E(M.names), E(M.namesAbbr), E(M.namesShort)] } K = F(K); if (I) { H = v(J[1], K); if (H === -1) { H = v(J[2], K) } } else { H = v(J[0], K) } return H }; D = function (O, N, J) { var H = O.months, I = O.monthsGenitive || O.months, L = O._upperMonths, M = O._upperMonthsGen; if (!L) { O._upperMonths = L = [E(H.names), E(H.namesAbbr)]; O._upperMonthsGen = M = [E(I.names), E(I.namesAbbr)] } N = F(N); var K = v(J ? L[1] : L[0], N); if (K < 0) { K = v(J ? M[1] : M[0], N) } return K }; C = function (H, S) { var U = H._parseRegExp; if (!U) { H._parseRegExp = U = {} } else { var L = U[S]; if (L) { return L } } var R = z(H, S).replace(/([\^\$\.\*\+\?\|\[\]\(\)\{\}])/g, "\\\\$1"), P = ["^"], I = [], O = 0, K = 0, X = h(), M; while ((M = X.exec(R)) !== null) { var W = R.slice(O, M.index); O = X.lastIndex; K += s(W, P); if (K % 2) { P.push(M[0]); continue } var J = M[0], N = J.length, T; switch (J) { case "dddd": case "ddd": case "MMMM": case "MMM": case "gg": case "g": T = "(\\D+)"; break; case "tt": case "t": T = "(\\D*)"; break; case "yyyy": case "fff": case "ff": case "f": T = "(\\d{" + N + "})"; break; case "dd": case "d": case "MM": case "M": case "yy": case "y": case "HH": case "H": case "hh": case "h": case "mm": case "m": case "ss": case "s": T = "(\\d\\d?)"; break; case "zzz": T = "([+-]?\\d\\d?:\\d{2})"; break; case "zz": case "z": T = "([+-]?\\d\\d?)"; break; case "/": T = "(\\/)"; break; default: throw "Invalid date format pattern '" + J + "'." }if (T) { P.push(T) } I.push(M[0]) } s(R.slice(O), P); P.push("$"); var V = P.join("").replace(/\s+/g, "\\s+"), Q = { regExp: V, groups: I }; return U[S] = Q }; G = function (J, H, I) { return J < H || J > I }; F = function (H) { return H.split("\u00A0").join(" ").toUpperCase() }; E = function (H) { var K = []; for (var J = 0, I = H.length; J < I; J++) { K[J] = F(H[J]) } return K }; e = function (ab, ai, aj) { ab = q(ab); var U = aj.calendar, ao = C(U, ai), O = new RegExp(ao.regExp).exec(ab); if (O === null) { return null } var ak = ao.groups, Z = null, S = null, an = null, am = null, T = null, M = 0, ae, ad = 0, al = 0, H = 0, J = null, V = false; for (var af = 0, ah = ak.length; af < ah; af++) { var I = O[af + 1]; if (I) { var aa = ak[af], L = aa.length, N = parseInt(I, 10); switch (aa) { case "dd": case "d": am = N; if (G(am, 1, 31)) { return null } break; case "MMM": case "MMMM": an = D(U, I, L === 3); if (G(an, 0, 11)) { return null } break; case "M": case "MM": an = N - 1; if (G(an, 0, 11)) { return null } break; case "y": case "yy": case "yyyy": S = L < 4 ? B(U, N) : N; if (G(S, 0, 9999)) { return null } break; case "h": case "hh": M = N; if (M === 12) { M = 0 } if (G(M, 0, 11)) { return null } break; case "H": case "HH": M = N; if (G(M, 0, 23)) { return null } break; case "m": case "mm": ad = N; if (G(ad, 0, 59)) { return null } break; case "s": case "ss": al = N; if (G(al, 0, 59)) { return null } break; case "tt": case "t": V = U.PM && (I === U.PM[0] || I === U.PM[1] || I === U.PM[2]); if (!V && (!U.AM || (I !== U.AM[0] && I !== U.AM[1] && I !== U.AM[2]))) { return null } break; case "f": case "ff": case "fff": H = N * Math.pow(10, 3 - L); if (G(H, 0, 999)) { return null } break; case "ddd": case "dddd": T = A(U, I, L === 3); if (G(T, 0, 6)) { return null } break; case "zzz": var K = I.split(/:/); if (K.length !== 2) { return null } ae = parseInt(K[0], 10); if (G(ae, -12, 13)) { return null } var Q = parseInt(K[1], 10); if (G(Q, 0, 59)) { return null } J = (ae * 60) + (y(I, "-") ? -Q : Q); break; case "z": case "zz": ae = N; if (G(ae, -12, 13)) { return null } J = ae * 60; break; case "g": case "gg": var W = I; if (!W || !U.eras) { return null } W = q(W.toLowerCase()); for (var ag = 0, ac = U.eras.length; ag < ac; ag++) { if (W === U.eras[ag].name.toLowerCase()) { Z = ag; break } } if (Z === null) { return null } break } } } var R = new Date(), Y, P = U.convert; Y = P ? P.fromGregorian(R)[0] : R.getFullYear(); if (S === null) { S = Y } else { if (U.eras) { S += U.eras[(Z || 0)].offset } } if (an === null) { an = 0 } if (am === null) { am = 1 } if (P) { R = P.toGregorian(S, an, am); if (R === null) { return null } } else { R.setFullYear(S, an, am); if (R.getDate() !== am) { return null } if (T !== null && R.getDay() !== T) { return null } } if (V && M < 12) { M += 12 } R.setHours(M, ad, al, H); if (J !== null) { var X = R.getMinutes() - (J + R.getTimezoneOffset()); R.setHours(R.getHours() + parseInt(X / 60, 10), X % 60) } return R } }()); b = function (D, C, B) { var F = C["-"], E = C["+"], A; switch (B) { case "n -": F = " " + F; E = " " + E; case "n-": if (u(D, F)) { A = ["-", D.substr(0, D.length - F.length)] } else { if (u(D, E)) { A = ["+", D.substr(0, D.length - E.length)] } } break; case "- n": F += " "; E += " "; case "-n": if (y(D, F)) { A = ["-", D.substr(F.length)] } else { if (y(D, E)) { A = ["+", D.substr(E.length)] } } break; case "(n)": if (y(D, "(") && u(D, ")")) { A = ["-", D.substr(1, D.length - 2)] } break }return A || ["", D] }; r.prototype.findClosestCulture = function (A) { return r.findClosestCulture.call(this, A) }; r.prototype.format = function (A, B, C) { return r.format.call(this, A, B, C) }; r.prototype.localize = function (A, B) { return r.localize.call(this, A, B) }; r.prototype.parseInt = function (B, A, C) { return r.parseInt.call(this, B, A, C) }; r.prototype.parseFloat = function (B, A, C) { return r.parseFloat.call(this, B, A, C) }; r.prototype.culture = function (A) { return r.culture.call(this, A) }; r.addCultureInfo = function (E, B, D) { var C = {}, A = false; if (typeof E !== "string") { D = E; E = this.culture().name; C = this.cultures[E] } else { if (typeof B !== "string") { D = B; A = (this.cultures[E] == null); C = this.cultures[E] || this.cultures["default"] } else { A = true; C = this.cultures[B] } } this.cultures[E] = t(true, {}, C, D); if (A) { this.cultures[E].calendar = this.cultures[E].calendars.standard } }; r.findClosestCulture = function (A) { var I; if (!A) { return this.findClosestCulture(this.cultureSelector) || this.cultures["default"] } if (typeof A === "string") { A = A.split(",") } if (m(A)) { var C, M = this.cultures, K = A, H, D = K.length, L = []; for (H = 0; H < D; H++) { A = q(K[H]); var B, G = A.split(";"); C = q(G[0]); if (G.length === 1) { B = 1 } else { A = q(G[1]); if (A.indexOf("q=") === 0) { A = A.substr(2); B = parseFloat(A); B = isNaN(B) ? 0 : B } else { B = 1 } } L.push({ lang: C, pri: B }) } L.sort(function (O, N) { if (O.pri < N.pri) { return 1 } else { if (O.pri > N.pri) { return -1 } } return 0 }); for (H = 0; H < D; H++) { C = L[H].lang; I = M[C]; if (I) { return I } } for (H = 0; H < D; H++) { C = L[H].lang; do { var J = C.lastIndexOf("-"); if (J === -1) { break } C = C.substr(0, J); I = M[C]; if (I) { return I } } while (1) } for (H = 0; H < D; H++) { C = L[H].lang; for (var F in M) { var E = M[F]; if (E.language == C) { return E } } } } else { if (typeof A === "object") { return A } } return I || null }; r.format = function (B, C, D) { var A = this.findClosestCulture(D); if (B instanceof Date) { B = o(B, C, A) } else { if (typeof B === "number") { B = i(B, C, A) } } return B }; r.localize = function (A, B) { return this.findClosestCulture(B).messages[A] || this.cultures["default"].messages[A] }; r.parseDate = function (I, G, E) { E = this.findClosestCulture(E); var C, A, B; if (G) { if (typeof G === "string") { G = [G] } if (G.length) { for (var F = 0, D = G.length; F < D; F++) { var H = G[F]; if (H) { C = e(I, H, E); if (C) { break } } } } } else { B = E.calendar.patterns; for (A in B) { C = e(I, B[A], E); if (C) { break } } } return C || null }; r.parseInt = function (B, A, C) { return c(r.parseFloat(B, A, C)) }; r.parseFloat = function (O, H, J) { if (typeof H !== "number") { J = H; H = 10 } var Q = this.findClosestCulture(J); var T = NaN, F = Q.numberFormat; if (O.indexOf(Q.numberFormat.currency.symbol) > -1) { O = O.replace(Q.numberFormat.currency.symbol, ""); O = O.replace(Q.numberFormat.currency["."], Q.numberFormat["."]) } if (O.indexOf(Q.numberFormat.percent.symbol) > -1) { O = O.replace(Q.numberFormat.percent.symbol, "") } O = O.replace(/ /g, ""); if (l.test(O)) { T = parseFloat(O) } else { if (!H && w.test(O)) { T = parseInt(O, 16) } else { var C = b(O, F, F.pattern[0]), S = C[0], I = C[1]; if (S === "" && F.pattern[0] !== "(n)") { C = b(O, F, "(n)"); S = C[0]; I = C[1] } if (S === "" && F.pattern[0] !== "-n") { C = b(O, F, "-n"); S = C[0]; I = C[1] } S = S || "+"; var N, K, R = I.indexOf("e"); if (R < 0) { R = I.indexOf("E") } if (R < 0) { K = I; N = null } else { K = I.substr(0, R); N = I.substr(R + 1) } var P, G, D = F["."], A = K.indexOf(D); if (A < 0) { P = K; G = null } else { P = K.substr(0, A); G = K.substr(A + D.length) } var L = F[","]; P = P.split(L).join(""); var E = L.replace(/\u00A0/g, " "); if (L !== E) { P = P.split(E).join("") } var M = S + P; if (G !== null) { M += "." + G } if (N !== null) { var B = b(N, F, "-n"); M += "e" + (B[0] || "+") + B[1] } if (x.test(M)) { T = parseFloat(M) } } } return T }; r.culture = function (A) { if (typeof A !== "undefined") { this.cultureSelector = A } return this.findClosestCulture(A) || this.cultures["default"] } }(this));


(function (window, undefined) {

	var Globalize;

	if (typeof require !== "undefined" &&
		typeof exports !== "undefined" &&
		typeof module !== "undefined") {
		// Assume CommonJS
		Globalize = require("globalize");
	} else {
		// Global variable
		Globalize = window.Globalize;
	}
	//添加多语言  王敏 2021-9-9
	var lan = {
		zh: {
			name: "zh",
			englishName: "Chinese (Simplified, PRC)",
			nativeName: "中文(中华人民共和国)",
			language: "zh-CHS",
			numberFormat: {
				"NaN": "非数字",
				negativeInfinity: "负无穷大",
				positiveInfinity: "正无穷大",
				percent: {
					pattern: ["-n%", "n%"]
				},
				currency: {
					pattern: ["$-n", "$n"],
					symbol: "¥"
				}
			},
			calendars: {
				standard: {
					days: {
						names: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
						namesAbbr: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
						namesShort: ["日", "一", "二", "三", "四", "五", "六"]
					},
					months: {
						names: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月", ""],
						namesAbbr: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月", ""]
					},
					AM: ["上午", "上午", "上午"],
					PM: ["下午", "下午", "下午"],
					eras: [{ "name": "公元", "start": null, "offset": 0 }],
					patterns: {
						d: "yyyy/M/d",
						D: "yyyy'年'M'月'd'日'",
						t: "H:mm",
						T: "H:mm:ss",
						f: "yyyy'年'M'月'd'日' H:mm",
						F: "yyyy'年'M'月'd'日' H:mm:ss",
						M: "M'月'd'日'",
						Y: "yyyy'年'M'月'"
					}
				}
			},
			pagerGoToPageString: "跳转:",
			pagerShowRowsString: "每页:",
			pagerRangeString: " 总记录数 ",
			pagerallString: " 总页数 ",
			pagerallstring: " 总页数 ",
			pagerPreviousButtonString: "上一页",
			pagerNextButtonString: "下一页",
			pagerFirstButtonsSring: "首页",
			pagerLastButtonString: "末页",
			emptyDataString: "没有数据",
			pagerrangestring: " 共计 ",
			loadText: "加载中..."
		},
		en: {
			name: "en",
			englishName: "english",
			nativeName: "english",
			language: "en",
			numberFormat: {
				"NaN": "not a number",
				negativeInfinity: "minus infinity",
				positiveInfinity: "positive infinity",
				percent: {
					pattern: ["-n%", "n%"]
				},
				currency: {
					pattern: ["$-n", "$n"],
					symbol: "¥"
				}
			},
			calendars: {
				standard: {
					days: {
						names: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
						namesAbbr: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
						namesShort: ["SUN.", "MON.", "TUE.", "WED.", "THU.", "FRI.", "SAT."]
					},
					months: {
						names: ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sept.", "Oct.", "Nov.", "Dec.", ""],
						namesAbbr: ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sept.", "Oct.", "Nov.", "Dec.", ""]
					},
					AM: ["AM", "AM", "AM"],
					PM: ["PM", "PM", "PM"],
					eras: [{ "name": "A.D.", "start": null, "offset": 0 }],
					patterns: {
						d: "yyyy/M/d",
						D: "yyyy'Year'M'Month'd'Day'",
						t: "H:mm",
						T: "H:mm:ss",
						f: "yyyy'Year'M'Month'd'Day' H:mm",
						F: "yyyy'Year'M'Month'd'Day' H:mm:ss",
						M: "M'Month'd'Day'",
						Y: "yyyy'Year'M'Month'"
					}
				}
			},
			pagerGoToPageString: "GoTo:",
			pagerShowRowsString: "Introwcount:",
			pagerRangeString: " of ",
			pagerallString: " var numItems ",
			pagerallstring: " var numItems ",
			pagerPreviousButtonString: "PREV",
			pagerNextButtonString: "NEXT",
			pagerFirstButtonsSring: "First Page",
			pagerLastButtonString: "Last Page",
			emptyDataString: "No Data",
			pagerrangestring: " Total ",
			loadText: "Loading..."
		},
		ru: {
			name: "ru",
			nativeName: "Российская Федерация",
			language: "ru-Russian",
			numberFormat: {
				NaN: "Не число",
				negativeInfinity: "Отрицательная бесконечность",
				positiveInfinity: "Положительная бесконечность",
				percent: {
					pattern: ["-n%", "n%"]
				},
				currency: {
					pattern: ["$-n", "$n"],
					symbol: "¥"
				}
			},
			calendars: {
				standard: {
					days: {
						names: ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"],
						namesAbbr: ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"],
						namesShort: ["день", "один", "два", "три", "четыре", "пять", "шесть"]
					},
					months: {
						names: ["январь", "февраль", "март", "апреля", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь", ""],
						namesAbbr: ["январь", "февраль", "март", "апреля", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь", ""]
					},
					AM: ["перваяя полвина дня", "перваяя полвина дня", "перваяя полвина дня"],
					PM: ["вторая половина дня", "вторая половина дня", "вторая половина дня"],
					eras: [{
						name: "n. эра",
						start: null,
						offset: 0
					}],
					patterns: {
						d: "yyyy/M/d",
						D: "yyyy'год'M'месяц'd'день'",
						t: "H:mm",
						T: "H:mm:ss",
						f: "yyyy'год'M'месяц'd'день' H:mm",
						F: "yyyy'год'M'месяц'd'день' H:mm:ss",
						M: "M'месяц'd'день'",
						Y: "yyyy'год'M'месяц'"
					}
				}
			},
			pagerGoToPageString: "Прыгай",
			pagerallstring: "Общее число страниц",
			pagerShowRowsString: "На каждой странице",
			pagerRangeString: " Общее число записи ",
			pagerPreviousButtonString: "предыдущийzhui",
			pagerNextButtonString: "Следующая страница",
			pageUnitString: "страниц",
			pagerFirstButtonsString: "Главная страница",
			pagerLastButtonString: "Страниц концs",
			emptyDataString: "Данных нет",
			pagerrangestring: " общий ",
			loadText: "Загрузка..."

		}
	}
	//添加获取cookie方法
	var getCookie = function (c_name) {
		var c_start, c_end;
		if (document.cookie.length > 0) {
			c_start = document.cookie.indexOf(c_name + "=");
			if (c_start != -1) {
				c_start = c_start + c_name.length + 1;
				c_end = document.cookie.indexOf(";", c_start);
				if (c_end == -1) c_end = document.cookie.length;
				return decodeURI(document.cookie.substring(c_start, c_end));
			}
		}
		return "";
	}
	var langKey = getCookie('EMAP_LANG') || 'zh';
	if(lan[langKey]){
		Globalize.addCultureInfo(langKey, "default", lan[langKey]);
	}else
	{
		Globalize.addCultureInfo('zh', "default", lan['zh']);
	}
	

}(this));