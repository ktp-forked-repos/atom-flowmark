'use babel';

import { CompositeDisposable } from 'atom';
import { all, reformatPlain, reformatWrap, smartQuotes, heavyCleanup } from './flowmark';

export default {
  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command
    this.subscriptions.add(
      atom.commands.add('atom-workspace', {
        'flowmark:all': () => this.processText(all),
        'flowmark:reformatPlain': () => this.processText(reformatPlain),
        'flowmark:reformatWrap': () => this.processText(reformatWrap),
        'flowmark:smartQuotes': () => this.processText(smartQuotes),
        'flowmark:heavyCleanup': () => this.processText(heavyCleanup)
      })
    );
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  processText(func) {
    const editor = atom.workspace.getActiveTextEditor();

    const point = editor.getCursorBufferPosition();
    if (editor.getSelectedText().length === 0) {
      editor.selectAll();
    }
    const text = editor.getSelectedText();

    func(text, (err, result) => {
      if (err) {
        atom.notifications.addError('Unexpected error processing Markdown');
        throw err;
      } else {
        atom.notifications.addInfo('Reformatted Markdown (' + func.name + ')');
        // TODO: Show some simple diff statistics.
        editor.insertText(String(result));
        editor.setCursorBufferPosition(point);
      }
    });
  }
};
