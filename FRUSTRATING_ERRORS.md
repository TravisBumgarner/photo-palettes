**Issue:**

```
frontend-1  |  ⚠ Attempted to load @next/swc-linux-arm64-gnu, but it was not installed
frontend-1  |  ⚠ Attempted to load @next/swc-linux-arm64-musl, but an error occurred: libc.so: cannot open shared object file: No such file or directory
frontend-1  | [Error: `turbo.createProject` is not supported by the wasm bindings.]
```

**Solution:**

No idea if this was actually the solution. Made some other improvements to docker compose.

```
make nuke-docker
```

{/_ ProtonPass appears to be injecting stuff that's causing issues with this form. Suppress those warnings. _/}

<form suppressHydrationWarning>

Every time I install a new package with Docker and React I get Module not found: Can't resolve 'react-dropzone'
docker compose exec frontend sh
npm install react-dropzone

Every time I install a new package with Docker and React I get Module not found: Can't resolve 'react-dropzone'
docker compose exec frontend sh
npm install react-dropzone

HOT RELOADING BACKEND - WatchFiles doesn't see all new files in backend.

Can't find something common? Like importing from theme? Need to make it

# Why did I use `http://backend:8000`?

I remember running into some issue that forced me to have to change NEXT_PUBLIC_API_URL=http://127.0.0.1:8000 to backend:8000?

For now I can't remember. I want to be able to test things on my iPhone so I'm going to chnage the route to backend:8000 for now.
