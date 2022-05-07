// import xlsx from 'node-xlsx';
// import dfd from "danfojs-node";

import lodash from 'lodash';
import util from 'util';

// const workSheetsFromFile = xlsx.parse(`./predsl_ranged_table_250418_adapt.xls`)[0].data;

const exampleLinks = [
    {name: 'Сп1', data: [1, 1, 1, 1]},
    {name: 'Сп2', data: [1, 0, 1, 1]},
    {name: 'Сп3', data: [0, 1, 1, 1]},
    {name: 'Сп4', data: [1, 1, 1, 1]},
    {name: 'Сп5', data: [1, 0, 1, 1]},
    {name: 'Сп6', data: [1, 1, 1, 1]},
    {name: 'Сп7', data: [1, 1, 1, 1]},
    {name: 'Сп8', data: [0, 0, 1, 1]},
    {name: 'Сп9', data: [0, 0, 1, 1]},
    {name: 'Сп10', data: [1, 0, 1, 1]},
    {name: 'Сп11', data: [1, 1, 1, 1]},
    {name: 'Сп12', data: [1, 1, 1, 1]},
    {name: 'Сп13', data: [0, 1, 0, 1]},
];

const groupsByData = lodash.groupBy(exampleLinks, 'data');

function contains(where, what){
    for(var i=0; i<what.length; i++){
        if(where.indexOf(what[i]) == -1) return false;
    }
    return true;
}

const groupsByDataWithLevel = [];
Object.values(groupsByData).forEach(group => {
    groupsByDataWithLevel.push({
            groups: group,
            level: group.length,
            elements: group[0].data
    })
})


console.log(util.inspect(groupsByDataWithLevel, {showHidden: false, depth: null, colors: true}))

// Функция проверяет, что A является подмножеством B
function checkSubset(A, B){
    return A.every((elementA, indexA) => {
        return (elementA | B[indexA]) == B[indexA];
    })
}

// console.log(checkSubset([1, 0, 0, 1], [1, 1, 0, 1]));

const minLevel = Math.min.apply(Math, groupsByDataWithLevel.map(function(o) { return o.level; }));
const maxLevel = Math.max.apply(Math, groupsByDataWithLevel.map(function(o) { return o.level; }));
console.log('minLevel: ' + minLevel);
console.log('maxLevel: ' + maxLevel);

const tree = [];

groupsByDataWithLevel.forEach(group => {
    if (group.level === minLevel) tree.push(group);
})

for(let currentLevel = minLevel + 1; currentLevel <= maxLevel; currentLevel++) {
    groupsByDataWithLevel.forEach(group => {
        if (group.level === minLevel) tree.push(group);
    })
}

console.log(tree);