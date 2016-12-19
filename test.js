'use strict';

const test = require('tape')
    , parse = require('.')

test('basic', function (t) {
  t.plan(3)

  parse('fixtures/dummy.exe', function (err, header, location) {
    t.ifError(err, 'no parse error')

    t.same(header, {
      machineType: 'i386',
      machineDescription: 'Intel 386 or later processors and compatible processors',
      numberOfSections: 3,
      timeDateStamp: 1480757919,
      pointerToSymbolTable: 0,
      numberOfSymbols: 0,
      sizeOfOptionalHeader: 224,
      characteristics: 258
    })

    t.same(location, { length: 20, offset: 132 })
  })
})

test('limit', function (t) {
  t.plan(9)

  parse('fixtures/dummy.exe', parse.ALL, function (err, header, location) {
    t.ifError(err, 'no parse error')

    t.same(header, {
      machineType: 'i386',
      machineDescription: 'Intel 386 or later processors and compatible processors',
      numberOfSections: 3,
      timeDateStamp: 1480757919,
      pointerToSymbolTable: 0,
      numberOfSymbols: 0,
      sizeOfOptionalHeader: 224,
      characteristics: 258
    })

    t.same(location, { length: 20, offset: 132 })
  })

  parse('fixtures/dummy.exe', parse.MACHINE_TYPE, function (err, header, location) {
    t.ifError(err, 'no parse error')

    t.same(header, {
      machineType: 'i386',
      machineDescription: 'Intel 386 or later processors and compatible processors',
    })

    t.same(location, { length: 2, offset: 132 })
  })

  parse('fixtures/dummy.exe', parse.POINTER_TO_SYMBOL_TABLE, function (err, header, location) {
    t.ifError(err, 'no parse error')

    t.same(header, {
      machineType: 'i386',
      machineDescription: 'Intel 386 or later processors and compatible processors',
      numberOfSections: 3,
      timeDateStamp: 1480757919,
      pointerToSymbolTable: 0
    })

    t.same(location, { length: 12, offset: 132 })
  })
})
