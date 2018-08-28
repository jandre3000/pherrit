/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/lib/GerritQuery.js":
/*!********************************!*\
  !*** ./src/lib/GerritQuery.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * Class that builds and executes the Gerrit query.
 */
class GerritQuery {
	constructor( ticketNumbers ) {
		this.queryString = this.createQueryString( ticketNumbers );
		this.queryUrl = this.createUrl( this.queryString );
	}

	get url() {
		return this.queryUrl;
	}

	createQueryString( ticketNumbers ) {
		var combiner = '+OR+',
			ticketsLength = ticketNumbers.length,
			queryElements = ticketNumbers.map( ( num, i ) => {
				if ( i === ticketsLength - 1 ) {
					return `${num}`;
				} else {
					return `${num}${combiner}`;
				}
			} );
		return queryElements.join( '' );
	}

	createUrl( query ) {
		return `https://gerrit.wikimedia.org/r/changes/?pp=0&o=TRACKING_IDS&o=DETAILED_LABELS&q=bug:${query}`;
	}

	fetch() {
		return fetch( this.url, {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			}
		} )
			.then( ( response ) => {
				return response.text();
			} )
			.then( ( responseText ) => {
				responseText = responseText.replace( /^.*\n/, '' );
				return JSON.parse( responseText );
			} )
			.catch( ( err ) => {
				console.log( err ); // eslint-disable-line
			} );
	}
}

/* harmony default export */ __webpack_exports__["default"] = (GerritQuery);


/***/ }),

/***/ "./src/lib/GerritResponseParser.js":
/*!*****************************************!*\
  !*** ./src/lib/GerritResponseParser.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * Class that parses the response from the Phabricator API and returns just the necessary data.
 */
class GerritResponseParser {
	formatJSON( response ) {
		return response.reduce( ( acc, r ) => {
			var phab = r.tracking_ids.find( ( i ) => i.system === 'Phab' );

			if ( phab ) {

				acc.push( {
					ticketNumber: phab.id,
					title: r.subject,
					url: `https://gerrit.wikimedia.org/r/#/c/${r.project}/+/${r._number}/`, // eslint-disable-line
					codeReviewScore: this.parseCodeReviewScore( r ) || 0,
					status: r.status
				} );
			}
			return acc;
		}, [] );
	}

	parseCodeReviewScore( r ) {
		if ( r.labels[ 'Code-Review' ] && r.labels[ 'Code-Review' ].all ) {
			return r.labels[ 'Code-Review' ].all.reduce( ( c, v ) => {
				if ( v.value !== 0 ) {
					c.push( v.value );
				}
				return c;
			}, [] );
		}
		return [ 0 ];

	}

}

/* harmony default export */ __webpack_exports__["default"] = (GerritResponseParser);


/***/ }),

/***/ "./src/lib/Page.js":
/*!*************************!*\
  !*** ./src/lib/Page.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * Class that abstracts the Phabricator DOM elements
 */
class Page {
	get cards() {
		return document.querySelectorAll( '[data-sigil=" project-card"]' );
	}

	get ticketNumbers() {
		const cardArray = Array.from( this.cards );
		return cardArray.map( ( card ) => {
			return this.getTicketNumberFromCard( card );
		} );
	}

	get cardMap() {
		const cardArray = Array.from( this.cards );
		return cardArray.reduce( ( cardObj, card ) => {
			const num = this.getTicketNumberFromCard( card );
			cardObj[ num ] = card;
			return cardObj;
		}, {} );
	}

	getTicketNumberFromCard( cardDOM ) {
		return cardDOM.querySelector( '.phui-oi-objname' ).innerHTML;
	}
}

/* harmony default export */ __webpack_exports__["default"] = (Page);


/***/ }),

/***/ "./src/lib/Renderer.js":
/*!*****************************!*\
  !*** ./src/lib/Renderer.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * Class responsible for taking data and rendering it into the DOM
 */
class Renderer {

	constructor() {
		this.parser = new DOMParser();
	}

	createTemplateString( data ) {
		const totalScore = data.codeReviewScore.reduce( ( s, i ) => {
				return s + i;
			}, 0 ),
			averageScore = Math.round( totalScore / data.codeReviewScore.length ) || 0,
			scoreClasses = {
				'-2': 'pherrit--very-low',
				'-1': 'pherrit--low',
				0: 'pherrit--neutral',
				1: 'pherrit--medium',
				2: 'pherrit--high'
			};
		return `
		<a target="_blank" href="${data.url}" class="pherrit ${scoreClasses[ averageScore ]} pherrit--status-${data.status}">
			<span class="pherrit__title">
				${data.title}
			</span>
			<span class="pherrit__score">
				${data.codeReviewScore.join( ',' )}
			</span>
		</a>
		`;
	}

	createDOMFragment( string ) {
		var fragment = this.parser.parseFromString( string, 'text/html' );
		return fragment;
	}
	createDOMTemplate( data ) {
		var domString = this.createTemplateString( data ),
			domFragment = this.createDOMFragment( domString );
		return domFragment;
	}
}

/* harmony default export */ __webpack_exports__["default"] = (Renderer);


/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _lib_Page_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/Page.js */ "./src/lib/Page.js");
/* harmony import */ var _lib_GerritQuery_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/GerritQuery.js */ "./src/lib/GerritQuery.js");
/* harmony import */ var _lib_GerritResponseParser_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/GerritResponseParser.js */ "./src/lib/GerritResponseParser.js");
/* harmony import */ var _lib_Renderer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./lib/Renderer.js */ "./src/lib/Renderer.js");





var page = new _lib_Page_js__WEBPACK_IMPORTED_MODULE_0__["default"](),
	gerritQuery = new _lib_GerritQuery_js__WEBPACK_IMPORTED_MODULE_1__["default"]( page.ticketNumbers ),
	parser = new _lib_GerritResponseParser_js__WEBPACK_IMPORTED_MODULE_2__["default"](),
	renderer = new _lib_Renderer_js__WEBPACK_IMPORTED_MODULE_3__["default"]();

if ( Object.keys( page.cardMap ).length > -1 ) {

	gerritQuery.fetch()
		.then( ( responseText ) => {
			var formattedJSON = parser.formatJSON( responseText );

			formattedJSON.forEach( ( data ) => {
				const template = renderer.createDOMTemplate( data );
				if ( page.cardMap[ data.ticketNumber ] ) {
					page.cardMap[ data.ticketNumber ].append( template.body.firstChild );
				}
			} );
		} );

}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi9HZXJyaXRRdWVyeS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGliL0dlcnJpdFJlc3BvbnNlUGFyc2VyLmpzIiwid2VicGFjazovLy8uL3NyYy9saWIvUGFnZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGliL1JlbmRlcmVyLmpzIiwid2VicGFjazovLy8uL3NyYy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNsRkE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxJQUFJO0FBQ25CLEtBQUs7QUFDTCxlQUFlLElBQUksRUFBRSxTQUFTO0FBQzlCO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7QUFDQSxnR0FBZ0csTUFBTTtBQUN0Rzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQSx1QkFBdUI7QUFDdkIsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7QUNsREE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0QsVUFBVSxLQUFLLFVBQVU7QUFDekU7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7Ozs7Ozs7Ozs7Ozs7QUNyQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHLElBQUk7QUFDUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7OztBQzdCQTtBQUFBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLFNBQVMsbUJBQW1CLDZCQUE2QixtQkFBbUIsWUFBWTtBQUNySDtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0osR0FBRzs7QUFFSCIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvbWFpbi5qc1wiKTtcbiIsIi8qKlxuICogQ2xhc3MgdGhhdCBidWlsZHMgYW5kIGV4ZWN1dGVzIHRoZSBHZXJyaXQgcXVlcnkuXG4gKi9cbmNsYXNzIEdlcnJpdFF1ZXJ5IHtcblx0Y29uc3RydWN0b3IoIHRpY2tldE51bWJlcnMgKSB7XG5cdFx0dGhpcy5xdWVyeVN0cmluZyA9IHRoaXMuY3JlYXRlUXVlcnlTdHJpbmcoIHRpY2tldE51bWJlcnMgKTtcblx0XHR0aGlzLnF1ZXJ5VXJsID0gdGhpcy5jcmVhdGVVcmwoIHRoaXMucXVlcnlTdHJpbmcgKTtcblx0fVxuXG5cdGdldCB1cmwoKSB7XG5cdFx0cmV0dXJuIHRoaXMucXVlcnlVcmw7XG5cdH1cblxuXHRjcmVhdGVRdWVyeVN0cmluZyggdGlja2V0TnVtYmVycyApIHtcblx0XHR2YXIgY29tYmluZXIgPSAnK09SKycsXG5cdFx0XHR0aWNrZXRzTGVuZ3RoID0gdGlja2V0TnVtYmVycy5sZW5ndGgsXG5cdFx0XHRxdWVyeUVsZW1lbnRzID0gdGlja2V0TnVtYmVycy5tYXAoICggbnVtLCBpICkgPT4ge1xuXHRcdFx0XHRpZiAoIGkgPT09IHRpY2tldHNMZW5ndGggLSAxICkge1xuXHRcdFx0XHRcdHJldHVybiBgJHtudW19YDtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gYCR7bnVtfSR7Y29tYmluZXJ9YDtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdHJldHVybiBxdWVyeUVsZW1lbnRzLmpvaW4oICcnICk7XG5cdH1cblxuXHRjcmVhdGVVcmwoIHF1ZXJ5ICkge1xuXHRcdHJldHVybiBgaHR0cHM6Ly9nZXJyaXQud2lraW1lZGlhLm9yZy9yL2NoYW5nZXMvP3BwPTAmbz1UUkFDS0lOR19JRFMmbz1ERVRBSUxFRF9MQUJFTFMmcT1idWc6JHtxdWVyeX1gO1xuXHR9XG5cblx0ZmV0Y2goKSB7XG5cdFx0cmV0dXJuIGZldGNoKCB0aGlzLnVybCwge1xuXHRcdFx0aGVhZGVyczoge1xuXHRcdFx0XHRBY2NlcHQ6ICdhcHBsaWNhdGlvbi9qc29uJyxcblx0XHRcdFx0J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuXHRcdFx0fVxuXHRcdH0gKVxuXHRcdFx0LnRoZW4oICggcmVzcG9uc2UgKSA9PiB7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS50ZXh0KCk7XG5cdFx0XHR9IClcblx0XHRcdC50aGVuKCAoIHJlc3BvbnNlVGV4dCApID0+IHtcblx0XHRcdFx0cmVzcG9uc2VUZXh0ID0gcmVzcG9uc2VUZXh0LnJlcGxhY2UoIC9eLipcXG4vLCAnJyApO1xuXHRcdFx0XHRyZXR1cm4gSlNPTi5wYXJzZSggcmVzcG9uc2VUZXh0ICk7XG5cdFx0XHR9IClcblx0XHRcdC5jYXRjaCggKCBlcnIgKSA9PiB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCBlcnIgKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuXHRcdFx0fSApO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdlcnJpdFF1ZXJ5O1xuIiwiLyoqXG4gKiBDbGFzcyB0aGF0IHBhcnNlcyB0aGUgcmVzcG9uc2UgZnJvbSB0aGUgUGhhYnJpY2F0b3IgQVBJIGFuZCByZXR1cm5zIGp1c3QgdGhlIG5lY2Vzc2FyeSBkYXRhLlxuICovXG5jbGFzcyBHZXJyaXRSZXNwb25zZVBhcnNlciB7XG5cdGZvcm1hdEpTT04oIHJlc3BvbnNlICkge1xuXHRcdHJldHVybiByZXNwb25zZS5yZWR1Y2UoICggYWNjLCByICkgPT4ge1xuXHRcdFx0dmFyIHBoYWIgPSByLnRyYWNraW5nX2lkcy5maW5kKCAoIGkgKSA9PiBpLnN5c3RlbSA9PT0gJ1BoYWInICk7XG5cblx0XHRcdGlmICggcGhhYiApIHtcblxuXHRcdFx0XHRhY2MucHVzaCgge1xuXHRcdFx0XHRcdHRpY2tldE51bWJlcjogcGhhYi5pZCxcblx0XHRcdFx0XHR0aXRsZTogci5zdWJqZWN0LFxuXHRcdFx0XHRcdHVybDogYGh0dHBzOi8vZ2Vycml0Lndpa2ltZWRpYS5vcmcvci8jL2MvJHtyLnByb2plY3R9LysvJHtyLl9udW1iZXJ9L2AsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcblx0XHRcdFx0XHRjb2RlUmV2aWV3U2NvcmU6IHRoaXMucGFyc2VDb2RlUmV2aWV3U2NvcmUoIHIgKSB8fCAwLFxuXHRcdFx0XHRcdHN0YXR1czogci5zdGF0dXNcblx0XHRcdFx0fSApO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGFjYztcblx0XHR9LCBbXSApO1xuXHR9XG5cblx0cGFyc2VDb2RlUmV2aWV3U2NvcmUoIHIgKSB7XG5cdFx0aWYgKCByLmxhYmVsc1sgJ0NvZGUtUmV2aWV3JyBdICYmIHIubGFiZWxzWyAnQ29kZS1SZXZpZXcnIF0uYWxsICkge1xuXHRcdFx0cmV0dXJuIHIubGFiZWxzWyAnQ29kZS1SZXZpZXcnIF0uYWxsLnJlZHVjZSggKCBjLCB2ICkgPT4ge1xuXHRcdFx0XHRpZiAoIHYudmFsdWUgIT09IDAgKSB7XG5cdFx0XHRcdFx0Yy5wdXNoKCB2LnZhbHVlICk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIGM7XG5cdFx0XHR9LCBbXSApO1xuXHRcdH1cblx0XHRyZXR1cm4gWyAwIF07XG5cblx0fVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IEdlcnJpdFJlc3BvbnNlUGFyc2VyO1xuIiwiLyoqXG4gKiBDbGFzcyB0aGF0IGFic3RyYWN0cyB0aGUgUGhhYnJpY2F0b3IgRE9NIGVsZW1lbnRzXG4gKi9cbmNsYXNzIFBhZ2Uge1xuXHRnZXQgY2FyZHMoKSB7XG5cdFx0cmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICdbZGF0YS1zaWdpbD1cIiBwcm9qZWN0LWNhcmRcIl0nICk7XG5cdH1cblxuXHRnZXQgdGlja2V0TnVtYmVycygpIHtcblx0XHRjb25zdCBjYXJkQXJyYXkgPSBBcnJheS5mcm9tKCB0aGlzLmNhcmRzICk7XG5cdFx0cmV0dXJuIGNhcmRBcnJheS5tYXAoICggY2FyZCApID0+IHtcblx0XHRcdHJldHVybiB0aGlzLmdldFRpY2tldE51bWJlckZyb21DYXJkKCBjYXJkICk7XG5cdFx0fSApO1xuXHR9XG5cblx0Z2V0IGNhcmRNYXAoKSB7XG5cdFx0Y29uc3QgY2FyZEFycmF5ID0gQXJyYXkuZnJvbSggdGhpcy5jYXJkcyApO1xuXHRcdHJldHVybiBjYXJkQXJyYXkucmVkdWNlKCAoIGNhcmRPYmosIGNhcmQgKSA9PiB7XG5cdFx0XHRjb25zdCBudW0gPSB0aGlzLmdldFRpY2tldE51bWJlckZyb21DYXJkKCBjYXJkICk7XG5cdFx0XHRjYXJkT2JqWyBudW0gXSA9IGNhcmQ7XG5cdFx0XHRyZXR1cm4gY2FyZE9iajtcblx0XHR9LCB7fSApO1xuXHR9XG5cblx0Z2V0VGlja2V0TnVtYmVyRnJvbUNhcmQoIGNhcmRET00gKSB7XG5cdFx0cmV0dXJuIGNhcmRET00ucXVlcnlTZWxlY3RvciggJy5waHVpLW9pLW9iam5hbWUnICkuaW5uZXJIVE1MO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBhZ2U7XG4iLCIvKipcbiAqIENsYXNzIHJlc3BvbnNpYmxlIGZvciB0YWtpbmcgZGF0YSBhbmQgcmVuZGVyaW5nIGl0IGludG8gdGhlIERPTVxuICovXG5jbGFzcyBSZW5kZXJlciB7XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy5wYXJzZXIgPSBuZXcgRE9NUGFyc2VyKCk7XG5cdH1cblxuXHRjcmVhdGVUZW1wbGF0ZVN0cmluZyggZGF0YSApIHtcblx0XHRjb25zdCB0b3RhbFNjb3JlID0gZGF0YS5jb2RlUmV2aWV3U2NvcmUucmVkdWNlKCAoIHMsIGkgKSA9PiB7XG5cdFx0XHRcdHJldHVybiBzICsgaTtcblx0XHRcdH0sIDAgKSxcblx0XHRcdGF2ZXJhZ2VTY29yZSA9IE1hdGgucm91bmQoIHRvdGFsU2NvcmUgLyBkYXRhLmNvZGVSZXZpZXdTY29yZS5sZW5ndGggKSB8fCAwLFxuXHRcdFx0c2NvcmVDbGFzc2VzID0ge1xuXHRcdFx0XHQnLTInOiAncGhlcnJpdC0tdmVyeS1sb3cnLFxuXHRcdFx0XHQnLTEnOiAncGhlcnJpdC0tbG93Jyxcblx0XHRcdFx0MDogJ3BoZXJyaXQtLW5ldXRyYWwnLFxuXHRcdFx0XHQxOiAncGhlcnJpdC0tbWVkaXVtJyxcblx0XHRcdFx0MjogJ3BoZXJyaXQtLWhpZ2gnXG5cdFx0XHR9O1xuXHRcdHJldHVybiBgXG5cdFx0PGEgdGFyZ2V0PVwiX2JsYW5rXCIgaHJlZj1cIiR7ZGF0YS51cmx9XCIgY2xhc3M9XCJwaGVycml0ICR7c2NvcmVDbGFzc2VzWyBhdmVyYWdlU2NvcmUgXX0gcGhlcnJpdC0tc3RhdHVzLSR7ZGF0YS5zdGF0dXN9XCI+XG5cdFx0XHQ8c3BhbiBjbGFzcz1cInBoZXJyaXRfX3RpdGxlXCI+XG5cdFx0XHRcdCR7ZGF0YS50aXRsZX1cblx0XHRcdDwvc3Bhbj5cblx0XHRcdDxzcGFuIGNsYXNzPVwicGhlcnJpdF9fc2NvcmVcIj5cblx0XHRcdFx0JHtkYXRhLmNvZGVSZXZpZXdTY29yZS5qb2luKCAnLCcgKX1cblx0XHRcdDwvc3Bhbj5cblx0XHQ8L2E+XG5cdFx0YDtcblx0fVxuXG5cdGNyZWF0ZURPTUZyYWdtZW50KCBzdHJpbmcgKSB7XG5cdFx0dmFyIGZyYWdtZW50ID0gdGhpcy5wYXJzZXIucGFyc2VGcm9tU3RyaW5nKCBzdHJpbmcsICd0ZXh0L2h0bWwnICk7XG5cdFx0cmV0dXJuIGZyYWdtZW50O1xuXHR9XG5cdGNyZWF0ZURPTVRlbXBsYXRlKCBkYXRhICkge1xuXHRcdHZhciBkb21TdHJpbmcgPSB0aGlzLmNyZWF0ZVRlbXBsYXRlU3RyaW5nKCBkYXRhICksXG5cdFx0XHRkb21GcmFnbWVudCA9IHRoaXMuY3JlYXRlRE9NRnJhZ21lbnQoIGRvbVN0cmluZyApO1xuXHRcdHJldHVybiBkb21GcmFnbWVudDtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBSZW5kZXJlcjtcbiIsImltcG9ydCBQYWdlIGZyb20gJy4vbGliL1BhZ2UuanMnO1xuaW1wb3J0IEdlcnJpdFF1ZXJ5IGZyb20gJy4vbGliL0dlcnJpdFF1ZXJ5LmpzJztcbmltcG9ydCBHZXJyaXRSZXNwb25zZVBhcnNlciBmcm9tICcuL2xpYi9HZXJyaXRSZXNwb25zZVBhcnNlci5qcyc7XG5pbXBvcnQgUmVuZGVyZXIgZnJvbSAnLi9saWIvUmVuZGVyZXIuanMnO1xuXG52YXIgcGFnZSA9IG5ldyBQYWdlKCksXG5cdGdlcnJpdFF1ZXJ5ID0gbmV3IEdlcnJpdFF1ZXJ5KCBwYWdlLnRpY2tldE51bWJlcnMgKSxcblx0cGFyc2VyID0gbmV3IEdlcnJpdFJlc3BvbnNlUGFyc2VyKCksXG5cdHJlbmRlcmVyID0gbmV3IFJlbmRlcmVyKCk7XG5cbmlmICggT2JqZWN0LmtleXMoIHBhZ2UuY2FyZE1hcCApLmxlbmd0aCA+IC0xICkge1xuXG5cdGdlcnJpdFF1ZXJ5LmZldGNoKClcblx0XHQudGhlbiggKCByZXNwb25zZVRleHQgKSA9PiB7XG5cdFx0XHR2YXIgZm9ybWF0dGVkSlNPTiA9IHBhcnNlci5mb3JtYXRKU09OKCByZXNwb25zZVRleHQgKTtcblxuXHRcdFx0Zm9ybWF0dGVkSlNPTi5mb3JFYWNoKCAoIGRhdGEgKSA9PiB7XG5cdFx0XHRcdGNvbnN0IHRlbXBsYXRlID0gcmVuZGVyZXIuY3JlYXRlRE9NVGVtcGxhdGUoIGRhdGEgKTtcblx0XHRcdFx0aWYgKCBwYWdlLmNhcmRNYXBbIGRhdGEudGlja2V0TnVtYmVyIF0gKSB7XG5cdFx0XHRcdFx0cGFnZS5jYXJkTWFwWyBkYXRhLnRpY2tldE51bWJlciBdLmFwcGVuZCggdGVtcGxhdGUuYm9keS5maXJzdENoaWxkICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=