# pe-coff

**Parse the COFF file header of a [PE](https://en.wikipedia.org/wiki/Portable_Executable). As specified by [Microsoft PE and COFF Specification 9.3](https://download.microsoft.com/download/9/c/5/9c5b2167-8017-4bae-9fde-d599bac8184a/pecoff_v83.docx) <sup>[doc]</sup>, section 3.3.**

[![npm status](http://img.shields.io/npm/v/pe-coff.svg?style=flat-square)](https://www.npmjs.org/package/pe-coff) [![node](https://img.shields.io/node/v/pe-coff.svg?style=flat-square)](https://www.npmjs.org/package/pe-coff) [![Travis build status](https://img.shields.io/travis/vweevers/pe-coff.svg?style=flat-square&label=travis)](http://travis-ci.org/vweevers/pe-coff) [![AppVeyor build status](https://img.shields.io/appveyor/ci/vweevers/pe-coff.svg?style=flat-square&label=appveyor)](https://ci.appveyor.com/project/vweevers/pe-coff) [![Dependency status](https://img.shields.io/david/vweevers/pe-coff.svg?style=flat-square)](https://david-dm.org/vweevers/pe-coff)

## example

```js
const pecoff = require('pe-coff')

pecoff('file.exe', function (err, header, location) {
  console.log(header)
  console.log(location)
})
```

The `header` has these properties:

```json
{
  "machineType": "i386",
  "machineDescription": "Intel 386 or later processors and compatible processors",
  "numberOfSections": 3,
  "timeDateStamp": 1480757919,
  "pointerToSymbolTable": 0,
  "numberOfSymbols": 0,
  "sizeOfOptionalHeader": 224,
  "characteristics": 258
}
```

And `location` contains the offset and length of the header in bytes:

```json
{
  "offset": 132,
  "length": 20
}
```

## `pecoff(mixed, [limit], callback)`

Where `mixed` is either a filename or a file descriptor. Use `limit` (the number of bytes to read) if you only need the first (few) fields:

```js
pecoff('file.exe', pecoff.NUMBER_OF_SECTIONS, function (err, header) {
  // Will have machineType, machineDescription, numberOfSections
  console.log(header)
})

pecoff('file.exe', pecoff.MACHINE_TYPE, function (err, header) {
  // Will have machineType, machineDescription
  console.log(header)
})
```

## related

- [pe-signature](https://github.com/vweevers/pe-signature)
- [pe-signature-offset](https://github.com/vweevers/pe-signature-offset)
- [pe-machine-type-descriptor](https://github.com/vweevers/pe-machine-type-descriptor])

## install

With [npm](https://npmjs.org) do:

```
npm install pe-coff
```

## license

[MIT](http://opensource.org/licenses/MIT) © Vincent Weevers
