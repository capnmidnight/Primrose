'use strict';

var rollupPluginutils = require('rollup-pluginutils');

function json ( options ) {
	if ( options === void 0 ) options = {};

	var filter = rollupPluginutils.createFilter( options.include, options.exclude );

	return {
		name: 'json',

		transform: function transform ( json, id ) {
			if ( id.slice( -5 ) !== '.json' ) { return null; }
			if ( !filter( id ) ) { return null; }

			var code = '';

			// Manipulating properties so keeping as `let`
			// eslint-disable-next-line prefer-const
			var ast = {
				type: 'Program',
				sourceType: 'module',
				start: 0,
				end: null,
				body: []
			};

			if ( json[0] !== '{' ) {
				code = "export default " + json + ";";

				ast.body.push({
					type: 'ExportDefaultDeclaration',
					start: 0,
					end: code.length,
					declaration: {
						type: 'Literal',
						start: 15,
						end: code.length - 1,
						value: null,
						raw: 'null'
					}
				});
			} else {
				var data = JSON.parse( json );

				var validKeys = [];
				var invalidKeys = [];

				Object.keys( data ).forEach( function (key) {
					if ( key === rollupPluginutils.makeLegalIdentifier( key ) ) {
						validKeys.push( key );
					} else {
						invalidKeys.push( key );
					}
				});

				var char = 0;

				validKeys.forEach( function (key) {
					var declarationType = options.preferConst ? 'const' : 'var';
					var declaration = "export " + declarationType + " " + key + " = " + (JSON.stringify( data[ key ] )) + ";";

					var start = char;
					var end = start + declaration.length;

					// generate fake AST node while we're here
					ast.body.push({
						type: 'ExportNamedDeclaration',
						start: char,
						end: char + declaration.length,
						declaration: {
							type: 'VariableDeclaration',
							start: start + 7, // 'export '.length
							end: end,
							declarations: [
								{
									type: 'VariableDeclarator',
									start: start + 7 + declarationType.length + 1, // `export ${declarationType} `.length
									end: end - 1,
									id: {
										type: 'Identifier',
										start: start + 7 + declarationType.length + 1, // `export ${declarationType} `.length
										end: start + 7 + declarationType.length + 1 + key.length, // `export ${declarationType} ${key}`.length
										name: key
									},
									init: {
										type: 'Literal',
										start: start + 7 + declarationType.length + 1 + key.length + 3, // `export ${declarationType} ${key} = `.length
										end: end - 1,
										value: null,
										raw: 'null'
									}
								}
							],
							kind: declarationType
						},
						specifiers: [],
						source: null
					});

					char = end + 1;
					code += declaration + "\n";
				});

				var defaultExportNode = {
					type: 'ExportDefaultDeclaration',
					start: char,
					end: null,
					declaration: {
						type: 'ObjectExpression',
						start: char + 15,
						end: null,
						properties: []
					}
				};

				char += 18; // 'export default {\n\t'.length'

				var defaultExportRows = validKeys.map( function (key) {
					var row = key + ": " + key;

					var start = char;
					var end = start + row.length;

					defaultExportNode.declaration.properties.push({
						type: 'Property',
						start: start,
						end: end,
						method: false,
						shorthand: false,
						computed: false,
						key: {
							type: 'Identifier',
							start: start,
							end: start + key.length,
							name: key
						},
						value: {
							type: 'Identifier',
							start: start + key.length + 2,
							end: end,
							name: key
						},
						kind: 'init'
					});

					char += row.length + 3; // ',\n\t'.length

					return row;
				}).concat( invalidKeys.map( function (key) { return ("\"" + key + "\": " + (JSON.stringify( data[ key ] ))); } ) );

				code += "export default {\n\t" + (defaultExportRows.join( ',\n\t' )) + "\n};";
				ast.body.push( defaultExportNode );

				var end = code.length;

				defaultExportNode.declaration.end = end - 1;
				defaultExportNode.end = end;
			}

			ast.end = code.length;

			return { ast: ast, code: code, map: { mappings: '' } };
		}
	};
}

module.exports = json;
//# sourceMappingURL=rollup-plugin-json.cjs.js.map
