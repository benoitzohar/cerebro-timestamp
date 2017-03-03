const formatter = require('./formatter')

describe('# formatter.js', () => {

    describe('# getType()', () => {

        it('should export input formats', () => {
            const format = formatter.INPUT_FORMAT
            expect(typeof format).toBe('object')
            expect(Object.keys(format)).toEqual(expect.arrayContaining(['NOW', 'TS_S', 'TS_MS', 'ARRAY', 'OTHER']));
        })

        it('should export ouptut formats', () => {
            const format = formatter.OUTPUT_FORMAT
            expect(typeof format).toBe('object')
            expect(Object.keys(format)).toEqual(expect.arrayContaining(['TIMESTAMP', 'TIMESTAMP_MS', 'SHORT', 'LONG', 'FULL']));
        })

        it('should recognize a blank input as "now"', () => {
            const type = formatter.getType()
            expect(typeof type).toBe('string')
            expect(type).toBe(formatter.INPUT_FORMAT.NOW)
        })

        it('should recognize "now" string input as "now"', () => {
            const type = formatter.getType('now')
            expect(typeof type).toBe('string')
            expect(type).toBe(formatter.INPUT_FORMAT.NOW)
        })

        it('should recognize "1488570776" string input as TS_S', () => {
            const type = formatter.getType('1488570776')
            expect(typeof type).toBe('string')
            expect(type).toBe(formatter.INPUT_FORMAT.TS_S)
        })

        it('should recognize "1488570776123" string input as TS_MS', () => {
            const type = formatter.getType('1488570776123')
            expect(typeof type).toBe('string')
            expect(type).toBe(formatter.INPUT_FORMAT.TS_MS)
        })

        it('should recognize 1488570776 integer input as TS_S', () => {
            const type = formatter.getType(1488570776)
            expect(typeof type).toBe('string')
            expect(type).toBe(formatter.INPUT_FORMAT.TS_S)
        })

        it('should recognize 1488570776123 string input as TS_MS', () => {
            const type = formatter.getType(1488570776123)
            expect(typeof type).toBe('string')
            expect(type).toBe(formatter.INPUT_FORMAT.TS_MS)
        })

        it('should not recognize an ISO 8601 string input', () => {
            const type = formatter.getType('2014-09-08T08:02:17-05:00')
            expect(typeof type).toBe('string')
            expect(type).toBe(formatter.INPUT_FORMAT.OTHER)
        })

        it('should not recognize an non-date string input', () => {
            const type = formatter.getType('hello')
            expect(typeof type).toBe('string')
            expect(type).toBe(formatter.INPUT_FORMAT.OTHER)
        })
    })

    describe('# parse()', () => {

        it('should parse a timestamp as int in seconds', () => {
            const moment = formatter.parse(1488570776, formatter.INPUT_FORMAT.TS_S)
            expect(typeof moment).toBe('object')
            expect(moment.isValid()).toBe(true)
            expect(+new Date(moment.format())).toBe(1488570776000) //the ms are thrown out
        })

        it('should parse a timestamp as int in milliseconds', () => {
            const moment = formatter.parse(1488570776123, formatter.INPUT_FORMAT.TS_MS)
            expect(typeof moment).toBe('object')
            expect(moment.isValid()).toBe(true)
            expect(+new Date(moment.format())).toBe(1488570776000) //the ms are thrown out
        })

        it('should parse a timestamp as String in seconds', () => {
            const moment = formatter.parse('1488570776', formatter.INPUT_FORMAT.TS_S)
            expect(typeof moment).toBe('object')
            expect(moment.isValid()).toBe(true)
            expect(+new Date(moment.format())).toBe(1488570776000) //the ms are thrown out
        })

        it('should parse a timestamp as String in milliseconds', () => {
            const moment = formatter.parse('1488570776123', formatter.INPUT_FORMAT.TS_MS)
            expect(typeof moment).toBe('object')
            expect(moment.isValid()).toBe(true)
            expect(+new Date(moment.format())).toBe(1488570776000) //the ms are thrown out
        })

        it('should parse an ISO 8601 String', () => {
            const moment = formatter.parse('2014-09-08T08:02:17-05:00', formatter.INPUT_FORMAT.OTHER)
            expect(typeof moment).toBe('object')
            expect(moment.isValid()).toBe(true)
            expect(+new Date(moment.format())).toBe(1410181337000) //the ms are thrown out
        })

    //    it('should not parse a non-date string', () => {
    //        const moment = formatter.parse('hello', formatter.INPUT_FORMAT.OTHER)
    //        expect(typeof moment).toBe('object')
    //        expect(moment.isValid()).toBe(false)
    //    })

    })

    describe('# output()', () => {

        const moment = formatter.parse(1488570776, formatter.INPUT_FORMAT.TS_S)

        it('should output to timestamp', () => {
            const res = formatter.output(moment, formatter.OUTPUT_FORMAT.TIMESTAMP)
            expect(typeof res).toBe('string')
            expect(res).toBe('1488570776')
        })

        it('should output to ms timestamp', () => {
            const res = formatter.output(moment, formatter.OUTPUT_FORMAT.TIMESTAMP_MS)
            expect(typeof res).toBe('string')
            expect(res).toBe('1488570776000')
        })

        it('should output to iso', () => {
            const res = formatter.output(moment, formatter.OUTPUT_FORMAT.ISO)
            expect(typeof res).toBe('string')
            expect(res).toBe('2017-03-03T14:52:56-05:00')
        })

        it('should output to short', () => {
            const res = formatter.output(moment, formatter.OUTPUT_FORMAT.SHORT)
            expect(typeof res).toBe('string')
            expect(res).toBe('03/03/2017 2:52:56 pm')
        })

        it('should output to long', () => {
            const res = formatter.output(moment, formatter.OUTPUT_FORMAT.LONG)
            expect(typeof res).toBe('string')
            expect(res).toBe('March 3, 2017 2:52 PM')
        })

        it('should output to full', () => {
            const res = formatter.output(moment, formatter.OUTPUT_FORMAT.FULL)
            expect(typeof res).toBe('string')
            expect(res).toBe('Friday, March 3, 2017 2:52 PM')
        })

    })

})
