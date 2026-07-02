# Protooly — API Contracts

## Backend scope
Lightweight backend providing:
1. Tool metadata API (list, search, category)
2. Anonymous usage analytics (popular tools)
3. Per-session favorites (localStorage session id, no auth)
4. Server-side network tools that can't run in browser (HTTP Status, Headers, Page Size, Domain→IP, Server Status, Redirect Checker)
5. Contact form

All endpoints under `/api` prefix.

## Endpoints

### Metadata
- `GET /api/tools` → `[{id,name,slug,category,icon,description,functional}]`
- `GET /api/tools/:slug` → tool detail
- `GET /api/categories` → `[{id,name,icon,desc}]`

### Analytics
- `POST /api/track` `{slug, sessionId}` → increments tool usage counter
- `GET /api/popular?limit=12` → `[{slug,name,count}]` (top-used tools)

### Favorites
- `GET /api/favorites/:sessionId` → `[slug]`
- `POST /api/favorites/:sessionId` `{slug}` → toggle
- `DELETE /api/favorites/:sessionId/:slug`

### Server-side tools
- `POST /api/net/http-status` `{url}` → `{url, status, statusText, finalUrl, redirects}`
- `POST /api/net/headers` `{url}` → `{headers: {...}}`
- `POST /api/net/page-size` `{url}` → `{bytes, kb, mb, contentType}`
- `POST /api/net/domain-to-ip` `{domain}` → `{domain, ips: []}`
- `POST /api/net/server-status` `{url}` → `{up, status, latencyMs}`
- `POST /api/net/redirect-chain` `{url}` → `{chain: [{url,status},...]}`

### Contact
- `POST /api/contact` `{name,email,message}` → `{id, ok:true}`

## Frontend integration
- ToolPage will `track` slug on mount.
- Add `useFavorites` hook (session id stored in localStorage as `protooly_sid`).
- Replace mock for HTTP Status, Page Size, Get HTTP Headers, Domain to IP, Server Status Checker, Redirect Checker with real backend calls.

## DB collections (MongoDB)
- `tool_usage` `{slug, count, updatedAt}`
- `favorites` `{sessionId, slug, createdAt}`
- `contacts` `{id,name,email,message,createdAt}`

## Mock note
Tools using third-party paid APIs (DA/PA, Moz, backlinks, AI features, Whois) remain mocked client-side. PDF/Image/Video conversions remain showcase mocks (require heavy infra).
