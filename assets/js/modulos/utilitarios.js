const isEmpty = (valor) => {
  if(typeof valor == 'string'){
    return valor == undefined || valor == null || valor.length <= 0;
  }else if(Array.isArray(valor)){
    return valor.length <= 0;
  }else if(typeof valor == 'object'){
    return Object.keys(valor).length <= 0;
  }else{
    return valor == undefined || valor == null
  }
}

const capitalize = (valor) => {
  return valor.charAt(0).toUpperCase() + valor.substr(1, valor.length);
}

const atualizarDatas = () => {
  const dataAtual = new Date();
  document.querySelectorAll("[data-ano-atual]").forEach(area => {
    area.textContent = `${dataAtual.getFullYear()}`;
  })
} 

const controleFechamentoModal = () => {
  const modais = document.querySelectorAll('.modal');
  modais.forEach(modal => {
    const btnFecha = modal.querySelector('[data-modal-fecha]');
    btnFecha.addEventListener('click', () => {
      $('#' + modal.id).modal('hide');
    })
  })
}

function sanitizarString(string){
  if(typeof string == 'string'){
    const substituir = [
      {
        original: '-',
        subst: ''
      },
      {
        original: '(',
        subst: ''
      },
      {
        original: ')',
        subst: ''
      },
      {
        original: ' ',
        subst: ''
      },
    ]

    substituir.forEach(substituicao => {
      string = string.replace(substituicao.original, substituicao.subst)
    })

    return string.trim();
  }else{
    console.log('O tipo do parâmetro passado não é uma string.');
    return null;
  }
}

function tooltips(){
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })
}

function popovers(){
  $(document).ready(function(){
    $('[data-bs-toggle="popover"]').popover();  
  });
}

async function SwalAlert(tipo, {icon, title, comp, confirmacao}){
  tipo = tipo.toLowerCase().trim();

  // comp: text, mensagem, timer
  // confirmacao: label, showCancelButton, focusCancel

  switch(tipo){
    case 'confirmacao':
      const dialog = await Swal.fire({
        icon: icon,
        title: title,
        text: text,
        showCancelButton: confirmacao.showCancelButton,
        confirmButtonText: confirmacao.label,
        focusCancel: confirmacao.focusCancel,
        timer: comp.timer
      })
  
      return new Promise((resolve, reject) => {
        resolve({confirmed: dialog.isConfirmed});
      });
    break;
  
    case 'aviso':  
    case 'error':
    default:
      Swal.fire({
        icon: icon,
        title: title,
        text: comp.text,
        footer: comp.mensagem,
        timer: comp.timer
      }) 
    break;
  }
}

function resizeTextArea(textarea){
  // Créditos https://www.instagram.com/reel/CrdgXF3AECg/
  const initialHeight = parseInt(getComputedStyle(textarea).getPropertyValue('height'));
  textarea.addEventListener('input', () => {
    textarea.style.height = `${initialHeight}px`;
    const scrollHeight = textarea.scrollHeight;
    const newHeight = textarea.scrollHeight - initialHeight;
    textarea.style.height = `${newHeight < scrollHeight ? scrollHeight : newHeight}px`;
  });
}

const copiar = async (valor) => {
  await navigator.clipboard.writeText(valor);
}

function verificarCPF(cpf){
  cpf = cpf.replace(/\D/g, '');

  switch (cpf){
    case '00000000000':
    resultado = false
    break;
    case '11111111111':
    resultado = false
    break;
    case '22222222222':
    resultado = false
    break;
    case '33333333333':
    resultado = false
    break;
    case '44444444444':
    resultado = false
    break;
    case '55555555555':
    resultado = false
    break;
    case '66666666666':
    resultado = false
    break;
    case '77777777777':
    resultado = false
    break;
    case '88888888888':
    resultado = false
    break;
    case '99999999999':
    resultado = false
    break;
    default: 
    if(cpf.toString().length != 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    var resultado = true;
    [9,10].forEach(function(j){
      var soma = 0, r;
      cpf.split(/(?=)/).splice(0,j).forEach(function(e, i){
        soma += parseInt(e) * ((j+2)-(i+1));
      });
      r = soma % 11;
      r = (r <2)?0:11-r;
      if(r != cpf.substring(j, j+1)) resultado = false;
    });
  }
  
  return resultado;
}

function zeroEsquerda(quantidadeZeros, valor){
  let zeros;
  
  for(let i = 0; i < quantidadeZeros; i++){
    zeros == null ? zeros = "0" : zeros = zeros + "0";
  }
  return (zeros + valor).slice(-quantidadeZeros);
}

function desanitizarStringURL(string){
  if(!isEmpty(string)){
    return string.replaceAll('-', ' ').replaceAll('%20', ' ');
  }else{
    return '';
  }
}

function sanitizarStringParaURL(string){
  if(!isEmpty(string)){
    return string.trim().toLowerCase().replaceAll(' ', '-');
  }else{
    return '';
  }
}

const converterParaMesBRL = (numero) => {
  try{
    numero = parseInt(numero);
    if(typeof numero == 'number'){
      let mes = null;
      switch (numero + 1){
        case 1: mes = 'janeiro'; break;
        case 2: mes = 'fevereiro'; break;
        case 3: mes = 'março'; break;
        case 4: mes = 'abril'; break;
        case 5: mes = 'maio'; break;
        case 6: mes = 'junho'; break;
        case 7: mes = 'julho'; break;
        case 8: mes = 'agosto'; break;
        case 9: mes = 'setembro'; break;
        case 10: mes = 'outubro'; break;
        case 11: mes = 'novembro'; break;
        case 12: mes = 'dezembro'; break;
        default: mes = 'janeiro'; break;
      }
    
      return mes;
    }else{
      return null;
    }
  }catch(error){
    console.warn('O valor informado não é um número');
    return null;
  }
}

export{
  isEmpty,
  capitalize,
  atualizarDatas,
  controleFechamentoModal,
  sanitizarString,
  tooltips,
  popovers,
  SwalAlert,
  resizeTextArea,
  copiar,
  verificarCPF,
  zeroEsquerda,
  desanitizarStringURL,
  sanitizarStringParaURL,
  converterParaMesBRL
}