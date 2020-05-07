/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2019/12/1
 **/
import {insertContent} from '../compile-util';

it('should ', function () {

let content = insertContent(
  `
  123123
  export default    { }
  123123123
  `,
  [
    {
      mark: /default +{/,
      isBefore: false,
      check: (content, rawContent) => {
        return true;
      },
      content: 'insert',
    },
  ],
);
console.log(content);

expect(content).toEqual(`
  123123
  export default    {
      insert 
       }
  123123123
 `)
});
