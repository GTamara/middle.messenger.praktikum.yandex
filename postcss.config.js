import autoprefixer from 'autoprefixer';
import postcssImport from 'postcss-import';
import postcssScss from 'postcss-scss';
import nested from 'postcss-nested';
import postcssMixins from 'postcss-mixins';
// import cssnanoPlugin from 'cssnano';
import postcssCombiner from 'postcss-combine-duplicated-selectors';
import postcssMediaMinmax from 'postcss-media-minmax';

export default {
	parser: 'postcss-scss',
	plugins: [
		postcssImport(),
        postcssMediaMinmax(),
		postcssMixins(),
        nested(),
        autoprefixer(),
		postcssCombiner(),
		// cssnanoPlugin(),
	],
};
