"use strict";

import { SwalAlert, converterParaMesBRL, isEmpty, verificarCPF, zeroEsquerda } from './modulos/utilitarios.js'

(() => {
  
  try{
    pdf2htmlEX.defaultViewer = new pdf2htmlEX.Viewer({});
  }catch(error){}
  
  document.querySelectorAll('[data-recarrega-pagina]').forEach(botao => {
    botao.addEventListener('click', () => {
      window.location.reload();
    })
  })
  
  function atribuirLinks(){
    const linkElementos = document.querySelectorAll('[data-link]');
    
    linkElementos.forEach(link => {
      switch(link.dataset.link.toLowerCase().trim()){        
        case 'github-dev':
        link.href = 'https://github.com/gabrieszin';
        break;
        
        case 'github-projeto':
        link.href = 'https://github.com/gabrieszin/[nome-repositorio]';
        break;
      }
      
      link.setAttribute('rel', 'noopener noreferrer');
    })
  }
  
  function atribuirAcoes(){
    const acoes = document.querySelectorAll('[data-action]');
    
    acoes.forEach(acao => {
      switch(acao.dataset.action){
        case 'acao':
        break;
        
        case 'editar':
        $(acao).on('click', (event) => {
          event.preventDefault();
          // SwalAlert('alert', {icon: 'success', title:'Teste', comp:{text:'Isso é apenas um teste', timer:null}, confirmacao:null});
          document.querySelector('#modal-editar-informacoes').showModal();
          document.querySelector('#modal-editar-informacoes').querySelectorAll('input')[0].focus();
        })
        break;
        
        case 'fechar-modal':
        $(acao).on('click', (event) => {
          event.preventDefault();
          (acao.closest('dialog')).close();
        })
        break;
        
        case 'formulario-editar-informacoes':
        $(acao).on('submit', (event) => {
          event.preventDefault();
          
          const inputs_tratamento = ['cc-agencia', 'cc-operacao', 'cc-numero', 'cc-digito', 'cp-agencia', 'cp-operacao', 'cp-numero', 'cp-digito'];
          
          if(!$('[data-input="conta-corrente"]').is(':checked')){
            // $('[data-input="cc-agencia"]').val('');
            // $('[data-input="cc-operacao"]').val('');
            // $('[data-input="cc-numero"]').val('');
          }
          
          if(!$('[data-input="conta-poupanca"]').is(':checked')){
            // $('[data-input="cp-agencia"]').val('');
            // $('[data-input="cp-operacao"]').val('');
            // $('[data-input="cp-numero"]').val('');
          }
          
          $('[data-input]').each((index, element) => {
            // console.log(element.tagName, element.type, element.dataset.input)
            if(element.tagName.toLowerCase() == 'input'){
              const tipo = element.type;
              const area = $(`sxs[refer=${element.dataset.input}]`);
              
              if(!isEmpty(tipo) && !isEmpty(area)){
                switch(tipo){
                  case 'text':
                  
                  !isEmpty(element.value) ? area.text(`${element.value.toUpperCase().trim()}`) : area.text('');
                  
                  // if(isEmpty(element.value) && inputs_tratamento.includes(element.dataset.input)){
                  if(inputs_tratamento.includes(element.dataset.input)){
                    switch(element.dataset.input){
                      case 'cc-agencia':
                      case 'cp-agencia':
                      // console.log(element.value.length)
                      element.value.length <= 5 ? area.html(replicar(5, element.value, '&emsp;')) : '';
                      element.value.length == 0 ? area.html(`&emsp;&emsp;&emsp;`) : '';
                      break;
                      
                      case 'cc-operacao':
                      case 'cp-operacao':
                      // console.log(element.value.length)
                      element.value.length <= 4 ? area.html(replicar(5, element.value, '&emsp;')) : '';
                      element.value.length == 0 ? area.html(`&emsp;&emsp;&emsp;`) : '';
                      break;
                      
                      case 'cc-numero':
                      case 'cp-numero':
                      // console.log(element.value.length)
                      console.log(element.value.split('-'))
                      element.value.length <= 14 ? area.html(replicar(14, element.value.split('-')[0], '&emsp;')) : '';
                      element.value.length == 0 ? area.html(`&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`) : '';

                      if(element.dataset.input == 'cc-numero'){
                        $('sxs[refer="cc-digito"]').text(element.value.split('-')[1]);
                      }else if(element.dataset.input == 'cp-numero'){
                        $('sxs[refer="cp-digito"]').text(element.value.split('-')[1]);
                      }

                      break;
                      
                      case 'cc-digito':
                      case 'cp-digito':
                      element.value.length < 1 ? area.html(``) : '';
                      break;
                    }
                  }
                  break;
                  
                  case 'date':
                  const data = element.value;
                  try{
                    if(data.length == 10){
                      const split = data.split('-');
                      $('sxs[refer="data-ano"]').text(split[0].trim());
                      $('sxs[refer="data-dia"]').text(split[2].trim());
                      
                      if(split[1][0] == '0'){
                        $('sxs[refer="data-mes-extenso"]').text((converterParaMesBRL(parseInt(split[1][1]) - 1)).toUpperCase());
                      }else{
                        $('sxs[refer="data-mes-extenso"]').text((converterParaMesBRL(parseInt(split[1]) - 1)).toUpperCase());
                      }
                    }
                  }catch(error){
                    
                  }
                  break;
                  
                  case 'checkbox':
                  case 'radio':
                  element.checked ? area.text('X') : area.text('');
                  break;
                }
              }
            }
          })
          
          acao.closest('dialog').close();
        })
        break;
        
        case 'toggle-dados-bancarios':
        $(acao).on('input', (event) => {
          // event.preventDefault();
          $((acao.closest('[data-content="dados-conta"]')).querySelector('[data-content="dados-bancarios"]')).toggle(300);
        })
        break;
        
        default:
        console.warn('A ação não foi implementada.')
        break;
      }
    })
  }
  
  const replicar = (quantidade, string, adicionar) => {
    if(typeof string == 'string' && quantidade > string.length){
      for(let i = string.length; i < quantidade; i++){
        string += adicionar;
      }
      return string;
    }else{
      return string;
    }
  }
  
  function atribuirMascaras(param, input){
    if(isEmpty(param) && isEmpty(input)){
      document.querySelectorAll('[data-mascara]').forEach(input => {
        switch(input.dataset.mascara.trim().toLowerCase()){
          case 'cpf':
          $(input).mask('000.000.000-00');
          $(input).on('input', (evento) => {
            if(verificarCPF(evento.target.value)){
              $(evento.target.closest('.area-validation-CPF').querySelector('.icon-invalid-CPF')).fadeOut(500);
            }else{
              $(evento.target.closest('.area-validation-CPF').querySelector('.icon-invalid-CPF')).fadeIn(500);
            }
          })
          break;
          
          case 'numero-contrato':
          $(input).mask('0.0000.0000000-0')
          break;
          
          case 'data':
          $(input).mask('00/00/0000');
          break;
          
          case 'agencia':
          $(input).mask('0000', {reverse: true});
          break;
          
          case 'operacao':
          $(input).mask('0000', {reverse: true});
          break;
          
          case 'conta':
          $(input).mask('000000000000-0', {reverse: true});
          break;
          
          case 'conta-vendedor':
          $(input).mask('000000000000-0', {reverse: true});
          break;
          
          case 'money':
          SimpleMaskMoney.setMask(input, {
            prefix: 'R$ ',
            fixed: true,
            fractionDigits: 2,
            decimalSeparator: ',',
            thousandsSeparator: '.',
            cursor: 'end'
          });
          input.removeAttribute('maxlength');
          break;
          
          default:
          throw new Error('Ação não implementada para o link informado.');
          break;
        }
      })
    }else{
      switch(param.toLowerCase().trim()){
        case 'agencia':
        $(input).mask('0000', {reverse: true});
        break;
        
        case 'operacao':
        $(input).mask('0000', {reverse: true});
        break;
        
        case 'conta':
        $(input).mask('000000000000-0', {reverse: true});
        break;
      }
    }
  }
  
  window.addEventListener("load", function () {
    $('.overlay').hide();
    atribuirLinks();
    atribuirAcoes();
    atribuirMascaras();
    
    try{
      const moment = new Date();
      $('#data-assinatura').val(`${moment.getFullYear()}-${zeroEsquerda(2, moment.getMonth() + 1)}-${zeroEsquerda(2, moment.getDate())}`);
    }catch(error){};
    
    $('input').each((index, input) => {
      input.setAttribute('autocomplete', 'off');
    })
    
    $('input[type=checkbox]').each((index, input) => {
      $(input).on('focus', (evento) => {
        $(input.closest('.form-group')).addClass('focus')
      })
      
      $(input).on('blur', (evento) => {
        $(input.closest('.form-group')).removeClass('focus')
      })
    })
    
    $('input[type=radio]').each((index, input) => {
      $(input).on('focus', (evento) => {
        $(input.closest('.form-group')).addClass('focus')
      })
      
      $(input).on('blur', (evento) => {
        $(input.closest('.form-group')).removeClass('focus')
      })
    })
    
    try{
      const url = new URLSearchParams(new URL(window.location).search);
      const parametros_insercao = new Array();
      
      document.querySelectorAll('sxs[refer]').forEach(sxs => {
        parametros_insercao.push(sxs.getAttribute('refer'));
      });
      console.log(parametros_insercao);
      
      parametros_insercao.forEach(parametro => {
        if(url.has(parametro) && !isEmpty(url.get(parametro))){
          const elemento = document.querySelector(`[data-input=${parametro}]`);
          const tag = elemento.tagName.toLowerCase();
          const parametros_para_tratar = ['CPF_1', 'CPF_2', 'n_contrato'];
          
          switch(tag){
            case 'input':
            elemento.value = url.get(parametro);
            
            // if()
            
            break;
            
            case 'checkbox':
            case 'radio':
            elemento.checked = url.get(parametro);
          }
        }
      })
      
    }catch(error){
      console.log('Ocorreu um erro ao tentar recuperar os dados da URL. Erro: %s', error);
    }
    
  });
  
  // document.querySelector('#modal-editar-informacoes').showModal();
  
  var antes_de_imprimir = function() {
    // console.log('Antes de imprimir...');
    $('#controle').hide();
  };
  
  var depois_de_imprimir = function() {
    // console.log('Depois de imprimir...');
    $('#controle').show();
  };
  
  if (window.matchMedia) {
    var mediaQueryList = window.matchMedia('print');
    mediaQueryList.addListener(function(mql) {
      if (mql.matches) {
        antes_de_imprimir();
      } else {
        depois_de_imprimir();
      }
    });
  }
  
  window.onbeforeprint = antes_de_imprimir();
  window.onafterprint = depois_de_imprimir();
  
  $('.btn-impressao').on('click', (event) => {
    event.preventDefault();
    window.print();
  })
})();