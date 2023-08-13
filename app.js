try{
  pdf2htmlEX.defaultViewer = new pdf2htmlEX.Viewer({});
}catch(e){}

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