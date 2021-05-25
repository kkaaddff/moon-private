/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2019/11/28
 **/

import * as minimatch from 'minimatch'

it('should match', function () {
  expect(minimatch('bar.foo', '*.foo')).toEqual(true)
  expect(minimatch('bar.foo', 'bar.foo')).toEqual(true)
  expect(minimatch('/a/b/c/d/f', '/a/**/*')).toEqual(true)
  expect(minimatch('/a/b/c/d/f', '/a/**')).toEqual(true)
})
