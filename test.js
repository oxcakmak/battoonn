var ee = Object.defineProperty;
var Bt = Object.getOwnPropertyDescriptor;
var Yt = Object.getOwnPropertyNames;
var Wt = Object.prototype.hasOwnProperty;
var a = (i, e) => ee(i, "name", { value: e, configurable: !0 });
var Jt = (i, e) => {
    for (var t in e) ee(i, t, { get: e[t], enumerable: !0 });
  },
  Vt = (i, e, t, r) => {
    if ((e && typeof e == "object") || typeof e == "function")
      for (let s of Yt(e))
        !Wt.call(i, s) &&
          s !== t &&
          ee(i, s, {
            get: () => e[s],
            enumerable: !(r = Bt(e, s)) || r.enumerable,
          });
    return i;
  };
var Ft = (i) => Vt(ee({}, "__esModule", { value: !0 }), i);
var Ei = {};
Jt(Ei, {
  DeezerAlbum: () => q,
  DeezerPlaylist: () => U,
  DeezerTrack: () => g,
  SoundCloudPlaylist: () => P,
  SoundCloudStream: () => L,
  SoundCloudTrack: () => T,
  SpotifyAlbum: () => z,
  SpotifyPlaylist: () => N,
  SpotifyTrack: () => E,
  YouTubeChannel: () => v,
  YouTubePlayList: () => D,
  YouTubeVideo: () => S,
  attachListeners: () => zt,
  authorization: () => Nt,
  decipher_info: () => j,
  deezer: () => Ne,
  default: () => Si,
  dz_advanced_track_search: () => ze,
  dz_validate: () => Se,
  extractID: () => ue,
  getFreeClientID: () => $e,
  is_expired: () => Oe,
  playlist_info: () => he,
  refreshToken: () => we,
  search: () => $t,
  setToken: () => Le,
  so_validate: () => ve,
  soundcloud: () => ke,
  sp_validate: () => ge,
  spotify: () => Ce,
  stream: () => Ot,
  stream_from_info: () => Pt,
  validate: () => At,
  video_basic_info: () => H,
  video_info: () => ce,
  yt_validate: () => Y,
});
module.exports = Ft(Ei);
var He = require("https"),
  Qe = require("url"),
  F = require("zlib");
var V = require("fs"),
  k;
(0, V.existsSync)(".data/youtube.data") &&
  ((k = JSON.parse((0, V.readFileSync)(".data/youtube.data", "utf-8"))),
  (k.file = !0));
function Ve() {
  let i = "";
  if (!!k?.cookie) {
    for (let [e, t] of Object.entries(k.cookie)) i += `${e}=${t};`;
    return i;
  }
}
a(Ve, "getCookies");
function jt(i, e) {
  return k?.cookie
    ? ((i = i.trim()), (e = e.trim()), Object.assign(k.cookie, { [i]: e }), !0)
    : !1;
}
a(jt, "setCookie");
function Kt() {
  k.cookie &&
    k.file &&
    (0, V.writeFileSync)(".data/youtube.data", JSON.stringify(k, void 0, 4));
}
a(Kt, "uploadCookie");
function Fe(i) {
  let e = i.cookie,
    t = {};
  e.split(";").forEach((r) => {
    let s = r.split("=");
    if (s.length <= 1) return;
    let n = s.shift()?.trim(),
      o = s.join("=").trim();
    Object.assign(t, { [n]: o });
  }),
    (k = { cookie: t }),
    (k.file = !1);
}
a(Fe, "setCookieToken");
function je(i) {
  !k?.cookie ||
    (i.forEach((e) => {
      e.split(";").forEach((t) => {
        let r = t.split("=");
        if (r.length <= 1) return;
        let s = r.shift()?.trim(),
          n = r.join("=").trim();
        jt(s, n);
      });
    }),
    Kt());
}
a(je, "cookieHeaders");
var te = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36 Edg/101.0.1210.53",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36 Edg/99.0.1150.30",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 YaBrowser/19.10.3.281 Yowser/2.5 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36",
];
function Ke(i) {
  te.push(...i);
}
a(Ke, "setUserAgent");
function Ht(i, e) {
  return (
    (i = Math.ceil(i)),
    (e = Math.floor(e)),
    Math.floor(Math.random() * (e - i + 1)) + i
  );
}
a(Ht, "getRandomInt");
function Ge() {
  let i = Ht(0, te.length - 1);
  return te[i];
}
a(Ge, "getRandomUserAgent");
function _(i, e = { method: "GET" }) {
  return new Promise(async (t, r) => {
    let s = await re(i, e).catch((n) => n);
    if (s instanceof Error) {
      r(s);
      return;
    }
    Number(s.statusCode) >= 300 &&
      Number(s.statusCode) < 400 &&
      (s = await _(s.headers.location, e)),
      t(s);
  });
}
a(_, "request_stream");
function Ze(i, e = { method: "GET" }) {
  return new Promise(async (t, r) => {
    let s = await re(i, e).catch((n) => n);
    if (s instanceof Error) {
      r(s);
      return;
    }
    if (Number(s.statusCode) >= 300 && Number(s.statusCode) < 400)
      s = await Ze(s.headers.location, e);
    else if (Number(s.statusCode) > 400) {
      r(new Error(`Got ${s.statusCode} from the request`));
      return;
    }
    t(s);
  });
}
a(Ze, "internalRequest");
function h(i, e = { method: "GET" }) {
  return new Promise(async (t, r) => {
    let s = !1;
    if (e.cookies) {
      let u = Ve();
      typeof u == "string" &&
        e.headers &&
        (Object.assign(e.headers, { cookie: u }), (s = !0));
    }
    if (e.cookieJar) {
      let u = [];
      for (let m of Object.entries(e.cookieJar)) u.push(m.join("="));
      if (u.length !== 0) {
        e.headers || (e.headers = {});
        let m = s ? `; ${e.headers.cookie}` : "";
        Object.assign(e.headers, { cookie: `${u.join("; ")}${m}` });
      }
    }
    e.headers &&
      (e.headers = {
        ...e.headers,
        "accept-encoding": "gzip, deflate, br",
        "user-agent": Ge(),
      });
    let n = await Ze(i, e).catch((u) => u);
    if (n instanceof Error) {
      r(n);
      return;
    }
    if (n.headers && n.headers["set-cookie"]) {
      if (e.cookieJar)
        for (let u of n.headers["set-cookie"]) {
          let m = u.split(";")[0].trim().split("=");
          e.cookieJar[m.shift()] = m.join("=");
        }
      s && je(n.headers["set-cookie"]);
    }
    let o = [],
      l,
      c = n.headers["content-encoding"];
    c === "gzip"
      ? (l = (0, F.createGunzip)())
      : c === "br"
      ? (l = (0, F.createBrotliDecompress)())
      : c === "deflate" && (l = (0, F.createDeflate)()),
      l
        ? (n.pipe(l),
          l.setEncoding("utf-8"),
          l.on("data", (u) => o.push(u)),
          l.on("end", () => t(o.join(""))))
        : (n.setEncoding("utf-8"),
          n.on("data", (u) => o.push(u)),
          n.on("end", () => t(o.join(""))));
  });
}
a(h, "request");
function ie(i) {
  return new Promise(async (e, t) => {
    let r = await re(i, { method: "HEAD" }).catch((n) => n);
    if (r instanceof Error) {
      t(r);
      return;
    }
    let s = Number(r.statusCode);
    if (s < 300) e(i);
    else if (s < 400) {
      let n = await ie(r.headers.location).catch((o) => o);
      if (n instanceof Error) {
        t(n);
        return;
      }
      e(n);
    } else t(new Error(`${r.statusCode}: ${r.statusMessage}, ${i}`));
  });
}
a(ie, "request_resolve_redirect");
function Te(i) {
  return new Promise(async (e, t) => {
    let r = await re(i, { method: "HEAD" }).catch((n) => n);
    if (r instanceof Error) {
      t(r);
      return;
    }
    let s = Number(r.statusCode);
    if (s < 300) e(Number(r.headers["content-length"]));
    else if (s < 400) {
      let n = await ie(r.headers.location).catch((l) => l);
      if (n instanceof Error) {
        t(n);
        return;
      }
      let o = await Te(n).catch((l) => l);
      if (o instanceof Error) {
        t(o);
        return;
      }
      e(o);
    } else
      t(
        new Error(
          `Failed to get content length with error: ${r.statusCode}, ${r.statusMessage}, ${i}`
        )
      );
  });
}
a(Te, "request_content_length");
function re(i, e = {}) {
  return new Promise((t, r) => {
    let s = new Qe.URL(i);
    e.method ??= "GET";
    let n = {
        host: s.hostname,
        path: s.pathname + s.search,
        headers: e.headers ?? {},
        method: e.method,
      },
      o = (0, He.request)(n, t);
    o.on("error", (l) => {
      r(l);
    }),
      e.method === "POST" && o.write(e.body),
      o.end();
  });
}
a(re, "https_getter");
var Ie = require("stream");
var se = require("url");
var G = "[a-zA-Z_\\$]\\w*",
  Qt = "'[^'\\\\]*(:?\\\\[\\s\\S][^'\\\\]*)*'",
  Zt = '"[^"\\\\]*(:?\\\\[\\s\\S][^"\\\\]*)*"',
  et = `(?:${Qt}|${Zt})`,
  A = `(?:${G}|${et})`,
  Xt = `(?:\\.${G}|\\[${et}\\])`,
  Xe = `(?:''|"")`,
  tt = ":function\\(a\\)\\{(?:return )?a\\.reverse\\(\\)\\}",
  it = ":function\\(a,b\\)\\{return a\\.slice\\(b\\)\\}",
  rt = ":function\\(a,b\\)\\{a\\.splice\\(0,b\\)\\}",
  st =
    ":function\\(a,b\\)\\{var c=a\\[0\\];a\\[0\\]=a\\[b(?:%a\\.length)?\\];a\\[b(?:%a\\.length)?\\]=c(?:;return a)?\\}",
  ei = new RegExp(
    `var (${G})=\\{((?:(?:${A}${tt}|${A}${it}|${A}${rt}|${A}${st}),?\\r?\\n?)+)\\};`
  ),
  ti = new RegExp(
    `${`function(?: ${G})?\\(a\\)\\{a=a\\.split\\(${Xe}\\);\\s*((?:(?:a=)?${G}`}${Xt}\\(a,\\d+\\);)+)return a\\.join\\(${Xe}\\)\\}`
  ),
  ii = new RegExp(`(?:^|,)(${A})${tt}`, "m"),
  ri = new RegExp(`(?:^|,)(${A})${it}`, "m"),
  si = new RegExp(`(?:^|,)(${A})${rt}`, "m"),
  ni = new RegExp(`(?:^|,)(${A})${st}`, "m");
function oi(i) {
  let e = ti.exec(i),
    t = ei.exec(i);
  if (!e || !t) return null;
  let r = t[1].replace(/\$/g, "\\$"),
    s = t[2].replace(/\$/g, "\\$"),
    n = e[1].replace(/\$/g, "\\$"),
    o = ii.exec(s),
    l = o && o[1].replace(/\$/g, "\\$").replace(/\$|^'|^"|'$|"$/g, "");
  o = ri.exec(s);
  let c = o && o[1].replace(/\$/g, "\\$").replace(/\$|^'|^"|'$|"$/g, "");
  o = si.exec(s);
  let u = o && o[1].replace(/\$/g, "\\$").replace(/\$|^'|^"|'$|"$/g, "");
  o = ni.exec(s);
  let m = o && o[1].replace(/\$/g, "\\$").replace(/\$|^'|^"|'$|"$/g, ""),
    y = `(${[l, c, u, m].join("|")})`,
    f = `(?:a=)?${r}(?:\\.${y}|\\['${y}'\\]|\\["${y}"\\])\\(a,(\\d+)\\)`,
    b = new RegExp(f, "g"),
    R = [];
  for (; (o = b.exec(n)) !== null; )
    switch (o[1] || o[2] || o[3]) {
      case m:
        R.push(`sw${o[4]}`);
        break;
      case l:
        R.push("rv");
        break;
      case c:
        R.push(`sl${o[4]}`);
        break;
      case u:
        R.push(`sp${o[4]}`);
        break;
    }
  return R;
}
a(oi, "js_tokens");
function ai(i, e) {
  let t = e.split(""),
    r = i.length;
  for (let s = 0; s < r; s++) {
    let n = i[s],
      o;
    switch (n.slice(0, 2)) {
      case "sw":
        (o = parseInt(n.slice(2))), li(t, o);
        break;
      case "rv":
        t.reverse();
        break;
      case "sl":
        (o = parseInt(n.slice(2))), (t = t.slice(o));
        break;
      case "sp":
        (o = parseInt(n.slice(2))), t.splice(0, o);
        break;
    }
  }
  return t.join("");
}
a(ai, "deciper_signature");
function li(i, e) {
  let t = i[0];
  (i[0] = i[e]), (i[e] = t);
}
a(li, "swappositions");
function ui(i, e) {
  if (!i.url) return;
  let t = decodeURIComponent(i.url),
    r = new se.URL(t);
  r.searchParams.set("ratebypass", "yes"),
    e && r.searchParams.set(i.sp || "signature", e),
    (i.url = r.toString());
}
a(ui, "download_url");
async function nt(i, e) {
  let t = await h(e),
    r = oi(t);
  return (
    i.forEach((s) => {
      let n = s.signatureCipher || s.cipher;
      if (n) {
        let o = Object.fromEntries(new se.URLSearchParams(n));
        Object.assign(s, o), delete s.signatureCipher, delete s.cipher;
      }
      if (r && s.s) {
        let o = ai(r, s.s);
        ui(s, o), delete s.s, delete s.sp;
      }
    }),
    i
  );
}
a(nt, "format_decipher");
var v = class {
  constructor(e = {}) {
    if (!e)
      throw new Error(
        `Cannot instantiate the ${this.constructor.name} class without data!`
      );
    (this.type = "channel"),
      (this.name = e.name || null),
      (this.verified = !!e.verified || !1),
      (this.artist = !!e.artist || !1),
      (this.id = e.id || null),
      (this.url = e.url || null),
      (this.icons = e.icons || [{ url: null, width: 0, height: 0 }]),
      (this.subscribers = e.subscribers || null);
  }
  iconURL(e = { size: 0 }) {
    if (typeof e.size != "number" || e.size < 0)
      throw new Error("invalid icon size");
    if (!this.icons?.[0]?.url) return;
    let t = this.icons?.[0]?.url.split("=s")[1].split("-c")[0];
    return this.icons?.[0]?.url.replace(`=s${t}-c`, `=s${e.size}-c`);
  }
  toString() {
    return this.name || "";
  }
  toJSON() {
    return {
      name: this.name,
      verified: this.verified,
      artist: this.artist,
      id: this.id,
      url: this.url,
      icons: this.icons,
      type: this.type,
      subscribers: this.subscribers,
    };
  }
};
a(v, "YouTubeChannel");
var B = class {
  constructor(e) {
    (this.url = e.url), (this.width = e.width), (this.height = e.height);
  }
  toJSON() {
    return { url: this.url, width: this.width, height: this.height };
  }
};
a(B, "YouTubeThumbnail");
var S = class {
  constructor(e) {
    if (!e)
      throw new Error(`Can not initiate ${this.constructor.name} without data`);
    (this.id = e.id || void 0),
      (this.url = `https://www.youtube.com/watch?v=${this.id}`),
      (this.type = "video"),
      (this.title = e.title || void 0),
      (this.description = e.description || void 0),
      (this.durationRaw = e.duration_raw || "0:00"),
      (this.durationInSec = (e.duration < 0 ? 0 : e.duration) || 0),
      (this.uploadedAt = e.uploadedAt || void 0),
      (this.liveAt = e.liveAt || void 0),
      (this.upcoming = e.upcoming),
      (this.views = parseInt(e.views) || 0);
    let t = [];
    for (let r of e.thumbnails) t.push(new B(r));
    (this.thumbnails = t || []),
      (this.channel = new v(e.channel) || {}),
      (this.likes = e.likes || 0),
      (this.live = !!e.live),
      (this.private = !!e.private),
      (this.tags = e.tags || []),
      (this.discretionAdvised = e.discretionAdvised ?? void 0),
      (this.music = e.music || []),
      (this.chapters = e.chapters || []);
  }
  toString() {
    return this.url || "";
  }
  toJSON() {
    return {
      id: this.id,
      url: this.url,
      title: this.title,
      description: this.description,
      durationInSec: this.durationInSec,
      durationRaw: this.durationRaw,
      uploadedAt: this.uploadedAt,
      thumbnail:
        this.thumbnails[this.thumbnails.length - 1].toJSON() || this.thumbnails,
      channel: this.channel,
      views: this.views,
      tags: this.tags,
      likes: this.likes,
      live: this.live,
      private: this.private,
      discretionAdvised: this.discretionAdvised,
      music: this.music,
      chapters: this.chapters,
    };
  }
};
a(S, "YouTubeVideo");
var ci = "https://www.youtube.com/youtubei/v1/browse?key=",
  D = class {
    constructor(e, t = !1) {
      this._continuation = {};
      if (!e)
        throw new Error(
          `Cannot instantiate the ${this.constructor.name} class without data!`
        );
      (this.__count = 0),
        (this.fetched_videos = new Map()),
        (this.type = "playlist"),
        t ? this.__patchSearch(e) : this.__patch(e);
    }
    __patch(e) {
      (this.id = e.id || void 0),
        (this.url = e.url || void 0),
        (this.title = e.title || void 0),
        (this.videoCount = e.videoCount || 0),
        (this.lastUpdate = e.lastUpdate || void 0),
        (this.views = e.views || 0),
        (this.link = e.link || void 0),
        (this.channel = new v(e.channel) || void 0),
        (this.thumbnail = e.thumbnail ? new B(e.thumbnail) : void 0),
        (this.videos = e.videos || []),
        this.__count++,
        this.fetched_videos.set(`${this.__count}`, this.videos),
        (this._continuation.api = e.continuation?.api ?? void 0),
        (this._continuation.token = e.continuation?.token ?? void 0),
        (this._continuation.clientVersion =
          e.continuation?.clientVersion ?? "<important data>");
    }
    __patchSearch(e) {
      (this.id = e.id || void 0),
        (this.url = this.id
          ? `https://www.youtube.com/playlist?list=${this.id}`
          : void 0),
        (this.title = e.title || void 0),
        (this.thumbnail = new B(e.thumbnail) || void 0),
        (this.channel = e.channel || void 0),
        (this.videos = []),
        (this.videoCount = e.videos || 0),
        (this.link = void 0),
        (this.lastUpdate = void 0),
        (this.views = 0);
    }
    async next(e = 1 / 0) {
      if (!this._continuation || !this._continuation.token) return [];
      let t = await h(`${ci}${this._continuation.api}&prettyPrint=false`, {
          method: "POST",
          body: JSON.stringify({
            continuation: this._continuation.token,
            context: {
              client: {
                utcOffsetMinutes: 0,
                gl: "US",
                hl: "en",
                clientName: "WEB",
                clientVersion: this._continuation.clientVersion,
              },
              user: {},
              request: {},
            },
          }),
        }),
        r =
          JSON.parse(t)?.onResponseReceivedActions[0]
            ?.appendContinuationItemsAction?.continuationItems;
      if (!r) return [];
      let s = xe(r, e);
      return (
        this.fetched_videos.set(`${this.__count}`, s),
        (this._continuation.token = ne(r)),
        s
      );
    }
    async fetch(e = 1 / 0) {
      if (!this._continuation.token) return this;
      for (
        e < 1 && (e = 1 / 0);
        typeof this._continuation.token == "string" &&
        this._continuation.token.length;

      ) {
        this.__count++;
        let r = await this.next();
        if (((e -= r.length), e <= 0 || !r.length)) break;
      }
      return this;
    }
    page(e) {
      if (!e) throw new Error("Page number is not provided");
      if (!this.fetched_videos.has(`${e}`))
        throw new Error("Given Page number is invalid");
      return this.fetched_videos.get(`${e}`);
    }
    get total_pages() {
      return this.fetched_videos.size;
    }
    get total_videos() {
      let e = this.total_pages;
      return (e - 1) * 100 + this.fetched_videos.get(`${e}`).length;
    }
    async all_videos() {
      await this.fetch();
      let e = [];
      for (let t of this.fetched_videos.values()) e.push(...t);
      return e;
    }
    toJSON() {
      return {
        id: this.id,
        title: this.title,
        thumbnail: this.thumbnail?.toJSON() || this.thumbnail,
        channel: this.channel,
        url: this.url,
        videos: this.videos,
      };
    }
  };
a(D, "YouTubePlayList");
var ae = require("url");
var oe = /^[a-zA-Z\d_-]{11,12}$/,
  hi = /^(PL|UU|LL|RD|OL)[a-zA-Z\d_-]{10,}$/,
  le = "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8",
  at =
    /^((?:https?:)?\/\/)?(?:(?:www|m|music)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|shorts\/|embed\/|live\/|v\/)?)([\w\-]+)(\S+)?$/,
  di =
    /^((?:https?:)?\/\/)?(?:(?:www|m|music)\.)?((?:youtube\.com|youtu.be))\/(?:(playlist|watch))?(.*)?((\?|\&)list=)(PL|UU|LL|RD|OL)[a-zA-Z\d_-]{10,}(&.*)?$/;
function Y(i) {
  let e = i.trim();
  if (e.indexOf("list=") === -1)
    if (e.startsWith("https"))
      if (e.match(at)) {
        let t;
        return (
          e.includes("youtu.be/")
            ? (t = e.split("youtu.be/")[1].split(/(\?|\/|&)/)[0])
            : e.includes("youtube.com/embed/")
            ? (t = e.split("youtube.com/embed/")[1].split(/(\?|\/|&)/)[0])
            : e.includes("youtube.com/shorts/")
            ? (t = e.split("youtube.com/shorts/")[1].split(/(\?|\/|&)/)[0])
            : (t = e.split("watch?v=")[1]?.split(/(\?|\/|&)/)[0]),
          t?.match(oe) ? "video" : !1
        );
      } else return !1;
    else return e.match(oe) ? "video" : e.match(hi) ? "playlist" : "search";
  else return e.match(di) ? "playlist" : Y(e.replace(/(\?|\&)list=[^&]*/, ""));
}
a(Y, "yt_validate");
function De(i) {
  if (i.startsWith("https://") && i.match(at)) {
    let e;
    if (
      (i.includes("youtu.be/")
        ? (e = i.split("youtu.be/")[1].split(/(\?|\/|&)/)[0])
        : i.includes("youtube.com/embed/")
        ? (e = i.split("youtube.com/embed/")[1].split(/(\?|\/|&)/)[0])
        : i.includes("youtube.com/shorts/")
        ? (e = i.split("youtube.com/shorts/")[1].split(/(\?|\/|&)/)[0])
        : i.includes("youtube.com/live/")
        ? (e = i.split("youtube.com/live/")[1].split(/(\?|\/|&)/)[0])
        : (e = (i.split("watch?v=")[1] ?? i.split("&v=")[1]).split(
            /(\?|\/|&)/
          )[0]),
      e.match(oe))
    )
      return e;
  } else if (i.match(oe)) return i;
  return !1;
}
a(De, "extractVideoId");
function ue(i) {
  let e = Y(i);
  if (!e || e === "search")
    throw new Error("This is not a YouTube url or videoId or PlaylistID");
  let t = i.trim();
  if (t.startsWith("https"))
    if (t.indexOf("list=") === -1) {
      let r = De(t);
      if (!r)
        throw new Error("This is not a YouTube url or videoId or PlaylistID");
      return r;
    } else return t.split("list=")[1].split("&")[0];
  else return t;
}
a(ue, "extractID");
async function H(i, e = {}) {
  if (typeof i != "string")
    throw new Error("url parameter is not a URL string or a string of HTML");
  let t = i.trim(),
    r,
    s = {};
  if (e.htmldata) r = t;
  else {
    let p = De(t);
    if (!p) throw new Error("This is not a YouTube Watch URL");
    let w = `https://www.youtube.com/watch?v=${p}&has_verified=1`;
    r = await h(w, {
      headers: { "accept-language": e.language || "en-US;q=0.9" },
      cookies: !0,
      cookieJar: s,
    });
  }
  if (
    r.indexOf(
      "Our systems have detected unusual traffic from your computer network."
    ) !== -1
  )
    throw new Error("Captcha page: YouTube has detected that you are a bot!");
  let n = r
    .split("var ytInitialPlayerResponse = ")?.[1]
    ?.split(";</script>")[0]
    .split(/(?<=}}});\s*(var|const|let)\s/)[0];
  if (!n) throw new Error("Initial Player Response Data is undefined.");
  let o = r
    .split("var ytInitialData = ")?.[1]
    ?.split(";</script>")[0]
    .split(/;\s*(var|const|let)\s/)[0];
  if (!o) throw new Error("Initial Response Data is undefined.");
  let l = JSON.parse(n),
    c = JSON.parse(o),
    u = l.videoDetails,
    m = !1,
    y = !1;
  if (l.playabilityStatus.status !== "OK")
    if (l.playabilityStatus.status === "CONTENT_CHECK_REQUIRED") {
      if (e.htmldata)
        throw new Error(
          `Accepting the viewer discretion is not supported when using htmldata, video: ${u.videoId}`
        );
      m = !0;
      let p =
        c.topbar.desktopTopbarRenderer.interstitial?.consentBumpV2Renderer
          .agreeButton.buttonRenderer.command.saveConsentAction;
      p &&
        Object.assign(s, {
          VISITOR_INFO1_LIVE: p.visitorCookie,
          CONSENT: p.consentCookie,
        });
      let w = await lt(u.videoId, s, r, !0);
      (l.streamingData = w.streamingData),
        (c.contents.twoColumnWatchNextResults.secondaryResults =
          w.relatedVideos);
    } else if (l.playabilityStatus.status === "LIVE_STREAM_OFFLINE") y = !0;
    else
      throw new Error(`While getting info from url
${
  l.playabilityStatus.errorScreen.playerErrorMessageRenderer?.reason
    .simpleText ??
  l.playabilityStatus.errorScreen.playerKavRenderer?.reason.simpleText ??
  l.playabilityStatus.reason
}`);
  let f =
      c.contents.twoColumnWatchNextResults.results?.results?.contents[1]
        ?.videoSecondaryInfoRenderer?.owner?.videoOwnerRenderer,
    b = f?.badges?.[0]?.metadataBadgeRenderer?.style?.toLowerCase(),
    R = `https://www.youtube.com${r.split('"jsUrl":"')[1].split('"')[0]}`,
    Z = [];
  c.contents.twoColumnWatchNextResults.secondaryResults.secondaryResults.results.forEach(
    (p) => {
      p.compactVideoRenderer &&
        Z.push(
          `https://www.youtube.com/watch?v=${p.compactVideoRenderer.videoId}`
        ),
        p.itemSectionRenderer?.contents &&
          p.itemSectionRenderer.contents.forEach((w) => {
            w.compactVideoRenderer &&
              Z.push(
                `https://www.youtube.com/watch?v=${w.compactVideoRenderer.videoId}`
              );
          });
    }
  );
  let X = l.microformat.playerMicroformatRenderer,
    Me = c.engagementPanels
      .find(
        (p) =>
          p?.engagementPanelSectionListRenderer?.panelIdentifier ==
          "engagement-panel-structured-description"
      )
      ?.engagementPanelSectionListRenderer.content.structuredDescriptionContentRenderer.items.find(
        (p) => p.videoDescriptionMusicSectionRenderer
      )?.videoDescriptionMusicSectionRenderer.carouselLockups,
    qe = [];
  Me &&
    Me.forEach((p) => {
      if (!p.carouselLockupRenderer) return;
      let w = p.carouselLockupRenderer,
        Lt =
          w.videoLockup?.compactVideoRenderer.title.simpleText ??
          w.videoLockup?.compactVideoRenderer.title.runs?.find((x) => x.text)
            ?.text,
        Mt = w.infoRows?.map((x) => [
          x.infoRowRenderer.title.simpleText.toLowerCase(),
          (
            x.infoRowRenderer.expandedMetadata ??
            x.infoRowRenderer.defaultMetadata
          )?.runs
            ?.map((Ut) => Ut.text)
            .join("") ??
            x.infoRowRenderer.defaultMetadata?.simpleText ??
            x.infoRowRenderer.expandedMetadata?.simpleText ??
            "",
        ]),
        qt = Object.fromEntries(Mt ?? {}),
        Je =
          w.videoLockup?.compactVideoRenderer.navigationEndpoint?.watchEndpoint
            .videoId ??
          w.infoRows
            ?.find(
              (x) => x.infoRowRenderer.title.simpleText.toLowerCase() == "song"
            )
            ?.infoRowRenderer.defaultMetadata.runs?.find(
              (x) => x.navigationEndpoint
            )?.navigationEndpoint.watchEndpoint?.videoId;
      qe.push({
        song: Lt,
        url: Je ? `https://www.youtube.com/watch?v=${Je}` : null,
        ...qt,
      });
    });
  let Ue =
      c.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer?.decoratedPlayerBarRenderer.playerBar?.multiMarkersPlayerBarRenderer.markersMap?.find(
        (p) => p.key === "DESCRIPTION_CHAPTERS"
      )?.value?.chapters,
    Be = [];
  if (Ue)
    for (let { chapterRenderer: p } of Ue)
      Be.push({
        title: p.title.simpleText,
        timestamp: ot(p.timeRangeStartMillis / 1e3),
        seconds: p.timeRangeStartMillis / 1e3,
        thumbnails: p.thumbnail.thumbnails,
      });
  let Ee;
  if (y)
    if (X.liveBroadcastDetails.startTimestamp)
      Ee = new Date(X.liveBroadcastDetails.startTimestamp);
    else {
      let p =
        l.playabilityStatus.liveStreamability.liveStreamabilityRenderer
          .offlineSlate.liveStreamOfflineSlateRenderer.scheduledStartTime;
      Ee = new Date(parseInt(p) * 1e3);
    }
  let Ye = c.contents.twoColumnWatchNextResults.results.results.contents
      .find((p) => p.videoPrimaryInfoRenderer)
      ?.videoPrimaryInfoRenderer.videoActions.menuRenderer.topLevelButtons?.find(
        (p) =>
          p.toggleButtonRenderer?.defaultIcon.iconType === "LIKE" ||
          p.segmentedLikeDislikeButtonRenderer?.likeButton.toggleButtonRenderer
            ?.defaultIcon.iconType === "LIKE"
      ),
    We = new S({
      id: u.videoId,
      title: u.title,
      description: u.shortDescription,
      duration: Number(u.lengthSeconds),
      duration_raw: ot(u.lengthSeconds),
      uploadedAt: X.publishDate,
      liveAt: X.liveBroadcastDetails?.startTimestamp,
      upcoming: Ee,
      thumbnails: u.thumbnail.thumbnails,
      channel: {
        name: u.author,
        id: u.channelId,
        url: `https://www.youtube.com/channel/${u.channelId}`,
        verified: Boolean(b?.includes("verified")),
        artist: Boolean(b?.includes("artist")),
        icons: f?.thumbnail?.thumbnails || void 0,
      },
      views: u.viewCount,
      tags: u.keywords,
      likes: parseInt(
        Ye?.toggleButtonRenderer?.defaultText.accessibility?.accessibilityData.label.replace(
          /\D+/g,
          ""
        ) ??
          Ye?.segmentedLikeDislikeButtonRenderer?.likeButton.toggleButtonRenderer?.defaultText.accessibility?.accessibilityData.label.replace(
            /\D+/g,
            ""
          ) ??
          0
      ),
      live: u.isLiveContent,
      private: u.isPrivate,
      discretionAdvised: m,
      music: qe,
      chapters: Be,
    }),
    K = [];
  return (
    y ||
      (K.push(...(l.streamingData.formats ?? [])),
      K.push(...(l.streamingData.adaptiveFormats ?? [])),
      O(K).length === 0 && !e.htmldata && (K = await ut(u.videoId, s, r))),
    {
      LiveStreamData: {
        isLive: We.live,
        dashManifestUrl: l.streamingData?.dashManifestUrl ?? null,
        hlsManifestUrl: l.streamingData?.hlsManifestUrl ?? null,
      },
      html5player: R,
      format: K,
      video_details: We,
      related_videos: Z,
    }
  );
}
a(H, "video_basic_info");
async function W(i, e = {}) {
  if (typeof i != "string")
    throw new Error("url parameter is not a URL string or a string of HTML");
  let t,
    r = {};
  if (e.htmldata) t = i;
  else {
    let f = De(i);
    if (!f) throw new Error("This is not a YouTube Watch URL");
    let b = `https://www.youtube.com/watch?v=${f}&has_verified=1`;
    t = await h(b, {
      headers: { "accept-language": "en-US,en;q=0.9" },
      cookies: !0,
      cookieJar: r,
    });
  }
  if (
    t.indexOf(
      "Our systems have detected unusual traffic from your computer network."
    ) !== -1
  )
    throw new Error("Captcha page: YouTube has detected that you are a bot!");
  let s = t
    .split("var ytInitialPlayerResponse = ")?.[1]
    ?.split(";</script>")[0]
    .split(/(?<=}}});\s*(var|const|let)\s/)[0];
  if (!s) throw new Error("Initial Player Response Data is undefined.");
  let n = JSON.parse(s),
    o = !1;
  if (n.playabilityStatus.status !== "OK")
    if (n.playabilityStatus.status === "CONTENT_CHECK_REQUIRED") {
      if (e.htmldata)
        throw new Error(
          `Accepting the viewer discretion is not supported when using htmldata, video: ${n.videoDetails.videoId}`
        );
      let f = t
        .split("var ytInitialData = ")?.[1]
        ?.split(";</script>")[0]
        .split(/;\s*(var|const|let)\s/)[0];
      if (!f) throw new Error("Initial Response Data is undefined.");
      let b =
        JSON.parse(f).topbar.desktopTopbarRenderer.interstitial
          ?.consentBumpV2Renderer.agreeButton.buttonRenderer.command
          .saveConsentAction;
      b &&
        Object.assign(r, {
          VISITOR_INFO1_LIVE: b.visitorCookie,
          CONSENT: b.consentCookie,
        });
      let R = await lt(n.videoDetails.videoId, r, t, !1);
      n.streamingData = R.streamingData;
    } else if (n.playabilityStatus.status === "LIVE_STREAM_OFFLINE") o = !0;
    else
      throw new Error(`While getting info from url
${
  n.playabilityStatus.errorScreen.playerErrorMessageRenderer?.reason
    .simpleText ??
  n.playabilityStatus.errorScreen.playerKavRenderer?.reason.simpleText ??
  n.playabilityStatus.reason
}`);
  let l = `https://www.youtube.com${t.split('"jsUrl":"')[1].split('"')[0]}`,
    c = Number(n.videoDetails.lengthSeconds),
    u = {
      url: `https://www.youtube.com/watch?v=${n.videoDetails.videoId}`,
      durationInSec: (c < 0 ? 0 : c) || 0,
    },
    m = [];
  o ||
    (m.push(...(n.streamingData.formats ?? [])),
    m.push(...(n.streamingData.adaptiveFormats ?? [])),
    O(m).length === 0 &&
      !e.htmldata &&
      (m = await ut(n.videoDetails.videoId, r, t)));
  let y = {
    isLive: n.videoDetails.isLiveContent,
    dashManifestUrl: n.streamingData?.dashManifestUrl ?? null,
    hlsManifestUrl: n.streamingData?.hlsManifestUrl ?? null,
  };
  return await j(
    { LiveStreamData: y, html5player: l, format: m, video_details: u },
    !0
  );
}
a(W, "video_stream_info");
function ot(i) {
  let e = Number(i),
    t = Math.floor(e / 3600),
    r = Math.floor((e % 3600) / 60),
    s = Math.floor((e % 3600) % 60),
    n = t > 0 ? (t < 10 ? `0${t}` : t) + ":" : "",
    o = r > 0 ? (r < 10 ? `0${r}` : r) + ":" : "00:",
    l = s > 0 ? (s < 10 ? `0${s}` : s) : "00";
  return n + o + l;
}
a(ot, "parseSeconds");
async function ce(i, e = {}) {
  let t = await H(i.trim(), e);
  return await j(t);
}
a(ce, "video_info");
async function j(i, e = !1) {
  return (
    (i.LiveStreamData.isLive === !0 &&
      i.LiveStreamData.dashManifestUrl !== null &&
      i.video_details.durationInSec === 0) ||
      (i.format.length > 0 &&
        (i.format[0].signatureCipher || i.format[0].cipher) &&
        (e && (i.format = O(i.format)),
        (i.format = await nt(i.format, i.html5player)))),
    i
  );
}
a(j, "decipher_info");
async function he(i, e = {}) {
  if (!i || typeof i != "string")
    throw new Error(`Expected playlist url, received ${typeof i}!`);
  let t = i.trim();
  if (
    (t.startsWith("https") ||
      (t = `https://www.youtube.com/playlist?list=${t}`),
    t.indexOf("list=") === -1)
  )
    throw new Error("This is not a Playlist URL");
  if (t.includes("music.youtube.com")) {
    let n = new ae.URL(t);
    (n.hostname = "www.youtube.com"), (t = n.toString());
  }
  let r = await h(t, {
    headers: { "accept-language": e.language || "en-US;q=0.9" },
  });
  if (
    r.indexOf(
      "Our systems have detected unusual traffic from your computer network."
    ) !== -1
  )
    throw new Error("Captcha page: YouTube has detected that you are a bot!");
  let s = JSON.parse(
    r
      .split("var ytInitialData = ")[1]
      .split(";</script>")[0]
      .split(/;\s*(var|const|let)\s/)[0]
  );
  if (s.alerts)
    if (s.alerts[0].alertWithButtonRenderer?.type === "INFO") {
      if (!e.incomplete)
        throw new Error(`While parsing playlist url
${s.alerts[0].alertWithButtonRenderer.text.simpleText}`);
    } else
      throw s.alerts[0].alertRenderer?.type === "ERROR"
        ? new Error(`While parsing playlist url
${s.alerts[0].alertRenderer.text.runs[0].text}`)
        : new Error(`While parsing playlist url
Unknown Playlist Error`);
  return s.currentVideoEndpoint ? pi(s, r, t) : mi(s, r);
}
a(he, "playlist_info");
function xe(i, e = 1 / 0) {
  let t = [];
  for (let r = 0; r < i.length && e !== t.length; r++) {
    let s = i[r].playlistVideoRenderer;
    !s ||
      !s.shortBylineText ||
      t.push(
        new S({
          id: s.videoId,
          duration: parseInt(s.lengthSeconds) || 0,
          duration_raw: s.lengthText?.simpleText ?? "0:00",
          thumbnails: s.thumbnail.thumbnails,
          title: s.title.runs[0].text,
          upcoming: s.upcomingEventData?.startTime
            ? new Date(parseInt(s.upcomingEventData.startTime) * 1e3)
            : void 0,
          channel: {
            id:
              s.shortBylineText.runs[0].navigationEndpoint.browseEndpoint
                .browseId || void 0,
            name: s.shortBylineText.runs[0].text || void 0,
            url: `https://www.youtube.com${
              s.shortBylineText.runs[0].navigationEndpoint.browseEndpoint
                .canonicalBaseUrl ||
              s.shortBylineText.runs[0].navigationEndpoint.commandMetadata
                .webCommandMetadata.url
            }`,
            icon: void 0,
          },
        })
      );
  }
  return t;
}
a(xe, "getPlaylistVideos");
function ne(i) {
  return i.find((e) => Object.keys(e)[0] === "continuationItemRenderer")
    ?.continuationItemRenderer.continuationEndpoint?.continuationCommand?.token;
}
a(ne, "getContinuationToken");
async function lt(i, e, t, r) {
  let s =
      t.split('INNERTUBE_API_KEY":"')[1]?.split('"')[0] ??
      t.split('innertubeApiKey":"')[1]?.split('"')[0] ??
      le,
    n =
      t.split('"XSRF_TOKEN":"')[1]?.split('"')[0].replaceAll("\\u003d", "=") ??
      t.split('"xsrf_token":"')[1]?.split('"')[0].replaceAll("\\u003d", "=");
  if (!n)
    throw new Error(
      `Unable to extract XSRF_TOKEN to accept the viewer discretion popup for video: ${i}.`
    );
  let o = await h(
      `https://www.youtube.com/youtubei/v1/verify_age?key=${s}&prettyPrint=false`,
      {
        method: "POST",
        body: JSON.stringify({
          context: {
            client: {
              utcOffsetMinutes: 0,
              gl: "US",
              hl: "en",
              clientName: "WEB",
              clientVersion:
                t
                  .split('"INNERTUBE_CONTEXT_CLIENT_VERSION":"')[1]
                  ?.split('"')[0] ??
                t
                  .split('"innertube_context_client_version":"')[1]
                  ?.split('"')[0] ??
                "<some version>",
            },
            user: {},
            request: {},
          },
          nextEndpoint: {
            urlEndpoint: { url: `/watch?v=${i}&has_verified=1` },
          },
          setControvercy: !0,
        }),
        cookies: !0,
        cookieJar: e,
      }
    ),
    l = JSON.parse(o).actions[0].navigateAction.endpoint,
    c = await h(`https://www.youtube.com/${l.urlEndpoint.url}&pbj=1`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new ae.URLSearchParams([
        ["command", JSON.stringify(l)],
        ["session_token", n],
      ]).toString(),
      cookies: !0,
      cookieJar: e,
    });
  if (c.includes("<h1>Something went wrong</h1>"))
    throw new Error(
      `Unable to accept the viewer discretion popup for video: ${i}`
    );
  let u = JSON.parse(c);
  if (u[2].playerResponse.playabilityStatus.status !== "OK")
    throw new Error(`While getting info from url after trying to accept the discretion popup for video ${i}
${
  u[2].playerResponse.playabilityStatus.errorScreen.playerErrorMessageRenderer
    ?.reason.simpleText ??
  u[2].playerResponse.playabilityStatus.errorScreen.playerKavRenderer?.reason
    .simpleText
}`);
  let m = u[2].playerResponse.streamingData;
  return r
    ? {
        streamingData: m,
        relatedVideos:
          u[3].response.contents.twoColumnWatchNextResults.secondaryResults,
      }
    : { streamingData: m };
}
a(lt, "acceptViewerDiscretion");
async function ut(i, e, t) {
  let r =
      t.split('INNERTUBE_API_KEY":"')[1]?.split('"')[0] ??
      t.split('innertubeApiKey":"')[1]?.split('"')[0] ??
      le,
    s = await h(
      `https://www.youtube.com/youtubei/v1/player?key=${r}&prettyPrint=false`,
      {
        method: "POST",
        body: JSON.stringify({
          context: {
            client: {
              clientName: "ANDROID",
              clientVersion: "16.49",
              hl: "en",
              timeZone: "UTC",
              utcOffsetMinutes: 0,
            },
          },
          videoId: i,
          playbackContext: {
            contentPlaybackContext: { html5Preference: "HTML5_PREF_WANTS" },
          },
          contentCheckOk: !0,
          racyCheckOk: !0,
        }),
        cookies: !0,
        cookieJar: e,
      }
    );
  return JSON.parse(s).streamingData.formats;
}
a(ut, "getAndroidFormats");
function pi(i, e, t) {
  let r = i.contents.twoColumnWatchNextResults.playlist?.playlist;
  if (!r)
    throw new Error(
      "Watch playlist unavailable due to YouTube layout changes."
    );
  let s = fi(r.contents),
    n =
      e.split('INNERTUBE_API_KEY":"')[1]?.split('"')[0] ??
      e.split('innertubeApiKey":"')[1]?.split('"')[0] ??
      le,
    o = r.totalVideos,
    l = r.shortBylineText?.runs?.[0],
    c = r.badges?.[0]?.metadataBadgeRenderer?.style.toLowerCase();
  return new D({
    continuation: {
      api: n,
      token: ne(r.contents),
      clientVersion:
        e.split('"INNERTUBE_CONTEXT_CLIENT_VERSION":"')[1]?.split('"')[0] ??
        e.split('"innertube_context_client_version":"')[1]?.split('"')[0] ??
        "<some version>",
    },
    id: r.playlistId || "",
    title: r.title || "",
    videoCount: parseInt(o) || 0,
    videos: s,
    url: t,
    channel: {
      id: l?.navigationEndpoint?.browseEndpoint?.browseId || null,
      name: l?.text || null,
      url: `https://www.youtube.com${
        l?.navigationEndpoint?.browseEndpoint?.canonicalBaseUrl ||
        l?.navigationEndpoint?.commandMetadata?.webCommandMetadata?.url
      }`,
      verified: Boolean(c?.includes("verified")),
      artist: Boolean(c?.includes("artist")),
    },
  });
}
a(pi, "getWatchPlaylist");
function mi(i, e) {
  let t =
      i.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content
        .sectionListRenderer.contents[0].itemSectionRenderer.contents[0]
        .playlistVideoListRenderer.contents,
    r = i.sidebar.playlistSidebarRenderer.items,
    s =
      e.split('INNERTUBE_API_KEY":"')[1]?.split('"')[0] ??
      e.split('innertubeApiKey":"')[1]?.split('"')[0] ??
      le,
    n = xe(t, 100),
    o = r[0].playlistSidebarPrimaryInfoRenderer;
  if (!o.title.runs || !o.title.runs.length)
    throw new Error("Failed to Parse Playlist info.");
  let l = r[1]?.playlistSidebarSecondaryInfoRenderer.videoOwner,
    c = o.stats.length === 3 ? o.stats[1].simpleText.replace(/\D/g, "") : 0,
    u =
      o.stats
        .find(
          (f) =>
            "runs" in f &&
            f.runs.find((b) => b.text.toLowerCase().includes("last update"))
        )
        ?.runs.pop()?.text ?? null,
    m = o.stats[0].runs[0].text.replace(/\D/g, "") || 0;
  return new D({
    continuation: {
      api: s,
      token: ne(t),
      clientVersion:
        e.split('"INNERTUBE_CONTEXT_CLIENT_VERSION":"')[1]?.split('"')[0] ??
        e.split('"innertube_context_client_version":"')[1]?.split('"')[0] ??
        "<some version>",
    },
    id: o.title.runs[0].navigationEndpoint.watchEndpoint.playlistId,
    title: o.title.runs[0].text,
    videoCount: parseInt(m) || 0,
    lastUpdate: u,
    views: parseInt(c) || 0,
    videos: n,
    url: `https://www.youtube.com/playlist?list=${o.title.runs[0].navigationEndpoint.watchEndpoint.playlistId}`,
    link: `https://www.youtube.com${o.title.runs[0].navigationEndpoint.commandMetadata.webCommandMetadata.url}`,
    channel: l
      ? {
          name: l.videoOwnerRenderer.title.runs[0].text,
          id: l.videoOwnerRenderer.title.runs[0].navigationEndpoint
            .browseEndpoint.browseId,
          url: `https://www.youtube.com${
            l.videoOwnerRenderer.navigationEndpoint.commandMetadata
              .webCommandMetadata.url ||
            l.videoOwnerRenderer.navigationEndpoint.browseEndpoint
              .canonicalBaseUrl
          }`,
          icons: l.videoOwnerRenderer.thumbnail.thumbnails ?? [],
        }
      : {},
    thumbnail: o.thumbnailRenderer.playlistVideoThumbnailRenderer?.thumbnail
      .thumbnails.length
      ? o.thumbnailRenderer.playlistVideoThumbnailRenderer.thumbnail.thumbnails[
          o.thumbnailRenderer.playlistVideoThumbnailRenderer.thumbnail
            .thumbnails.length - 1
        ]
      : null,
  });
}
a(mi, "getNormalPlaylist");
function fi(i, e = 1 / 0) {
  let t = [];
  for (let r = 0; r < i.length && e !== t.length; r++) {
    let s = i[r].playlistPanelVideoRenderer;
    if (!s || !s.shortBylineText) continue;
    let n = s.shortBylineText.runs[0];
    t.push(
      new S({
        id: s.videoId,
        duration: yi(s.lengthText?.simpleText) || 0,
        duration_raw: s.lengthText?.simpleText ?? "0:00",
        thumbnails: s.thumbnail.thumbnails,
        title: s.title.simpleText,
        upcoming:
          s.thumbnailOverlays[0].thumbnailOverlayTimeStatusRenderer?.style ===
            "UPCOMING" || void 0,
        channel: {
          id: n.navigationEndpoint.browseEndpoint.browseId || void 0,
          name: n.text || void 0,
          url: `https://www.youtube.com${
            n.navigationEndpoint.browseEndpoint.canonicalBaseUrl ||
            n.navigationEndpoint.commandMetadata.webCommandMetadata.url
          }`,
          icon: void 0,
        },
      })
    );
  }
  return t;
}
a(fi, "getWatchPlaylistVideos");
function yi(i) {
  if (!i) return 0;
  let e = i.split(":");
  switch (e.length) {
    case 2:
      return parseInt(e[0]) * 60 + parseInt(e[1]);
    case 3:
      return parseInt(e[0]) * 60 * 60 + parseInt(e[1]) * 60 + parseInt(e[2]);
    default:
      return 0;
  }
}
a(yi, "parseDuration");
var ct = require("url"),
  de = class {
    constructor(e, t, r, s) {
      (this.stream = new Ie.Readable({
        highWaterMark: 5 * 1e3 * 1e3,
        read() {},
      })),
        (this.type = "arbitrary"),
        (this.sequence = 0),
        (this.dash_url = e),
        (this.base_url = ""),
        (this.interval = t),
        (this.video_url = r),
        (this.precache = s || 3),
        (this.dash_timer = new $(() => {
          this.dash_updater(), this.dash_timer.reuse();
        }, 1800)),
        this.stream.on("close", () => {
          this.cleanup();
        }),
        this.initialize_dash();
    }
    cleanup() {
      this.normal_timer?.destroy(),
        this.dash_timer.destroy(),
        this.request?.destroy(),
        (this.video_url = ""),
        (this.request = void 0),
        (this.dash_url = ""),
        (this.base_url = ""),
        (this.interval = 0);
    }
    async dash_updater() {
      let e = await W(this.video_url);
      return (
        e.LiveStreamData.dashManifestUrl &&
          (this.dash_url = e.LiveStreamData.dashManifestUrl),
        this.initialize_dash()
      );
    }
    async initialize_dash() {
      let t = (await h(this.dash_url))
        .split('<AdaptationSet id="0"')[1]
        .split("</AdaptationSet>")[0]
        .split("</Representation>");
      if (
        (t[t.length - 1] === "" && t.pop(),
        (this.base_url = t[t.length - 1]
          .split("<BaseURL>")[1]
          .split("</BaseURL>")[0]),
        await _(`https://${new ct.URL(this.base_url).host}/generate_204`),
        this.sequence === 0)
      ) {
        let r = t[t.length - 1]
          .split("<SegmentList>")[1]
          .split("</SegmentList>")[0]
          .replaceAll('<SegmentURL media="', "")
          .split('"/>');
        r[r.length - 1] === "" && r.pop(),
          r.length > this.precache && r.splice(0, r.length - this.precache),
          (this.sequence = Number(r[0].split("sq/")[1].split("/")[0])),
          this.first_data(r.length);
      }
    }
    async first_data(e) {
      for (let t = 1; t <= e; t++)
        await new Promise(async (r) => {
          let s = await _(this.base_url + "sq/" + this.sequence).catch(
            (n) => n
          );
          if (s instanceof Error) {
            this.stream.emit("error", s);
            return;
          }
          (this.request = s),
            s.on("data", (n) => {
              this.stream.push(n);
            }),
            s.on("end", () => {
              this.sequence++, r("");
            }),
            s.once("error", (n) => {
              this.stream.emit("error", n);
            });
        });
      this.normal_timer = new $(() => {
        this.loop(), this.normal_timer?.reuse();
      }, this.interval);
    }
    loop() {
      return new Promise(async (e) => {
        let t = await _(this.base_url + "sq/" + this.sequence).catch((r) => r);
        if (t instanceof Error) {
          this.stream.emit("error", t);
          return;
        }
        (this.request = t),
          t.on("data", (r) => {
            this.stream.push(r);
          }),
          t.on("end", () => {
            this.sequence++, e("");
          }),
          t.once("error", (r) => {
            this.stream.emit("error", r);
          });
      });
    }
    pause() {}
    resume() {}
  };
a(de, "LiveStream");
var pe = class {
  constructor(e, t, r, s, n, o) {
    (this.stream = new Ie.Readable({
      highWaterMark: 5 * 1e3 * 1e3,
      read() {},
    })),
      (this.url = e),
      (this.quality = o.quality),
      (this.type = t),
      (this.bytes_count = 0),
      (this.video_url = n),
      (this.per_sec_bytes = Math.ceil(s / r)),
      (this.content_length = s),
      (this.request = null),
      (this.timer = new $(() => {
        this.timer.reuse(), this.loop();
      }, 265)),
      this.stream.on("close", () => {
        this.timer.destroy(), this.cleanup();
      }),
      this.loop();
  }
  async retry() {
    let e = await W(this.video_url),
      t = O(e.format);
    this.url = t[this.quality].url;
  }
  cleanup() {
    this.request?.destroy(), (this.request = null), (this.url = "");
  }
  async loop() {
    if (this.stream.destroyed) {
      this.timer.destroy(), this.cleanup();
      return;
    }
    let e = this.bytes_count + this.per_sec_bytes * 300,
      t = await _(this.url, {
        headers: {
          range: `bytes=${this.bytes_count}-${
            e >= this.content_length ? "" : e
          }`,
        },
      }).catch((r) => r);
    if (t instanceof Error) {
      this.stream.emit("error", t),
        (this.bytes_count = 0),
        (this.per_sec_bytes = 0),
        this.cleanup();
      return;
    }
    if (Number(t.statusCode) >= 400) {
      this.cleanup(), await this.retry(), this.timer.reuse(), this.loop();
      return;
    }
    (this.request = t),
      t.on("data", (r) => {
        this.stream.push(r);
      }),
      t.once("error", async () => {
        this.cleanup(), await this.retry(), this.timer.reuse(), this.loop();
      }),
      t.on("data", (r) => {
        this.bytes_count += r.length;
      }),
      t.on("end", () => {
        e >= this.content_length &&
          (this.timer.destroy(), this.stream.push(null), this.cleanup());
      });
  }
  pause() {
    this.timer.pause();
  }
  resume() {
    this.timer.resume();
  }
};
a(pe, "Stream");
var $ = class {
  constructor(e, t) {
    (this.callback = e),
      (this.time_total = t),
      (this.time_left = t),
      (this.paused = !1),
      (this.destroyed = !1),
      (this.time_start = process.hrtime()[0]),
      (this.timer = setTimeout(this.callback, this.time_total * 1e3));
  }
  pause() {
    return !this.paused && !this.destroyed
      ? ((this.paused = !0),
        clearTimeout(this.timer),
        (this.time_left =
          this.time_left - (process.hrtime()[0] - this.time_start)),
        !0)
      : !1;
  }
  resume() {
    return this.paused && !this.destroyed
      ? ((this.paused = !1),
        (this.time_start = process.hrtime()[0]),
        (this.timer = setTimeout(this.callback, this.time_left * 1e3)),
        !0)
      : !1;
  }
  reuse() {
    return this.destroyed
      ? !1
      : (clearTimeout(this.timer),
        (this.time_left = this.time_total),
        (this.paused = !1),
        (this.time_start = process.hrtime()[0]),
        (this.timer = setTimeout(this.callback, this.time_total * 1e3)),
        !0);
  }
  destroy() {
    clearTimeout(this.timer),
      (this.destroyed = !0),
      (this.callback = () => {}),
      (this.time_total = 0),
      (this.time_left = 0),
      (this.paused = !1),
      (this.time_start = 0);
  }
};
a($, "Timer");
var Q = require("play-audio"),
  ht = require("stream");
var bi = Object.keys(Q.WebmElements),
  me = class extends ht.Duplex {
    constructor(e, t) {
      super(t);
      (this.state = "READING_HEAD"),
        (this.cursor = 0),
        (this.header = new Q.WebmHeader()),
        (this.headfound = !1),
        (this.headerparsed = !1),
        (this.seekfound = !1),
        (this.data_length = 0),
        (this.data_size = 0),
        (this.offset = 0),
        (this.sec = e),
        (this.time = Math.floor(e / 10) * 10);
    }
    get vint_length() {
      let e = 0;
      for (; e < 8 && !((1 << (7 - e)) & this.chunk[this.cursor]); e++);
      return ++e;
    }
    vint_value() {
      if (!this.chunk) return !1;
      let e = this.vint_length;
      if (this.chunk.length < this.cursor + e) return !1;
      let t = this.chunk[this.cursor] & ((1 << (8 - e)) - 1);
      for (let r = this.cursor + 1; r < this.cursor + e; r++)
        t = (t << 8) + this.chunk[r];
      return (this.data_size = e), (this.data_length = t), !0;
    }
    cleanup() {
      (this.cursor = 0), (this.chunk = void 0), (this.remaining = void 0);
    }
    _read() {}
    seek(e) {
      let t = 0,
        r = 0,
        s = (this.sec - this.time) * 1e3 || 0;
      if (((s = Math.round(s / 20) * 20), !this.header.segment.cues))
        return new Error("Failed to Parse Cues");
      for (let n = 0; n < this.header.segment.cues.length; n++) {
        let o = this.header.segment.cues[n];
        if (Math.floor(o.time / 1e3) === this.time) {
          (r = o.position),
            (t = (this.header.segment.cues[n + 1]?.position || e) - r - 1);
          break;
        } else continue;
      }
      return t === 0 ? r : this.offset + Math.round(r + (s / 20) * (t / 500));
    }
    _write(e, t, r) {
      this.remaining
        ? ((this.chunk = Buffer.concat([this.remaining, e])),
          (this.remaining = void 0))
        : (this.chunk = e);
      let s;
      this.state === "READING_HEAD"
        ? (s = this.readHead())
        : this.seekfound
        ? (s = this.readTag())
        : (s = this.getClosestBlock()),
        s ? r(s) : r();
    }
    readHead() {
      if (!this.chunk) return new Error("Chunk is missing");
      for (; this.chunk.length > this.cursor; ) {
        let e = this.cursor,
          t = this.vint_length;
        if (this.chunk.length < this.cursor + t) break;
        let r = this.parseEbmlID(
          this.chunk.slice(this.cursor, this.cursor + t).toString("hex")
        );
        if (((this.cursor += t), !this.vint_value())) {
          this.cursor = e;
          break;
        }
        if (!r) {
          this.cursor += this.data_size + this.data_length;
          continue;
        }
        if (!this.headfound)
          if (r.name === "ebml") this.headfound = !0;
          else return new Error("Failed to find EBML ID at start of stream.");
        let s = this.chunk.slice(
            this.cursor + this.data_size,
            this.cursor + this.data_size + this.data_length
          ),
          n = this.header.parse(r, s);
        if (n instanceof Error) return n;
        if (
          (r.name === "seekHead" && (this.offset = e),
          r.name === "cueClusterPosition" &&
            this.header.segment.cues.length > 2 &&
            this.time === this.header.segment.cues.at(-2).time / 1e3 &&
            this.emit("headComplete"),
          r.type === 0)
        ) {
          this.cursor += this.data_size;
          continue;
        }
        if (
          this.chunk.length <
          this.cursor + this.data_size + this.data_length
        ) {
          this.cursor = e;
          break;
        } else this.cursor += this.data_size + this.data_length;
      }
      (this.remaining = this.chunk.slice(this.cursor)), (this.cursor = 0);
    }
    readTag() {
      if (!this.chunk) return new Error("Chunk is missing");
      for (; this.chunk.length > this.cursor; ) {
        let e = this.cursor,
          t = this.vint_length;
        if (this.chunk.length < this.cursor + t) break;
        let r = this.parseEbmlID(
          this.chunk.slice(this.cursor, this.cursor + t).toString("hex")
        );
        if (((this.cursor += t), !this.vint_value())) {
          this.cursor = e;
          break;
        }
        if (!r) {
          this.cursor += this.data_size + this.data_length;
          continue;
        }
        let s = this.chunk.slice(
            this.cursor + this.data_size,
            this.cursor + this.data_size + this.data_length
          ),
          n = this.header.parse(r, s);
        if (n instanceof Error) return n;
        if (r.type === 0) {
          this.cursor += this.data_size;
          continue;
        }
        if (
          this.chunk.length <
          this.cursor + this.data_size + this.data_length
        ) {
          this.cursor = e;
          break;
        } else this.cursor += this.data_size + this.data_length;
        if (r.name === "simpleBlock") {
          let o = this.header.segment.tracks[this.header.audioTrack];
          if (!o || o.trackType !== 2)
            return new Error("No audio Track in this webm file.");
          (s[0] & 15) === o.trackNumber && this.push(s.slice(4));
        }
      }
      (this.remaining = this.chunk.slice(this.cursor)), (this.cursor = 0);
    }
    getClosestBlock() {
      if (this.sec === 0) return (this.seekfound = !0), this.readTag();
      if (!this.chunk) return new Error("Chunk is missing");
      this.cursor = 0;
      let e = !1;
      for (; !e && this.cursor < this.chunk.length; ) {
        if (
          ((this.cursor = this.chunk.indexOf("a3", this.cursor, "hex")),
          this.cursor === -1)
        )
          return new Error("Failed to find nearest Block.");
        if ((this.cursor++, !this.vint_value()))
          return new Error("Failed to find correct simpleBlock in first chunk");
        if (
          this.cursor + this.data_length + this.data_length >
          this.chunk.length
        )
          continue;
        let t = this.chunk.slice(
            this.cursor + this.data_size,
            this.cursor + this.data_size + this.data_length
          ),
          r = this.header.segment.tracks[this.header.audioTrack];
        if (!r || r.trackType !== 2)
          return new Error("No audio Track in this webm file.");
        if ((t[0] & 15) === r.trackNumber)
          (this.cursor += this.data_size + this.data_length),
            this.push(t.slice(4)),
            (e = !0);
        else continue;
      }
      return e
        ? ((this.seekfound = !0), this.readTag())
        : new Error("Failed to find nearest correct simple Block.");
    }
    parseEbmlID(e) {
      return bi.includes(e) ? Q.WebmElements[e] : !1;
    }
    _destroy(e, t) {
      this.cleanup(), t(e);
    }
    _final(e) {
      this.cleanup(), e();
    }
  };
a(me, "WebmSeeker");
var fe = class {
  constructor(e, t, r, s, n, o, l) {
    (this.stream = new me(l.seek, {
      highWaterMark: 5 * 1e3 * 1e3,
      readableObjectMode: !0,
    })),
      (this.url = e),
      (this.quality = l.quality),
      (this.type = "opus"),
      (this.bytes_count = 0),
      (this.video_url = o),
      (this.per_sec_bytes = Math.ceil(n ? n / 8 : s / t)),
      (this.header_length = r),
      (this.content_length = s),
      (this.request = null),
      (this.timer = new $(() => {
        this.timer.reuse(), this.loop();
      }, 265)),
      this.stream.on("close", () => {
        this.timer.destroy(), this.cleanup();
      }),
      this.seek();
  }
  async seek() {
    let e = await new Promise(async (r, s) => {
      if (this.stream.headerparsed) r("");
      else {
        let n = await _(this.url, {
          headers: { range: `bytes=0-${this.header_length}` },
        }).catch((o) => o);
        if (n instanceof Error) {
          s(n);
          return;
        }
        if (Number(n.statusCode) >= 400) {
          s(400);
          return;
        }
        (this.request = n),
          n.pipe(this.stream, { end: !1 }),
          n.once("end", () => {
            (this.stream.state = "READING_DATA"), r("");
          }),
          this.stream.once("headComplete", () => {
            n.unpipe(this.stream),
              n.destroy(),
              (this.stream.state = "READING_DATA"),
              r("");
          });
      }
    }).catch((r) => r);
    if (e instanceof Error) {
      this.stream.emit("error", e),
        (this.bytes_count = 0),
        (this.per_sec_bytes = 0),
        this.cleanup();
      return;
    } else if (e === 400)
      return await this.retry(), this.timer.reuse(), this.seek();
    let t = this.stream.seek(this.content_length);
    if (t instanceof Error) {
      this.stream.emit("error", t),
        (this.bytes_count = 0),
        (this.per_sec_bytes = 0),
        this.cleanup();
      return;
    }
    (this.stream.seekfound = !1),
      (this.bytes_count = t),
      this.timer.reuse(),
      this.loop();
  }
  async retry() {
    let e = await W(this.video_url),
      t = O(e.format);
    this.url = t[this.quality].url;
  }
  cleanup() {
    this.request?.destroy(), (this.request = null), (this.url = "");
  }
  async loop() {
    if (this.stream.destroyed) {
      this.timer.destroy(), this.cleanup();
      return;
    }
    let e = this.bytes_count + this.per_sec_bytes * 300,
      t = await _(this.url, {
        headers: {
          range: `bytes=${this.bytes_count}-${
            e >= this.content_length ? "" : e
          }`,
        },
      }).catch((r) => r);
    if (t instanceof Error) {
      this.stream.emit("error", t),
        (this.bytes_count = 0),
        (this.per_sec_bytes = 0),
        this.cleanup();
      return;
    }
    if (Number(t.statusCode) >= 400) {
      this.cleanup(), await this.retry(), this.timer.reuse(), this.loop();
      return;
    }
    (this.request = t),
      t.pipe(this.stream, { end: !1 }),
      t.once("error", async () => {
        this.cleanup(), await this.retry(), this.timer.reuse(), this.loop();
      }),
      t.on("data", (r) => {
        this.bytes_count += r.length;
      }),
      t.on("end", () => {
        e >= this.content_length &&
          (this.timer.destroy(), this.stream.end(), this.cleanup());
      });
  }
  pause() {
    this.timer.pause();
  }
  resume() {
    this.timer.resume();
  }
};
a(fe, "SeekStream");
var dt = require("url");
function O(i) {
  let e = [];
  return (
    i.forEach((t) => {
      let r = t.mimeType;
      r.startsWith("audio") &&
        ((t.codec = r.split('codecs="')[1].split('"')[0]),
        (t.container = r.split("audio/")[1].split(";")[0]),
        e.push(t));
    }),
    e
  );
}
a(O, "parseAudioFormats");
async function ye(i, e = {}) {
  let t = await W(i, { htmldata: e.htmldata, language: e.language });
  return await be(t, e);
}
a(ye, "stream");
async function be(i, e = {}) {
  if (i.format.length === 0)
    throw new Error(
      "Upcoming and premiere videos that are not currently live cannot be streamed."
    );
  if (e.quality && !Number.isInteger(e.quality))
    throw new Error("Quality must be set to an integer.");
  let t = [];
  if (
    i.LiveStreamData.isLive === !0 &&
    i.LiveStreamData.dashManifestUrl !== null &&
    i.video_details.durationInSec === 0
  )
    return new de(
      i.LiveStreamData.dashManifestUrl,
      i.format[i.format.length - 1].targetDurationSec,
      i.video_details.url,
      e.precache
    );
  let r = O(i.format);
  typeof e.quality != "number"
    ? (e.quality = r.length - 1)
    : e.quality <= 0
    ? (e.quality = 0)
    : e.quality >= r.length && (e.quality = r.length - 1),
    r.length !== 0
      ? t.push(r[e.quality])
      : t.push(i.format[i.format.length - 1]);
  let s =
    t[0].codec === "opus" && t[0].container === "webm"
      ? "webm/opus"
      : "arbitrary";
  if (
    (await _(`https://${new dt.URL(t[0].url).host}/generate_204`),
    s === "webm/opus")
  )
    if (e.discordPlayerCompatibility) {
      if (e.seek)
        throw new Error(
          "Can not seek with discordPlayerCompatibility set to true."
        );
    } else {
      if (
        ((e.seek ??= 0), e.seek >= i.video_details.durationInSec || e.seek < 0)
      )
        throw new Error(
          `Seeking beyond limit. [ 0 - ${i.video_details.durationInSec - 1}]`
        );
      return new fe(
        t[0].url,
        i.video_details.durationInSec,
        t[0].indexRange.end,
        Number(t[0].contentLength),
        Number(t[0].bitrate),
        i.video_details.url,
        e
      );
    }
  let n;
  return (
    t[0].contentLength
      ? (n = Number(t[0].contentLength))
      : (n = await Te(t[0].url)),
    new pe(
      t[0].url,
      s,
      i.video_details.durationInSec,
      n,
      i.video_details.url,
      e
    )
  );
}
a(be, "stream_from_info");
var gi = [
  "-oaymwEpCOADEI4CSFryq4qpAxsIARUAAAAAGAElAADIQj0AgKJDeAHtAZmZGUI=",
  "-oaymwEiCOADEI4CSFXyq4qpAxQIARUAAIhCGAFwAcABBu0BmZkZQg==",
  "-oaymwEiCOgCEMoBSFXyq4qpAxQIARUAAIhCGAFwAcABBu0BZmbmQQ==",
  "-oaymwEiCNAFEJQDSFXyq4qpAxQIARUAAIhCGAFwAcABBu0BZmZmQg==",
  "-oaymwEdCNAFEJQDSFryq4qpAw8IARUAAIhCGAHtAWZmZkI=",
  "-oaymwEdCNACELwBSFryq4qpAw8IARUAAIhCGAHtAT0K10E=",
];
function mt(i, e) {
  if (!i) throw new Error("Can't parse Search result without data");
  e ? e.type || (e.type = "video") : (e = { type: "video", limit: 0 });
  let t = typeof e.limit == "number" && e.limit > 0;
  e.unblurNSFWThumbnails ??= !1;
  let r = i
      .split("var ytInitialData = ")?.[1]
      ?.split(";</script>")[0]
      .split(/;\s*(var|const|let)\s/)[0],
    s = JSON.parse(r),
    n = [],
    o =
      s.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents.flatMap(
        (l) => l.itemSectionRenderer?.contents
      );
  for (let l of o) {
    if (t && n.length === e.limit) break;
    if (
      !(!l || (!l.videoRenderer && !l.channelRenderer && !l.playlistRenderer))
    )
      switch (e.type) {
        case "video": {
          let c = ki(l);
          c && (e.unblurNSFWThumbnails && c.thumbnails.forEach(pt), n.push(c));
          break;
        }
        case "channel": {
          let c = _i(l);
          c && n.push(c);
          break;
        }
        case "playlist": {
          let c = vi(l);
          c &&
            (e.unblurNSFWThumbnails && c.thumbnail && pt(c.thumbnail),
            n.push(c));
          break;
        }
        default:
          throw new Error(`Unknown search type: ${e.type}`);
      }
  }
  return n;
}
a(mt, "ParseSearchResult");
function wi(i) {
  if (!i) return 0;
  let e = i.split(":"),
    t = 0;
  switch (e.length) {
    case 3:
      t = parseInt(e[0]) * 60 * 60 + parseInt(e[1]) * 60 + parseInt(e[2]);
      break;
    case 2:
      t = parseInt(e[0]) * 60 + parseInt(e[1]);
      break;
    default:
      t = parseInt(e[0]);
  }
  return t;
}
a(wi, "parseDuration");
function _i(i) {
  if (!i || !i.channelRenderer)
    throw new Error("Failed to Parse YouTube Channel");
  let e =
      i.channelRenderer.ownerBadges?.[0]?.metadataBadgeRenderer?.style?.toLowerCase(),
    t = `https://www.youtube.com${
      i.channelRenderer.navigationEndpoint.browseEndpoint.canonicalBaseUrl ||
      i.channelRenderer.navigationEndpoint.commandMetadata.webCommandMetadata
        .url
    }`,
    r =
      i.channelRenderer.thumbnail.thumbnails[
        i.channelRenderer.thumbnail.thumbnails.length - 1
      ];
  return new v({
    id: i.channelRenderer.channelId,
    name: i.channelRenderer.title.simpleText,
    icon: {
      url: r.url.replace("//", "https://"),
      width: r.width,
      height: r.height,
    },
    url: t,
    verified: Boolean(e?.includes("verified")),
    artist: Boolean(e?.includes("artist")),
    subscribers:
      i.channelRenderer.subscriberCountText?.simpleText ?? "0 subscribers",
  });
}
a(_i, "parseChannel");
function ki(i) {
  if (!i || !i.videoRenderer) throw new Error("Failed to Parse YouTube Video");
  let e = i.videoRenderer.ownerText.runs[0],
    t =
      i.videoRenderer.ownerBadges?.[0]?.metadataBadgeRenderer?.style?.toLowerCase(),
    r = i.videoRenderer.lengthText;
  return new S({
    id: i.videoRenderer.videoId,
    url: `https://www.youtube.com/watch?v=${i.videoRenderer.videoId}`,
    title: i.videoRenderer.title.runs[0].text,
    description: i.videoRenderer.detailedMetadataSnippets?.[0].snippetText.runs
      ?.length
      ? i.videoRenderer.detailedMetadataSnippets[0].snippetText.runs
          .map((n) => n.text)
          .join("")
      : "",
    duration: r ? wi(r.simpleText) : 0,
    duration_raw: r ? r.simpleText : null,
    thumbnails: i.videoRenderer.thumbnail.thumbnails,
    channel: {
      id: e.navigationEndpoint.browseEndpoint.browseId || null,
      name: e.text || null,
      url: `https://www.youtube.com${
        e.navigationEndpoint.browseEndpoint.canonicalBaseUrl ||
        e.navigationEndpoint.commandMetadata.webCommandMetadata.url
      }`,
      icons:
        i.videoRenderer.channelThumbnailSupportedRenderers
          .channelThumbnailWithLinkRenderer.thumbnail.thumbnails,
      verified: Boolean(t?.includes("verified")),
      artist: Boolean(t?.includes("artist")),
    },
    uploadedAt: i.videoRenderer.publishedTimeText?.simpleText ?? null,
    upcoming: i.videoRenderer.upcomingEventData?.startTime
      ? new Date(parseInt(i.videoRenderer.upcomingEventData.startTime) * 1e3)
      : void 0,
    views: i.videoRenderer.viewCountText?.simpleText?.replace(/\D/g, "") ?? 0,
    live: !r,
  });
}
a(ki, "parseVideo");
function vi(i) {
  if (!i || !i.playlistRenderer)
    throw new Error("Failed to Parse YouTube Playlist");
  let e =
      i.playlistRenderer.thumbnails[0].thumbnails[
        i.playlistRenderer.thumbnails[0].thumbnails.length - 1
      ],
    t = i.playlistRenderer.shortBylineText.runs?.[0];
  return new D(
    {
      id: i.playlistRenderer.playlistId,
      title: i.playlistRenderer.title.simpleText,
      thumbnail: {
        id: i.playlistRenderer.playlistId,
        url: e.url,
        height: e.height,
        width: e.width,
      },
      channel: {
        id: t?.navigationEndpoint.browseEndpoint.browseId,
        name: t?.text,
        url: `https://www.youtube.com${t?.navigationEndpoint.commandMetadata.webCommandMetadata.url}`,
      },
      videos: parseInt(i.playlistRenderer.videoCount.replace(/\D/g, "")),
    },
    !0
  );
}
a(vi, "parsePlaylist");
function pt(i) {
  if (gi.find((e) => i.url.includes(e)))
    switch (
      ((i.url = i.url.split("?")[0]), i.url.split("/").at(-1).split(".")[0])
    ) {
      case "hq2":
      case "hqdefault":
        (i.width = 480), (i.height = 360);
        break;
      case "hq720":
        (i.width = 1280), (i.height = 720);
        break;
      case "sddefault":
        (i.width = 640), (i.height = 480);
        break;
      case "mqdefault":
        (i.width = 320), (i.height = 180);
        break;
      case "default":
        (i.width = 120), (i.height = 90);
        break;
      default:
        i.width = i.height = NaN;
    }
}
a(pt, "unblurThumbnail");
async function ft(i, e = {}) {
  let t = "https://www.youtube.com/results?search_query=" + i;
  if (((e.type ??= "video"), t.indexOf("&sp=") === -1))
    switch (((t += "&sp="), e.type)) {
      case "channel":
        t += "EgIQAg%253D%253D";
        break;
      case "playlist":
        t += "EgIQAw%253D%253D";
        break;
      case "video":
        t += "EgIQAQ%253D%253D";
        break;
      default:
        throw new Error(`Unknown search type: ${e.type}`);
    }
  let r = await h(t, {
    headers: { "accept-language": e.language || "en-US;q=0.9" },
  });
  if (
    r.indexOf(
      "Our systems have detected unusual traffic from your computer network."
    ) !== -1
  )
    throw new Error("Captcha page: YouTube has detected that you are a bot!");
  return mt(r, e);
}
a(ft, "yt_search");
var E = class {
  constructor(e) {
    (this.name = e.name),
      (this.id = e.id),
      (this.isrc = e.external_ids?.isrc || ""),
      (this.type = "track"),
      (this.url = e.external_urls.spotify),
      (this.explicit = e.explicit),
      (this.playable = e.is_playable),
      (this.durationInMs = e.duration_ms),
      (this.durationInSec = Math.round(this.durationInMs / 1e3));
    let t = [];
    e.artists.forEach((r) => {
      t.push({ name: r.name, id: r.id, url: r.external_urls.spotify });
    }),
      (this.artists = t),
      e.album?.name
        ? (this.album = {
            name: e.album.name,
            url: e.external_urls.spotify,
            id: e.album.id,
            release_date: e.album.release_date,
            release_date_precision: e.album.release_date_precision,
            total_tracks: e.album.total_tracks,
          })
        : (this.album = void 0),
      e.album?.images?.[0]
        ? (this.thumbnail = e.album.images[0])
        : (this.thumbnail = void 0);
  }
  toJSON() {
    return {
      name: this.name,
      id: this.id,
      url: this.url,
      explicit: this.explicit,
      durationInMs: this.durationInMs,
      durationInSec: this.durationInSec,
      artists: this.artists,
      album: this.album,
      thumbnail: this.thumbnail,
    };
  }
};
a(E, "SpotifyTrack");
var N = class {
  constructor(e, t, r) {
    (this.name = e.name),
      (this.type = "playlist"),
      (this.search = r),
      (this.collaborative = e.collaborative),
      (this.description = e.description),
      (this.url = e.external_urls.spotify),
      (this.id = e.id),
      (this.thumbnail = e.images[0]),
      (this.owner = {
        name: e.owner.display_name,
        url: e.owner.external_urls.spotify,
        id: e.owner.id,
      }),
      (this.tracksCount = Number(e.tracks.total));
    let s = [];
    this.search ||
      e.tracks.items.forEach((n) => {
        n.track && s.push(new E(n.track));
      }),
      (this.fetched_tracks = new Map()),
      this.fetched_tracks.set("1", s),
      (this.spotifyData = t);
  }
  async fetch() {
    if (this.search) return this;
    let e;
    if ((this.tracksCount > 1e3 ? (e = 1e3) : (e = this.tracksCount), e <= 100))
      return this;
    let t = [];
    for (let r = 2; r <= Math.ceil(e / 100); r++)
      t.push(
        new Promise(async (s, n) => {
          let o = await h(
              `https://api.spotify.com/v1/playlists/${this.id}/tracks?offset=${
                (r - 1) * 100
              }&limit=100&market=${this.spotifyData.market}`,
              {
                headers: {
                  Authorization: `${this.spotifyData.token_type} ${this.spotifyData.access_token}`,
                },
              }
            ).catch((u) =>
              n(`Response Error : 
${u}`)
            ),
            l = [];
          if (typeof o != "string") return;
          JSON.parse(o).items.forEach((u) => {
            u.track && l.push(new E(u.track));
          }),
            this.fetched_tracks.set(`${r}`, l),
            s("Success");
        })
      );
    return await Promise.allSettled(t), this;
  }
  page(e) {
    if (!e) throw new Error("Page number is not provided");
    if (!this.fetched_tracks.has(`${e}`))
      throw new Error("Given Page number is invalid");
    return this.fetched_tracks.get(`${e}`);
  }
  get total_pages() {
    return this.fetched_tracks.size;
  }
  get total_tracks() {
    if (this.search) return this.tracksCount;
    let e = this.total_pages;
    return (e - 1) * 100 + this.fetched_tracks.get(`${e}`).length;
  }
  async all_tracks() {
    await this.fetch();
    let e = [];
    for (let t of this.fetched_tracks.values()) e.push(...t);
    return e;
  }
  toJSON() {
    return {
      name: this.name,
      collaborative: this.collaborative,
      description: this.description,
      url: this.url,
      id: this.id,
      thumbnail: this.thumbnail,
      owner: this.owner,
      tracksCount: this.tracksCount,
    };
  }
};
a(N, "SpotifyPlaylist");
var z = class {
  constructor(e, t, r) {
    (this.name = e.name),
      (this.type = "album"),
      (this.id = e.id),
      (this.search = r),
      (this.url = e.external_urls.spotify),
      (this.thumbnail = e.images[0]);
    let s = [];
    e.artists.forEach((o) => {
      s.push({ name: o.name, id: o.id, url: o.external_urls.spotify });
    }),
      (this.artists = s),
      (this.copyrights = e.copyrights),
      (this.release_date = e.release_date),
      (this.release_date_precision = e.release_date_precision),
      (this.tracksCount = e.total_tracks);
    let n = [];
    this.search ||
      e.tracks.items.forEach((o) => {
        n.push(new E(o));
      }),
      (this.fetched_tracks = new Map()),
      this.fetched_tracks.set("1", n),
      (this.spotifyData = t);
  }
  async fetch() {
    if (this.search) return this;
    let e;
    if ((this.tracksCount > 500 ? (e = 500) : (e = this.tracksCount), e <= 50))
      return this;
    let t = [];
    for (let r = 2; r <= Math.ceil(e / 50); r++)
      t.push(
        new Promise(async (s, n) => {
          let o = await h(
              `https://api.spotify.com/v1/albums/${this.id}/tracks?offset=${
                (r - 1) * 50
              }&limit=50&market=${this.spotifyData.market}`,
              {
                headers: {
                  Authorization: `${this.spotifyData.token_type} ${this.spotifyData.access_token}`,
                },
              }
            ).catch((u) =>
              n(`Response Error : 
${u}`)
            ),
            l = [];
          if (typeof o != "string") return;
          JSON.parse(o).items.forEach((u) => {
            u && l.push(new E(u));
          }),
            this.fetched_tracks.set(`${r}`, l),
            s("Success");
        })
      );
    return await Promise.allSettled(t), this;
  }
  page(e) {
    if (!e) throw new Error("Page number is not provided");
    if (!this.fetched_tracks.has(`${e}`))
      throw new Error("Given Page number is invalid");
    return this.fetched_tracks.get(`${e}`);
  }
  get total_pages() {
    return this.fetched_tracks.size;
  }
  get total_tracks() {
    if (this.search) return this.tracksCount;
    let e = this.total_pages;
    return (e - 1) * 100 + this.fetched_tracks.get(`${e}`).length;
  }
  async all_tracks() {
    await this.fetch();
    let e = [];
    for (let t of this.fetched_tracks.values()) e.push(...t);
    return e;
  }
  toJSON() {
    return {
      name: this.name,
      id: this.id,
      type: this.type,
      url: this.url,
      thumbnail: this.thumbnail,
      artists: this.artists,
      copyrights: this.copyrights,
      release_date: this.release_date,
      release_date_precision: this.release_date_precision,
      tracksCount: this.tracksCount,
    };
  }
};
a(z, "SpotifyAlbum");
var J = require("fs"),
  d;
(0, J.existsSync)(".data/spotify.data") &&
  ((d = JSON.parse((0, J.readFileSync)(".data/spotify.data", "utf-8"))),
  (d.file = !0));
var yt =
  /^((https:)?\/\/)?open\.spotify\.com\/(?:intl\-.{2}\/)?(track|album|playlist)\//;
async function Ce(i) {
  if (!d)
    throw new Error(`Spotify Data is missing
Did you forgot to do authorization ?`);
  let e = i.trim();
  if (!e.match(yt)) throw new Error("This is not a Spotify URL");
  if (e.indexOf("track/") !== -1) {
    let t = e.split("track/")[1].split("&")[0].split("?")[0],
      r = await h(`https://api.spotify.com/v1/tracks/${t}?market=${d.market}`, {
        headers: { Authorization: `${d.token_type} ${d.access_token}` },
      }).catch((n) => n);
    if (r instanceof Error) throw r;
    let s = JSON.parse(r);
    if (s.error)
      throw new Error(
        `Got ${s.error.status} from the spotify request: ${s.error.message}`
      );
    return new E(s);
  } else if (e.indexOf("album/") !== -1) {
    let t = i.split("album/")[1].split("&")[0].split("?")[0],
      r = await h(`https://api.spotify.com/v1/albums/${t}?market=${d.market}`, {
        headers: { Authorization: `${d.token_type} ${d.access_token}` },
      }).catch((n) => n);
    if (r instanceof Error) throw r;
    let s = JSON.parse(r);
    if (s.error)
      throw new Error(
        `Got ${s.error.status} from the spotify request: ${s.error.message}`
      );
    return new z(s, d, !1);
  } else if (e.indexOf("playlist/") !== -1) {
    let t = i.split("playlist/")[1].split("&")[0].split("?")[0],
      r = await h(
        `https://api.spotify.com/v1/playlists/${t}?market=${d.market}`,
        { headers: { Authorization: `${d.token_type} ${d.access_token}` } }
      ).catch((n) => n);
    if (r instanceof Error) throw r;
    let s = JSON.parse(r);
    if (s.error)
      throw new Error(
        `Got ${s.error.status} from the spotify request: ${s.error.message}`
      );
    return new N(s, d, !1);
  } else throw new Error("URL is out of scope for play-dl.");
}
a(Ce, "spotify");
function ge(i) {
  let e = i.trim();
  return e.startsWith("https")
    ? e.match(yt)
      ? e.indexOf("track/") !== -1
        ? "track"
        : e.indexOf("album/") !== -1
        ? "album"
        : e.indexOf("playlist/") !== -1
        ? "playlist"
        : !1
      : !1
    : "search";
}
a(ge, "sp_validate");
async function bt(i, e) {
  let t = await h("https://accounts.spotify.com/api/token", {
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${i.client_id}:${i.client_secret}`
      ).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=authorization_code&code=${
      i.authorization_code
    }&redirect_uri=${encodeURI(i.redirect_url)}`,
    method: "POST",
  }).catch((s) => s);
  if (t instanceof Error) throw t;
  let r = JSON.parse(t);
  return (
    (d = {
      client_id: i.client_id,
      client_secret: i.client_secret,
      redirect_url: i.redirect_url,
      access_token: r.access_token,
      refresh_token: r.refresh_token,
      expires_in: Number(r.expires_in),
      expiry: Date.now() + (r.expires_in - 1) * 1e3,
      token_type: r.token_type,
      market: i.market,
    }),
    e
      ? (0, J.writeFileSync)(".data/spotify.data", JSON.stringify(d, void 0, 4))
      : (console.log(`Client ID : ${d.client_id}`),
        console.log(`Client Secret : ${d.client_secret}`),
        console.log(`Refresh Token : ${d.refresh_token}`),
        console.log(`Market : ${d.market}`),
        console.log(`
Paste above info in setToken function.`)),
    !0
  );
}
a(bt, "SpotifyAuthorize");
function Oe() {
  return Date.now() >= d.expiry;
}
a(Oe, "is_expired");
async function gt(i, e, t = 10) {
  let r = [];
  if (!d)
    throw new Error(`Spotify Data is missing
Did you forget to do authorization ?`);
  if (i.length === 0) throw new Error("Pass some query to search.");
  if (t > 50 || t < 0)
    throw new Error("You crossed limit range of Spotify [ 0 - 50 ]");
  let s = await h(
    `https://api.spotify.com/v1/search?type=${e}&q=${i}&limit=${t}&market=${d.market}`,
    { headers: { Authorization: `${d.token_type} ${d.access_token}` } }
  ).catch((o) => o);
  if (s instanceof Error) throw s;
  let n = JSON.parse(s);
  return (
    e === "track"
      ? n.tracks.items.forEach((o) => {
          r.push(new E(o));
        })
      : e === "album"
      ? n.albums.items.forEach((o) => {
          r.push(new z(o, d, !0));
        })
      : e === "playlist" &&
        n.playlists.items.forEach((o) => {
          r.push(new N(o, d, !0));
        }),
    r
  );
}
a(gt, "sp_search");
async function we() {
  let i = await h("https://accounts.spotify.com/api/token", {
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${d.client_id}:${d.client_secret}`
      ).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=refresh_token&refresh_token=${d.refresh_token}`,
    method: "POST",
  }).catch((t) => t);
  if (i instanceof Error) return !1;
  let e = JSON.parse(i);
  return (
    (d.access_token = e.access_token),
    (d.expires_in = Number(e.expires_in)),
    (d.expiry = Date.now() + (e.expires_in - 1) * 1e3),
    (d.token_type = e.token_type),
    d.file &&
      (0, J.writeFileSync)(".data/spotify.data", JSON.stringify(d, void 0, 4)),
    !0
  );
}
a(we, "refreshToken");
async function wt(i) {
  (d = i), (d.file = !1), await we();
}
a(wt, "setSpotifyToken");
var _e = require("fs");
var _t = require("stream");
var T = class {
  constructor(e) {
    (this.name = e.title),
      (this.id = e.id),
      (this.url = e.uri),
      (this.permalink = e.permalink_url),
      (this.fetched = !0),
      (this.type = "track"),
      (this.durationInSec = Math.round(Number(e.duration) / 1e3)),
      (this.durationInMs = Number(e.duration)),
      e.publisher_metadata
        ? (this.publisher = {
            name: e.publisher_metadata.publisher,
            id: e.publisher_metadata.id,
            artist: e.publisher_metadata.artist,
            contains_music: Boolean(e.publisher_metadata.contains_music) || !1,
            writer_composer: e.publisher_metadata.writer_composer,
          })
        : (this.publisher = null),
      (this.formats = e.media.transcodings),
      (this.user = {
        name: e.user.username,
        id: e.user.id,
        type: "user",
        url: e.user.permalink_url,
        verified: Boolean(e.user.verified) || !1,
        description: e.user.description,
        first_name: e.user.first_name,
        full_name: e.user.full_name,
        last_name: e.user.last_name,
        thumbnail: e.user.avatar_url,
      }),
      (this.thumbnail = e.artwork_url);
  }
  toJSON() {
    return {
      name: this.name,
      id: this.id,
      url: this.url,
      permalink: this.permalink,
      fetched: this.fetched,
      durationInMs: this.durationInMs,
      durationInSec: this.durationInSec,
      publisher: this.publisher,
      formats: this.formats,
      thumbnail: this.thumbnail,
      user: this.user,
    };
  }
};
a(T, "SoundCloudTrack");
var P = class {
  constructor(e, t) {
    (this.name = e.title),
      (this.id = e.id),
      (this.url = e.uri),
      (this.client_id = t),
      (this.type = "playlist"),
      (this.sub_type = e.set_type),
      (this.durationInSec = Math.round(Number(e.duration) / 1e3)),
      (this.durationInMs = Number(e.duration)),
      (this.user = {
        name: e.user.username,
        id: e.user.id,
        type: "user",
        url: e.user.permalink_url,
        verified: Boolean(e.user.verified) || !1,
        description: e.user.description,
        first_name: e.user.first_name,
        full_name: e.user.full_name,
        last_name: e.user.last_name,
        thumbnail: e.user.avatar_url,
      }),
      (this.tracksCount = e.track_count);
    let r = [];
    e.tracks.forEach((s) => {
      s.title
        ? r.push(new T(s))
        : r.push({ id: s.id, fetched: !1, type: "track" });
    }),
      (this.tracks = r);
  }
  async fetch() {
    let e = [];
    for (let t = 0; t < this.tracks.length; t++)
      this.tracks[t].fetched ||
        e.push(
          new Promise(async (r) => {
            let s = t,
              n = await h(
                `https://api-v2.soundcloud.com/tracks/${this.tracks[t].id}?client_id=${this.client_id}`
              );
            (this.tracks[s] = new T(JSON.parse(n))), r("");
          })
        );
    return await Promise.allSettled(e), this;
  }
  get total_tracks() {
    let e = 0;
    return (
      this.tracks.forEach((t) => {
        if (t instanceof T) e++;
        else return;
      }),
      e
    );
  }
  async all_tracks() {
    return await this.fetch(), this.tracks;
  }
  toJSON() {
    return {
      name: this.name,
      id: this.id,
      sub_type: this.sub_type,
      url: this.url,
      durationInMs: this.durationInMs,
      durationInSec: this.durationInSec,
      tracksCount: this.tracksCount,
      user: this.user,
      tracks: this.tracks,
    };
  }
};
a(P, "SoundCloudPlaylist");
var L = class {
  constructor(e, t = "arbitrary") {
    (this.stream = new _t.Readable({
      highWaterMark: 5 * 1e3 * 1e3,
      read() {},
    })),
      (this.type = t),
      (this.url = e),
      (this.downloaded_time = 0),
      (this.request = null),
      (this.downloaded_segments = 0),
      (this.time = []),
      (this.timer = new $(() => {
        this.timer.reuse(), this.start();
      }, 280)),
      (this.segment_urls = []),
      this.stream.on("close", () => {
        this.cleanup();
      }),
      this.start();
  }
  async parser() {
    let e = await h(this.url).catch((r) => r);
    if (e instanceof Error) throw e;
    e.split(
      `
`
    ).forEach((r) => {
      r.startsWith("#EXTINF:")
        ? this.time.push(parseFloat(r.replace("#EXTINF:", "")))
        : r.startsWith("https") && this.segment_urls.push(r);
    });
  }
  async start() {
    if (this.stream.destroyed) {
      this.cleanup();
      return;
    }
    (this.time = []),
      (this.segment_urls = []),
      (this.downloaded_time = 0),
      await this.parser(),
      this.segment_urls.splice(0, this.downloaded_segments),
      this.loop();
  }
  async loop() {
    if (this.stream.destroyed) {
      this.cleanup();
      return;
    }
    if (this.time.length === 0 || this.segment_urls.length === 0) {
      this.cleanup(), this.stream.push(null);
      return;
    }
    (this.downloaded_time += this.time.shift()), this.downloaded_segments++;
    let e = await _(this.segment_urls.shift()).catch((t) => t);
    if (e instanceof Error) {
      this.stream.emit("error", e), this.cleanup();
      return;
    }
    (this.request = e),
      e.on("data", (t) => {
        this.stream.push(t);
      }),
      e.on("end", () => {
        this.downloaded_time >= 300 || this.loop();
      }),
      e.once("error", (t) => {
        this.stream.emit("error", t);
      });
  }
  cleanup() {
    this.timer.destroy(),
      this.request?.destroy(),
      (this.url = ""),
      (this.downloaded_time = 0),
      (this.downloaded_segments = 0),
      (this.request = null),
      (this.time = []),
      (this.segment_urls = []);
  }
  pause() {
    this.timer.pause();
  }
  resume() {
    this.timer.resume();
  }
};
a(L, "SoundCloudStream");
var C;
(0, _e.existsSync)(".data/soundcloud.data") &&
  (C = JSON.parse((0, _e.readFileSync)(".data/soundcloud.data", "utf-8")));
var kt =
  /^(?:(https?):\/\/)?(?:(?:www|m)\.)?(api\.soundcloud\.com|soundcloud\.com|snd\.sc)\/(.*)$/;
async function ke(i) {
  if (!C)
    throw new Error(`SoundCloud Data is missing
Did you forget to do authorization ?`);
  let e = i.trim();
  if (!e.match(kt)) throw new Error("This is not a SoundCloud URL");
  let t = await h(
    `https://api-v2.soundcloud.com/resolve?url=${e}&client_id=${C.client_id}`
  ).catch((s) => s);
  if (t instanceof Error) throw t;
  let r = JSON.parse(t);
  if (r.kind !== "track" && r.kind !== "playlist")
    throw new Error("This url is out of scope for play-dl.");
  return r.kind === "track" ? new T(r) : new P(r, C.client_id);
}
a(ke, "soundcloud");
async function vt(i, e, t = 10) {
  let r = await h(
      `https://api-v2.soundcloud.com/search/${e}?q=${i}&client_id=${C.client_id}&limit=${t}`
    ),
    s = [];
  return (
    JSON.parse(r).collection.forEach((o) => {
      e === "tracks" ? s.push(new T(o)) : s.push(new P(o, C.client_id));
    }),
    s
  );
}
a(vt, "so_search");
async function St(i, e) {
  let t = await ke(i);
  if (t instanceof P)
    throw new Error("Streams can't be created from playlist urls");
  let r = xt(t.formats);
  typeof e != "number"
    ? (e = r.length - 1)
    : e <= 0
    ? (e = 0)
    : e >= r.length && (e = r.length - 1);
  let s = r[e].url + "?client_id=" + C.client_id,
    n = JSON.parse(await h(s)),
    o = r[e].format.mime_type.startsWith("audio/ogg")
      ? "ogg/opus"
      : "arbitrary";
  return new L(n.url, o);
}
a(St, "stream");
async function $e() {
  let i = await h("https://soundcloud.com/", { headers: {} }).catch((s) => s);
  if (i instanceof Error)
    throw new Error("Failed to get response from soundcloud.com: " + i.message);
  let e = i.split('<script crossorigin src="'),
    t = [];
  return (
    e.forEach((s) => {
      s.startsWith("https") && t.push(s.split('"')[0]);
    }),
    (await h(t[t.length - 1])).split(',client_id:"')[1].split('"')[0]
  );
}
a($e, "getFreeClientID");
async function Et(i, e) {
  let t = xt(i.formats);
  typeof e != "number"
    ? (e = t.length - 1)
    : e <= 0
    ? (e = 0)
    : e >= t.length && (e = t.length - 1);
  let r = t[e].url + "?client_id=" + C.client_id,
    s = JSON.parse(await h(r)),
    n = t[e].format.mime_type.startsWith("audio/ogg")
      ? "ogg/opus"
      : "arbitrary";
  return new L(s.url, n);
}
a(Et, "stream_from_info");
async function Tt(i) {
  return !(
    (await h(
      `https://api-v2.soundcloud.com/search?client_id=${i}&q=Rick+Roll&limit=0`
    ).catch((t) => t)) instanceof Error
  );
}
a(Tt, "check_id");
async function ve(i) {
  let e = i.trim();
  if (!e.startsWith("https")) return "search";
  if (!e.match(kt)) return !1;
  let t = await h(
    `https://api-v2.soundcloud.com/resolve?url=${e}&client_id=${C.client_id}`
  ).catch((s) => s);
  if (t instanceof Error) return !1;
  let r = JSON.parse(t);
  return r.kind === "track" ? "track" : r.kind === "playlist" ? "playlist" : !1;
}
a(ve, "so_validate");
function xt(i) {
  let e = [];
  return (
    i.forEach((t) => {
      t.format.protocol === "hls" && e.push(t);
    }),
    e
  );
}
a(xt, "parseHlsFormats");
function Dt(i) {
  C = i;
}
a(Dt, "setSoundCloudToken");
var It = require("url");
var g = class {
  constructor(e, t) {
    (this.id = e.id),
      (this.title = e.title),
      (this.shortTitle = e.title_short),
      (this.url = e.link),
      (this.durationInSec = e.duration),
      (this.rank = e.rank),
      (this.explicit = e.explicit_lyrics),
      (this.previewURL = e.preview),
      (this.artist = new M(e.artist)),
      (this.album = new Pe(e.album)),
      (this.type = "track"),
      (this.partial = t),
      t ||
        ((this.trackPosition = e.track_position),
        (this.diskNumber = e.disk_number),
        (this.releaseDate = new Date(e.release_date)),
        (this.bpm = e.bpm),
        (this.gain = e.gain),
        (this.contributors = []),
        e.contributors.forEach((r) => {
          this.contributors?.push(new M(r));
        }));
  }
  async fetch() {
    if (!this.partial) return this;
    let e = await h(`https://api.deezer.com/track/${this.id}/`).catch((r) => r);
    if (e instanceof Error) throw e;
    let t = JSON.parse(e);
    return (
      (this.partial = !1),
      (this.trackPosition = t.track_position),
      (this.diskNumber = t.disk_number),
      (this.releaseDate = new Date(t.release_date)),
      (this.bpm = t.bpm),
      (this.gain = t.gain),
      (this.contributors = []),
      t.contributors.forEach((r) => {
        this.contributors?.push(new M(r));
      }),
      this
    );
  }
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      shortTitle: this.shortTitle,
      url: this.url,
      durationInSec: this.durationInSec,
      rank: this.rank,
      explicit: this.explicit,
      previewURL: this.previewURL,
      artist: this.artist,
      album: this.album,
      type: this.type,
      trackPosition: this.trackPosition,
      diskNumber: this.diskNumber,
      releaseDate: this.releaseDate,
      bpm: this.bpm,
      gain: this.gain,
      contributors: this.contributors,
    };
  }
};
a(g, "DeezerTrack");
var q = class {
  constructor(e, t) {
    if (
      ((this.id = e.id),
      (this.title = e.title),
      (this.url = e.link),
      (this.recordType = e.record_type),
      (this.explicit = e.explicit_lyrics),
      (this.artist = new M(e.artist)),
      (this.type = "album"),
      (this.tracksCount = e.nb_tracks),
      (this.contributors = []),
      (this.genres = []),
      (this.tracks = []),
      (this.cover = {
        xl: e.cover_xl,
        big: e.cover_big,
        medium: e.cover_medium,
        small: e.cover_small,
      }),
      (this.partial = t),
      !t)
    ) {
      (this.upc = e.upc),
        (this.durationInSec = e.duration),
        (this.numberOfFans = e.fans),
        (this.releaseDate = new Date(e.release_date)),
        (this.available = e.available),
        e.contributors.forEach((s) => {
          this.contributors?.push(new M(s));
        }),
        e.genres.data.forEach((s) => {
          this.genres?.push({
            name: s.name,
            picture: {
              xl: `${s.picture}?size=xl`,
              big: `${s.picture}?size=big`,
              medium: `${s.picture}?size=medium`,
              small: `${s.picture}?size=small`,
            },
          });
        });
      let r = {
        id: this.id,
        title: this.title,
        cover_xl: this.cover.xl,
        cover_big: this.cover.big,
        cover_medium: this.cover.medium,
        cover_small: this.cover.small,
        release_date: e.release_date,
      };
      e.tracks.data.forEach((s) => {
        (s.album = r), this.tracks.push(new g(s, !0));
      });
    }
  }
  async fetch() {
    if (!this.partial) return this;
    let e = await h(`https://api.deezer.com/album/${this.id}/`).catch((s) => s);
    if (e instanceof Error) throw e;
    let t = JSON.parse(e);
    (this.partial = !1),
      (this.upc = t.upc),
      (this.durationInSec = t.duration),
      (this.numberOfFans = t.fans),
      (this.releaseDate = new Date(t.release_date)),
      (this.available = t.available),
      (this.contributors = []),
      (this.genres = []),
      (this.tracks = []),
      t.contributors.forEach((s) => {
        this.contributors?.push(new M(s));
      }),
      t.genres.data.forEach((s) => {
        this.genres?.push({
          name: s.name,
          picture: {
            xl: `${s.picture}?size=xl`,
            big: `${s.picture}?size=big`,
            medium: `${s.picture}?size=medium`,
            small: `${s.picture}?size=small`,
          },
        });
      });
    let r = {
      id: this.id,
      title: this.title,
      cover_xl: this.cover.xl,
      cover_big: this.cover.big,
      cover_medium: this.cover.medium,
      cover_small: this.cover.small,
      release_date: t.release_date,
    };
    return (
      t.tracks.data.forEach((s) => {
        (s.album = r), this.tracks.push(new g(s, !0));
      }),
      this
    );
  }
  async all_tracks() {
    return await this.fetch(), this.tracks;
  }
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      url: this.url,
      recordType: this.recordType,
      explicit: this.explicit,
      artist: this.artist,
      cover: this.cover,
      type: this.type,
      upc: this.upc,
      tracksCount: this.tracksCount,
      durationInSec: this.durationInSec,
      numberOfFans: this.numberOfFans,
      releaseDate: this.releaseDate,
      available: this.available,
      genres: this.genres,
      contributors: this.contributors,
      tracks: this.tracks.map((e) => e.toJSON()),
    };
  }
};
a(q, "DeezerAlbum");
var U = class {
  constructor(e, t) {
    (this.id = e.id),
      (this.title = e.title),
      (this.public = e.public),
      (this.url = e.link),
      (this.creationDate = new Date(e.creation_date)),
      (this.type = "playlist"),
      (this.tracksCount = e.nb_tracks),
      (this.tracks = []),
      (this.picture = {
        xl: e.picture_xl,
        big: e.picture_big,
        medium: e.picture_medium,
        small: e.picture_small,
      }),
      e.user
        ? (this.creator = { id: e.user.id, name: e.user.name })
        : (this.creator = { id: e.creator.id, name: e.creator.name }),
      (this.partial = t),
      t ||
        ((this.description = e.description),
        (this.durationInSec = e.duration),
        (this.isLoved = e.is_loved_track),
        (this.collaborative = e.collaborative),
        (this.fans = e.fans),
        this.public && (this.tracks = e.tracks.data.map((r) => new g(r, !0))));
  }
  async fetch() {
    if (
      !this.partial &&
      (this.tracks.length === this.tracksCount || !this.public)
    )
      return this;
    if (this.partial) {
      let t = await h(`https://api.deezer.com/playlist/${this.id}/`).catch(
        (s) => s
      );
      if (t instanceof Error) throw t;
      let r = JSON.parse(t);
      (this.partial = !1),
        (this.description = r.description),
        (this.durationInSec = r.duration),
        (this.isLoved = r.is_loved_track),
        (this.collaborative = r.collaborative),
        (this.fans = r.fans),
        this.public && (this.tracks = r.tracks.data.map((s) => new g(s, !0)));
    }
    let e = this.tracks.length;
    if (this.public && e !== this.tracksCount) {
      let t = this.tracksCount - e;
      t > 1e3 && (t = 1e3);
      let r = [];
      for (let o = 1; o <= Math.ceil(t / 100); o++)
        r.push(
          new Promise(async (l, c) => {
            let u = await h(
              `https://api.deezer.com/playlist/${
                this.id
              }/tracks?limit=100&index=${o * 100}`
            ).catch((f) => c(f));
            if (typeof u != "string") return;
            let y = JSON.parse(u).data.map((f) => new g(f, !0));
            l(y);
          })
        );
      let s = await Promise.allSettled(r),
        n = [];
      for (let o of s)
        if (o.status === "fulfilled") n.push(...o.value);
        else throw o.reason;
      this.tracks.push(...n);
    }
    return this;
  }
  async all_tracks() {
    return await this.fetch(), this.tracks;
  }
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      public: this.public,
      url: this.url,
      picture: this.picture,
      creationDate: this.creationDate,
      type: this.type,
      creator: this.creator,
      tracksCount: this.tracksCount,
      description: this.description,
      durationInSec: this.durationInSec,
      isLoved: this.isLoved,
      collaborative: this.collaborative,
      fans: this.fans,
      tracks: this.tracks.map((e) => e.toJSON()),
    };
  }
};
a(U, "DeezerPlaylist");
var Pe = class {
  constructor(e) {
    (this.id = e.id),
      (this.title = e.title),
      (this.url = `https://www.deezer.com/album/${e.id}/`),
      (this.cover = {
        xl: e.cover_xl,
        big: e.cover_big,
        medium: e.cover_medium,
        small: e.cover_small,
      }),
      e.release_date && (this.releaseDate = new Date(e.release_date));
  }
};
a(Pe, "DeezerTrackAlbum");
var M = class {
  constructor(e) {
    (this.id = e.id),
      (this.name = e.name),
      (this.url = e.link ? e.link : `https://www.deezer.com/artist/${e.id}/`),
      e.picture_xl &&
        (this.picture = {
          xl: e.picture_xl,
          big: e.picture_big,
          medium: e.picture_medium,
          small: e.picture_small,
        }),
      e.role && (this.role = e.role);
  }
};
a(M, "DeezerArtist");
async function Ae(i) {
  let e;
  try {
    e = new It.URL(i);
  } catch {
    return { type: "search" };
  }
  if (e.protocol !== "https:" && e.protocol !== "http:")
    return { type: "search" };
  let t = e.pathname;
  t.endsWith("/") && (t = t.slice(0, -1));
  let r = t.split("/");
  switch (e.hostname) {
    case "deezer.com":
    case "www.deezer.com": {
      if (r.length === 4) {
        if (!r.splice(1, 1)[0].match(/^[a-z]{2}$/)) return { type: !1 };
      } else if (r.length !== 3) return { type: !1 };
      return (r[1] === "track" || r[1] === "album" || r[1] === "playlist") &&
        r[2].match(/^\d+$/)
        ? { type: r[1], id: r[2] }
        : { type: !1 };
    }
    case "api.deezer.com":
      return r.length === 3 &&
        (r[1] === "track" || r[1] === "album" || r[1] === "playlist") &&
        r[2].match(/^\d+$/)
        ? { type: r[1], id: r[2] }
        : { type: !1 };
    case "deezer.page.link":
      if (r.length === 2 && r[1].match(/^[A-Za-z0-9]+$/)) {
        let s = await ie(i).catch((n) => n);
        return s instanceof Error
          ? { type: !1, error: s.message }
          : await Ae(s);
      } else return { type: !1 };
    default:
      return { type: "search" };
  }
}
a(Ae, "internalValidate");
async function Ne(i) {
  let e = await Ae(i.trim());
  if (e.error)
    throw new Error(`This is not a Deezer track, playlist or album URL:
${e.error}`);
  if (!e.type || e.type === "search")
    throw new Error("This is not a Deezer track, playlist or album URL");
  let t = await h(`https://api.deezer.com/${e.type}/${e.id}`).catch((s) => s);
  if (t instanceof Error) throw t;
  let r = JSON.parse(t);
  if (r.error)
    throw new Error(`Deezer API Error: ${r.error.type}: ${r.error.message}`);
  switch (e.type) {
    case "track":
      return new g(r, !1);
    case "playlist":
      return new U(r, !1);
    case "album":
      return new q(r, !1);
  }
}
a(Ne, "deezer");
async function Se(i) {
  return (await Ae(i.trim())).type;
}
a(Se, "dz_validate");
async function Rt(i, e) {
  let t = i.trim(),
    r = e.type ?? "track",
    s = e.limit ?? 10,
    n = e.fuzzy ?? !0;
  if (t.length === 0) throw new Error("A query is required to search.");
  if (s > 100) throw new Error("The maximum search limit for Deezer is 100");
  if (s < 1) throw new Error("The minimum search limit for Deezer is 1");
  if (r !== "track" && r !== "album" && r != "playlist")
    throw new Error(`"${r}" is not a valid Deezer search type`);
  t = encodeURIComponent(t);
  let o = await h(
    `https://api.deezer.com/search/${r}/?q=${t}&limit=${s}${
      n ? "" : "strict=on"
    }`
  ).catch((u) => u);
  if (o instanceof Error) throw o;
  let l = JSON.parse(o);
  if (l.error)
    throw new Error(`Deezer API Error: ${l.error.type}: ${l.error.message}`);
  let c = [];
  switch (r) {
    case "track":
      c = l.data.map((u) => new g(u, !0));
      break;
    case "playlist":
      c = l.data.map((u) => new U(u, !0));
      break;
    case "album":
      c = l.data.map((u) => new q(u, !0));
      break;
  }
  return c;
}
a(Rt, "dz_search");
async function ze(i) {
  let e = i.limit ?? 10;
  if (e > 100) throw new Error("The maximum search limit for Deezer is 100");
  if (e < 1) throw new Error("The minimum search limit for Deezer is 1");
  let t = [];
  if (
    (i.artist && t.push(`artist:"${encodeURIComponent(i.artist.trim())}"`),
    i.album && t.push(`album:"${encodeURIComponent(i.album.trim())}"`),
    i.title && t.push(`track:"${encodeURIComponent(i.title.trim())}"`),
    i.label && t.push(`label:"${encodeURIComponent(i.label.trim())}"`),
    isNaN(Number(i.minDurationInSec)) ||
      t.push(`dur_min:${i.minDurationInSec}`),
    isNaN(Number(i.maxDurationInSec)) ||
      t.push(`dur_max:${i.maxDurationInSec}`),
    isNaN(Number(i.minBPM)) || t.push(`bpm_min:${i.minBPM}`),
    isNaN(Number(i.maxBPM)) || t.push(`bpm_max:${i.maxBPM}`),
    t.length === 0)
  )
    throw new Error("At least one type of metadata is required.");
  let r = await h(
    `https://api.deezer.com/search/track/?q=${t.join(" ")}&limit=${e}`
  ).catch((o) => o);
  if (r instanceof Error) throw r;
  let s = JSON.parse(r);
  if (s.error)
    throw new Error(`Deezer API Error: ${s.error.type}: ${s.error.message}`);
  return s.data.map((o) => new g(o, !0));
}
a(ze, "dz_advanced_track_search");
async function Le(i) {
  i.spotify && (await wt(i.spotify)),
    i.soundcloud && Dt(i.soundcloud),
    i.youtube && Fe(i.youtube),
    i.useragent && Ke(i.useragent);
}
a(Le, "setToken");
var Ct = require("readline"),
  I = require("fs");
async function Ot(i, e = {}) {
  let t = i.trim();
  if (t.length === 0)
    throw new Error("Stream URL has a length of 0. Check your url again.");
  if (e.htmldata) return await ye(t, e);
  if (t.indexOf("spotify") !== -1)
    throw new Error(
      "Streaming from Spotify is not supported. Please use search() to find a similar track on YouTube or SoundCloud instead."
    );
  if (t.indexOf("deezer") !== -1)
    throw new Error(
      "Streaming from Deezer is not supported. Please use search() to find a similar track on YouTube or SoundCloud instead."
    );
  return t.indexOf("soundcloud") !== -1
    ? await St(t, e.quality)
    : await ye(t, e);
}
a(Ot, "stream");
async function $t(i, e = {}) {
  e.source || (e.source = { youtube: "video" });
  let t = encodeURIComponent(i.trim());
  if (e.source.youtube)
    return await ft(t, {
      limit: e.limit,
      type: e.source.youtube,
      language: e.language,
      unblurNSFWThumbnails: e.unblurNSFWThumbnails,
    });
  if (e.source.spotify) return await gt(t, e.source.spotify, e.limit);
  if (e.source.soundcloud) return await vt(t, e.source.soundcloud, e.limit);
  if (e.source.deezer)
    return await Rt(t, {
      limit: e.limit,
      type: e.source.deezer,
      fuzzy: e.fuzzy,
    });
  throw new Error(
    "Not possible to reach Here LOL. Easter Egg of play-dl if someone get this."
  );
}
a($t, "search");
async function Pt(i, e = {}) {
  return i instanceof T ? await Et(i, e.quality) : await be(i, e);
}
a(Pt, "stream_from_info");
async function At(i) {
  let e,
    t = i.trim();
  return t.startsWith("https")
    ? t.indexOf("spotify") !== -1
      ? ((e = ge(t)), e !== !1 ? "sp_" + e : !1)
      : t.indexOf("soundcloud") !== -1
      ? ((e = await ve(t)), e !== !1 ? "so_" + e : !1)
      : t.indexOf("deezer") !== -1
      ? ((e = await Se(t)), e !== !1 ? "dz_" + e : !1)
      : ((e = Y(t)), e !== !1 ? "yt_" + e : !1)
    : "search";
}
a(At, "validate");
function Nt() {
  let i = (0, Ct.createInterface)({
    input: process.stdin,
    output: process.stdout,
  });
  i.question("Do you want to save data in a file ? (Yes / No): ", (e) => {
    let t;
    if (e.toLowerCase() === "yes") t = !0;
    else if (e.toLowerCase() === "no") t = !1;
    else {
      console.log("That option doesn't exist. Try again..."), i.close();
      return;
    }
    i.question(
      "Choose your service - sc (for SoundCloud) / sp (for Spotify)  / yo (for YouTube): ",
      (r) => {
        if (r.toLowerCase().startsWith("sp")) {
          let s, n, o, l;
          i.question("Start by entering your Client ID : ", (c) => {
            (s = c),
              i.question("Now enter your Client Secret : ", (u) => {
                (n = u),
                  i.question("Enter your Redirect URL now : ", (m) => {
                    (o = m),
                      console.log(`
If you would like to know your region code visit : 
https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements 
`),
                      i.question(
                        "Enter your region code (2-letter country code) : ",
                        (y) => {
                          y.length === 2
                            ? (l = y)
                            : (console.log(
                                "That doesn't look like a valid region code, IN will be selected as default."
                              ),
                              (l = "IN")),
                            console.log(`
Now open your browser and paste the below url, then authorize it and copy the redirected url. 
`),
                            console.log(`https://accounts.spotify.com/authorize?client_id=${s}&response_type=code&redirect_uri=${encodeURI(
                              o
                            )} 
`),
                            i.question(
                              "Paste the url which you just copied : ",
                              async (f) => {
                                (0, I.existsSync)(".data") ||
                                  (0, I.mkdirSync)(".data");
                                let b = {
                                  client_id: s,
                                  client_secret: n,
                                  redirect_url: o,
                                  authorization_code: f.split("code=")[1],
                                  market: l,
                                };
                                if ((await bt(b, t)) === !1)
                                  throw new Error(
                                    "Failed to get access token."
                                  );
                                i.close();
                              }
                            );
                        }
                      );
                  });
              });
          });
        } else if (r.toLowerCase().startsWith("sc")) {
          if (!t) {
            console.log(
              "You already had a client ID, just paste that in setToken function."
            ),
              i.close();
            return;
          }
          i.question("Client ID : ", async (s) => {
            let n = s;
            if (!n) {
              console.log("You didn't provide a client ID. Try again..."),
                i.close();
              return;
            }
            (0, I.existsSync)(".data") || (0, I.mkdirSync)(".data"),
              console.log("Validating your client ID, hold on..."),
              (await Tt(n))
                ? (console.log("Client ID has been validated successfully."),
                  (0, I.writeFileSync)(
                    ".data/soundcloud.data",
                    JSON.stringify({ client_id: n }, void 0, 4)
                  ))
                : console.log(
                    "That doesn't look like a valid client ID. Retry with a correct client ID."
                  ),
              i.close();
          });
        } else if (r.toLowerCase().startsWith("yo")) {
          if (!t) {
            console.log(
              "You already had cookie, just paste that in setToken function."
            ),
              i.close();
            return;
          }
          i.question("Cookies : ", (s) => {
            if (!s || s.length === 0) {
              console.log("You didn't provide a cookie. Try again..."),
                i.close();
              return;
            }
            (0, I.existsSync)(".data") || (0, I.mkdirSync)(".data"),
              console.log("Cookies has been added successfully.");
            let n = {};
            s.split(";").forEach((o) => {
              let l = o.split("=");
              if (l.length <= 1) return;
              let c = l.shift()?.trim(),
                u = l.join("=").trim();
              Object.assign(n, { [c]: u });
            }),
              (0, I.writeFileSync)(
                ".data/youtube.data",
                JSON.stringify({ cookie: n }, void 0, 4)
              ),
              i.close();
          });
        } else
          console.log("That option doesn't exist. Try again..."), i.close();
      }
    );
  });
}
a(Nt, "authorization");
function zt(i, e) {
  let t = i.listeners("idle");
  for (let o of t)
    o.__playDlAttachedListener && (o(), i.removeListener("idle", o));
  let r = a(() => e.pause(), "pauseListener"),
    s = a(() => e.resume(), "resumeListener"),
    n = a(() => {
      i.removeListener("paused", r),
        i.removeListener("autopaused", r),
        i.removeListener("playing", s);
    }, "idleListener");
  (r.__playDlAttachedListener = !0),
    (s.__playDlAttachedListener = !0),
    (n.__playDlAttachedListener = !0),
    i.on("paused", r),
    i.on("autopaused", r),
    i.on("playing", s),
    i.once("idle", n);
}
a(zt, "attachListeners");
var Si = {
  DeezerAlbum: q,
  DeezerPlaylist: U,
  DeezerTrack: g,
  SoundCloudPlaylist: P,
  SoundCloudStream: L,
  SoundCloudTrack: T,
  SpotifyAlbum: z,
  SpotifyPlaylist: N,
  SpotifyTrack: E,
  YouTubeChannel: v,
  YouTubePlayList: D,
  YouTubeVideo: S,
  attachListeners: zt,
  authorization: Nt,
  decipher_info: j,
  deezer: Ne,
  dz_advanced_track_search: ze,
  dz_validate: Se,
  extractID: ue,
  getFreeClientID: $e,
  is_expired: Oe,
  playlist_info: he,
  refreshToken: we,
  search: $t,
  setToken: Le,
  so_validate: ve,
  soundcloud: ke,
  spotify: Ce,
  sp_validate: ge,
  stream: Ot,
  stream_from_info: Pt,
  validate: At,
  video_basic_info: H,
  video_info: ce,
  yt_validate: Y,
};
0 &&
  (module.exports = {
    DeezerAlbum,
    DeezerPlaylist,
    DeezerTrack,
    SoundCloudPlaylist,
    SoundCloudStream,
    SoundCloudTrack,
    SpotifyAlbum,
    SpotifyPlaylist,
    SpotifyTrack,
    YouTubeChannel,
    YouTubePlayList,
    YouTubeVideo,
    attachListeners,
    authorization,
    decipher_info,
    deezer,
    dz_advanced_track_search,
    dz_validate,
    extractID,
    getFreeClientID,
    is_expired,
    playlist_info,
    refreshToken,
    search,
    setToken,
    so_validate,
    soundcloud,
    sp_validate,
    spotify,
    stream,
    stream_from_info,
    validate,
    video_basic_info,
    video_info,
    yt_validate,
  });
//# sourceMappingURL=index.js.map
