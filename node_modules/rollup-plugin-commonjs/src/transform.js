import acorn from 'acorn';
import { walk } from 'estree-walker';
import MagicString from 'magic-string';
import { attachScopes, makeLegalIdentifier } from 'rollup-pluginutils';
import { flatten, isReference, isTruthy, isFalsy } from './ast-utils.js';
import { PREFIX, HELPERS_ID } from './helpers.js';
import { getName } from './utils.js';

const reserved = 'abstract arguments boolean break byte case catch char class const continue debugger default delete do double else enum eval export extends false final finally float for function goto if implements import in instanceof int interface let long native new null package private protected public return short static super switch synchronized this throw throws transient true try typeof var void volatile while with yield'.split( ' ' );
const blacklistedExports = { __esModule: true };
reserved.forEach( word => blacklistedExports[ word ] = true );

const exportsPattern = /^(?:module\.)?exports(?:\.([a-zA-Z_$][a-zA-Z_$0-9]*))?$/;

const firstpassGlobal = /\b(?:require|module|exports|global)\b/;
const firstpassNoGlobal = /\b(?:require|module|exports)\b/;
const importExportDeclaration = /^(?:Import|Export(?:Named|Default))Declaration/;

function deconflict ( scope, globals, identifier ) {
	let i = 1;
	let deconflicted = identifier;

	while ( scope.contains( deconflicted ) || globals.has( deconflicted ) ) deconflicted = `${identifier}_${i++}`;
	scope.declarations[ deconflicted ] = true;

	return deconflicted;
}

function tryParse ( code, id ) {
	try {
		return acorn.parse( code, {
			ecmaVersion: 6,
			sourceType: 'module'
		});
	} catch ( err ) {
		err.message += ` in ${id}`;
		throw err;
	}
}

export default function transform ( code, id, isEntry, ignoreGlobal, customNamedExports, sourceMap ) {
	const firstpass = ignoreGlobal ? firstpassNoGlobal : firstpassGlobal;
	if ( !firstpass.test( code ) ) return null;

	const ast = tryParse( code, id );

	// if there are top-level import/export declarations, this is ES not CommonJS
	for ( const node of ast.body ) {
		if ( importExportDeclaration.test( node.type ) ) return null;
	}

	const magicString = new MagicString( code );

	const required = {};
	// Because objects have no guaranteed ordering, yet we need it,
	// we need to keep track of the order in a array
	const sources = [];

	let uid = 0;

	let scope = attachScopes( ast, 'scope' );
	const uses = { module: false, exports: false, global: false, require: false };

	let lexicalDepth = 0;
	let programDepth = 0;

	const globals = new Set();

	const HELPERS_NAME = deconflict( scope, globals, 'commonjsHelpers' ); // TODO technically wrong since globals isn't populated yet, but ¯\_(ツ)_/¯

	const namedExports = {};

	// TODO handle transpiled modules
	let shouldWrap = /__esModule/.test( code );

	walk( ast, {
		enter ( node, parent ) {
			if ( sourceMap ) {
				magicString.addSourcemapLocation( node.start );
				magicString.addSourcemapLocation( node.end );
			}

			// skip dead branches
			if ( parent && ( parent.type === 'IfStatement' || parent.type === 'ConditionalExpression' ) ) {
				if ( node === parent.consequent && isFalsy( parent.test ) ) return this.skip();
				if ( node === parent.alternate && isTruthy( parent.test ) ) return this.skip();
			}

			if ( node._skip ) return this.skip();

			programDepth += 1;

			if ( node.scope ) scope = node.scope;
			if ( /^Function/.test( node.type ) ) lexicalDepth += 1;

			// Is this an assignment to exports or module.exports?
			if ( node.type === 'AssignmentExpression' ) {
				if ( node.left.type !== 'MemberExpression' ) return;

				const flattened = flatten( node.left );
				if ( !flattened ) return;

				if ( scope.contains( flattened.name ) ) return;

				const match = exportsPattern.exec( flattened.keypath );
				if ( !match || flattened.keypath === 'exports' ) return;

				uses[ flattened.name ] = true;

				// we're dealing with `module.exports = ...` or `[module.]exports.foo = ...` –
				// if this isn't top-level, we'll need to wrap the module
				if ( programDepth > 3 ) shouldWrap = true;

				node.left._skip = true;

				if ( flattened.keypath === 'module.exports' && node.right.type === 'ObjectExpression' ) {
					return node.right.properties.forEach( prop => {
						if ( prop.computed || prop.key.type !== 'Identifier' ) return;
						const name = prop.key.name;
						if ( name === makeLegalIdentifier( name ) ) namedExports[ name ] = true;
					});
				}

				if ( match[1] ) namedExports[ match[1] ] = true;
				return;
			}

			if ( node.type === 'Identifier' ) {
				if ( isReference( node, parent ) && !scope.contains( node.name ) ) {
					if ( node.name in uses ) {
						uses[ node.name ] = true;
						if ( node.name === 'global' && !ignoreGlobal ) {
							magicString.overwrite( node.start, node.end, `${HELPERS_NAME}.commonjsGlobal`, true );
						}

						if ( node.name === 'require' ) {
							magicString.overwrite( node.start, node.end, `${HELPERS_NAME}.commonjsRequire`, true );
						}

						// if module or exports are used outside the context of an assignment
						// expression, we need to wrap the module
						if ( node.name === 'module' || node.name === 'exports' ) {
							shouldWrap = true;
						}
					}

					globals.add( node.name );
				}

				return;
			}

			if ( node.type === 'ThisExpression' && lexicalDepth === 0 ) {
				uses.global = true;
				if ( !ignoreGlobal ) magicString.overwrite( node.start, node.end, `${HELPERS_NAME}.commonjsGlobal`, true );
				return;
			}

			if ( node.type !== 'CallExpression' ) return;
			if ( node.callee.name !== 'require' || scope.contains( 'require' ) ) return;
			if ( node.arguments.length !== 1 || node.arguments[0].type !== 'Literal' ) return; // TODO handle these weird cases?

			const source = node.arguments[0].value;

			const existing = required[ source ];
			if ( existing === undefined ) {
				sources.unshift(source);
			}
			let name;

			if ( !existing ) {
				name = `require$$${uid++}`;
				required[ source ] = { source, name, importsDefault: false };
			} else {
				name = required[ source ].name;
			}

			if ( parent.type !== 'ExpressionStatement' ) {
				required[ source ].importsDefault = true;
				magicString.overwrite( node.start, node.end, name );
			} else {
				// is a bare import, e.g. `require('foo');`
				magicString.remove( parent.start, parent.end );
			}

			node.callee._skip = true;
		},

		leave ( node ) {
			programDepth -= 1;
			if ( node.scope ) scope = scope.parent;
			if ( /^Function/.test( node.type ) ) lexicalDepth -= 1;
		}
	});

	if ( !sources.length && !uses.module && !uses.exports && !uses.require && ( ignoreGlobal || !uses.global ) ) {
		if ( Object.keys( namedExports ).length ) {
			throw new Error( `Custom named exports were specified for ${id} but it does not appear to be a CommonJS module` );
		}
		return null; // not a CommonJS module
	}

	const includeHelpers = shouldWrap || uses.global || uses.require;
	const importBlock = ( includeHelpers ? [ `import * as ${HELPERS_NAME} from '${HELPERS_ID}';` ] : [] ).concat(
		sources.map( source => {
			// import the actual module before the proxy, so that we know
			// what kind of proxy to build
			return `import '${source}';`;
		}),
		sources.map( source => {
			const { name, importsDefault } = required[ source ];
			return `import ${importsDefault ? `${name} from ` : ``}'${PREFIX}${source}';`;
		})
	).join( '\n' ) + '\n\n';

	const namedExportDeclarations = [];
	let wrapperStart = '';
	let wrapperEnd = '';

	const moduleName = deconflict( scope, globals, getName( id ) );
	if ( !isEntry ) {
		const exportModuleExports = `export { ${moduleName} as __moduleExports };`;
		namedExportDeclarations.push( exportModuleExports );
	}

	const name = getName( id );

	function addExport ( x ) {
		let declaration;

		if ( x === name ) {
			const deconflicted = deconflict( scope, globals, name );
			declaration = `var ${deconflicted} = ${moduleName}.${x};\nexport { ${deconflicted} as ${x} };`;
		} else {
			declaration = `export var ${x} = ${moduleName}.${x};`;
		}

		namedExportDeclarations.push( declaration );
	}

	if ( customNamedExports ) customNamedExports.forEach( addExport );

	const defaultExportPropertyAssignments = [];
	let hasDefaultExport = false;

	if ( shouldWrap ) {
		const args = `module${uses.exports ? ', exports' : ''}`;

		wrapperStart = `var ${moduleName} = ${HELPERS_NAME}.createCommonjsModule(function (${args}) {\n`;
		wrapperEnd = `\n});`;

		Object.keys( namedExports )
			.filter( key => !blacklistedExports[ key ] )
			.forEach( addExport );
	} else {
		const names = [];

		ast.body.forEach( node => {
			if ( node.type === 'ExpressionStatement' && node.expression.type === 'AssignmentExpression' ) {
				const { left, right } = node.expression;
				const flattened = flatten( left );

				if ( !flattened ) return;

				const match = exportsPattern.exec( flattened.keypath );
				if ( !match ) return;

				if ( flattened.keypath === 'module.exports' ) {
					hasDefaultExport = true;
					magicString.overwrite( left.start, left.end, `var ${moduleName}` );
				} else {
					const name = match[1];
					const deconflicted = deconflict( scope, globals, name );

					names.push({ name, deconflicted });

					magicString.overwrite( node.start, right.start, `var ${deconflicted} = ` );

					const declaration = name === deconflicted ?
						`export { ${name} };` :
						`export { ${deconflicted} as ${name} };`;

					namedExportDeclarations.push( declaration );
					defaultExportPropertyAssignments.push( `${moduleName}.${name} = ${deconflicted};` );
				}
			}
		});

		if ( !hasDefaultExport ) {
			wrapperEnd = `\n\nvar ${moduleName} = {\n${
				names.map( ({ name, deconflicted }) => `\t${name}: ${deconflicted}` ).join( ',\n' )
			}\n};`;
		}
	}

	const defaultExport = /__esModule/.test( code ) ?
		`export default ${HELPERS_NAME}.unwrapExports(${moduleName});` :
		`export default ${moduleName};`;

	const exportBlock = '\n\n' + [ defaultExport ]
		.concat( namedExportDeclarations )
		.concat( hasDefaultExport ? defaultExportPropertyAssignments : [] )
		.join( '\n' );

	magicString.trim()
		.prepend( importBlock + wrapperStart )
		.trim()
		.append( wrapperEnd + exportBlock );

	code = magicString.toString();
	const map = sourceMap ? magicString.generateMap() : null;

	return { code, map };
}
