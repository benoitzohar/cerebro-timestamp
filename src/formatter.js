'use strict';

const moment = require('moment')

//
// Constants
//

const INPUT_FORMAT = {
    NOW: 'now',
    TS_S: 'ts_s',
    TS_MS: 'ts_ms',
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
    ISO:  {
        title: 'ISO date and time',
        format: ''
    },
    SHORT:  {
        title: 'Short date and time',
        format: 'L h:mm:ss a'
    },
    LONG:  {
        title: 'Long date and time',
        format: 'LLL'
    },
    FULL:  {
        title: 'Full date and time',
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
        //is it a ms or a s timestamp
        if (String(input).length < 12) {
            return INPUT_FORMAT.TS_S
        }
        else {
            return INPUT_FORMAT.TS_MS
        }
    }

    return INPUT_FORMAT.OTHER
}

/*
 *
 * @return momentJS
 **/
module.exports.parse = (input, type) => {
    switch(type) {
        case INPUT_FORMAT.NOW:
            return moment()
            break
        case INPUT_FORMAT.TS_S:
            return moment.unix(parseInt(input))
            break
        case INPUT_FORMAT.TS_MS:
            return moment.unix(parseInt(input) / 1000)
            break
        case INPUT_FORMAT.ARRAY:
            return moment(input)
            break
        default:
            return moment(input)
    }
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
