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

console.log('minLevel: ', minLevel);
console.log('maxLevel: ', maxLevel);



console.log('\n\ngroupWithSubset: ');

for(let currentLevel = minLevel; currentLevel <= maxLevel; currentLevel++) {
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


// console.log(groupsByDataWithLevel);

function buildTree (array) {
    // Складываем все элементы будущего дерева в мап под id-ключами
    // Так легче делать поиск родительской ноды
    const map = new Map(groupsByDataWithLevel.map(item => [item.id, item]));
    
    // Обход в цикле по значениям, хранящимся в мапе
    for (let item of map.values()) {
      
      // Проверка, является ли нода дочерней (при parent === null вернет undefined)
      if (!map.has(item.parentId)) {
        continue;
      }
      
      // Сохраняем прямую ссылку на родительскую ноду, чтобы дважды не доставать из мапа
      const parentId = map.get(item.parentId);
  
      // Добавляем поточную ноду в список дочерних нод родительчкого узла.
      // Здесь сокращено записана проверка на то, есть ли у ноды свойство children.
      parentId.children = [...parentId.children || [], item];
    }
  
    // Возвращаем верхний уровень дерева. Все дочерние узлы уже есть в нужных родительских нодах
    return [...map.values()].filter(item => !item.parentId);
}
  
const tree = buildTree(groupsByDataWithLevel);
console.log(util.inspect(tree, {showHidden: false, depth: null, colors: true}))
