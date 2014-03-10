// frequencytracker.js
// Apoorva Sharma - March 2014

// regexes to remove meaningless words and punctuation
var meaningless = require('./regexes');
var regexes = meaningless.regexes;

// A class that takes in words and keeps track of their frequencies
function FrequencyTracker() {
	this.words = {}; // a dictionary to store words and frequencies
	this.total = 0; // total number of words taken in
	console.log("made a frequency tracker");
}

FrequencyTracker.prototype = {
	// insert an element
	push: function(word) {
		// normalize the word to get better stats
		word = this.normalize(word);

		// if the normalized word is bad, nothing to do
		if (word === "")
			return;

		// if the word is in the dictionary
		if (this.words.hasOwnProperty(word))
			this.words[word] += 1;
		else
			this.words[word] = 1;

		// increment the total;
		this.total += 1;
	},

	normalize: function(word) {
		for (var i = 0; i<regexes.length; i++) {
			word = word.toLowerCase().replace(regexes[i],"");
		}

		return word.charAt(0).toUpperCase() + word.slice(1);
	},

	getFrequencies: function() {
		return Object.keys(this.words).map(function(key) {
			return {word:      key,
				    frequency: this.words[key]/this.total};
		}, this);
	}
};

/* node.js doesn't support iterators yet :(

// iterator for the above class
function FrequencyTrackerIterator(tracker) {
	this.tracker = tracker; // the Frequency Tracker linked to the object
	this.dictIter = Iterator(this.tracker.words);  // an iterator to iterate with
}

FrequencyTrackerIterator.prototype = {
	next: function() {
		// get the next word from the dictionary (if it isn't there, it will
	    // throw the StopIteration exception for us)
		var nextWord = dictIter.next();
		// compute that word's frequency
		var nextFrequency = this.tracker.words[nextWord]/this.tracker.total;
		return {word: nextWord, frequency: nextFrequency};
	}
}

*/

exports.FrequencyTracker = FrequencyTracker;
