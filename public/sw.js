/* Taganga One · Service worker
   - Guarda la app para que abra sin conexión.
   - Guarda las teselas del mapa que el visitante ya vio (máx. ~600).
   - Guarda la última copia de los catálogos públicos de la API (zonas, decálogo,
     preguntas frecuentes). Los registros (POST) nunca se guardan aquí.
   - Sirve las narraciones de las historias que el visitante ya escuchó. */
const VERSION = "taganga-one-v3";
const APP = VERSION + "-app";
const TILES = VERSION + "-tiles";
const API = VERSION + "-api";
const MAX_TILES = 600;
// Narraciones: la página las guarda al escucharlas (StoryPlayer.jsx). Tiene nombre
// propio para que cambiar VERSION no borre audios que el visitante ya descargó.
const AUDIO = "taganga-one-audio";

const APP_FILES = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png"
];

self.addEventListener("install", e => {
  e.waitUntil((async () => {
    const c = await caches.open(APP);
    await c.addAll(APP_FILES);
    self.skipWaiting();
  })());
});

self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => !k.startsWith(VERSION) && k !== AUDIO).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

const esTesela = url =>
  url.hostname === "server.arcgisonline.com" || url.hostname.endsWith("tile.openstreetmap.fr");

async function recortar(cache) {
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - MAX_TILES; i++) await cache.delete(keys[i]);
}

// El reproductor pide el audio por partes (Range → 206). Si la narración está
// guardada completa, se recorta aquí la parte pedida; si no, va a la red sin guardar
// nada (una respuesta parcial no se puede poner en caché).
async function narracion(req) {
  const guardada = await (await caches.open(AUDIO)).match(req.url);
  if (!guardada) return fetch(req);
  const rango = req.headers.get("range");
  if (!rango) return guardada;
  const datos = await guardada.arrayBuffer();
  const m = /bytes=(\d*)-(\d*)/.exec(rango);
  const inicio = m && m[1] ? Number(m[1]) : 0;
  const fin = Math.min(m && m[2] ? Number(m[2]) : datos.byteLength - 1, datos.byteLength - 1);
  return new Response(datos.slice(inicio, fin + 1), {
    status: 206,
    headers: {
      "Content-Type": guardada.headers.get("Content-Type") || "audio/mpeg",
      "Content-Range": `bytes ${inicio}-${fin}/${datos.byteLength}`,
      "Content-Length": String(fin - inicio + 1),
      "Accept-Ranges": "bytes"
    }
  });
}

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  if (url.origin === self.location.origin && url.pathname.startsWith("/audio/")) {
    e.respondWith(narracion(req));
    return;
  }

  // Catálogos de la API (mismo origen o backend externo): red primero, y si no hay conexión, la última copia
  if (url.pathname.startsWith("/api/")) {
    e.respondWith((async () => {
      const cache = await caches.open(API);
      try {
        const r = await fetch(req);
        if (r.ok) cache.put(req, r.clone());
        return r;
      } catch (_) {
        return (await cache.match(req)) || Response.error();
      }
    })());
    return;
  }

  // Navegación: red primero, y si no hay conexión, la copia guardada
  if (req.mode === "navigate") {
    e.respondWith((async () => {
      try {
        const r = await fetch(req);
        (await caches.open(APP)).put("./index.html", r.clone());
        return r;
      } catch (_) {
        return (await caches.match("./index.html")) || (await caches.match("./"));
      }
    })());
    return;
  }

  // Teselas del mapa: copia guardada primero, se actualiza en segundo plano
  if (esTesela(url)) {
    e.respondWith((async () => {
      const cache = await caches.open(TILES);
      const guardada = await cache.match(req);
      const red = fetch(req).then(r => {
        if (r && (r.ok || r.type === "opaque")) { cache.put(req, r.clone()); recortar(cache); }
        return r;
      }).catch(() => guardada);
      return guardada || red;
    })());
    return;
  }

  // Archivos de la app: copia guardada primero
  if (url.origin === self.location.origin) {
    e.respondWith((async () => {
      const guardada = await caches.match(req, { ignoreSearch: true });
      if (guardada) return guardada;
      try {
        const r = await fetch(req);
        if (r && r.ok) (await caches.open(APP)).put(req, r.clone());
        return r;
      } catch (_) {
        return Response.error();
      }
    })());
  }
});
