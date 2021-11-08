const { sdb } = require('./database')

function Vip(userId) {

    const VipObj = {
        DateNow: sdb.get(`Users.${userId}.Timeouts.Vip.DateNow`) || null,
        TimeRemaing: sdb.get(`Users.${userId}.Timeouts.Vip.TimeRemaing`) || 0,
    }

    const { DateNow, TimeRemaing } = VipObj

    return (DateNow !== null && TimeRemaing - (Date.now() - DateNow) > 0) ? true : False()


    function False() {

        if (DateNow)
            sdb.delete(`Users.${userId}.Timeouts.Vip`)

        return false
    }

}

module.exports = Vip