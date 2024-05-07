// Menú de navegación
const toggleMenuElement = document.getElementById('toggle-button');
const mainMenuElement = document.getElementById('menu-list');
const navigationHeight = document.getElementById('nav-bar').offsetHeight;

// Contenedor de los proyectos
const projectsDiv = document.getElementById('projects-container');
const projects = document.querySelectorAll('.project');

// Formulario
const form = document.getElementById('form-contact');

document.documentElement.style.setProperty('--scroll-padding', navigationHeight + "px");

toggleMenuElement.addEventListener('click', ()=>{
    mainMenuElement.classList.toggle('menu-list--show');
});

projectsDiv.addEventListener('click', (e) => {
    if(e.target.parentElement.classList.contains("project__header"))
    {
       const projectContent = e.target.parentElement.parentElement.querySelector('.project__content');
       projectContent.classList.toggle("project__content--show");
    
       const projectTitle = e.target.parentElement.querySelector('.project__title');
       projectTitle.classList.toggle("project__title--fixed");
    }   
});

form.addEventListener('submit', validateForm);

function validateForm(e){    
    e.preventDefault();

    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');
    
    const formFields = [name, email, subject, message];
    let inputContainer;
    let validForm = true;

    formFields.forEach(field => {
        field.value = field.value.trim();
        inputContainer = field.parentElement;

        if(field.value === '') {
            showMessage('El campo no puede estar vacío', inputContainer);
            validForm = false;
            return; 
        }
        else if(field.name === 'email' && !validateEmail(field.value)){
            showMessage('Correo no válido', inputContainer);
            validForm = false;
            return;
        }

        cleanMessage(inputContainer);
    });

    if(validForm){
        form.submit();
        form.reset();
        showMessage('Enviando correo...', document.getElementById('message').parentElement, "success");
    }
}

function validateEmail(email){
    const regex =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/  
    const resultado = regex.test(email);  
    return resultado;   
}

function showMessage(message, container, type="error"){
    cleanMessage(container);
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    messageElement.className = type == 'error' ? 'message error' : 'message success';
    
    container.append(messageElement);
}

function cleanMessage(container){
    const messageElement = container.querySelector('.error');

    if(messageElement)
        messageElement.remove();
}


// IntersectionObserver para las animaciones de los elementos cuando están visibles en el viewport
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            const element = entry.target;
            if(element.classList.contains('fade--left'))
                element.classList.add('fade--left-show');
            else if(element.classList.contains('fade--right'))
                element.classList.add('fade--right-show');
        }
    });
});

// Otro observer a parte para animar los proyectos, ya que este es un poco diferente
const projectsObserver = new IntersectionObserver(entries => {
    let transitionDelay = 0;
    entries.forEach(entry => {
        const element = entry.target;
        if(entry.isIntersecting){
            element.style.setProperty('--transition-delay', transitionDelay + 's');
            element.classList.add('project--show');
            transitionDelay += 0.1;
        }
    })
});

const fadeLeftElements = document.querySelectorAll('.fade--left');
const fadeRightElements = document.querySelectorAll('.fade--right');

// Animaciones cuando los elementos estén dentro del viewport
fadeLeftElements.forEach(element => observer.observe(element));
fadeRightElements.forEach(element => observer.observe(element));
projects.forEach(element => projectsObserver.observe(element));
