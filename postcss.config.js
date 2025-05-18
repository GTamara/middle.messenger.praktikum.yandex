import postcssPresetEnv from 'postcss-preset-env';
import autoprefixer from 'autoprefixer';
import postcssImport from 'postcss-import';
import postcssScss from 'postcss-scss';
import nested from 'postcss-nested';
// import cssnanoPlugin from 'cssnano';

export default {
	parser: 'postcss-scss',
	plugins: [
		// postcssPresetEnv(),
		nested(),
		autoprefixer(),
		postcssImport(),
		// cssnanoPlugin(),
	],
};