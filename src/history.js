/* History module for Game Closure Devkit
 *
 * Authors: Jishnu Mohan <jishnu7@gmail.com>,
 *          Ramprasad rajendran <r.ramprasad@gmail.com>
 *
 * Copyright: 2014, Hashcube (http://hashcube.com)
 *
 */

/* global _, Callback, console */

/* jshint ignore:start */
import src.lib.underscore as _;
import event.Callback as Callback;
/* jshint ignore:end */

exports = (function () {
  'use strict';

  var history = {},
    // Stack where all actions are pushed
    stack = [],
    // Flag to indicate backbutton action is being executed
    busy = false,
    // Back button press count in menu screen
    count = 0,
    // Set this to true to debug back button/history
    debug = false,

    log = function (msg) {
      if (debug) {
        console.log('history:', msg,
          '| Busy:', busy,
          '| Stack:', stack.length, stack);
      }
    };

  // Function to add an action to the backbutton stack
  history.add = function (callback) {
    count = 0;
    callback = callback || false;
    stack.push(callback);
    log('add');
  };

  // Function for back button action.
  // If the global busy flag is set or the top most item
  // in the stck is false, this won't run.
  // Otherwise this will pop the stack and run the popped function
  // While the popped function is being run, the busy flag will be set.
  // A callback will be passed when the popped function is called,
  // that need's to be called manually from the running function,
  //using fire() method
  history.release = function () {
    var action, callback;

    log('release');
    if (stack.length <= 0) {
      // Stack is empty. So user is in menu screen.
      // By returning false, user will be able to go back to the system.
      return (count > 0 ? false: ++count);
    }
    // If another back button action isn't going on
    // and back button is not disabled
    else if (busy !== true && _.last(stack) !== false) {
      // We are going to execute back action
      busy = true;
      // Creating callback, using which we can be reset the busy flag
      callback = new Callback();
      // This function will reset the busy flag.
      callback.run(function () {
        busy = false;
        log('callback');
        callback.clear();
      });
      action = stack.pop();
      action(callback);
    }
  };

  // This will pop the function on top of the stack, but won't execute it.
  // Useful when back button has to be enabled after disabling it,
  // and also when multiple actions have to be removed from the stack.
  history.pop = function (count) {
    var i;
    count = count || 1;
    for (i = 0; i < count; i++) {
      stack.pop();
    }
    log('pop');
  };

  // This function isn't used
  // But useful if the stack has to be emptied
  history.empty = function () {
    // empty stack
    stack.length = 0;
    log('empty');
  };

  // Function to set the busy flag
  history.setBusy = function () {
    busy = true;
    log('setBusy');
  };

  // Function to reset the busy flag
  history.resetBusy = function () {
    busy = false;
    log('resetBusy');
  };

  return history;
}());