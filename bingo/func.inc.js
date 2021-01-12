function redraw() {
    getTable();
    getTableList();
    getPot();
}

// BINGO TABLE

function getTable() {
    let tableNum = document.getElementById('table-number').value;
    let nums = getNums(tableNum);
    let bingo = document.getElementById('bingo');
    let table = '<table id="bingo-table" class="pure-table pure-u-4-5">';
    let potNums = getPotNums();

    for (let i = 0; i < 25; i++) {
        let checked = '';

        if (potNums.includes(nums[i]) || 12 === i) {
            checked = 'num-matched';
        }

        if (0 === i % 5) {
            table += '<tr id="row-' + parseInt(i/5) + '">';
        }

        table += '<td id="col-' + (i % 5) + '" class="' + checked + '">';

        if (12 === i) {
            table += '<input id="num-12" disabled="disabled" value="FREE"></input>';
        } else {
            table += '<input id="num-' + i + '" type="number" min="0" value="' + nums[i] + '" class="' + checked + '" onclick="this.select()" />';
        }
        table += '</td>';

        if (4 === i % 5) {
            table += '</tr>';
        }
    }

    table += '</table>';

    bingo.innerHTML = table;
}

function setTable() {
    let tableNum = document.getElementById('table-number').value;
    let table = document.getElementById('bingo-table');

    if (!table) {
        return;
    }

    let nums = [];

    for (i = 0; i < 25; i++) {
        if (12 === i) {
            continue;
        }

        nums[i] = document.getElementById('num-' + i).value;
    }

    setNums(tableNum, nums)
}

function getNums(tableNum) {
    let ret = localStorage.getItem('table-' + tableNum);

    if (!ret) {
        ret = new Array(25).fill(0);
    } else {
        ret = JSON.parse(ret);
    }

    return ret;
}

function setNums(tableNum, nums) {
    addSavedTables(tableNum);

    localStorage.setItem('table-' + tableNum, JSON.stringify(nums));

    redraw();
}


// SAVED TABLES

function setTableNumber(tableNum) {
    document.getElementById('table-number').value = tableNum;
    redraw();
}

function getTableList() {
    let tables = document.getElementById('table-list');
    let savedTables = getSavedTables();
    let list = 'Tables:<br />';

    for (i = 0; i < savedTables.length; i++) {
        list += '<button onclick="setTableNumber(' + savedTables[i] + ')" class="pure-button button-secondary">';
        list += savedTables[i] + ' (' + checkMatchByTable(savedTables[i]) + ')';
        list += '</button>';
    }

    tables.innerHTML = list;
}

function getSavedTables() {
    let savedTables = localStorage.getItem('saved-tables');

    if (!savedTables) {
        savedTables = [];
    } else {
        savedTables = JSON.parse(savedTables);
    }

    return savedTables;
}

function addSavedTables(tableNum) {
    let savedTables = getSavedTables();

    savedTables.push(tableNum);
    savedTables = savedTables.filter(function(elem, pos, potNums) {
        return savedTables.indexOf(elem) == pos;
    });

    localStorage.setItem('saved-tables', JSON.stringify(savedTables));
}


// POT

function getPot() {
    let pot = document.getElementById('pot');
    let potNums = getPotNums();
    let list = '<ul>';

    for (i = 0; i < potNums.length; i++) {
        list += '<li>' + potNums[i] + '</li>';
    }

    list += '</ul>';

    pot.innerHTML = list;
}

function getPotNums() {
    let potNums = localStorage.getItem('pot');

    if (!potNums) {
        potNums = [];
    } else {
        potNums = JSON.parse(potNums);
    }

    return potNums;
}

function setPotNums(potNums) {
    potNums = potNums.filter(function(elem, pos, potNums) {
        return potNums.indexOf(elem) == pos;
    });

    return localStorage.setItem('pot', JSON.stringify(potNums));
}

function addPotNum() {
    let num = document.getElementById('pot-number').value;
    let potNums = getPotNums();

    potNums.push(num);

    setPotNums(potNums);
    redraw();
}

function removePotNum() {
    let num = document.getElementById('pot-number').value;
    let potNums = localStorage.getItem('pot');

    if (!potNums) {
        potNums = [];
    } else {
        potNums = JSON.parse(potNums);
    }

    potNums = potNums.filter(function(ele){ 
            return ele != num;
    });

    setPotNums(potNums);
    redraw();
}


// CHECK MATCH

function checkMatchByTable(tableNum) {
    let isCurrent = (tableNum === document.getElementById('table-number').value)? true:false;
    let nums = getNums(tableNum);
    let potNums = getPotNums();
    let matchedNums = Array(25).fill(0);
    let links = 0;

    for (let i = 0; i < 25; i++) {
        if (potNums.includes(nums[i])) {
            matchedNums[i] = 1;
        }
    }
    matchedNums[12] = 1;

    // check row
    for (let i = 0; i < 25; i += 5) {
        let rowSum = [
            matchedNums[i],
            matchedNums[i+1],
            matchedNums[i+2],
            matchedNums[i+3],
            matchedNums[i+4],
        ].reduce(function (a, b) {
            return a + b;
        });

        if (5 === rowSum) {
            links++;

            if (isCurrent) {
                document.getElementById('num-' + i).className += ' bingo';
                document.getElementById('num-' + (i + 1)).className += ' bingo';
                document.getElementById('num-' + (i + 2)).className += ' bingo';
                document.getElementById('num-' + (i + 3)).className += ' bingo';
                document.getElementById('num-' + (i + 4)).className += ' bingo';
            }
        }
    }

    // check column
    for (let i = 0; i < 5; i += 1) {
        let rowSum = [
            matchedNums[i],
            matchedNums[i+5],
            matchedNums[i+10],
            matchedNums[i+15],
            matchedNums[i+20],
        ].reduce(function (a, b) {
            return a + b;
        });

        if (5 === rowSum) {
            links++;

            if (isCurrent) {
                document.getElementById('num-' + i).className += ' bingo';
                document.getElementById('num-' + (i + 5)).className += ' bingo';
                document.getElementById('num-' + (i + 10)).className += ' bingo';
                document.getElementById('num-' + (i + 15)).className += ' bingo';
                document.getElementById('num-' + (i + 20)).className += ' bingo';
            }
        }
    }

    // cross
    let crossSum = [
        matchedNums[0],
        matchedNums[6],
        matchedNums[12],
        matchedNums[18],
        matchedNums[24],
    ].reduce(function (a, b) {
        return a + b;
    });

    if (5 === crossSum) {
        links++;

        if (isCurrent) {
            document.getElementById('num-0').className += ' bingo';
            document.getElementById('num-6').className += ' bingo';
            document.getElementById('num-12').className += ' bingo';
            document.getElementById('num-18').className += ' bingo';
            document.getElementById('num-24').className += ' bingo';
        }
    }

    let backCrossSum = [
        matchedNums[4],
        matchedNums[8],
        matchedNums[12],
        matchedNums[16],
        matchedNums[20],
    ].reduce(function (a, b) {
        return a + b;
    });

    if (5 === backCrossSum) {
        links++;

        if (isCurrent) {
            document.getElementById('num-4').className += ' bingo';
            document.getElementById('num-8').className += ' bingo';
            document.getElementById('num-12').className += ' bingo';
            document.getElementById('num-16').className += ' bingo';
            document.getElementById('num-20').className += ' bingo';
        }
    }

    return links;
}
