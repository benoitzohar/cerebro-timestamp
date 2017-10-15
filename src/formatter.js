'use strict';

const moment = require('moment')

//
// Constants
//

const INPUT_FORMAT = {
    NOW: 'now',
    TS_S: 'ts_s',
    TS_MS: 'ts_ms',
    TS_NS: 'ts_ns',
    ARRAY: 'array',
    OTHER: 'other'
}

//export input_format constant
module.exports.INPUT_FORMAT = INPUT_FORMAT

const OUTPUT_FORMAT = {
    TIMESTAMP: {
        title: 'Unix time',
        format: 'X'
    },
    TIMESTAMP_MS:  {
        title: 'Unix millisecond time',
        format: 'x'
    },
    TIMESTAMP_NS:  {
        title: 'Unix nanosecond time',
        format: 'x000000' // momentjs doesn't support ns formatting :(
    },
    ISO:  {
        title: 'ISO date and time ({{TIMEZONE}})',
        format: ''
    },
    SHORT:  {
        title: 'Short date and time ({{TIMEZONE}})',
        format: 'L h:mm:ss a'
    },
    LONG:  {
        title: 'Long date and time ({{TIMEZONE}})',
        format: 'LLL'
    },
    FULL:  {
        title: 'Full date and time ({{TIMEZONE}})',
        format: 'LLLL'
    }
}

//export output_format constant
module.exports.OUTPUT_FORMAT = OUTPUT_FORMAT

const ERROR_UNKNOWN = 'Could not understand the date you\'ve typed, sorry.'
//export ERROR_UNKNOWN constant
module.exports.ERROR_UNKNOWN = ERROR_UNKNOWN

/*
 * try to guess type from input format
 * @return String
 **/

module.exports.getType = (input) => {
    //if this is now
    if (!input || 'now' === String(input).toLowerCase()) {
        return INPUT_FORMAT.NOW
    }
    //if this is a timestamp
    else if (parseInt(input) == String(input)) {
        // guess timestamp precision
        if (String(input).length < 12) {
            return INPUT_FORMAT.TS_S
        }
        else if (String(input).length < 15) {
            return INPUT_FORMAT.TS_MS
        } else {
            return INPUT_FORMAT.TS_NS
        }
    }

    return INPUT_FORMAT.OTHER
}

/*
 *
 * @return momentJS
 **/
module.exports.parse = (input, type, isUTC) => {
    let result;

    switch(type) {
        case INPUT_FORMAT.NOW:
            result = moment()
            break
        case INPUT_FORMAT.TS_S:
            result = moment.unix(parseInt(input))
            break
        case INPUT_FORMAT.TS_MS:
            result = moment.unix(parseInt(input) / 1000)
            break
        case INPUT_FORMAT.TS_NS:
            result = moment.unix(parseInt(input) / 1000000000)
            break
        case INPUT_FORMAT.ARRAY:
            result = moment(input)
            break
        default:
            result = moment(input)
    }

    if (isUTC) {
        result = result.utc();
    }

    return result;
}

/*
 *
 * @return {}
 **/
module.exports.output = (moment, format) => {

    if (!moment || !moment.isValid || !moment.isValid()) {
        return ERROR_UNKNOWN
    }

    return moment.format(format.format)
}
