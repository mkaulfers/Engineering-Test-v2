const fs = require('fs');

// For this take home assignment, we are asking you to complete the implementation of a text searching class found in `TextSearcher.js` by implementing the `#_init` and `#search` functions. At a high level, the `TextSearcher` 
// class provides an interface for a consumer to search a file an arbitary number of times. The class is instantiated with a file path and the resulting instance provides a search interface where the consumer can search
// for a specific query, and is returned an array of strings for each occurence of the search. The `search` function also takes a secondary `contextWords` argument which asks for a certain number of contextual words 
// on either side of each found instance of the query word. See `TextSearcher.js` for more information

class TextSearcher {
  fileContents = '';

  /**
   * Initializes the text searcher with the contents of a text file.
   * The current implementation just reads the contents into a string
   * and passes them to #init().  You may modify this implementation if you need to.
   *
   * @param file Input file
   * @throws exception
   */
  constructor(file) {
    try {
      const data = fs.readFileSync(file, 'utf-8');
      this._init(data);
    } catch (err) {
      console.error('ENCOUNTERED ERROR STARTING SEARCHER: ', err);
    }
  }

  /**
   *  Initializes any internal data structures that are needed for
   *  this class to implement search efficiently.
   */
  _init(fileContents) {
    this.fileContents = fileContents;
  }

  /**
   *
   * @param queryWord    [String] The word to search for in the file contents.
   * @param contextWords [Number] The number of words of context to provide on
   *                              each side of the query word.
   *
   * @return One context string for each time the query word appears in the file.
   */
  search(queryWord, contextWords) {
    let matches = [];

    for (let i = 0; i < this.fileContents.length; i++) {

      let char = this.fileContents[i];
      if (char === queryWord[0]) {
        let match = this.fileContents.slice(i, i + queryWord.length);
        if (match === queryWord) {

          if (contextWords === 0) {
            matches.push(match);
          } else {
            let startIndexOffset = this.getLeadingContextWordOffset(i, contextWords);
            let endIndexOffset = this.getTrailingContextWordOffset(i + queryWord.length, contextWords);
            let context = this.fileContents.slice(startIndexOffset, endIndexOffset);

            context = context.trim()

            if (context[context.length - 1].match(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g)) {
              context = context.slice(0, context.length - 1);
            }

            matches.push(context);
          }

        }
      }

    }

    return matches;
  }

  getLeadingContextWordOffset(startOffset, wordCountTarget) {
    let wordCount = -1;
    let i = startOffset - 1;

    while (i >= 0) {
      if ((this.fileContents[i] === ' ' ||
        this.fileContents.substr(i, 2) === '\r\n') &&
        (i === 0 || this.fileContents[i - 1] !== ' ' &&
          this.fileContents.substr(i - 1, 2) !== '\r\n')) {
        wordCount++;
        if (wordCount === wordCountTarget) break;
      }
      i--;
    }

    return i + 1;
  }

  getTrailingContextWordOffset(endOffset, wordCountTarget) {
    let wordCount = -1;
    let i = endOffset;

    while (i < this.fileContents.length) {
      if ((this.fileContents[i] === ' ' ||
        this.fileContents.substr(i, 2) === '\r\n') &&
        (i + 1 >= this.fileContents.length ||
          this.fileContents[i + 1] !== ' ' &&
          this.fileContents.substr(i + 1, 2) !== '\r\n')) {
        wordCount++;
        if (wordCount === wordCountTarget) break;
      }
      i++;
    }

    return i;
  }


}

// Any needed utility classes/functions can just go in this file

module.exports = TextSearcher;
