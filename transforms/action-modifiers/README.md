# action-modifiers


## Usage

```
npx actions-codemod action-modifiers path/of/files/ or/some**/*glob.hbs

# or

yarn global add actions-codemod
actions-codemod action-modifiers path/of/files/ or/some**/*glob.hbs
```

## Local Usage
```
node ./bin/cli.js action-modifiers path/of/files/ or/some**/*glob.hbs
```

## Input / Output

<!--FIXTURES_TOC_START-->
* [basic](#basic)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="basic">**basic**</a>

**Input** (<small>[basic.input.hbs](transforms/action-modifiers/__testfixtures__/basic.input.hbs)</small>):
```hbs
<Admin::NewSelector
  @assignees={{app.assignableAdminsWithoutUnassigned}}
  @onSelectItem={{action "changeOwner"}}
  @teammatesHeading="Select account owner"
  data-test-owner-selector={{true}}
/>

<Admin::NewSelector
  @assignees={{app.assignableAdminsWithoutUnassigned}}
  onClick={{this.onClick}}
  @teammatesHeading="Select account owner"
  data-test-owner-selector={{true}}
/>

<Admin::NewSelector
  @assignees={{app.assignableAdminsWithoutUnassigned}}
  onClick={{fn this.onClick "test"}}
  @teammatesHeading="Select account owner"
  data-test-owner-selector={{true}}
/>

{{!-- With params --}}
<Admin::NewSelector
  @assignees={{app.assignableAdminsWithoutUnassigned}}
  @onSelectItem={{action "changeOwner" test}}
  @teammatesHeading="Select account owner"
  data-test-owner-selector={{true}}
/>

{{!-- mut helper --}}
<Admin::NewSelector
  @assignees={{app.assignableAdminsWithoutUnassigned}}
  @onClick={{action (mut settings.teammateCalendarUrl)}}
  @teammatesHeading="Select account owner"
  data-test-owner-selector={{true}}
/>

{{!-- passed function --}}
<Admin::NewSelector
  @assignees={{app.assignableAdminsWithoutUnassigned}}
  @onClick={{action update}}
  @teammatesHeading="Select account owner"
  data-test-owner-selector={{true}}
/>

{{!-- Dom handlers --}}
<input
  value={{settings.teammateCalendarUrl}}
  maxlength="30"
  data-test-better-url-input
  placeholder={{adminUrlPlaceholder}}
  onblur={{action "endEditingUrl"}}
  oninput={{action (mut settings.teammateCalendarUrl) value="target.value"                    }}
  onkeypress={{action "blurOnEnter"}}
/>
```

**Output** (<small>[basic.output.hbs](transforms/action-modifiers/__testfixtures__/basic.output.hbs)</small>):
```hbs
<Admin::NewSelector
  @assignees={{app.assignableAdminsWithoutUnassigned}}
  @onSelectItem={{this.changeOwner}}
  @teammatesHeading="Select account owner"
  data-test-owner-selector={{true}}
/>

<Admin::NewSelector
  @assignees={{app.assignableAdminsWithoutUnassigned}}
  onClick={{this.onClick}}
  @teammatesHeading="Select account owner"
  data-test-owner-selector={{true}}
/>

<Admin::NewSelector
  @assignees={{app.assignableAdminsWithoutUnassigned}}
  onClick={{fn this.onClick "test"}}
  @teammatesHeading="Select account owner"
  data-test-owner-selector={{true}}
/>

{{!-- With params --}}
<Admin::NewSelector
  @assignees={{app.assignableAdminsWithoutUnassigned}}
  @onSelectItem={{fn this.changeOwner test}}
  @teammatesHeading="Select account owner"
  data-test-owner-selector={{true}}
/>

{{!-- mut helper --}}
<Admin::NewSelector
  @assignees={{app.assignableAdminsWithoutUnassigned}}
  @onClick={{action (mut settings.teammateCalendarUrl)}}
  @teammatesHeading="Select account owner"
  data-test-owner-selector={{true}}
/>

{{!-- passed function --}}
<Admin::NewSelector
  @assignees={{app.assignableAdminsWithoutUnassigned}}
  @onClick={{action update}}
  @teammatesHeading="Select account owner"
  data-test-owner-selector={{true}}
/>

{{!-- Dom handlers --}}
<input
  value={{settings.teammateCalendarUrl}}
  maxlength="30"
  data-test-better-url-input
  placeholder={{adminUrlPlaceholder}}
  onblur={{action "endEditingUrl"}}
  oninput={{action (mut settings.teammateCalendarUrl) value="target.value"                    }}
  onkeypress={{action "blurOnEnter"}}
/>
```
<!--FIXTURES_CONTENT_END-->