# Collection design import

Drop the approved design package here before running `npm run optimize:collection-heroes`:

```
design-import/
  dogs/assets/hero.jpg
  reads/assets/hero.jpg
  desk/assets/hero.jpg
  shared/…
```

The script writes responsive AVIF/WebP files to `public/collections/{theme}/`.
