let innerWidth = window.innerWidth;

//테스트트

/* 인트로 관련 변수 */ 
let body = document.querySelector('body');
let introTit = document.querySelectorAll('.ani--intro span');

/* GNB 관련 변수 */ 
let gnb = document.querySelector('.ani--gnb');
let gnbItem = document.querySelectorAll(".main--gnb li a");
let btnHam = document.querySelector('.main--gnb.scr--mo > .ar--btn');

/* me 변수 */ 
let meImg = document.querySelector('.main--me--img:nth-of-type(2)');
let meTit = document.querySelector('.main--me--tit:nth-child(2)');
let txtAni = document.querySelectorAll('.ani--fade-in');
let meContainer = document.querySelector('.main--me');
let meImgs = document.querySelectorAll('.main--me img');
let meTits = document.querySelectorAll('.ani--opacity > div');

/* 경험 변수 */ 
let targetSize = 65; //변경될 사이즈
let initialSize = window.innerWidth * 0.3; // 40vw를 픽셀로 변환
let currentSize = initialSize;

let totalChange = initialSize - targetSize;
let deltaPerWheel = totalChange / 3; // 4번의 휠 이벤트로 변화

let exprSlidItm = document.querySelectorAll('.expr--works .slide__group');
let galryItm = document.querySelectorAll('.ani--y');


const hugTxt1 = document.querySelector('.ani--huge-txt');
const hugTxt2 = document.querySelector('.ani--huge-move');
const hugArry = [hugTxt1, hugTxt2];
let winHeight = window.innerHeight;

let isPause = false; //이벤트 중복방지

/* 스크롤트리거 변수 */
let container = document.querySelectorAll(".wrap > div");
let slickContainer = document.querySelector('.main--expr');

/* 경험 변수 */ 

let button = document.querySelector(".main--expr nav");
const horizSlide = $('.expr--works .slide');


/* 팝업 관련 변수 */ 
let pop = document.querySelector('.pop');
let popActive = document.querySelector('.pop.active');
let popFloatNav = document.querySelector('.pop--float-nav');
let popElement = document.querySelector('.pop');
let popBody = document.querySelector('.pop--body');
let closeBtn = document.querySelector('.pop--nav--close');

/* 슬라이드 관련 변수 */ 
dot = document.querySelectorAll('.slick--dots');

/* 버튼 관련 변수, 그 외 */

/* 이벤트 */ 
window.addEventListener('load', () => {

    winHeight = window.innerHeight;

    if (body.classList.contains('active')) {
        body.classList.remove('active');
    }
    if (gnb.classList.contains('ham-active')) {
        gnb.classList.remove('ham-active');
    }

    /* 햄메뉴 */ 
    btnHam.addEventListener('click', function () { 
        const isHamActive = gnb.classList.contains('ham-active');

        if (isHamActive) {
            body.classList.remove('active');
            gnb.classList.remove('ham-active');
            returnScrol();
        } else {
            scrollY = window.scrollY; // 현재 위치 저장하기
            body.classList.add('active');
            gnb.classList.add('ham-active');
        }
    });
    gnbMove();
    meImgMbSet();
    slidePlyPause();
    exprSlide();
    gsapScrolTrigr();
    galry();
});

window.addEventListener("resize", () => {
    winHeight = window.innerHeight;
    ScrollTrigger.refresh();
    txtAniHeightSet();
    meImgMbSet();
})

window.addEventListener('wheel', (event) => {
    hugeTxt();
    hugeTxtMove();
    showGnbOnScrollUp(event);
});

window.addEventListener('scroll', (event) => {
    showGnbOnScrollUp(event);
    hugeTxt();
    hugeTxtMove();
    galry();
});


/* Lenis */
function initLenis() {
    /* 팝업에는 lenis 미적용 */ 
    if (popActive) {
        return;
    }
    /* //팝업에는 lenis 미적용 */

    // Lenis 초기화
    lenis = new Lenis({
        smooth: true, // 부드러운 스크롤 활성화
        lerp: 0.1, // 부드러운 스크롤 속도 (0.1 ~ 1.0)
        direction: 'vertical', // 세로 스크롤
    });

    // Lenis의 스크롤 업데이트 함수
    function raf(time) {
        lenis.raf(time); // Lenis 스크롤 프레임 업데이트
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Lenis와 ScrollTrigger 동기화
    lenis.on('scroll', () => ScrollTrigger.update());

    ScrollTrigger.scrollerProxy(document.body, {
        scrollTop(value) {
            return arguments.length ? lenis.scrollTo(value) : window.scrollY;
        },
        getBoundingClientRect() {
            return {
                top: 0,
                left: 0,
                width: window.innerWidth,
                height: window.innerHeight,
            };
        },
        pinType: document.body.style.transform ? "transform" : "fixed",
    });
} 

/* 로딩 애니메이션 */
function loadingAin() {
    setTimeout(() => {
        const loadingScreen = document.querySelector('.loading--group');
        const dimElement = document.querySelector('.loading--dim');

        loadingScreen.style.display = 'none';
        dimElement.classList.add('ani--dim-active');

        // 애니메이션 종료 시 클래스 삭제
        dimElement.addEventListener('animationend', () => {
            dimElement.classList.remove('ani--dim-active');
            setTimeout(() => {
                document.querySelector('.wrap').style.visibility = 'visible';
                document.querySelectorAll('.ani--intro').forEach(element => {
                    element.classList.add('intro--active');
                });
            }, 500);
            setTimeout(() => {
                window.scrollTo(0, 0); // 새로고침시 항상 상단
            }, 520)
            
        });

    }, 1000);
}

/* GNB 이동 */ 
function gnbMove() {
   
    gnbItem.forEach(item => {
        item.addEventListener('click', function() {
            const targetId = this.getAttribute('href').substring(1);
            const targetEle = document.getElementById(targetId);
            
            if (body.classList.contains('active')) {
                body.classList.remove('active');
                gnb.classList.remove('ham-active');
            }
            targetEle.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

/* 스크롤 위로 올릴 때, show gnb*/ 
function showGnbOnScrollUp(event) {
    const scrollY = window.scrollY; // 현재 스크롤 위치
    const dvh100 = window.innerHeight; // 100vh 값
   
    if (scrollY > dvh100) { // 100vh 보다 스크롤이 아래에 있을 떄
        if (event.deltaY > 0) { // 휠을 아래로 올릴 때
            gnb.classList.remove('fix-active');
        } else if (event.deltaY < 0) { // 휠을 위로 올릴 때
            gnb.classList.add('fix-active');
        }
    } else { // 스크롤이 첫 화면에 있을 때 
        if (gnb.classList.contains('fix-active') && scrollY < 100) {
            gnb.classList.remove('fix-active');
        }
    }
};


/* 스크롤 유지하기 (햄메뉴 open > close시 필요) */ 
function returnScrol() {
    window.scrollTo(0, scrollY);
}


/* 인트로 타이틀 애니메이션 */
function introAni(target, delay) {
    target.forEach((element, index) => {
        element.style.animationDelay = `${index * delay}s`;  
    });
}

/* me txt--ani */ 
function txtAniHeightSet() {
    txtAni.forEach((element, index) => {
        let targetH = element.firstElementChild.offsetHeight;
        element.style.height = targetH + 'px';
    });
}

/* me 레이아웃 조절하기 */ 
function meImgMbSet() {
    let meTitH = meTit.offsetHeight;
    meImg.style.marginBottom = meTitH + 'px';
}

/* expr */ 
function exprSlide() {
    horizSlide.slick({
        dots: false,
        arrow: true, 
        appendArrows: '.slide--ctrl',
        prevArrow: '<button class="arrw--prev ar--btn ar--btn-lg ar--btn-bg-non ar--btn-icon" aria-label="이전" title="이전"><i class="ar--icon fa--arrow-left"></i></button>',
        nextArrow: '<button class="arrw--next ar--btn ar--btn-lg ar--btn-bg-non ar--btn-icon" aria-label="다음" title="다음"><i class="ar--icon fa--arrow-right"></i></button>',
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        autoplay: true,
        autoplaySpeed : 3000,
        //pauseOnHover: false,
        disableOnInteraction: false,
        responsive: [
            {  
                breakpoint: 1201, 
                settings: {
                    autoplaySpeed : 1500,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    centerMode: true,
                    centerPadding: '60px',
                } 
            },
            { 
                breakpoint: 801,
                settings: {	
                    centerMode: false,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    centerPadding: '0',
                } 
            }
        ]
    });
    $('.slide--ctrl .arrw--pause').on('click', function (e) {
        e.preventDefault();
        horizSlide.slick('slickPause'); 
    });
    $('.slide--ctrl .arrw--play').on('click', function (e) {
        e.preventDefault();
        horizSlide.slick('slickPlay'); 
    });

    // horizSlide.on('wheel', function(e) {
    //     e.preventDefault();

    //     if (e.deltaY < 0) {
    //         $(this).slick('slickPrev');
    //     } else {
    //         $(this).slick('slickNext');
    //     }
    // });

    horizSlide.on('afterChange', function(event, slick, currentSlide) {

        $('.expr--works .slide__group').removeClass('ani--slide-active');
        
        var $activeSlides = $('.expr--works .slick-active');
        
        $activeSlides.each(function(index, element) {
          setTimeout(function() {
            $(element).addClass('ani--slide-active');
          }, index * 200);
        });
      });
}

function slidePlyPause() {
   
    let btnArr = [document.querySelector('.arrw--pause'), document.querySelector('.arrw--play')];

    btnArr.forEach( element => {
        element.addEventListener('click', function(event) {
            let current = event.target.parentElement;
            btnArr.forEach(ele => {ele.classList.remove('active')})
            current.classList.add('active');
        })
    })

}

function hugeTxt() {
    if (window.innerWidth < 1200) return;
    hugArry.forEach(txtElem => {

         // 각 요소에 대해 _currentSize가 저장되어 있지 않다면 초기값 할당
         if (!txtElem.hasOwnProperty('_currentSize')) {
            txtElem._currentSize = initialSize;
        }

        const rectTop = txtElem.getBoundingClientRect().top;

        if (rectTop > 0 && rectTop < winHeight) { //화면 출연
            if (rectTop < winHeight * 0.7) {

                if (isPause) return; //이벤트 중복 방지 처리
                isPause = true;

                txtElem._currentSize = Math.max(targetSize, txtElem._currentSize - deltaPerWheel);
                txtElem.style.fontSize = `${txtElem._currentSize}px`;

                setTimeout(() => isPause = false, 16);
            }

        } else if (rectTop <= 0) { // 화면 상단으로 사라짐

        } else if (rectTop >= winHeight) { //화면 하단 대기
            txtElem._currentSize = initialSize;
            txtElem.style.fontSize = initialSize + 'px';
        }
    });
}

function hugeTxtMove() {
    if (window.innerWidth > 1200) return;
    hugArry.forEach(txtElem => {
        const rectTop = txtElem.getBoundingClientRect().top;
        
        if (rectTop > 0 && rectTop < winHeight) { //화면 출연
            if (rectTop < winHeight * 0.7) {
                if (!txtElem.classList.contains('intro--active')) {
                    txtElem.classList.add('intro--active');
                    introAni(txtElem.querySelectorAll('span'), 0.2);
                }
            }

        } else if (rectTop <= 0) { // 화면 상단으로 사라짐

        } else if (rectTop >= winHeight) { //화면 하단 대기
            txtElem.classList.remove('intro--active');
            // txtElem.classList.contains('intro--active')
            // ? txtElem.classList.remove('intro--active')
            // : null;
        }
    })

}

function galry() {
    winHeight = window.innerHeight;
    galryItm.forEach(galryItm => {
        const rectTop = galryItm.getBoundingClientRect().top;
        if (rectTop > 0 && rectTop < winHeight) { //화면 출연
            if (rectTop < winHeight * 0.6) {
                galryItm.classList.add('ani--y-active');
            }

        } else if (rectTop <= 0) { // 화면 상단으로 사라짐

        } else if (rectTop >= winHeight) { //화면 하단 대기
            galryItm.classList.remove('ani--y-active');
        }
    });
}

/*  */ 


/* 스크롤 트리거 */ 
function gsapScrolTrigr() {
    gsap.registerPlugin(ScrollTrigger); //플러그인 등록

    ScrollTrigger.matchMedia({
        "(min-width: 1001px)": function () { //pc 일 때 

            /* gnb active */ 
            container.forEach((element, index) => { 
                if (gnbItem[index]) {
                    ScrollTrigger.create({
                        trigger: element,
                        start: "top center",
                        toggleClass: {
                            targets: gnbItem[index],
                            className: "active",
                        },
                    });
                }
            });
        },

        "(max-width: 1000px)": function () { //태블릿, 모바일
            gnbItem = document.querySelectorAll("div.main--gnb ul li");

            container.forEach((element, index) => {
                if (gnbItem[index]) {
                    ScrollTrigger.create({
                        trigger: element,
                        start: "top center",
                        end: "bottom center",
                        onEnter: () => {
                            activeIndex = index; // 활성화된 index 저장
                            gnbItem.forEach(item => item.classList.remove("active")); // 기존 활성화 제거
                            gnbItem[index].classList.add("active"); // 현재 gnb 활성화
                        },
                    });
                }
            });
        },

        "all": function () {// 공통 설정
            container.forEach((element, index) => { //txt fade-in
                ScrollTrigger.create({
                    trigger: element,
                    start: "top center",
                    end: "bottom center",
                    onEnter: () => {
                        element.querySelectorAll('.ani--fade-in').forEach((item) => {
                            item.classList.add('fade-in--active');
                        });
                    },
                });
            });
            container.forEach((element, index) => { //형광펜 효과
                ScrollTrigger.create({
                    trigger: element,
                    start: "top center",
                    end: "bottom center",
                    onEnter: () => {
                        console.log('형광펜')
                        element.querySelectorAll('.ani--fade-in u').forEach((item) => {
                            item.classList.add('undrl--active');
                        });
                    },
                });
            });
            ScrollTrigger.create({
                trigger: meContainer,
                start: "top center",
                end: "bottom center",
                toggleClass: {
                    targets:  document.querySelector('body'),
                    className: "colr-cnge--active",
                },
            });
            meImgs.forEach((element, index) => { // me 컨테이너 타이틀 애니메이션
                ScrollTrigger.create({
                        trigger: element,
                        start: "top center",
                        end: "bottom center",
                        toggleClass: {
                            targets: meTits[index],
                            className: "opacity--active",
                        },
                });
            });

        },
    });
    // ScrollTrigger 새로고침
    ScrollTrigger.refresh();
}

initLenis();
loadingAin();
introAni(introTit, 0.3);
meImgMbSet();
txtAniHeightSet();
//gsapScrolTrigr();

