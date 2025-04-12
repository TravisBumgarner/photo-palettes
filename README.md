Photo Palettes

Social platform for generating color palettes from photos.

# Debug

- `heroku logs --tail --app photo-palettes-backend`
# Add Environment Variable

## Local

Add to `docker-compose.yml`: 

```
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Heroku

- Set environment variable: `heroku config:set ENVIRONMENT=production --app photo-palettes-backend`
- Get environment variable: `heroku config:get ENVIRONMENT --app photo-palettes-backend`