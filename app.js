// import xlsx from 'node-xlsx';
// import dfd from "danfojs-node";

import lodash from 'lodash';
import util from 'util';

// const workSheetsFromFile = xlsx.parse(`./predsl_ranged_table_250418_adapt.xls`)[0].data;

console.log('\n\n\n');

const exampleLinks = [
    {name: 'Сп1', data: [0, 0, 0, 0, 1]},
    {name: 'Сп2', data: [0, 0, 0, 1, 0]},
    {name: 'Сп3', data: [0, 0, 1, 0, 0]},
    {name: 'Сп4', data: [0, 1, 0, 0, 0]},
    {name: 'Сп5', data: [0, 0, 0, 1, 1]},
    {name: 'Сп6', data: [0, 0, 0, 1, 1]},
    {name: 'Сп7', data: [0, 0, 1, 1, 0]},
    {name: 'Сп8', data: [0, 0, 1, 1, 0]},
    {name: 'Сп9', data: [0, 1, 1, 1, 1]},
    {name: 'Сп10', data: [0, 1, 1, 1, 1]},
    {name: 'Сп11', data: [0, 1, 1, 1, 1]},
    {name: 'Сп12', data: [0, 1, 1, 1, 1]},
    {name: 'Сп13', data: [0, 1, 1, 1, 1]},
    {name: 'Сп14', data: [0, 1, 0, 1, 1]},
    {name: 'Сп15', data: [0, 1, 0, 1, 1]},
    {name: 'Сп16', data: [0, 1, 0, 1, 1]},
];

const groupsByData = lodash.groupBy(exampleLinks, 'data');

let groupsByDataWithLevel = [];
Object.values(groupsByData).forEach((group, groupIndex) => {
    groupsByDataWithLevel.push({
            groups: group.map(item => item.name),
            level: group.length,
            id: groupIndex,
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


let tree = [];

console.log('minLevel: ', minLevel);
console.log('maxLevel: ', maxLevel);

let treeWithMin = [];

// console.log('treeWithMin: ', treeWithMin);

console.log('\n\ngroupWithSubset: ');

for(let currentLevel = minLevel; currentLevel <= maxLevel; currentLevel++) {
        //console.log(util.inspect(arr, {showHidden: false, depth: null, colors: true}))

        const currentLevelGroups = groupsByDataWithLevel.filter(currentLevelGroupsItem => currentLevelGroupsItem.level === currentLevel);
        
        currentLevelGroups.forEach((currentGroup, indexCurrentGroup, arrCurrentGroup) => {
            for(let upperLevel = currentLevel + 1; upperLevel <= maxLevel; upperLevel++){
                const upperLevelGroups = groupsByDataWithLevel.filter(upperLevelGroupsItem => upperLevelGroupsItem.level === upperLevel);
                        
                upperLevelGroups.forEach(upperLevelGroupsItem => {
                    const isSubset = checkSubset(currentGroup.elements, upperLevelGroupsItem.elements);
                    const notParentOnCurrentLevel = currentLevelGroups.every(currentLevelGroupsItem => currentLevelGroupsItem.parentId !== upperLevelGroupsItem.id)
                    if (
                        isSubset
                        && notParentOnCurrentLevel
                        && !currentGroup.parentId
                    ){
                        const findedIndex = groupsByDataWithLevel.findIndex(findIndexItem => findIndexItem.id === currentGroup.id);
                        groupsByDataWithLevel[findedIndex].parentId = upperLevelGroupsItem.id;
                    }
                })
            }
        })
    
}

console.log(groupsByDataWithLevel);


// for(let currentLevel = minLevel + 1; currentLevel <= maxLevel; currentLevel++) {
//     treeWithMin.forEach((treeItem, indexTreeItem) => {
//         groupsByDataWithLevel.forEach(group => {
//             if (
//                 currentLevel === group.level 
//                 && checkSubset(treeItem.elements, group.elements) 
//                 && !treeItem.locked
//             ) {
//                 // treeWithMin.some(treeWithMinItem => {
//                 //     treeWithMinItem.level})
//                 if (!treeWithMin.find(item => item.id === group.id)){
//                     treeWithMin.push(group);
//                 }
//                 // Если уже есть элемент с таким group.id, то переходим на след уровень
//                 for(let searchLevel = currentLevel - 1; searchLevel <= maxLevel; searchLevel++) {
//                     console.log('searchLevel: ', searchLevel);
//                     console.log(treeWithMin.some(treeWithMinItem => treeWithMinItem.level === searchLevel && treeWithMinItem.parentId === group.id));
//                     if (!treeWithMin.some(treeWithMinItem => treeWithMinItem.level === searchLevel && treeWithMinItem.parentId === group.id)){
//                         treeWithMin[indexTreeItem].parentId = group.id;
//                         treeWithMin[indexTreeItem].locked = true;
//                     }
//                 }
                
//                 //console.log(util.inspect(group, {showHidden: false, depth: null, colors: true}))
//             }
//         })
//     })
// }
