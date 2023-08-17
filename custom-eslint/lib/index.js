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

const excludesRules = () => {
    const runs = {};
    Object.keys(rules).map(item => {
        const current = rules[item];
        if (current.run) {
            runs[item] = current;
        }
    });
    return runs;
}

const efficientRules = excludesRules();

module.exports = {
  // rules是必须的
  rules: efficientRules,
  // 增加configs配置
  configs: {
      // 配置了这个之后，就可以在其他项目中像下面这样使用了
      // extends: ['plugin:guming-eslint/recommended']
      recommended: {
          plugins: ['rosen'],
          rules: {
              'rosen/no-use-taro-navigate': ['error']
          }
      }
  }
}

