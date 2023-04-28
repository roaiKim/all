/**
 * @fileoverview 这是一个lodash按需引入的eslint规则
 * @author guming-eslint
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */


module.exports = {
  // eslint-disable-next-line eslint-plugin/prefer-message-ids
  meta: {
    type: "suggestion", // `problem`, `suggestion`, or `layout`
    docs: {
      description: "这是一个lodash按需引入的eslint规则",
      recommended: true,
      url: null, // URL to the documentation page for this rule
    },
    messages: {
      autoImportLodash: "请使用lodash按需引用",
      invalidImport: "lodash 导出依赖不为空",
    },
    fixable: "code",
    schema: [],
  },

  create: function (context) {
    
    // 获取lodash中导入的函数名称，并返回
    function getImportSpecifierArray(specifiers) {
      const incluedType = ["ImportSpecifier", "ImportDefaultSpecifier"];
      return specifiers
        .filter((item) => incluedType.includes(item.type))
        .map((item) => {
          return item.imported ? item.imported.name : item.local.name;
        });
    }

    // 生成修复文本
    function generateFixedImportText(importedList, dependencyName) {
      let fixedText = "";
      importedList.forEach((importName, index) => {
        fixedText += `import ${importName} from "${dependencyName}/${importName}";`;
        if (index != importedList.length - 1) fixedText += "\n";
      });
      return fixedText;
    }
    // const SOURCElIST = ["lodash", "lodash-es"];
    return {
      ImportDeclaration(node) {
        const source = node.source.value;
        const hasUseLodash = true; //SOURCElIST.inclues(source);

        // 使用lodash
        if (hasUseLodash) {
          const importedList = getImportSpecifierArray(node.specifiers || []);

          if (importedList.length <= 0) {
            return context.report({
              node,
              messageId: "invalidImport",
            });
          }

          const dependencyName = "lodash";  // getImportDependencyName(node);
          return context.report({
            node,
            messageId: "autoImportLodash",
            // fix(fixer) {
            //   return fixer.replaceTextRange(
            //     node.range,
            //     generateFixedImportText(importedList, dependencyName)
            //   );
            // },
          });
        }
      },
    };
  },
};
