# Making an endpoint

## Frontend

- Every endpoint should have a Zod discriminated union response keyed off of `success`.

````typescript
const zodResponse = z.discriminatedUnion('success', [
  z.object({
    success: z.literal(true),
    // data
  }),
  z.object({
    success: z.literal(false),
    error: z.string(),
  }),
])

- Every React component should have a useEffect hook that logs errors.

```typescript
useEffect(() => {
    if (error) logger.error(error)
}, [error])
````

## Backend

- Import the router from **init**.py
- Import the router back into **init**.py
- Every endpoint should have a try-except block.

```python
try:
    # endpoint logic
except Exception as error:
    log_error(error)
    return {
        "success": False,
        "error": "Failed to get moderated palettes",
    }

return {
    "success": True,
    // data
}
```

## Database
