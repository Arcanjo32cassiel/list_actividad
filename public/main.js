window.addEventListener('load', init);

//////////////// variavéis globais/////////////
const list = document.getElementById('list');
const button = document.getElementById('button');
const check = document.getElementById('check');
const Input = document.getElementById('Input');
const form = document.querySelector('form');
const lis = document.querySelectorAll('li')
const modaloverlay = document.querySelector('.modal-overlay ');
const ul = document.createElement("ul");

var IsEditing = true;
var Posicao;

const fototrash = [url = 'bin.svg']

function init() {
    capturetypedvalues(Input, button);
    preventbehaviordefault(form);
    displayvector();

    document.title = ` list_activit`;
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

// localStorage
const actividadlocalStorage = localStorage.getItem("actividad")

var actividad = actividadlocalStorage != null ? JSON.parse(actividadlocalStorage) : []

const updateLocalStorage = () => {
    localStorage.setItem("actividad", JSON.stringify(actividad))

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
                        actividad.splice(Posicao, 1, valuetyped);
                        console.log(Posicao)
                        IsEditing = false;

                        Showpercent();
                    } else {
                        //  Inserindo valores
                        actividad.unshift(valuetyped); //  Inserindo no array actividad
                        document.title = `(${actividad.length}) list_activit`;
                    }
                }
                // localStorage
                updateLocalStorage();

                displayvector(); //vai atualizar a página e exibir vetor com novo valor

                modaloverlay.classList.remove('active-modal'); //remove o modal
                // function para evitar refresh
                preventbehaviordefault(form);
            }
        });
    });
}

function displayvector() {
    //limpando conteudo da ul e input para receber novos valores
    ul.innerHTML = '';
    Input.value = '';

    //para cada posição do vetor, executar a função 
    actividad.map(item => {
        const li = document.createElement("li");
        li.value = `${100/actividad.length}`;
        console.log(li.value)
        li.addEventListener('mouseover', function() {
            li.style.background = '#ccc';
        })
        li.addEventListener('mouseout', function() {
                li.style.background = '';
            })
            ////////////////////////////////////////
        li.appendChild(inputboxselet());
        li.appendChild(span(item));
        li.appendChild(trashcan());
        ul.appendChild(li);

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
    var index = actividad.indexOf(valor); //Indentificando o indice
    Input.value = actividad[index]

    aplicatefocus(Input); //Aplicando foco no input
    modaloverlay.classList.add('active-modal');
    IsEditing = true;
    Posicao = index;
    console.log(Posicao)
}

ul.addEventListener('click', event => {
    var li = event.target.parentElement;
    // console.log(li)
    // Realizar evento apenas quando o usário clicar no botão
    if (event.target.localName === 'img') {

        // Capturando conteudo do elemento clicado
        var conteudo = event.srcElement.previousSibling.innerHTML;
        console.log(conteudo)
            //  Deletando elemento de actividad
        var index = actividad.indexOf(conteudo); // Identificando índice
        actividad.splice(index, 1);
        console.log(index);
        updateLocalStorage();
        li.remove(); // Removendo elemento do página ( a LI )
        ////////////////////////////////////////////////////////////
        document.title = `(${actividad.length-0}) list_activit  `;
        if (actividad.length === 0) {
            document.title = ` list_activit  `;
        }
        ////////////////////////////////////////////////
        displayvector(); // Atualizar site e Exibir vetor com novo valor
        Showpercent();
    }



    // const currentthme = localStorage.getItem('done')
    // const check = document.getElementById('check')
    // if (currentthme) {
    //     if (currentthme === 'done') {
    //         li.classList.add(currentthme);
    //         // check.checked = true
    //     }
    // }
    if (event.target.id === 'check') {
        if (event.target.checked) {
            li.classList.add('done')
            localStorage.setItem('done', 'done')
        } else {
            li.classList.remove('done')
            localStorage.setItem('done', 'notdone')
        }
    }
    Showpercent(event);
});

// ///////////////Mostrar a porcentagem correspondente às atividades feitas////////// //
function Showpercent() {
    const percent = document.querySelector('#percent')

    const percentitem = 100 / actividad.length;
    const verifiqueddone = document.getElementsByClassName('done').length;

    lis.value = `${percentitem*verifiqueddone}`;
    percent.innerHTML = Math.round(lis.value)


}
// Quando executar uma função não alterar  o estado de uma list
// https://developer.mozilla.org/en-US/docs/Web/API/Window/unload_event



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


// Quando clicar no x(close2) , chama uma função 
// que remove o modal   de new activity
const close2 = document.querySelector(".close2")

close2.addEventListener('click', function() {
    modaloverlay.classList.remove('active-modal')
})


// DARK e LIGTH
function darklight() {
    const theme = document.getElementById('theme');
    const currentTheme = localStorage.getItem('data-theme');
    if (currentTheme) {
        if (currentTheme === 'dark') {
            document.body.classList.add(currentTheme);
            theme.checked = true;
        }
    }
    theme.addEventListener('change', ev => {

        if (ev.target.checked) {
            document.body.classList.add('dark');
            localStorage.setItem('data-theme', 'dark')
        } else {
            document.body.classList.remove('dark')
            localStorage.setItem('data-theme', '')
        }
    })
}
darklight();
// salvar image do header 
// update future
// https://www.youtube.com/watch?v=De5np8phQxo&t=1251s
// https://www.youtube.com/watch?v=cZvWDTqTGKg