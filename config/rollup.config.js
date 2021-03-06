import node from 'rollup-plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';

export const globals = {
  // Apollo
  'apollo-client': 'apollo.core',
  'apollo-cache': 'apolloCache.core',
  'apollo-link': 'apolloLink.core',
  'apollo-link-dedup': 'apolloLink.dedup',
  'apollo-utilities': 'apollo.utilities',
  'graphql-anywhere': 'graphqlAnywhere',
  'graphql-anywhere/lib/async': 'graphqlAnywhere.async',
  'apollo-boost': 'apollo.boost',
};

export default (name, override = {}) => {
  const config = Object.assign(
    {
      input: 'lib/index.js',
      //output: merged separately
      onwarn,
      external: Object.keys(globals),
    },
    override,
  );

  config.output = Object.assign(
    {
      file: 'lib/bundle.umd.js',
      format: 'umd',
      name,
      exports: 'named',
      sourcemap: true,
      globals,
    },
    config.output,
  );

  config.plugins = config.plugins || [];
  config.plugins.push(
    sourcemaps(),
    node({
      // Inline anything imported from the tslib package, e.g. __extends
      // and __assign. This depends on the "importHelpers":true option in
      // tsconfig.base.json.
      module: true,
      only: ['tslib'],
    }),
  );
  return config;
};

function onwarn(message) {
  const suppressed = ['UNRESOLVED_IMPORT', 'THIS_IS_UNDEFINED'];

  if (!suppressed.find(code => message.code === code)) {
    return console.warn(message.message);
  }
}
