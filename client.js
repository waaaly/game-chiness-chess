
const sokcet = io("http://192.168.91.3:911")


function emit(type,data){
    sokcet.emit(type,data)
}

sokcet.on('login',data=>{
    console.log(data)
    player = data.player
    FEN = data.FEN
    IN_BOARD = data.IN_BOARD
    renderBoard(FEN)
})

sokcet.on('fen',data=>{
    console.log(data)
    FEN = data.FEN
    IN_BOARD = data.IN_BOARD
    renderBoard(FEN)
})

emit('login',{})