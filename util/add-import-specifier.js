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
        let importDeclaration = j.importDeclaration(
          [j.importSpecifier(j.identifier(importSpecifier))],
          j.literal(source),
        );
        let importIndex = path.value.body.findIndex((node) => node.type === 'ImportDeclaration');
        if (importIndex > -1) {
          path.value.body.splice(importIndex + 1, 0, importDeclaration);
        } else {
          path.value.body.unshift(importDeclaration);
        }
      })
      .toSource(FORMATTING);
  }

  return code;
}

module.exports = addImportSpecifier;
