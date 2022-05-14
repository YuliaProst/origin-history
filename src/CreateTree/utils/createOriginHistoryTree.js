import lodash from "lodash";

export const createOriginHistory = (links) => {
  const groupsByData = lodash.groupBy(links, "data");

  let groupsByDataWithLevel = [];
  // составление групп вариантов
  Object.values(groupsByData).forEach((group, groupIndex) => {
    groupsByDataWithLevel.push({
      groups: group.map((item) => item.name),
      level: group.length,
      id: String(groupIndex),
      elements: group[0].data,
    });
  });

  // Функция проверяет, что A является подмножеством B
  function checkSubset(A, B) {
    return A.every((elementA, indexA) => {
      return (elementA | B[indexA]) == B[indexA];
    });
  }

  // минимальный уровень
  const minLevel = Math.min.apply(
    Math,
    groupsByDataWithLevel.map(function (o) {
      return o.level;
    })
  );

  // макс уровень
  const maxLevel = Math.max.apply(
    Math,
    groupsByDataWithLevel.map(function (o) {
      return o.level;
    })
  );

//   console.log("minLevel: ", minLevel);
//   console.log("maxLevel: ", maxLevel);

//   console.log("\n\ngroupWithSubset: ");

  // запускаем цикл от мин уровня до макс уровня
  for (let currentLevel = minLevel; currentLevel <= maxLevel; currentLevel++) {

    // выделяем группы с текущим уровнем в один массив
    const currentLevelGroups = groupsByDataWithLevel.filter(
      (currentLevelGroupsItem) => currentLevelGroupsItem.level === currentLevel
    );

    // запускаем цикл по текущему уровню
    currentLevelGroups.forEach(
      (currentGroup, indexCurrentGroup, arrCurrentGroup) => {
        // запускаем цикл по уровню на один больше чем текущий
        for (
          let upperLevel = currentLevel + 1;
          upperLevel <= maxLevel;
          upperLevel++
        ) {

          // выделяем группу для верхнего уровня
          const upperLevelGroups = groupsByDataWithLevel.filter(
            (upperLevelGroupsItem) => upperLevelGroupsItem.level === upperLevel
          );

          // запускаем цикл по группам верхнего уровня
          upperLevelGroups.forEach((upperLevelGroupsItem) => {
            // проверяем, является ли текущая группа подмножеством группы верхнего уровня
            const isSubset = checkSubset(
              currentGroup.elements,
              upperLevelGroupsItem.elements
            );

            // проверяем является ли текущая группа родителем для уже другой верхней группы
            const notParentOnCurrentLevel = currentLevelGroups.every(
              (currentLevelGroupsItem) =>
                currentLevelGroupsItem.parentId !== upperLevelGroupsItem.id
            );

            // если удовл. всем условиям, то текущей группе присваиваем parentId  верхней группы
            if (isSubset && notParentOnCurrentLevel && !currentGroup.parentId) {
              const findedIndex = groupsByDataWithLevel.findIndex(
                (findIndexItem) => findIndexItem.id === currentGroup.id
              );
              groupsByDataWithLevel[findedIndex].parentId =
                upperLevelGroupsItem.id;
            }
          });
        }
      }
    );
  }

  // функция для составления дерева по полям parentId
  function buildTree(array) {
    // Складываем все элементы будущего дерева в мап под id-ключами
    // Так легче делать поиск родительской ноды
    const map = new Map(groupsByDataWithLevel.map((item) => [item.id, item]));

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
      parentId.children = [...(parentId.children || []), item];
    }

    // Возвращаем верхний уровень дерева. Все дочерние узлы уже есть в нужных родительских нодах
    return [...map.values()].filter((item) => !item.parentId);
  }

  // составляем дерево
  const tree = buildTree(groupsByDataWithLevel);

  return tree;
};
