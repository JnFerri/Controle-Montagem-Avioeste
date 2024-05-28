
/**
 * Tranforma uma data em String no formato 'ano-mes-diaThora:minutos:segundos+00:00'
 * @param {object} data Objeto de data , new Date()
 * @returns Data formatada como string.
 */
function tranformarDataEmString(data) {
    const ano = data.getFullYear();
    let mes = data.getMonth() + 1;
    let dia = data.getDate();
    let hora = data.getHours();
    let minuto = data.getMinutes();
    let segundo = data.getSeconds();

    // Adicionando zero à esquerda para manter o formato consistente
    if (mes < 10) {
        mes = '0' + mes;
    }
    if (dia < 10) {
        dia = '0' + dia;
    }
    if (hora < 10) {
        hora = '0' + hora;
    }
    if (minuto < 10) {
        minuto = '0' + minuto;
    }
    if (segundo < 10) {
        segundo = '0' + segundo;
    }

    const dataFormatada = `${ano}-${mes}-${dia}T${hora}:${minuto}:${segundo}+00:00`;
    return dataFormatada;
}

export default tranformarDataEmString