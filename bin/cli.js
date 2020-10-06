#!/usr/bin/env node
'use strict';

const ActionsMap = require('../util/actions-map');
const { runTransform } = require('codemod-cli');

async function run() {
  const transform = process.argv[2];
  if (transform === 'full-transform') {
    let args = process.argv.slice(3);
    let noModifyArgs = [].concat(args, '--should-modify=false');
    console.log('==== Gathering template {{action}} data ====');
    await runTransform(__dirname, 'action-modifiers' /* transform name */, noModifyArgs, 'hbs');
    console.log('==== Gathering js {{action}} data ====');
    await runTransform(__dirname, 'action-hash' /* transform name */, noModifyArgs, 'js');

    let jsCache = ActionsMap.getCache('js');
    let hbsCache = ActionsMap.getCache('hbs');

    console.log(jsCache);
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
    console.log(ActionsMap.getCache('actions'));

    let modifyArgs = [].concat(args, '--should-modify=true');
    console.log('==== Removing {{action}} from templates ====');
    await runTransform(__dirname, 'action-modifiers' /* transform name */, modifyArgs, 'hbs');
    console.log('==== Removing {{action}} from js ====');
    await runTransform(__dirname, 'action-hash' /* transform name */, modifyArgs, 'js');
  } else {
    await runTransform(
      __dirname,
      transform /* transform name */,
      process.argv.slice(3) /* paths or globs */,
    );
  }
  ActionsMap.clear();
}
run();
