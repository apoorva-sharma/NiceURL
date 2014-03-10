// priorityqueue.js
// Apoorva Sharma - March 2014
// 
// a generic binary heap based priority queue, based on
// the very clear and thorough description here:
// http://eloquentjavascript.net/appendix2.html

// takes in a scoring function, which is used to keep elements minimized
function PriorityQueue(scoreFunction){
  this.content = [];
  this.scoreFunction = scoreFunction;
}

PriorityQueue.prototype = {
	// insert an element
	push: function(element) {
		// add the elemnt to the end
		this.content.push(element);
		// bubble it up
		this.bubbleUp(this.content.length - 1);
	},

	// remove and return the top level element
	pop: function() {
		// store the first one
		var topelem = this.content[0];

		// get the element at the end
		var end = this.content.pop();

		// if there are elements left, put the element back at the start
		// letting it sink down:
		if (this.content.length > 0) {
			this.content[0] = end;
			this.sinkDown(0);
		}

		return topelem;
	},

	// return the size of the content
	size: function() {
	    return this.content.length;
	},

	// bubble up the element at n
	bubbleUp: function(n) {
		// get the elem
		var element = this.content[n];
		var score = this.scoreFunction(element);
		var pos = n;
		// bubble up until pos == 0
		while (pos > 0) {
			var parentN = this._parentN_(pos);
			var parent = this.content[parentN];

			if (score > this.scoreFunction(parent))
				break; // things are in order

			// else, swap
			this.content[parentN] = element;
			this.content[pos] = parent;

			// and get ready to repeat!
			pos = parentN;
		}
	},

	sinkDown: function(n) {
		// get the elem and size of the array
		var size = this.size();
		var element = this.content[n];
		var score = this.scoreFunction(element);
		var pos = n;

		// while we're not done:
		while (true) {
			var rchildN = this._rchildN_(pos);
			var lchildN = this._lchildN_(pos);
			// we might need to swap to a pos, stored here
			var swapN = null;
			// check each child:
			if (rchildN < size) {
				var rchild = this.content[rchildN];
				var rchildScore = this.scoreFunction(rchild);
				if (rchildScore < score)
					swapN = rchildN; // it's out of order, so we swap.
			}
			// Similar procedure
			if (lchildN < size) {
				var lchild = this.content[lchildN];
				var lchildScore = this.scoreFunction(lchild);
				if (lchildScore < (swapN == null ? score : rchildScore))
					swapN = lchildN;
			}

			// if no need to swap, it's in order!
			if (swapN == null) break;

			// Else, swap and continue:
			this.content[pos] = this.content[swapN];
			this.content[swapN] = element;
			pos = swapN;
		}
	},

	// helper functions to navigate the array
	_parentN_: function(n) { return Math.floor((n + 1) / 2) - 1; },
	_lchildN_: function(n) { return (n+1)*2; },
	_rchildN_: function(n) { return (n+1)*2 - 1;}
};

// tests the heap
function testMe() {
  var heap = new PriorityQueue(function(x){return -x;});
  var elems = [1,2,5,6,8,9,3,8,10,15,12,16,4];
  for (var i = 0; i < elems.length; i++) {
  	heap.push(elems[i]);
  }
  console.log(heap.content);
  for(var i = 0; i < 7; i++)
    console.log(heap.pop());
}

exports.test = testMe;
exports.PriorityQueue = PriorityQueue;

