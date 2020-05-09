/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2020/1/14
 **/

import {getValueByPath, modifyDeep} from '../immer-util';
import produce from "immer";

it('should getValueByPath', function() {
  let result  = getValueByPath(
    {
      a: {
        b: {
          c: {
            c1: '11',
            c2: '22',
          },
        },
      },
    },
    ['a','b','c'],
  );


  expect(result).toEqual({
    c1: '11',
    c2: '22',
  })
});



it('should modifyDeep', function() {

  let data = {
    a: {
      b: {
        c: {
          c1: '11',
          c2: '22',
        },
      },
    },
  };

  let newData = produce(data,state=>{
     modifyDeep(
      state,
      ['a','b','c'],{c2:"22 modifyDeep"}
    );
     return state;
  });

  delete data.a.b.c.c1;
  data.a.b.c.c2="22 modifyDeep";
  expect(newData).toEqual(data);
});


it('modifyDeep 0级路径', async () =>{
  let data = {
    a: {
      b: {
        c: {
          c1: '11',
          c2: '22',
        },
      },
    },
  };

  let newData = produce(data,state=>{
    state = modifyDeep(
      state,
      [],(a)=>{
        return  {ddd:123}
      }
    );
    return state;
  });
  expect(newData).toEqual({
    ddd:123
  });
});

it('modifyDeep 一级路径', function() {

  let data = {
    a: {
      b: {
        c: {
          c1: '11',
          c2: '22',
        },
      },
    },
  };

  let newData = produce(data,state=>{
    modifyDeep(
      state,
      ['a'],(a)=>{
        a.b=12312;
      }
    );
    return state;
  });
  expect(newData).toEqual({
    a:{
      b:12312
    }
  });
});
