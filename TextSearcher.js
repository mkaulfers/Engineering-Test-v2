const fs = require('fs');

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

  /**
   * Returns the offset of the first character of the word that is
   * wordCountTarget words before the word that starts at startOffset.
   *
   * @param startOffset     [Number] The offset of the first character of the word
   *                                  that we want to find the leading context of.
   * @param wordCountTarget [Number] The number of words of context to provide on
   *                                  the left side of the word.
   *
   * @return The offset of the first character of the word that is wordCountTarget
   *         words before the word that starts at startOffset.
   */
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

  /**
   * Returns the offset of the first character after the word that is
   * wordCountTarget words after the word that ends at endOffset.
   *
   * @param endOffset       [Number] The offset of the last character of the word
   *                                  that we want to find the trailing context of.
   * @param wordCountTarget [Number] The number of words of context to provide on
   *                                  the right side of the word.
   *
   * @return The offset of the first character after the word that is wordCountTarget
   *         words after the word that ends at endOffset.
   */
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

module.exports = TextSearcher;
