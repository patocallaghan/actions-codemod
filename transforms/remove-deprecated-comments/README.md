# remove-deprecated-comments


## Usage

```
npx actions-codemod remove-deprecated-comments path/of/files/ or/some**/*glob.hbs

# or

yarn global add actions-codemod
actions-codemod remove-deprecated-comments path/of/files/ or/some**/*glob.hbs
```

## Local Usage
```
node ./bin/cli.js remove-deprecated-comments path/of/files/ or/some**/*glob.hbs
```

## Input / Output

<!--FIXTURES_TOC_START-->
* [remove-all-comments](#remove-all-comments)
* [remove-single-comment](#remove-single-comment)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="remove-all-comments">**remove-all-comments**</a>

**Input** (<small>[remove-all-comments.input.hbs](transforms/remove-deprecated-comments/__testfixtures__/remove-all-comments.input.hbs)</small>):
```hbs
{{!-- === ⚠️ THIS FILE CURRENTLY USES DEPRECATED PATTERNS ⚠️ === --}}
{{!-- === 🔗 For more information visit https://go.inter.com/ember-best-practices 🔗 --}}
{{!-- === 🚀 Please consider refactoring & removing some of the comments below when working on this file 🚀 --}}
{{!-- template-lint-disable no-action --}}
<div></div>

```

**Output** (<small>[remove-all-comments.output.hbs](transforms/remove-deprecated-comments/__testfixtures__/remove-all-comments.output.hbs)</small>):
```hbs
<div></div>

```
---
<a id="remove-single-comment">**remove-single-comment**</a>

**Input** (<small>[remove-single-comment.input.hbs](transforms/remove-deprecated-comments/__testfixtures__/remove-single-comment.input.hbs)</small>):
```hbs
{{!-- === ⚠️ THIS FILE CURRENTLY USES DEPRECATED PATTERNS ⚠️ === --}}
{{!-- === 🔗 For more information visit https://go.inter.com/ember-best-practices 🔗 --}}
{{!-- === 🚀 Please consider refactoring & removing some of the comments below when working on this file 🚀 --}}
{{!-- template-lint-disable no-action --}}
{{!-- template-lint-disable no-mut --}}
<div></div>

```

**Output** (<small>[remove-single-comment.output.hbs](transforms/remove-deprecated-comments/__testfixtures__/remove-single-comment.output.hbs)</small>):
```hbs
{{!-- === ⚠️ THIS FILE CURRENTLY USES DEPRECATED PATTERNS ⚠️ === --}}
{{!-- === 🔗 For more information visit https://go.inter.com/ember-best-practices 🔗 --}}
{{!-- === 🚀 Please consider refactoring & removing some of the comments below when working on this file 🚀 --}}
{{!-- template-lint-disable no-mut --}}
<div></div>

```
<!--FIXTURES_CONTENT_END-->