/**
 * @desc
 * @使用场景
 *
 * @Date    2019/6/5
 **/

// let mockApiInfo={};

export function createMockUtil(mockApiInfo = {}) {
  return {
    /**
     * 判断此api是否需要mock
     * @param {string} controller
     * @param {string} method
     * @returns {boolean}
     */
    isMockApi(controller: string, method: string) {
      if (!mockApiInfo || !mockApiInfo[controller]) {
        return false;
      }

      if (mockApiInfo[controller].includes(method)) {
        return true;
      } else {
        return false;
      }
    },
  };
}
