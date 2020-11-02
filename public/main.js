window.addEventListener('load', init);

//////////////// variavéis globais/////////////
const globallists = [];
const list = document.getElementById('list');
const button = document.getElementById('button');
const check = document.getElementById('check');
const Input = document.getElementById('Input');
const form = document.querySelector('form');
const lis = document.querySelectorAll('li')
const modaloverlay = document.querySelector('.modal-overlay ');
const ul = document.createElement("ul");
const fototrash = [url = 'bin.svg']

var IsEditing = true;
var Posicao;


function init() {
    capturetypedvalues(Input, button);
    // darkLigth();
    preventbehaviordefault(form);
    displayvector();

    document.title = ` list_activit`;

    // document.body.style.background = '#2f3336'
    // document.body.style.color = '#fafbfc'
}

// PARA PREVENIR COMPORTAMENTO PADRÃO DO FORMULÁRIO///////
function preventbehaviordefault(object) {
    object.addEventListener('submit', event => {
        event.preventDefault();
    })
}
//  PARA APLICAR FOCU NO INPUT, QUNADO O USUARIO
// FOR ADCIONAR UMA N0VA ATIVIDADE OU EDITAR
function aplicatefocus(object) {
    object.focus();
}

function capturetypedvalues(obj, object) {
    obj.addEventListener('keyup', event => {
        object.addEventListener('click', e => {
            if (event.key === 'Enter' || e.target.id === 'button') {

                var valuetyped = event.target.value; // Obtendo conteudo digitado
                //   se tiver sido digitado algum valor, então  editar ou iserir
                if (valuetyped) {
                    if (IsEditing) {
                        //  editar valores
                        globallists.splice(Posicao, 1, valuetyped);
                        IsEditing = false;

                        Showpercent();
                    } else {
                        //  Inserindo valores
                        globallists.unshift(valuetyped); //  Inserindo no array globallists
                        document.title = `(${globallists.length}) list_activit`;
                    }
                }
                displayvector(); //vai atualizar a página e exibir vetor com novo valor

                modaloverlay.classList.remove('active-modal'); //remove o modal
            }
        });
    });
}

function displayvector() {
    //limpando conteudo da ul e input para receber novos valores
    ul.innerHTML = '';
    Input.value = '';

    //para cada posição do vetor, executar a função 
    globallists.map(item => {
        var lis = document.createElement("li");
        lis.value = `${100/globallists.length}`;
        console.log(lis.value)
        lis.addEventListener('mouseover', function() {
            lis.style.background = '#ccc';
        })
        lis.addEventListener('mouseout', function() {
                lis.style.background = '';
            })
            ////////////////////////////////////////
        lis.appendChild(inputboxselet());
        lis.appendChild(span(item));
        lis.appendChild(trashcan());
        ul.appendChild(lis);
    })
    list.appendChild(ul); //adcionar a ul dentro da nav  list para ser exibida na página
}

function inputboxselet() {
    var inputcheckbox = document.createElement('input');
    inputcheckbox.type = 'checkbox'
    inputcheckbox.style.width = '18px';
    inputcheckbox.style.height = '20px';
    inputcheckbox.id = "check";

    return inputcheckbox;
}

function trashcan() {
    var trashcanimg = document.createElement("img");
    trashcanimg.style.width = '3rem';
    trashcanimg.id = 'trashcanimg';
    trashcanimg.src = `images/${fototrash[0]}`;
    trashcanimg.style.cursor = 'pointer';

    return trashcanimg;
}

function span(valor) {
    var span = document.createElement('span');
    span.textContent = valor; // adicionando valor dentro da span
    span.id = 'span'
    span.addEventListener('click', EditarItem) // quando o span for clicado, chama a função EditarItem
    span.style.fontSize = '25px'
    return span;

}

//  /////Editar um valor////////////////
function EditarItem(event) {
    // capturadando valor do elemento clicado
    const valor = event.target.innerHTML;
    var index = globallists.indexOf(valor); //Indentificando o indice
    Input.value = globallists[index]

    aplicatefocus(Input); //Aplicando foco no input
    modaloverlay.classList.add('active-modal');
    IsEditing = true;
    Posicao = index;
}

ul.addEventListener('click', event => {
    var li = event.target.parentElement;
    // Realizar evento apenas quando o usário clicar no botão
    if (event.target.localName === 'img') {

        // Capturando conteudo do elemento clicado
        var conteudo = event.srcElement.previousSibling.innerHTML;
        //  Deletando elemento de globallists
        var index = globallists.indexOf(conteudo); // Identificando índice
        globallists.splice(index, 1);
        console.log(index);

        li.remove(); // Removendo elemento do página ( a LI )
        ////////////////////////////////////////////////////////////
        document.title = `(${globallists.length-0}) list_activit  `;
        if (globallists.length === 0) {
            document.title = ` list_activit  `;
        }
        ////////////////////////////////////////////////
        displayvector(); // Atualizar site e Exibir vetor com novo valor
        Showpercent();
    }

    if (event.target.id === 'check') {
        li.classList.toggle("done");
        
    }
    Showpercent();
});

// ///////////////Mostrar a porcentagem correspondente às atividades feitas////////// //
function Showpercent() {
    const percent = document.querySelector('#percent')

    const percentitem = 100 / globallists.length;
    const verifiqueddone = document.getElementsByClassName('done').length;

    lis.value = `${percentitem*verifiqueddone}`;
    percent.innerHTML = Math.round(lis.value)


}
// Atualizar div sem carregar a página
// https://www.youtube.com/watch?v=5fu4Y9z0lco
// https://developer.mozilla.org/en-US/docs/Web/API/Window/unload_event
// https://desenvolvimentoparaweb.com/javascript/como-loading-de-javascript-funciona-domcontentloaded-e-onload/#content


// /local storage
// https://www.youtube.com/watch?v=FdR1Lla4A5M
// https://www.youtube.com/watch?v=De5np8phQxo
// https://www.youtube.com/watch?v=6deCUoDuMQc&t=431s
// https://www.youtube.com/watch?v=hNTozXl-qJA

//////////////////////MODAL NEW ACTIVITY////////////////////////////////////////////////////////////
//Quando clicar new activity abrirá um modal para adicionar a nova atividade

function modalnewactivity() {
    const newactivity = document.querySelector(".new-activity");

    newactivity.addEventListener('click', function() {
        modaloverlay.classList.add('active-modal')
        aplicatefocus(Input);
    })
}
modalnewactivity();


// Qunado clicar no x(close2) , chama uma função 
// que remove o modal   de new activity
const close2 = document.querySelector(".close2")

close2.addEventListener('click', function() {
    modaloverlay.classList.remove('active-modal')
})

// DARK e LIGTH
const theme = document.getElementById('theme');
theme.addEventListener('click', ev =>{
    document.body.classList.toggle('dark')
})
