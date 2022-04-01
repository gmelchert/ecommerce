function valueFormatter(value) {
    return value.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})
}

function valueParse(value, paramReplace) {
    const valueFormatted = value.replace(paramReplace, '').replace(',', '.').split('R$')
    return parseFloat(valueFormatted[1])
}

function base64(param) {
    const response = typeof param === 'object'
        ?  btoa(JSON.stringify(param))
        : JSON.parse(atob(param))
    return response
}

class DateFormatter {
    constructor(date) {
        this.data = _date(date)
        this.hora = _hour(date)
    }

    _date(date) {
        const data = date === '' ? new Date() : new Date(date)
        const mes = (data.getMonth() + 1) <= 9 ? '0'+(data.getMonth() + 1) : (data.getMonth() + 1)
        const dia = (data.getDate()) <= 9 ? '0'+(data.getDate()) : (data.getDate())
        const dataFormatada = ((dia )) + "/" + (mes) + "/" + data.getFullYear()
        return dataFormatada
    }

    _hour(date) {
        const data = date === '' ? new Date() : new Date(date)
        const horas = data.getHours() <= 9 ? '0'+data.getHours() : data.getHours()
        const minutos = data.getMinutes() <= 9 ? '0'+data.getMinutes() : data.getMinutes()
        const segundos = data.getSeconds() <= 9 ? '0'+data.getSeconds() : data.getSeconds()

        return horas + ":" + minutos + ":" + segundos
    }
}