const assert = require('assert');
const TextSearcher = require('../TextSearcher');
const TextTokenizer = require('../TextTokenizer');

async function initTests() {
  console.log('STARTING TESTS...');
  let passCounter = 0;

  if (await runTest(testOneHitNoContext)) passCounter++;
  if (await runTest(testMultipleHitsNoContext)) passCounter++;
  if (await runTest(testBasicSearch)) passCounter++;
  if (await runTest(testBasicMoreContext)) passCounter++;
  // if (await runTest(testApostropheQuery)) passCounter++;
  // if (await runTest(testNumericQuery)) passCounter++;
  // if (await runTest(testMixedQuery)) passCounter++;
  // if (await runTest(testCaseInsensitiveSearch)) passCounter++;
  // if (await runTest(testNearBeginning)) passCounter++;
  // if (await runTest(testNearEnd)) passCounter++;
  // if (await runTest(testMultipleSearches)) passCounter++;
  // if (await runTest(testOverlappingHits)) passCounter++;
  // if (await runTest(testNoHits)) passCounter++;
  // if (await runTest(testTokenizer)) passCounter++;

  console.log(`\n\n Passed ${passCounter} / 14`);
}

/** Simplest possible case, no context and the word occurs exactly once. */
async function testOneHitNoContext() {
  const searcher = (new TextSearcher('files/short_excerpt.txt'));

  const expected = [ "sketch" ];
  const results = searcher.search("sketch", 0);
  assertArraysEqual(expected, results);
}

/** Next simplest case, no context and multiple hits. */
async function testMultipleHitsNoContext() {
  const searcher = new TextSearcher('files/short_excerpt.txt');

  const expected = [ "naturalists", "naturalists" ];
  const results = searcher.search("naturalists", 0);
  assertArraysEqual(expected, results);
}

/** This is the example from the document. */
async function testBasicSearch() {
  const searcher = new TextSearcher('files/short_excerpt.txt');

  const expected = ["great majority of naturalists believed that species", "authors.  Some few naturalists, on the other"];
  const results = searcher.search("naturalists", 3);
  assertArraysEqual(expected, results);
}

/** Same as basic search but a little more context. */
async function testBasicMoreContext() {
  const searcher = new TextSearcher('files/short_excerpt.txt');

  const expected = ["Until recently the great majority of naturalists believed that species were immutable productions", "maintained by many authors.  Some few naturalists, on the other hand, have believed"];
  const results = searcher.search("naturalists", 6);
  assertArraysEqual(expected, results);
}

/** Tests query word with apostrophe. */
async function testApostropheQuery() {
  const searcher = new TextSearcher('files/long_excerpt.txt');

  const expected = ["not indeed to the animal's or plant's own good", "habitually speak of an animal's organisation as\r\nsomething plastic"];
  const results = searcher.search(`animal's`, 4);
  assertArraysEqual(expected, results);
}

/** Tests numeric query word. */
async function testNumericQuery() {
  const searcher = new TextSearcher('files/long_excerpt.txt');

  const expected = ["enlarged in 1844 into a", "sketch of 1844--honoured me"];
  const results = searcher.search('1844', 2);
  assertArraysEqual(expected, results);
}

/** Tests mixed alphanumeric query word. */
async function testMixedQuery() {
  const searcher = new TextSearcher('files/long_excerpt.txt');

  const expected = ["date first edition [xxxxx10x.xxx] please check"];
  const results = searcher.search('xxxxx10x', 3);
  assertArraysEqual(expected, results);
}

/** Should get same results regardless of case. */
async function testCaseInsensitiveSearch() {
  const searcher = new TextSearcher('files/short_excerpt.txt');

  const expected = ["on the Origin of Species.  Until recently the great", "of naturalists believed that species were immutable productions, and", "hand, have believed that species undergo modification, and that"];

  let results = searcher.search('species', 4);
  assertArraysEqual(expected, results);

  results = searcher.search("SPECIES", 4);
  assertArraysEqual(expected, results);

  results = searcher.search("SpEcIeS", 4);
  assertArraysEqual(expected, results);
}

/** Hit that overlaps file start should still work. */
async function testNearBeginning() {
  const searcher = new TextSearcher('files/short_excerpt.txt');

  const expected = ["I will here give a brief sketch"];
  const results = searcher.search('here', 4);
  assertArraysEqual(expected, results);
}

/** Hit that overlaps file end should still work. */
async function testNearEnd() {
  const searcher = new TextSearcher('files/short_excerpt.txt');

  const expected = ["and that the existing forms of life", "generation of pre existing forms."];
  const results = searcher.search('existing', 3);
  assertArraysEqual(expected, results);
}

/** Searcher can execute multiple searches after initialization. */
async function testMultipleSearches() {
  const searcher = new TextSearcher('files/short_excerpt.txt');

  let results = [];
  let expected = [
    "on the Origin of Species.  Until recently the great",
    "of naturalists believed that species were immutable productions, and",
    "hand, have believed that species undergo modification, and that"
  ];

  results = searcher.search("species", 4);
  assertArraysEqual(expected, results);

  expected = [ "I will here give a brief sketch" ];
  results = searcher.search("here", 4);
  assertArraysEqual(expected, results);

  expected = [
    "and that the existing forms of life",
    "generation of pre existing forms."
  ];
  results = searcher.search("existing", 3);
  assertArraysEqual(expected, results);
}

/** Overlapping hits should just come back as separate hits. */
async function testOverlappingHits() {
  const searcher = new TextSearcher('files/short_excerpt.txt');

  const expected = [
    "of naturalists believed that species were immutable",
    "hand, have believed that species undergo modification",
    "undergo modification, and that the existing forms"
  ];
  const results = searcher.search("that", 3);
  assertArraysEqual(expected, results);
}

/** If no hits, get back an empty array. */
async function testNoHits() {
  const searcher = new TextSearcher('files/short_excerpt.txt');

  const expected = searcher.search("slejrlskejrlkajlsklejrlksjekl", 3);
  const results = [];
  assertArraysEqual(expected, results);
}

/** Verify the tokenizer. This should always pass. */
async function testTokenizer() {
  const input = '123, 789: def';
  const expected = ['123', ', ', '789', ': def'];

  const lexer = new TextTokenizer(input, '[0-9]+');

  const tokens = [];
  while (lexer.hasNext()) {
    tokens.push(lexer.next());
  }

  assertArraysEqual(expected, tokens);

  assert.equal(lexer.isWord('1029384'), true);
  assert.equal(lexer.isWord('1029388 '), false);
  assert.equal(lexer.isWord('123,456'), false);
}

/*********************
 *  HELPER FUNCTIONS
 **********************/

async function runTest(testFunc) {
  try {
    console.log(`RUNNING ${testFunc.name}...`);
    await testFunc();

    console.log('\x1b[32m', 'Passed!', '\x1b[0m');
    return true;
  } catch (err) {
    console.log('\x1b[31m', 'Failed!', '\x1b[0m');
    console.error(err.stack);
    return false;
  }
}

function assertArraysEqual(arr1, arr2) {
  try {
    assert.equal(arr1.length, arr2.length);

    for (let i = 0; i < arr1.length; i++) {
      assert.equal(arr1[i], arr2[i]);
    }

    return true;
  } catch (err) {
    console.log('Failed comparing following arrays:');
    console.log(' Array 1: ', arr1);
    console.log(' Array 2: ', arr2);

    throw err;
  }
}

initTests();
