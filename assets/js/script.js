"use strict";

import { SwalAlert } from './modulos/utilitarios.js'

(() => {
  
  try{
    pdf2htmlEX.defaultViewer = new pdf2htmlEX.Viewer({});
  }catch(e){}
  
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
          acao.closest('dialog').close();
        })
        break;
        
        default:
        console.warn('A ação não foi implementada.')
        break;
      }
    })
  }
  
  window.addEventListener("load", function () {
    $('.overlay').hide();
    atribuirLinks();
    atribuirAcoes();
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