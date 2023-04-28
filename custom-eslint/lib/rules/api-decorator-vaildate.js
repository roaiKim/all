/**
 * @fileoverview f
 * @author 
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "problem", // `problem`, `suggestion`, or `layout`
    messages: {
      callExpression: "service 方法内部的返回函数 ajax 必须使用 call 方法",
      ThisExpression: "ajax 的第一个参数 必须是 当前方法",
    },
    docs: {
      description: "f",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: "code", // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
  },

  create(context) {
    return {
      ClassDeclaration(node) {
        if (node.id.type === "Identifier") {
          const isServiceName = node.id.name.endsWith("Service");
          if (isServiceName) {
            const methodBody = node.body.body;
            if (methodBody.length) {
              methodBody.forEach((item, index) => {
                const methodName = item.key.name;
                const returnStatement = item.value.body?.body.find(statement => statement.type === "ReturnStatement");
                const isCallEx = returnStatement.argument.callee?.property?.name === "call";
                if (!isCallEx) {
                  context.report({
                      node: returnStatement.argument.callee,
                      messageId: "callExpression",
                      fix(fixer) {
                        return fixer.insertTextAfterRange(
                          returnStatement.argument.callee.range,
                          ".call"
                        )
                      }
                  });
                }
                const firstArgument = returnStatement.argument.arguments?.[0]
                if (firstArgument?.object?.type === "ThisExpression") {
                  if (firstArgument.property.name !== methodName) {
                    context.report({
                        node: firstArgument,
                        messageId: "ThisExpression",
                        fix(fixer) {
                          return fixer.replaceText(
                            firstArgument,
                            `this.${methodName}`
                          )
                        }
                    });
                  }
                } else {
                  if (firstArgument.type !=="ThisExpression") {
                    context.report({
                        node: firstArgument,
                        messageId: "ThisExpression",
                        fix(fixer) {
                          return fixer.insertTextBefore(
                            firstArgument,
                            `this.${methodName},`
                          )
                        }
                    });
                  } else {
                    context.report({
                        node: firstArgument,
                        messageId: "ThisExpression",
                        fix(fixer) {
                          return fixer.replaceText(
                            firstArgument,
                            `this.${methodName}`
                          )
                        }
                    });
                  }
                }
              });
            }
          }
        }
      }
    };
  },
};

// node_modules/.bin/eslint src/service/public-api/LoginService.ts