'use strict';

const open = require('fs-maybe-open')
    , signature = require('pe-signature')
    , readExactly = require('fs-read-exactly')
    , signatureOffset = require('pe-signature-offset')
    , machineType = require('pe-machine-type-descriptor')

const SHORT = 2
    , LONG  = 4

const FIELDS =
    [ ['MACHINE_TYPE',            'machineType',          SHORT ]
    , ['NUMBER_OF_SECTIONS',      'numberOfSections',     SHORT ]
    , ['TIME_DATE_STAMP',         'timeDateStamp',        LONG  ]
    , ['POINTER_TO_SYMBOL_TABLE', 'pointerToSymbolTable', LONG  ]
    , ['NUMBER_OF_SYMBOLS',       'numberOfSymbols',      LONG  ]
    , ['SIZE_OF_OPTIONAL_HEADER', 'sizeOfOptionalHeader', SHORT ]
    , ['CHARACTERISTICS',         'characteristics',      SHORT ] ]

module.exports = PECOFFHeader
module.exports.ALL = exportLengths(FIELDS, module.exports)

function PECOFFHeader (fdOrFile, limit, done) {
  if (typeof limit === 'function') {
    done = limit, limit = PECOFFHeader.ALL
  } else if (typeof limit !== 'number') {
    throw new TypeError('Limit must be a number')
  } else if (limit === -1) {
    limit = PECOFFHeader.ALL
  } else if (limit < 0) {
    throw new RangeError(`Negative limit (${limit})`)
  } else if (limit > PECOFFHeader.ALL) {
    throw new RangeError(`Limit (${limit}) exceeds COFF length (${PECOFFHeader.ALL})`)
  }

  open(fdOrFile, 'r', (err, fd, close) => {
    if (err) return done(err)

    signatureOffset(fd, function (err, offset) {
      if (err) return close(done, err)

      readExactly(fd, offset, signature.length + limit, function (err, buf) {
        if (err) return close(done, err)

        if (!signature.has(buf)) {
          return close(done, new Error('PE signature mismatch'))
        }

        try {
          var header = limit ? readHeader(buf, signature.length, limit) : null
          var location = { offset: offset + signature.length, length: limit }
        } catch (err) {
          return close(done, err)
        }

        close(done, null, header, location)
      })
    })
  })
}

function readHeader (buf, offset, limit) {
  let position = offset
    , more = true

  function read (length) {
    const uint = buf.readUIntLE(position, length)

    position = position + length
    more = position - offset < limit

    return uint
  }

  const mt = read(FIELDS[0][2])
      , header = machineType(mt, 'machineType', 'machineDescription')

  for(let i = 1; i < FIELDS.length && more; i++) {
    header[FIELDS[i][1]] = read(FIELDS[i][2])
  }

  return header
}

function exportLengths (fields, exports) {
  let sum = 0

  for (let f of FIELDS) {
    exports[f[0]] = sum = sum + f[2]
  }

  return sum
}
