/**
 * Iterator class which returns token strings from the input string.
 * It must be initialized with a regular expression representing a word.
 * Returned tokens will alternate between words (i.e. that match the regular expression)
 * and intervening strings that are not words.<p>
 *
 * The method isWord(String) can be used to check whether a given token is a word
 * or an intervening token.
 *
 * To learn what regular expression syntax is supported by the JavaScript platform,
 * see the documentation for node regular expressions
 */
class TextTokenizer {
  /**
   * Initializes the tokenizer with an input string and a regular expression
   * representing a word.
   *
   * @param input
   * @param wordRegex
   */
  constructor(input, wordRegex) {
    this._tokenStack = [];
    this._regEx = new RegExp(wordRegex);


    this._tokenizeInput(input, this._regEx);
  }

  // PUBLIC METHODS

  /**
   * Returns true if more tokens are available, i.e. if end-of-file has
   * not been reached.
   *
   * @return boolean
   */
  hasNext() {
    return this._tokenStack.length > 0;
  }
  /**
   * Returns the next token if any more tokens are available.
   * Otherwise returns null.
   *
   * @return [Object|Null]
   */
  next() {
    if (!this.hasNext()) return null;

    return this._tokenStack.shift();
  }

  /**
   * Returns true if the string matches this tokenizer's regular expression, otherwise
   * returns false.
   *
   * @return boolean
   */
  isWord(word) {
    if (!this._regEx.test(word)) return false;

    return word.match(this._regEx)[0] === word;
  }

  // Private Methods

  _tokenizeInput(input, regEx) {
    let remainingInput = input;
    let startIndex = 0;
    let endIndex = 0;

    while (remainingInput) {
      const currentMatch = remainingInput.match(regEx);

      if (!currentMatch) {
        this._tokenStack.push(remainingInput);
        this.remainingInput = null;
        break;
      }

      if (startIndex !== currentMatch.index) {
        // Record non-matching token
        this._tokenStack.push(remainingInput.slice(startIndex, currentMatch.index));
        remainingInput = remainingInput.slice(currentMatch.index);
      }

      // Record matching token
      endIndex = startIndex + currentMatch[0].length;

      this._tokenStack.push(remainingInput.slice(0, endIndex));

      remainingInput = remainingInput.slice(endIndex);
      this.startIndex = endIndex;
     }
  }
}

module.exports = TextTokenizer;
