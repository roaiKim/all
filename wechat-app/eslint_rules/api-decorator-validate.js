module.exports = {
    meta: {
        type: "suggestion",
        messages: {
            avoidName: "Avoid using variables named '{{ name }}'",
        },
        docs: {
            description: "disallow unnecessary semicolons",
            category: "Possible Errors",
            recommended: true,
            url: "https://eslint.org/docs/rules/no-extra-semi",
        },
        fixable: "code",
        schema: [], // no options
    },
    create: function (context) {
        return {
            Identifier(node) {
                if (node.name) {
                    context.report({
                        node,
                        messageId: "avoidName",
                        data: {
                            name: "foo",
                        },
                    });
                }
            },
        };
    },
};
