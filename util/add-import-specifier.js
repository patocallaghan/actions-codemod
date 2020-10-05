const FORMATTING = require('./formatting');

function addImportSpecifier(j, code, importSpecifier, source) {
  let needsImportDeclarationAdded = true;
  code = j(code)
    .find(j.ImportDeclaration, {
      source: {
        value: source,
      },
    })
    .forEach((path) => {
      let hasComputedSpecifier = path.value.specifiers.find(
        (specifier) => specifier.imported && specifier.imported.name === importSpecifier,
      );
      if (!hasComputedSpecifier) {
        path.value.specifiers.push(j.importSpecifier(j.identifier(importSpecifier)));
      }
      needsImportDeclarationAdded = false;
    })
    .toSource(FORMATTING);

  if (needsImportDeclarationAdded) {
    code = j(code)
      .find(j.Program)
      .forEach((path) => {
        path.value.body.unshift(
          j.importDeclaration(
            [j.importSpecifier(j.identifier(importSpecifier))],
            j.literal(source),
          ),
        );
      })
      .toSource(FORMATTING);
  }

  return code;
}

module.exports = addImportSpecifier;
