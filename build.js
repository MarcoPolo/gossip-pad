require('esbuild').build({
  entryPoints: ['src/index.tsx'],
  bundle: true,
  outdir: 'www/js',
}).catch((e) => {
  console.error(e)
  process.exit(1)
})