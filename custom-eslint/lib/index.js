/**
 * @fileoverview s
 * @author 
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const requireIndex = require("requireindex");

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------


// import all rules in lib/rules
const rules = requireIndex(__dirname + "/rules");



module.exports = {
  // rules是必须的
  rules,
  // 增加configs配置
  configs: {
      // 配置了这个之后，就可以在其他项目中像下面这样使用了
      // extends: ['plugin:guming-eslint/recommended']
      recommended: {
          plugins: ['rosen'],
          rules: {
              'rosen/api-decorator-vaildate': ['error'],
            //   'rosen/lodash-auto-import': ['error'],
          }
      }
  }
}

