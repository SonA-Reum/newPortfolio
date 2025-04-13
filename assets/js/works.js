
window.addEventListener('load', function() {
    let upBtn = document.querySelector('.move--btn');
    
    upBtn.addEventListener('click', function() {
        window.scrollTo(0,0);
    });
    
});

window.addEventListener('scroll', function() {
    let innerH = window.innerHeight;
    let upBtn = document.querySelector('.move--btn');
    let scrollY = window.scrollY;


    if (window.scrollY > innerH * 0.7) {
        upBtn.style.transform = "translateY(0)";
    } else {
        upBtn.style.transform = "translateY(100px)";
    }
    

});




