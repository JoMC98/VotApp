exports.generateListOptions = (codigo, opciones) => {
    var options = []
    for (var opt of opciones) {
        var a = [codigo, opt]
        options.push(a)
    }
    return options
}

exports.generateListParticipants = (codigo, participantes) => {
    var participants = []
    for (var dni of participantes) {
        var a = [dni, codigo]
        participants.push(a)
    }
    return participants
}