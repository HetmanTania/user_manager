function sortUser(users, nameKey, isReverse) {
    if(!isReverse) {
        return sort(users, nameKey);
    }
    else {
        return sortReverse(users, nameKey);
    }
}

function sort(users, nameKey) {
    return users.sort((firstValue, secondValue) => {
        if (firstValue[nameKey] < secondValue[nameKey]) {
            return -1;
        }
        if (firstValue[nameKey] > secondValue[nameKey]) {
            return 1;
        }
        return 0;
    });
}

function sortReverse(users, nameKey) {
    return users.sort((firstValue, secondValue) => {
        if (firstValue[nameKey] > secondValue[nameKey]) {
            return -1;
        }
        if (firstValue[nameKey] < secondValue[nameKey]) {
            return 1;
        }
        return 0;
    });
}

export { sortUser }