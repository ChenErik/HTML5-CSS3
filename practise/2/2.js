const circle = document.querySelector('.circle');
const text = circle.innerText;
circle.innerText = '';
for(let i=0;i<text.length;i++){
    let letter = text[i]
    let span = document.createElement('span')
    span.innerText = letter
    let r = (360 / text.length) * i
    span.style.transform = `rotate(${r}deg)`
    circle.appendChild(span)
}