'use strict';

const icon = require('./icon.png');
const {
    INPUT_FORMAT,
    OUTPUT_FORMAT,
    ERROR_UNKNOWN,
    getType,
    parse,
    output
} = require('./formatter');

const plugin = ({ term, display, actions }) => {
    let match = term.match(/^(\d{10,13})/);

    //fall back on the ts prefix
    if (!match) {
        match = term.match(/^tsu?\s?(.*)/);
    }

    if (match) {
        const isUTC = term.startsWith('tsu');
        const input = match[1];

        const type = getType(input); //String
        const moment = parse(input, type, isUTC); //momentJS object

        if (!moment.isValid()) {
            display({
                title: ERROR_UNKNOWN,
                id: 'cerebro-timestamp-error',
                icon,
                subtitle: ''
            });
        } else {
            //prepare appopriate order for rows
            let typesInOrder;

            switch (type) {
                case INPUT_FORMAT.TS_S:
                case INPUT_FORMAT.TS_MS:
                case INPUT_FORMAT.TS_NS:
                    typesInOrder = [
                        OUTPUT_FORMAT.SHORT,
                        OUTPUT_FORMAT.LONG,
                        OUTPUT_FORMAT.FULL,
                        OUTPUT_FORMAT.ISO,
                        OUTPUT_FORMAT.TIMESTAMP_MS,
                        OUTPUT_FORMAT.TIMESTAMP_NS,
                        OUTPUT_FORMAT.TIMESTAMP
                    ];
                    break;
                case INPUT_FORMAT.NOW:
                case INPUT_FORMAT.ARRAY:
                case INPUT_FORMAT.OTHER:
                default:
                    typesInOrder = [
                        OUTPUT_FORMAT.TIMESTAMP,
                        OUTPUT_FORMAT.TIMESTAMP_MS,
                        OUTPUT_FORMAT.TIMESTAMP_NS,
                        OUTPUT_FORMAT.SHORT,
                        OUTPUT_FORMAT.LONG,
                        OUTPUT_FORMAT.FULL,
                        OUTPUT_FORMAT.ISO
                    ];
                    break;
            }

            typesInOrder.forEach(format => {
                const res = output(moment, format);

                display({
                    title: res,
                    id: `cerebro-timestamp-${format.title}`,
                    icon,
                    clipboard: res,
                    subtitle: format.title.replace('{{TIMEZONE}}', isUTC ? 'UTC' : 'local time'),
                    onSelect: () => {
                        actions.copyToClipboard(res);
                    }
                });
            });
        }
    }
};

module.exports = {
    fn: plugin,
    name: 'Encode/decode timestamp',
    keyword: 'ts',
    icon
};
