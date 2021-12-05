import NodeModulesPolyfills from '@esbuild-plugins/node-modules-polyfill'
import EsmExternals from '@esbuild-plugins/node-globals-polyfill'
import { build, serve } from 'esbuild'

console.log(EsmExternals)

serve({
  servedir: "www"
}, {
  entryPoints: ['src/index.tsx'],
  bundle: true,
  outdir: 'www/js',
  // inject: [require.resolve('@esbuild-plugins/node-globals-polyfill/process')],
  plugins: [NodeModulesPolyfills.NodeModulesPolyfillPlugin(), EsmExternals.NodeGlobalsPolyfillPlugin()],
}).catch((e) => {
  console.error(e)
  process.exit(1)
}).then(({
  port, // : number,
  host, // : string,
  wait, // : Promise<void>,
  stop  // : () => void
}) => {
  console.log(`Listening on http://${host}:${JSON.stringify(port)}`)
})