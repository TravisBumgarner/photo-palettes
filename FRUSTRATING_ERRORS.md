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


{/* ProtonPass appears to be injecting stuff that's causing issues with this form. Suppress those warnings. */}
<form suppressHydrationWarning>


Every time I install a new package with Docker and React I get Module not found: Can't resolve 'react-dropzone'
docker compose exec frontend sh
npm install react-dropzone