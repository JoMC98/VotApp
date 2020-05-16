exports.checkParticipants = async (db, participants) => {
    return await new Promise((resolve, reject) => {
        var errors = {}

        var part = checkNumberParticipantes(participants, errors)

        if (Object.keys(errors).length == 0) {
            checkDuplicatedParticipants(part, errors)
            if (Object.keys(errors).length == 0) {
                checkValidParticipants(db, part).then(() => {
                    resolve(part)
                }).catch(() => {
                    errors["participants"] = "notValid"
                    reject(errors)
                })
            } else {
                reject(errors)
            }
        } else {
            reject(errors)
        }
    })
}

function checkNumberParticipantes(participants, errors) {
    var part = []
    for (var p of participants) {
      if (p != "") {
        part.push(p)
      }
    }
    if (part.length > 6) {
        errors["participants"] = "maximum"
    } else if (part.length >= 3) {
        return part
    } else {
        errors["participants"] = "required"
    }
}

function checkDuplicatedParticipants(participants, errors) {
    var part = []
    for (var p of participants) {
        if (part.includes(p)) {
            errors["participants"] = "duplicated"
        } 
        else {
            part.push(p)
        }
    }
}

async function checkValidParticipants(db, participants) {
    return await new Promise((resolve, reject) => {
        db.query(
            'SELECT COUNT(*) AS total FROM Usuario JOIN Votante USING(DNI) WHERE DNI IN (?)', [participants], (error, result) => {
                if (error) {
                    reject(false)
                } else {
                    if (result[0].total == participants.length) {
                        resolve(true) 
                    } else {
                        reject(false)
                    }
                }
        })
    })
}