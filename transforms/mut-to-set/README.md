# mut-to-set


## Usage

```
npx actions-codemod mut-to-set path/of/files/ or/some**/*glob.hbs

# or

yarn global add actions-codemod
actions-codemod mut-to-set path/of/files/ or/some**/*glob.hbs
```

## Local Usage
```
node ./bin/cli.js mut-to-set path/of/files/ or/some**/*glob.hbs
```

## Input / Output

<!--FIXTURES_TOC_START-->
* [basic](#basic)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="basic">**basic**</a>

**Input** (<small>[basic.input.hbs](transforms/mut-to-set/__testfixtures__/basic.input.hbs)</small>):
```hbs
<Something
  @onSelect={{action (mut this.something)}}
/>	

<Something
  @onSelect={{action (mut this.something) true}}
/>	

<Something
  @onSelect={{action (pick this.something) true}}
/>

<Something
  @onSelect={{action (mut this.something) value="target.value" }}
/>	

{{component
  onclick=(action (mut test) true)
  onenter=(action (mut test))
  oninput=(action (mut test) value="target.value")
}}
```

**Output** (<small>[basic.output.hbs](transforms/mut-to-set/__testfixtures__/basic.output.hbs)</small>):
```hbs
<Something
  @onSelect={{set this.something}}
/>	

<Something
  @onSelect={{set this.something true}}
/>	

<Something
  @onSelect={{action (pick this.something) true}}
/>

<Something
  @onSelect={{action (mut this.something) value="target.value" }}
/>	

{{component
  onclick=(set test true)
  onenter=(set test)
  oninput=(action (mut test) value="target.value")
}}
```
<!--FIXTURES_CONTENT_END-->