/**
 * Class for manage pending requests.
 * @private
 */

const PromiseController = require('promise-controller');
const promiseFinally = require('promise.prototype.finally');

module.exports = class Requests {
  constructor() {
    this._items = new Map();
  }

  /**
   * Creates new request and stores it in the list.
   *
   * @param {String|Number} requestId
   * @param {*} requestMetadata
   * @param {Function} fn
   * @param {Number} timeout
   * @returns {Promise}
   */
  //rule disabled to provide downward compatiblility, 4th parameter is optional
  // eslint-disable-next-line max-params
  create(requestId, fn, timeout, requestMetadata) {
    this._rejectExistingRequest(requestId);
    return this._createNewRequest(requestId, fn, timeout, requestMetadata);
  }

  resolve(requestId, data) {
    if (requestId && this._items.has(requestId)) {
      this._items.get(requestId).request.resolve(data);
    }
  }

  has(requestId) {
    return requestId && this._items.has(requestId);
  }

  getMetadata(requestId){
    return this._items.get(requestId).metaData;
  }

  rejectAll(error) {
    this._items.forEach(entry => entry.request.isPending ? entry.request.reject(error) : null);
  }

  _rejectExistingRequest(requestId) {
    const existingRequest = this._items.get(requestId);
    if (existingRequest && existingRequest.request.isPending) {
      existingRequest.request.reject(new Error(`WebSocket request is replaced, id: ${requestId}`));
    }
  }

  //rule disabled to provide downward compatiblility, 4th parameter is optional
  // eslint-disable-next-line max-params
  _createNewRequest(requestId, fn, timeout, requestMetadata) {
    const request = new PromiseController({
      timeout,
      timeoutReason: `WebSocket request was rejected by timeout (${timeout} ms). RequestId: ${requestId}`
    });
    const entry = {request: request, metaData: requestMetadata};
    this._items.set(requestId, entry);
    return promiseFinally(request.call(fn), () => this._deleteRequest(requestId, request));
  }

  _deleteRequest(requestId, request) {
    // this check is important when request was replaced
    if (this._items.get(requestId).request === request) {
      this._items.delete(requestId);
    }
  }
};
