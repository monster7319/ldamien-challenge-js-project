const touche = [...document.querySelectorAll('.button')];
const listeKeycode = touche.map(input => input.dataset.key);
console.log(listeKeycode)

document.addEventListener('keydown', (e) =>{
    const valeur = e.keyCode.toString();
    console.log(valeur, typeof valeur)
})

document.addEventListener('click', (e) => {
    const valeur = e.target.dataset.key;
    console.log(valeur, typeof valeur)
})

const calculer = (valeur) => {
    if (listeKeycode.includes(valeur)){
        console.log(listeKeycode)
    }
}