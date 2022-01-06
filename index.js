
// king advisor bishop knight rook cannon pawn
const CHESS_RED_KING = 8;
const CHESS_RED_ADVISOR = 9;
const CHESS_RED_BISHOP = 10;
const CHESS_RED_KNIGHT = 11;
const CHESS_RED_ROOK = 12;
const CHESS_RED_CANNON = 13;
const CHESS_RED_PAWN = 14;

const CHESS_BLACK_KING = 16;
const CHESS_BLACK_ADVISOR = 17;
const CHESS_BLACK_BISHOP = 18;
const CHESS_BLACK_KNIGHT = 19;
const CHESS_BLACK_ROOK = 20;
const CHESS_BLACK_CANNON = 21;
const CHESS_BLACK_PAWN = 22;

const chessMap = new Map();
chessMap.set('k', CHESS_RED_KING)
chessMap.set('a', CHESS_RED_ADVISOR)
chessMap.set('b', CHESS_RED_BISHOP)
chessMap.set('n', CHESS_RED_KNIGHT)
chessMap.set('r', CHESS_RED_ROOK)
chessMap.set('c', CHESS_RED_CANNON)
chessMap.set('p', CHESS_RED_PAWN)
chessMap.set('K', CHESS_BLACK_KING)
chessMap.set('A', CHESS_BLACK_ADVISOR)
chessMap.set('B', CHESS_BLACK_BISHOP)
chessMap.set('N', CHESS_BLACK_KNIGHT)
chessMap.set('R', CHESS_BLACK_ROOK)
chessMap.set('C', CHESS_BLACK_CANNON)
chessMap.set('P', CHESS_BLACK_PAWN)

const chessImgArr = [];
chessImgArr[1] = 'oo.gif'
chessImgArr[CHESS_RED_KING] = 'rk.gif'
chessImgArr[CHESS_RED_ADVISOR] = 'ra.gif'
chessImgArr[CHESS_RED_BISHOP] = 'rb.gif'
chessImgArr[CHESS_RED_KNIGHT] = 'rn.gif'
chessImgArr[CHESS_RED_ROOK] = 'rr.gif'
chessImgArr[CHESS_RED_CANNON] = 'rc.gif'
chessImgArr[CHESS_RED_PAWN] = 'rp.gif'
chessImgArr[CHESS_BLACK_KING] = 'bk.gif'
chessImgArr[CHESS_BLACK_ADVISOR] = 'ba.gif'
chessImgArr[CHESS_BLACK_BISHOP] = 'bb.gif'
chessImgArr[CHESS_BLACK_KNIGHT] = 'bn.gif'
chessImgArr[CHESS_BLACK_ROOK] = 'br.gif'
chessImgArr[CHESS_BLACK_CANNON] = 'bc.gif'
chessImgArr[CHESS_BLACK_PAWN] = 'bp.gif'


//  将的规则,上右下左
const kingRule = [16, -1, 1, -16]
// 士的规则， 左上，右上，右下，左下
const advisorRule = [17, 15, -17, -15]
// 相的规则 左上，右上，右下，左下
const bishopRule = [-34, -30, 34, 30]
// 马的规则
const knightRule = [-33, -31, -18, 14, -14, 18, 31, 33]
// 范围
const redKingRang = [54, 55, 56, 70, 71, 72, 86, 87, 88]
const redAdvisorRang = [54, 55, 56, 70, 71, 72, 86, 87, 88]
const redBishopRang = [53, 57, 83, 87, 91, 117, 121]
const blackKingRang = [166, 167, 168, 182, 183, 198, 199, 200]
const blackAdvisorRang = [166, 167, 168, 182, 183, 198, 199, 200]
const blackBishopRang = [197, 201, 163, 167, 171, 133, 137]
// 象脚和马脚
const bishopPin = [-17, -30, 15, 17]
const knightPin = [-16, -16, -1, -1, 1, 1, 16, 16]
// 棋盘初始字符串
// var FEN = 'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR'


const chessBoardEl = document.getElementById('board')
// 当前路径
var wayArr = [];
// 上次点击棋子的id
var lastClickId = null;
var curClickId = null;



// for(let i = 0; i < 16; i ++){
//     console.log(IN_BOARD[16*i], IN_BOARD[16*i + 1],IN_BOARD[16*i+2],IN_BOARD[16*i+3],
//         IN_BOARD[16*i + 4],IN_BOARD[16*i+5],IN_BOARD[16*i+6],IN_BOARD[16*i+7],
//         IN_BOARD[16*i + 8],IN_BOARD[16*i+9],IN_BOARD[16*i+10],IN_BOARD[16*i+11],
//         IN_BOARD[16*i + 12],IN_BOARD[16*i+13],IN_BOARD[16*i+14],IN_BOARD[16*i+15],'\n')
// }

// 根据字符串渲染棋盘
function renderBoard(FEN) {
    fromFen(FEN)
    for (let r = 3; r < 13; r++) {
        for (let c = 3; c < 12; c++) {
            let id = r * 16 + c;
            if(player == 'red'){
                id = 254 - id
            }
            
            let child = renderChessImg(id, chessImgArr[IN_BOARD[id]], 57 * (r - 3), 57 * (c - 3));
            chessBoardEl.append(child)
        }
    }
}
// 渲染棋子图片
function renderChessImg(id, src, top, left) {
    let el = document.getElementById(id)
    let imgUrl = './images/' + src
    if(el){
        el.style.backgroundImage = `url(${imgUrl})`
    }else{
        el = document.createElement('div')
        el.id = id
        el.className = 'chess-img'
        el.style.backgroundImage = `url(${imgUrl})`
        el.style.top = (3 + top) + 'px'
        el.style.left = (4 + left) + 'px'
        el.onclick = onClickChess
    }
    
    return el
}
// 渲染选中框
function renderSelectedImg(id) {
    let el = document.getElementById(id).cloneNode(true)
    el.id = 'select'
    el.style.backgroundImage = 'url(./images/oos.gif)'
    chessBoardEl.appendChild(el)
}
// 清除上次选中
function clearPrveSelected() {
    let selectedEl = document.getElementById('select')
    if (selectedEl) {
        chessBoardEl.removeChild(selectedEl)
    }
}
// 渲染路径
function renderChessWay(wayArr) {
    wayArr.forEach(id => {
        let el = document.getElementById(id)
        let wayEl = document.createElement('div')
        wayEl.className = 'chess-way'
        wayEl.style.backgroundImage = 'url(./images/point.png)'
        el.appendChild(wayEl)
    });

}
// 清除路径
function clearChessWay() {
    wayArr.forEach(item => {
        let el = document.getElementById(item);
        el.removeChild(el.childNodes[0])
    })
    wayArr = []
}
// 渲染当前棋子路径
function renderCurChessWay(chess) {
    switch (chess) {
        case CHESS_BLACK_KING:
            console.log('黑将')
            wayArr = getWay(curClickId, kingRule)
            console.log(wayArr)
            wayArr = checkWayInBoard(wayArr)
            wayArr = checkWayInRang(blackKingRang, wayArr)
            console.log(wayArr)
            wayArr = checkWaySelfChess(curClickId, wayArr)
            console.log(wayArr)
            renderChessWay(wayArr)
            break;
        case CHESS_BLACK_ADVISOR:
            console.log('黑士')
            wayArr = getWay(curClickId, advisorRule)
            console.log(wayArr)
            wayArr = checkWayInBoard(wayArr)
            wayArr = checkWayInRang(blackAdvisorRang, wayArr)
            console.log(wayArr)
            wayArr = checkWaySelfChess(curClickId, wayArr)
            console.log(wayArr)
            renderChessWay(wayArr)
            break;
        case CHESS_BLACK_BISHOP:
            console.log('黑相')
            wayArr = getWay(curClickId, bishopRule)
            console.log(wayArr)
            wayArr = checkWayInPin(curClickId, bishopPin, wayArr)
            console.log(wayArr)
            wayArr = checkWayInBoard(wayArr)
            wayArr = checkWayInRang(blackBishopRang, wayArr)
            console.log(wayArr)
            wayArr = checkWaySelfChess(curClickId, wayArr)
            console.log(wayArr)
            renderChessWay(wayArr)
            break;
        case CHESS_BLACK_KNIGHT:
            console.log('黑马')
            wayArr = getWay(curClickId, knightRule)
            console.log(wayArr)
            wayArr = checkWayInPin(curClickId, knightPin, wayArr)
            console.log(wayArr)
            wayArr = checkWayInBoard(wayArr)
            console.log(wayArr)
            wayArr = checkWaySelfChess(curClickId, wayArr)
            console.log(wayArr)
            renderChessWay(wayArr)
            break;
        case CHESS_BLACK_ROOK:
            console.log('黑车')
            wayArr = getWayRook(curClickId)
            console.log(wayArr)
            renderChessWay(wayArr)
            break;
        case CHESS_BLACK_CANNON:
            console.log('黑炮')
            wayArr = getWayCannon(curClickId)
            console.log(wayArr)
            renderChessWay(wayArr)
            break;
        case CHESS_BLACK_PAWN:
            console.log('黑兵')
            wayArr = getWayPawn(curClickId)
            console.log(wayArr)
            wayArr = checkWayInBoard(wayArr)
            wayArr = checkWaySelfChess(curClickId, wayArr)
            renderChessWay(wayArr)
            break;
        case CHESS_RED_KING:
            console.log('红将')
            wayArr = getWay(curClickId, kingRule)
            console.log(wayArr)
            wayArr = checkWayInBoard(wayArr)
            wayArr = checkWayInRang(redKingRang, wayArr)
            console.log(wayArr)
            wayArr = checkWaySelfChess(curClickId, wayArr)
            console.log(wayArr)
            renderChessWay(wayArr)
            break;
        case CHESS_RED_ADVISOR:
            console.log('红士')
            wayArr = getWay(curClickId, advisorRule)
            console.log(wayArr)
            wayArr = checkWayInBoard(wayArr)
            wayArr = checkWayInRang(redAdvisorRang, wayArr)
            console.log(wayArr)
            wayArr = checkWaySelfChess(curClickId, wayArr)
            console.log(wayArr)
            renderChessWay(wayArr)
            break;
        case CHESS_RED_BISHOP:
            console.log('红相')
            wayArr = getWay(curClickId, bishopRule)
            console.log(wayArr)
            wayArr = checkWayInBoard(wayArr)
            wayArr = checkWayInRang(redBishopRang, wayArr)
            console.log(wayArr)
            wayArr = checkWaySelfChess(curClickId, wayArr)
            console.log(wayArr)
            renderChessWay(wayArr)
            break;
        case CHESS_RED_KNIGHT:
            console.log('红马')
            wayArr = getWay(curClickId, knightRule)
            console.log(wayArr)
            wayArr = checkWayInPin(curClickId, knightPin, wayArr)
            console.log(wayArr)
            wayArr = checkWayInBoard(wayArr)
            console.log(wayArr)
            wayArr = checkWaySelfChess(curClickId, wayArr)
            console.log(wayArr)
            renderChessWay(wayArr)
            break;
        case CHESS_RED_ROOK:
            console.log('红车')
            wayArr = getWayRook(curClickId)
            console.log(wayArr)
            renderChessWay(wayArr)
            break;
        case CHESS_RED_CANNON:
            console.log('红炮')
            wayArr = getWayCannon(curClickId)
            console.log(wayArr)
            renderChessWay(wayArr)
            break;
        case CHESS_RED_PAWN:
            console.log('红兵')
            wayArr = getWayPawn(curClickId)
            console.log(wayArr)
            wayArr = checkWayInBoard(wayArr)
            wayArr = checkWaySelfChess(curClickId, wayArr)
            renderChessWay(wayArr)
            break;
    }
}

// 🚩红棋
function isRedChess(chessNumber) {
    return (chessNumber & 8) == 8
}
// 🏴 黑棋
function isBlackChess(chessNumber) {
    return (chessNumber & 16) == 16
}
// 判断目标是不是己方棋子
function isSelfChess(id, target) {
    if (isRedChess(IN_BOARD[id])) {
        return isRedChess(IN_BOARD[target])
    } else {
        return isBlackChess(IN_BOARD[target])
    }
}
// 判断目标是不是敌方棋子
function isEnemyChess(id, target) {
    if (isRedChess(IN_BOARD[id])) {
        return isBlackChess(IN_BOARD[target])
    } else {
        return isRedChess(IN_BOARD[target])
    }
}
// 根据规则获取路径
function getWay(id, rule) {
    return rule.map(item => {
        return item + Number(id)
    })
}
// 根据row = id >> 4,col = id & 15，获取车路径
function getWayRook(id) {
    let arr = [], rId = Number(id) - 16
    //向上
    while (IN_BOARD[rId] !== 0) {
        if (IN_BOARD[rId] == 1 || isEnemyChess(id, rId)) {
            console.log(id, rId, isEnemyChess(id, rId))
            arr.push(rId)
        }

        if (IN_BOARD[rId] !== 1) {
            break;
        }
        rId = rId - 16
    }

    //向下
    rId = Number(id) + 16
    while (IN_BOARD[rId] !== 0) {
        if (IN_BOARD[rId] == 1 || isEnemyChess(id, rId)) {
            arr.push(rId)
        }

        if (IN_BOARD[rId] !== 1) {
            break;
        }
        rId = rId + 16
    }
    //向左
    rId = Number(id) - 1
    while (IN_BOARD[rId] !== 0) {
        if (IN_BOARD[rId] == 1 || isEnemyChess(id, rId)) {
            arr.push(rId)
        }

        if (IN_BOARD[rId] !== 1) {
            break;
        }
        rId = rId - 1
    }
    // 向右
    rId = Number(id) + 1
    while (IN_BOARD[rId] !== 0) {
        if (IN_BOARD[rId] == 1 || isEnemyChess(id, rId)) {
            arr.push(rId)
        }

        if (IN_BOARD[rId] !== 1) {
            break;
        }
        rId = rId + 1
    }
    return arr
}
function getWayCannon(id) {
    let arr = [], rId = Number(id) - 16
    //向上
    while (IN_BOARD[rId] !== 0) {
        if (IN_BOARD[rId] == 1) {
            arr.push(rId)
        }
        // 碰到山
        if (IN_BOARD[rId] !== 1) {
            // 找到山之后的第一枚敌方棋子
            rId = rId - 16
            while (IN_BOARD[rId] !== 0) {
                if (isEnemyChess(id, rId)) {
                    arr.push(rId);
                    break;
                }
                if (isSelfChess(id, rId)) {
                    break;
                }
                rId = rId - 16
            }
            break;
        }
        rId = rId - 16
    }

    //向下
    rId = Number(id) + 16
    while (IN_BOARD[rId] !== 0) {
        if (IN_BOARD[rId] == 1) {
            arr.push(rId)
        }

        if (IN_BOARD[rId] !== 1) {
            // 找到山之后的第一枚敌方棋子
            rId = rId + 16
            while (IN_BOARD[rId] !== 0) {
                if (isEnemyChess(id, rId)) {
                    arr.push(rId)
                    break;
                }
                if (isSelfChess(id, rId)) {
                    break;
                }
                rId = rId + 16
            }
            break;
        }
        rId = rId + 16
    }
    //向左
    rId = Number(id) - 1
    while (IN_BOARD[rId] !== 0) {
        if (IN_BOARD[rId] == 1) {
            arr.push(rId)
        }

        if (IN_BOARD[rId] !== 1) {
            // 找到山之后的第一枚敌方棋子
            rId = rId - 1
            while (IN_BOARD[rId] !== 0) {
                if (isEnemyChess(id, rId)) {
                    arr.push(rId)
                    break;
                }
                if (isSelfChess(id, rId)) {
                    break;
                }
                rId = rId - 1
            }
            break;
        }
        rId = rId - 1
    }
    // 向右
    rId = Number(id) + 1
    while (IN_BOARD[rId] !== 0) {
        if (IN_BOARD[rId] == 1) {
            arr.push(rId)
        }

        if (IN_BOARD[rId] !== 1) {
            // 找到山之后的第一枚敌方棋子
            rId = rId + 1
            while (IN_BOARD[rId] !== 0) {
                if (isEnemyChess(id, rId)) {
                    arr.push(rId)
                    
                }
                if (isSelfChess(id, rId)) {
                    break;
                }
                rId = rId + 1
            }
            break;
        }
        rId = rId + 1
    }
    return arr
}
function getWayPawn(id) {
    if (isRedChess(IN_BOARD[id])) {
        if (id >= 131) {
            return [16, 1, -1].map(item => {
                return Number(id) + item
            })
        } else {
            return [Number(id) + (16)]
        }
    }
    if (isBlackChess(IN_BOARD[id])) {
        if (id <= 131) {
            return [-16, 1, -1].map(item => {
                return Number(id) + item
            })
        } else {
            return [Number(id) + (-16)]
        }
    }
}
// 判断是否在棋盘中
function checkWayInBoard(way) {
    return way.filter(item => {
        if (IN_BOARD[item] !== 0) {
            return true
        }
    })
}
// 判断是否在范围中
function checkWayInRang(rang, way) {
    return way.filter(item => {
        if (rang.indexOf(item) !== -1) {
            return true
        }
    })
}
// 判断是否卡脚
function checkWayInPin(id, pin, way) {
    return way.filter((item, index) => {
        if (IN_BOARD[Number(id) + Number(pin[index])] == 1) {
            return item
        }
    })
}
// 判断路径是否有己方棋子
function checkWaySelfChess(id, way) {
    let arr = []
    if (isRedChess(IN_BOARD[id])) {
        arr = way.filter(item => {
            if (!isRedChess(IN_BOARD[item])) {
                return true
            }
        })
    }
    if (isBlackChess(IN_BOARD[id])) {
        arr = way.filter(item => {
            if (!isBlackChess(IN_BOARD[item])) {
                return true
            }
        })
    }
    return arr
}
// 从map中根据value获取key
function getChessKey(chessNumber) {
    let key = null
    chessMap.forEach((v, k) => {
        if (v == chessNumber) {
            key = k
        }
    })
    return key
}
// 从FEN字符串转换成一维数组
function fromFen(str) {
    var len = 0, row = 3, col = 3, char = str[len];
    while (char != undefined) {
        if (char == '/') {
            row += 1
            col = 3
        } else if (char >= 0 && char <= 9) {
            for(let i = 0; i < char; i++){
                IN_BOARD[row * 16 + col] = 1
            }
            col += Number(char)
            if (col > 12) {
                col = 3
            }
        } else if (char >= 'a' && char <= 'z') {
            IN_BOARD[row * 16 + col] = chessMap.get(char)
            col += 1
        } else if (char >= 'A' && char <= 'Z') {
            IN_BOARD[row * 16 + col] = chessMap.get(char)
            col += 1
        }
        char = str[++len]
    }
}
// 从棋盘获取FEN字符串
function fromBoard() {
    let FEN = '', count = 0;
    for (let r = 3; r < 13; r++) {
        for (let c = 3; c < 12; c++) {
            let cNum = r * 16 + c;
            if (IN_BOARD[cNum] == 1) {
                count += 1
            } else {
                if (count > 0) {
                    FEN += count
                    count = 0
                }
                FEN += getChessKey(IN_BOARD[cNum])
            }
        }
        if (count > 0) {
            FEN += count
            count = 0
        }
        FEN += '/'
    }
    return FEN.substr(0, FEN.length - 1)
}

function onClickChess(e) {
    let id = 0;
    if (e.target.id == '') {
        id = e.path[1].id
    } else {
        id = e.target.id
    }
    if (!lastClickId && !curClickId) {
        lastClickId = id
        curClickId = id
    } else {
        lastClickId = curClickId
        curClickId = id
    }

    clearPrveSelected()
    console.log(curClickId, id, IN_BOARD[curClickId])
    if (IN_BOARD[curClickId] != 1) {
        renderSelectedImg(curClickId)
    }

    if (wayArr.length != 0) {
        console.log(lastClickId, curClickId, wayArr)
        // 走棋
        if (wayArr.indexOf(Number(curClickId)) !== -1) {
            if (isEnemyChess(lastClickId, curClickId)) {
                IN_BOARD[curClickId] = IN_BOARD[lastClickId]
                IN_BOARD[lastClickId] = 1
            } else {
                let temp = IN_BOARD[lastClickId]
                IN_BOARD[lastClickId] = IN_BOARD[curClickId]
                IN_BOARD[curClickId] = temp
            }
            curClickId = null;
            lastClickId = null;
            clearChessWay()
            let fen = fromBoard()
            renderBoard(fen)
            emit('fen',{FEN:fromBoard()})
            return
        } else {
            lastClickId = null;
            clearChessWay()
            // 路径渲染
            renderCurChessWay(IN_BOARD[curClickId])
            curClickId = null;
            return
        }
    }
    renderCurChessWay(IN_BOARD[curClickId])
}

