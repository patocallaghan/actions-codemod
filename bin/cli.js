#!/usr/bin/env node
'use strict';

const ActionsMap = require('../util/actions-map');
const { runTransform } = require('codemod-cli');
const chalk = require('chalk');

async function run() {
  const transform = process.argv[2];
  try {
    if (transform === 'full-transform') {
      let args = process.argv.slice(3);
      let noModifyArgs = [].concat(args, '--should-modify=false');
      console.log(chalk.yellow('==== Gathering template {{action}} data ===='));
      await runTransform(__dirname, 'action-modifiers' /* transform name */, noModifyArgs, 'hbs');
      console.log(chalk.yellow('==== Gathering js {{action}} data ===='));
      await runTransform(__dirname, 'action-hash' /* transform name */, noModifyArgs, 'js');

      let jsCache = ActionsMap.getCache('js');
      let hbsCache = ActionsMap.getCache('hbs');

      console.log(chalk.yellow('==== JS actions ===='));
      console.log(jsCache);
      console.log(chalk.yellow('==== HBS actions ===='));
      console.log(hbsCache);

      Object.keys(jsCache).forEach((key) => {
        let jsActions = jsCache[key];
        let hbsActions = hbsCache[key];
        if (hbsActions) {
          let actionsToMigrate = jsActions.filter((action) => hbsActions.includes(action));
          let actionsCache = ActionsMap.getCache('actions');
          actionsCache[key] = actionsToMigrate;
          ActionsMap.map.set('actions', JSON.stringify(actionsCache));
        }
      });

      console.log(chalk.yellow('==== Actions ===='));
      console.log(ActionsMap.getCache('actions'));

      let modifyArgs = [].concat(args, '--should-modify=true');
      console.log(chalk.yellow('==== Removing {{action}} from templates ===='));
      await runTransform(__dirname, 'action-modifiers' /* transform name */, modifyArgs, 'hbs');
      console.log(chalk.yellow('==== Removing {{action}} from js ===='));
      await runTransform(__dirname, 'action-hash' /* transform name */, modifyArgs, 'js');
      console.log(chalk.yellow('==== Detecting imports of refactored classes ===='));
      await runTransform(__dirname, 'import-usage' /* transform name */, ['app', 'lib'], 'js');
      console.log(chalk.yellow('==== Remove unnecessary no-action lint rules ===='));
      await runTransform(
        __dirname,
        'remove-deprecated-comments' /* transform name */,
        ['app', 'lib'],
        'hbs',
      );
    } else {
      await runTransform(
        __dirname,
        transform /* transform name */,
        process.argv.slice(3) /* paths or globs */,
      );
    }
    ActionsMap.clear();
  } catch (e) {
    console.log(e);
  } finally {
    ActionsMap.clear();
  }
}
run();
