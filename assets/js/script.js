import {
  converterParaMesBRL, isEmpty, numero_e_digito, verificarCPF, zeroEsquerda,
} from './modulos/utilitarios.js';

(() => {
  // Apresentação do Projeto no console
  const dados_do_projeto = {
    'Project name': 'Ateste de Processo',
    'Developed by': 'Gabriel Ribeiro',
    Version: '1.0.1',
    'Release date': '2024-05-04',
    Hostname: new URL(window.location).hostname,
    Origin: new URL(window.location).origin,
    Status: 'Active',
  };

  const novas_funcionalidades = [
    'Recebimento de dados via parâmetro: dados enviados por URL (GET) são recuperados e lançados para criação do ateste do processo.',
    'Formatação da capa para impressão: na impressão da capa, os campos são devidamente tratados e exibido apenas o conteúdo necessário.',
  ];

  Object.freeze(novas_funcionalidades);
  Object.freeze(dados_do_projeto);

  // Exibindo dados
  console.groupCollapsed(`${dados_do_projeto['Project name']}, Version ${dados_do_projeto.Version}`);
  console.table(dados_do_projeto);
  console.groupEnd();

  console.groupCollapsed('New features');
  novas_funcionalidades.toSorted((a, b) => a.localeCompare(b)).forEach((feature) => { console.info(`${feature}`); });
  console.groupEnd();
  // Fim da apresentação do projeto

  document.querySelectorAll('[data-recarrega-pagina]').forEach((botao) => {
    botao.addEventListener('click', () => {
      window.location.reload();
    });
  });

  try {
    pdf2htmlEX.defaultViewer = new pdf2htmlEX.Viewer({});
  } catch (error) {
    console.log('Um erro ocorreu. Erro: %s', error);
  }

  const replicar = (quantidade, string, adicionar) => {
    let string_saida = String(string);
    if (typeof string === 'string' && quantidade > string.length) {
      for (let i = string.length; i < quantidade; i += 1) {
        string_saida += String(adicionar);
      }
      return string_saida;
    }
    return string;
  };

  function atribuirLinks() {
    const linkElementos = document.querySelectorAll('[data-link]');

    linkElementos.forEach((link) => {
      switch (link.dataset.link.toLowerCase().trim()) {
        case 'github-dev':
          link.href = 'https://github.com/gabrieszin';
          break;

        case 'github-projeto':
          link.href = 'https://github.com/gabrieszin/[nome-repositorio]';
          break;
      }

      link.setAttribute('rel', 'noopener noreferrer');
    });
  }

  function exibirModalEditarInformacoes() {
    document.querySelector('#modal-editar-informacoes').showModal();
    setTimeout(() => {
      document.querySelector('#modal-editar-informacoes').querySelectorAll('input')[0].focus();
    }, 0);
  }

  function enviarFormulario() {
    const inputs_tratamento = ['cc_agencia', 'cc_operacao', 'cc_numero', 'cc_digito', 'cp_agencia', 'cp_operacao', 'cp_numero', 'cp_digito'];
    
    const contas = {
      corrente: [
        document.querySelector('#conta_corrente').checked,
        !isEmpty(document.querySelector('#cc_agencia').value),
        !isEmpty(document.querySelector('#cc_operacao').value),
        !isEmpty(document.querySelector('#cc_numero').value),
      ],
      poupanca: [
        document.querySelector('#conta_poupanca').checked,
        !isEmpty(document.querySelector('#cp_agencia').value),
        !isEmpty(document.querySelector('#cp_operacao').value),
        !isEmpty(document.querySelector('#cp_numero').value),
      ],
    };

    if (!contas.corrente.every((e) => e)) {
      $('[data-input="cc_agencia"]').val('');
      $('[data-input="cc_operacao"]').val('');
      $('[data-input="cc_numero"]').val('');
      $('sxs[refer="cc_digito"]').text('');

      if (contas.corrente.some((e) => e) && !document.querySelector('[data-e="dados-bancarios-conta-corrente"] [role="alert"]')) $('[data-e="dados-bancarios-conta-corrente"]').prepend('<div role="alert"><div class="alert alert-danger"><p>Um ou mais campos não foram preenchidos!</p></div></div>');
    } else {
      $('[data-e="dados-bancarios-conta-corrente"] [role="alert"]').remove();
    }
    
    if (!contas.poupanca.every((e) => e)) {
      $('[data-input="cp_agencia"]').val('');
      $('[data-input="cp_operacao"]').val('');
      $('[data-input="cp_numero"]').val('');
      $('sxs[refer="cp_digito"]').text('');

      if (contas.poupanca.some((e) => e) && !document.querySelector('[data-e="dados-bancarios-conta-poupanca"] [role="alert"]')) $('[data-e="dados-bancarios-conta-poupanca"]').prepend('<div role="alert"><div class="alert alert-danger"><p>Um ou mais campos não foram preenchidos!</p></div></div>');
    } else {
      $('[data-e="dados-bancarios-conta-poupanca"] [role="alert"]').remove();
    }
    
    $('[data-input]').each((index, element) => {
      if (element.tagName.toLowerCase() === 'input') {
        const tipo = element.type;
        const area = $(`sxs[refer=${element.dataset.input}]`);
        
        if (!isEmpty(tipo) && !isEmpty(area)) {
          switch (tipo) {
            case 'text':
            
            if (!isEmpty(element.value)) {
              area.text(`${element.value.toUpperCase().trim()}`);
            } else {
              area.text('');
            }
            
            if (inputs_tratamento.includes(element.dataset.input)) {
              switch (element.dataset.input) {
                case 'cc_agencia':
                case 'cp_agencia':
                if (element.value.length <= 5) area.html(replicar(5, element.value, '&emsp;'));
                if (element.value.length === 0) area.html('&emsp;&emsp;&emsp;');
                break;
                
                case 'cc_operacao':
                case 'cp_operacao':
                if (element.value.length <= 4) area.html(replicar(5, element.value, '&emsp;'));
                if (element.value.length === 0) area.html('&emsp;&emsp;&emsp;');
                break;
                
                case 'cc_numero':
                case 'cp_numero':
                
                const valor = element.value.replaceAll('-', '');
                if (element.value.length <= 14) area.html(replicar(14, numero_e_digito(valor).numero, '&emsp;'));
                if (element.value.length === 0) area.html('&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;');

                if (element.dataset.input === 'cc_numero') {
                  $('sxs[refer="cc_digito"]').text(numero_e_digito(valor).digito);
                } else if (element.dataset.input === 'cp_numero') {
                  $('sxs[refer="cp_digito"]').text(numero_e_digito(valor).digito);
                }
                break;
              }
            }
            break;
            
            case 'date':
            const data = element.value;
            try {
              if (data.length === 10) {
                const split = data.split('-');
                $('sxs[refer="data_ano"]').text(split[0].trim());
                $('sxs[refer="data_dia"]').text(split[2].trim());
                
                if (split[1][0] === '0') {
                  $('sxs[refer="data_mes_extenso"]').text((converterParaMesBRL(parseInt(split[1][1], 10) - 1)).toUpperCase());
                } else {
                  $('sxs[refer="data_mes_extenso"]').text((converterParaMesBRL(parseInt(split[1], 10) - 1)).toUpperCase());
                }
              }
            } catch (error) {
              console.log('Um erro ocorreu. Erro: %s', error);
            }
            break;
            
            case 'checkbox':
            case 'radio':
            if (element.checked) area.text('X');
            else area.text('');
            break;
          }
        }
      }
    });
  }

  function atribuirAcoes() {
    const acoes = document.querySelectorAll('[data-action]');

    acoes.forEach((acao) => {
      switch (acao.dataset.action) {
        case 'acao':
          break;

        case 'editar':
          try {
            $(acao).on('click', (event) => {
              event.preventDefault();
              document.querySelector('#modal-editar-informacoes').showModal();
              setTimeout(() => {
                document.querySelector('#modal-editar-informacoes').querySelectorAll('input')[0].focus();
              }, 0);
            });
          } catch (error) {
            console.log('Um erro ocorreu. Erro: %s', error);
          }
          break;

        case 'fechar-modal':
          $(acao).on('click', (event) => {
            event.preventDefault();
            (acao.closest('dialog')).close();
          });
          break;

        case 'formulario-editar-informacoes':
          $(acao).on('submit', (event) => {
            event.preventDefault();
            enviarFormulario();
            acao.closest('dialog').close();
          });
          break;

        case 'toggle-dados-bancarios':
          $(acao).on('input', () => {
            if (acao.checked) {
              $((acao.closest('[data-content="dados-conta"]')).querySelector('[data-content="dados-bancarios"]')).show(300);
              setTimeout(() => {
                (acao.closest('[data-content="dados-conta"]')).querySelector('[data-content="dados-bancarios"]').querySelectorAll('input')[0].focus();
              }, 500);
            } else {
              $((acao.closest('[data-content="dados-conta"]')).querySelector('[data-content="dados-bancarios"]')).hide(300);
            }
          });
          break;

        default:
          console.warn('A ação não foi implementada.');
          break;
      }
    });
  }

  function atribuirMascaras(param, input_atribuicao) {
    if (isEmpty(param) && isEmpty(input_atribuicao)) {
      document.querySelectorAll('[data-mascara]').forEach((input) => {
        switch (input.dataset.mascara.trim().toLowerCase()) {
          case 'cpf':
            $(input).mask('000.000.000-00');
            $(input).on('input', (evento) => {
              if (verificarCPF(evento.target.value)) {
                $(evento.target.closest('.area-validation-CPF').querySelector('.icon-invalid-CPF')).fadeOut(500);
              } else {
                $(evento.target.closest('.area-validation-CPF').querySelector('.icon-invalid-CPF')).fadeIn(500);
              }
            });
            break;

          case 'numero-contrato':
            $(input).mask('0.0000.0000000-0');
            break;

          case 'data':
            $(input).mask('00/00/0000');
            break;

          case 'agencia':
            $(input).mask('0000', { reverse: true });
            break;

          case 'operacao':
            $(input).mask('0000', { reverse: true });
            break;

          case 'conta':
            $(input).mask('000000000000-0', { reverse: true });
            break;

          case 'conta-vendedor':
            $(input).mask('000000000000-0', { reverse: true });
            break;

          case 'money':
            SimpleMaskMoney.setMask(input, {
              prefix: 'R$ ',
              fixed: true,
              fractionDigits: 2,
              decimalSeparator: ',',
              thousandsSeparator: '.',
              cursor: 'end',
            });
            input.removeAttribute('maxlength');
            break;

          default:
            throw new Error('Ação não implementada para o link informado.');
        }
      });
    } else {
      switch (param.toLowerCase().trim()) {
        case 'agencia':
          $(input_atribuicao).mask('0000', { reverse: true });
          break;

        case 'operacao':
          $(input_atribuicao).mask('0000', { reverse: true });
          break;

        case 'cpf':
          $(input_atribuicao).mask('000.000.000-00', { reverse: true });
          break;

        case 'numero-contrato':
          $(input_atribuicao).mask('0.0000.0000000-0', { reverse: true });
          break;

        case 'conta':
          $(input_atribuicao).mask('000000000000-0', { reverse: true });
          break;
      }
    }
  }

  window.addEventListener('load', () => {
    $('.overlay').hide();
    atribuirLinks();
    atribuirAcoes();
    atribuirMascaras();

    $('input').each((index, input) => {
      input.setAttribute('autocomplete', 'off');
    });

    $('input[type=checkbox]').each((index, input) => {
      $(input).on('focus', () => {
        $(input.closest('.form-group')).addClass('focus');
      });

      $(input).on('blur', () => {
        $(input.closest('.form-group')).removeClass('focus');
      });
    });

    $('input[type=radio]').each((index, input) => {
      $(input).on('focus', () => {
        $(input.closest('.form-group')).addClass('focus');
      });

      $(input).on('blur', () => {
        $(input.closest('.form-group')).removeClass('focus');
      });
    });

    try {
      const moment = new Date();
      $('#data_assinatura').val(`${moment.getFullYear()}-${zeroEsquerda(2, moment.getMonth() + 1)}-${zeroEsquerda(2, moment.getDate())}`);
    } catch (error) {
      console.log('Um erro ocorreu. Erro: %s', error);
    }

    try {
      const url = new URLSearchParams(new URL(window.location).search);
      const parametros_insercao = new Array();
      const modalidades = ['CCNPMCMV', 'CCFGTS', 'CCSBPE', 'PROCOTISTA'];

      document.querySelectorAll('sxs[refer]').forEach((sxs) => {
        parametros_insercao.push(sxs.getAttribute('refer'));
      });

      if (!isEmpty(parametros_insercao) && url.size > 0) {
        // Inclusão de parâmetros como forma de substituição de chaves para tratamento
        if (url.has('conta_comprador_numero')) url.set('cc_numero', url.get('conta_comprador_numero'));
        if (url.has('conta_comprador_agencia')) url.set('cc_agencia', url.get('conta_comprador_agencia'));
        if (url.has('conta_comprador_operacao')) url.set('cc_operacao', url.get('conta_comprador_operacao'));

        parametros_insercao.forEach((parametro) => {
          if (url.has(parametro) && !isEmpty(url.get(parametro))) {
            const elemento = document.querySelector(`[data-input=${parametro}]`);
            const { type } = elemento;

            const parametros_para_tratar = ['CPF_1', 'CPF_2', 'n_contrato', 'cc_agencia', 'cc_operacao', 'cc_numero', 'cp_agencia', 'cp_operacao', 'cp_numero'];

            switch (type) {
              case 'text':
                if (parametros_para_tratar.includes(parametro)) {
                  switch (parametro) {
                    case 'CPF_1':
                    case 'CPF_2':
                      elemento.value = url.get(parametro).replace(/\D/g, '').substring(0, 11) || '';
                      atribuirMascaras('cpf', elemento);
                      if (verificarCPF(elemento.value)) {
                        $(elemento.closest('.area-validation-CPF').querySelector('.icon-invalid-CPF')).fadeOut(500);
                      } else {
                        $(elemento.closest('.area-validation-CPF').querySelector('.icon-invalid-CPF')).fadeIn(500);
                      }
                      break;

                    case 'n_contrato':
                      elemento.value = url.get(parametro).replace(/\D/g, '').substring(0, 16) || '';
                      atribuirMascaras('numero-contrato', elemento);
                      break;

                    case 'cc_numero':
                    case 'cp_numero':
                      const valor = url.get(parametro).replace(/\D/g, '') || '';
                      elemento.value = (valor);
                      atribuirMascaras('conta', elemento);
                      if (elemento.dataset.input === 'cc_numero') {
                        $('sxs[refer="cc_digito"]').text(numero_e_digito(valor).digito);
                        $('[data-e="dados-bancarios-conta-corrente"]').show(300);
                        document.querySelector('[data-input="conta_corrente"]').checked = true;
                      } else if (elemento.dataset.input === 'cp_numero') {
                        $('sxs[refer="cp_digito"]').text(numero_e_digito(valor).digito);
                        $('[data-e="dados-bancarios-conta-poupanca"]').show(300);
                        document.querySelector('[data-input="conta_poupanca"]').checked = true;
                      }
                      break;

                    case 'cc_agencia':
                    case 'cp_agencia':
                      elemento.value = (url.get(parametro).replace(/\D/, '') || '').substring(0, 4);
                      atribuirMascaras('agencia', elemento);
                      break;

                    case 'cc_operacao':
                    case 'cp_operacao':
                      elemento.value = (url.get(parametro).replace(/\D/, '') || '').substring(0, 4);
                      atribuirMascaras('operacao', elemento);
                      break;
                  }
                } else {
                  elemento.value = url.get(parametro).replaceAll('-', ' ');
                }
                break;

              case 'checkbox':
              case 'radio':
                elemento.checked = (url.get(parametro) === 'true');
              break;
            }
          }
        });
        enviarFormulario();
        // Clicando no botão de impressão
        setTimeout(() => { document.querySelector('.btn-impressao').click(); }, 500);
      }

      if (!isEmpty(url.has('modalidade')) && modalidades.includes(url.get('modalidade'))) {
        $(`sxs[refer=${url.get('modalidade')}]`).text('X');
        document.querySelector(`#${url.get('modalidade')}`).checked = true;
      }
    } catch (error) {
      console.log('Ocorreu um erro ao tentar recuperar os dados da URL. Erro: %s', error);
    }
  });

  const antes_de_imprimir = () => {
    $('#controle').hide();
  };

  const depois_de_imprimir = () => {
    $('#controle').show();
  };

  if (window.matchMedia) {
    const mediaQueryList = window.matchMedia('print');
    mediaQueryList.addListener((mql) => {
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
  });

  document.addEventListener('keyup', (evento) => {
    if (!isEmpty(evento.keyCode)) {
      if (evento.keyCode === 45) {
        // Ativar modal editar informações
        exibirModalEditarInformacoes();
      }
    }
  });
})();
