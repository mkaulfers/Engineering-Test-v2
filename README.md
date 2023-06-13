# Title
Winston Health Engineering Test

# Estimated Time
1-2 Hours

# Summary
For this take home assignment, we are asking you to complete the implementation of a text searching class found in `TextSearcher.js` by implementing the `#_init` and `#search` functions. At a high level, the `TextSearcher` class provides an interface for a consumer to search a file an arbitary number of times. The class is instantiated with a file path and the resulting instance provides a search interface where the consumer can search for a specific query, and is returned an array of strings for each occurence of the search. The `search` function also takes a secondary `contextWords` argument which asks for a certain number of contextual words on either side of each found instance of the query word. See `TextSearcher.js` for more information.

We have provided a basic `TextTokenizer` class, which tokenizes a string based on a provided regular expression, for your benefit. You are free to use, or not use, this class at your discretion.

# Additional Technical Specs and Requirements
- Implement "#_init" and "#search" functions
- Make the implementations as performant as possible (be ready to speak to your design decisions, trade-offs and overall algorithm performance)
- An instance of `TextSearcher` should be able to field an arbitrary number of searches
- Do not loop over the contents of a file than once
- Do not use any outside libraries (core node modules are fine)
- Do not modify `TextTokenizer` unless absolutely necessary
- See the provided classes for more inforamtion

# Testing
- Execute 'node test/TextSearcherTest.js' to run the base test cases

# Technical Requirements
- Node v.12.0.0+

# Contributions and Acknowledgements
This test was adapted from a Java engineering test designed and administered by Aaron Silverman. Special thanks to them and all their guidance and support.
