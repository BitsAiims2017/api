
/**
 * Check if an object contains the required properties
 *
 * @param data The object to check
 * @param props The properties to check
 * @return bool True if it contains all properties
 */
exports.contains = (data, props) => {
    for (var i = 0; i < props.length; i++) {
        if (! data[props[i]]) {
            return false;
        }
    }
    return true;
};
