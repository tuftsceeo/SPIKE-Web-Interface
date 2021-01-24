/**  Sleep function
 * @private
 * @param {number} ms Miliseconds to sleep
 * @returns {Promise} 
 */
Service_SPIKE.prototype.sleep = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
