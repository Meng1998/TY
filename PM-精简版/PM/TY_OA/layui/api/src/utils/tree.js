"use strict";

/**
 * 树形节点操作
 */
(function () {

    /**
     * 子节点设置
     * @param {object} node 父节点
     * @param {object} newChildren 子节点
     */
    const nodeChildren = function (node, newChildren) {
        if (!node) {
            return null;
        }
        var key = "children";
        if (typeof newChildren !== 'undefined') {
            node[key] = newChildren;
        }
        return node[key];
    }

    /**
     * 子节点统计
     * @param {array} node 节点集合
     * @param {number} num 数量
     */
    const statisticsChildren = function (node, field, num) {
        var number = 0;
        if (node.children) {
            for (var i = 0; i < node.children.length; i++) {
                const childNode = node.children[i];
                if (childNode.node_type !== field) {
                    number++;
                } else {
                    number += statisticsChildren(childNode, field, num);
                }
            }
            if (!node.total) {
                node.total = 0;
            }
            node.total += number;
        } else {
            if (node.node_type === field) {
                node.total = "0";
            }
        }
        return number;
    }

    /**
     * 将数组转为树形结构对象
     * @param {array} nodes 节点数据
     * @param {string} parentKey 父节点关键字
     * @param {boolean} statistics 统计数量
     * @param {string} group_field 分组字段
     */
    module.exports = function (nodes, parentKey = "pid", statistics = false, group_field) {
        if (typeof parentKey === "boolean") {
            group_field = statistics;
            statistics = parentKey;
            parentKey = "pid";
        }

        var key = "id";
        var r = [];
        var tmpMap = {};
        for (var i = 0, l = nodes.length; i < l; i++) {
            tmpMap[nodes[i][key]] = nodes[i];
        }
        for (var i = 0, l = nodes.length; i < l; i++) {
            var p = tmpMap[nodes[i][parentKey]];
            if (p && nodes[i][key] != nodes[i][parentKey]) {
                var children = nodeChildren(p);
                if (!children) {
                    children = nodeChildren(p, []);
                }
                children.push(nodes[i]);
            } else {
                r.push(nodes[i]);
            }
        }

        if (typeof parentKey === "boolean") {
            group_field = statistics;
            statistics = parentKey
        }
        if (statistics) {
            for (var i = 0; i < r.length; i++) {
                var item = r[i];
                var total = statisticsChildren(item, group_field);
                item.total = total;
            }
        }

        return r;
    }
})();